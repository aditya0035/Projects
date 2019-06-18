const userRA=require("../repository/userResourceAccess")
const bcrypt=require("bcrypt");
const uniqueId=require("uniqid");
const jwtHelper=require("../utils/jwthelper");
const publisher=require("../authenticationEventPubliser");
module.exports.Post_Login=(request,response,next)=>{
    let username=request.body.username;
    let password=request.body.password;
    userRA.GetActiveUseDetailsByUserName(username).then((result)=>{
        if(!result.UserDetails){
            response.contentType = 'json';
            response.send({Code:404,Message:"username or password is invalid or account is not active please active account first"});
        }else{
            let passwordhash=result.UserDetails.PasswordHash
            bcrypt.compare(password,passwordhash).then((comparedResult)=>{
                if(comparedResult){
                  let chatApp= new jwtHelper.TokenFactory("chatapp");
                  let payLoad={
                      "emailid":`${result.UserDetails.EmailId}`,
                      "username":`${result.UserDetails.Username}`
                  };
                  chatApp.CreateJsonWebToken(payLoad)
                  .then(({token})=>{ 
                      return chatApp.CreateRefreshToken({"emailid":payLoad.emailid})
                      .then(({refreshtoken})=>Promise.resolve({"token":token,"refershtoken":refreshtoken}));
                    })
                  .then((token)=>{
                    var loginTime=new Date();
                    userRA.UpdateLastLoginDetails(result.UserDetails.Username,loginTime,token.refershtoken);
                    response.contentType = 'json';
                    response.send({Code:200,data:token});
                    }).catch(erro=>{
                        response.contentType="json",
                        response.send({Code:500,Message:"Something bad happened"})
                    });;
                }
                else{
                    response.contentType = 'json';
                    response.send({Code:404,Message:"username or password is invalid"});
                }
            }).catch(erro=>{
                response.contentType="json",
                response.send({Code:500,Message:"Something bad happened"})
            });
        }
    }).catch(erro=>{
        response.contentType="json",
        response.send({Code:500,Message:"Something bad happened"})
    });
};

module.exports.Get_JsonWebToken=(requeest,response,next)=>{
    //Here check if token expires then a new token will be generated from refresh token
    let refershToken=requeest.body.refershToken;
    jwtHelper.TokenFactory("chatapp").VerifyRefereshToken(refershToken).then(payload=>{
        let emailid=payload.emailid
        userRA.GetActiveUseDetailsByUserEmailId(emailid).then((result)=>{
            if(!result.UserDetails){
                response.contentType = 'json';
                response.send({Code:500,Message:"something bad happened"});
            }
            else{
                let chatApp= new jwtHelper.TokenFactory("chatapp");
                let payLoad={
                    "emailid":`${result.UserDetails.EmailId}`,
                    "username":`${result.UserDetails.Username}`
                };
                chatApp.CreateJsonWebToken(payLoad)
                .then(({token})=>{ 
                    return chatApp.CreateRefreshToken({"emailid":payLoad.emailid})
                    .then(({refreshtoken})=>Promise.resolve({"token":token,"refershtoken":refreshtoken}));
                  })
                .then((token)=>{
                  userRA.UpdateLastLoginDetails(result.UserDetails.Username,result.UserDetails.LastLoginDate,token.refershtoken);
                  response.contentType = 'json';
                  response.send({Code:200,data:token});
                  });
              }
        }).catch(erro=>{
            response.contentType="json",
            response.send({Code:500,Message:"Something bad happened"})
        });
    }).catch(erro=>{
        response.contentType="json",
        response.send({Code:500,Message:"Something bad happened"})
    });
};

module.exports.Get_CheckUserNameExists=(request,response,next)=>{
    let username=request.query.username;
    userRA.IsUserNameExists(username).then(result=>{
        response.contentType = 'json';
        if(result.isExists){
        response.send({Code:200,data: result.isExists});
        }
        else{
        response.send({Code:404,data: result.isExists});
        }
    }).catch(err=>{
        response.contentType = 'json';
        response.status=500
        response.send({Code:500,Message:"Internal Server Error"});
    });
};

module.exports.Post_Register=(request,response,next)=>{
    //Return Nothing and User has to Activate Account and then login again
   let  username=request.body.username;
   let applicationUrl=request.body.applicationurl
    userRA.IsUserNameExists(username).then(result=>{
        if(result.isExists){
            response.contentType="json"
            response.send({"Code":503,Message:"Unable to create user"});
        }
        else{
            bcrypt.genSalt(12).then((salt)=>{
                    let unqId=uniqueId();
                   return  bcrypt.hash(unqId,salt).then((passwordhash)=>{
                    let user={}
                    user.emailId=request.body.emailId;
                    user.username=username;
                    user.temporaryPasswordSalt=salt;
                    user.temporaryPasswordHash=passwordhash;
                    return Promise.resolve({user:user});
                    });
            }).then((result)=>{
                userRA.SaveNewUserDetails(result.user).then((result)=>{
                    let doc=result.doc;
                    console.log("Application Url",applicationUrl);
                    publisher.SendEmailConfirmationMail(applicationUrl,doc.Username,doc.EmailId,doc.TemporaryPasswordHash).then(()=>{
                        response.contentType="json"
                        response.send({Code:200,Messgae:"Registration done! Please check your registered email for confirmation mail"});}
                    ).catch(err=>{
                        response.contentType="json"
                        response.send({"Code":500,Message:"Something bad happened,Please try again later"});
                        userRA.DeleteUserDetails(doc._id);
                    });
                });
            });
        }
    });
   
};

module.exports.ActivateAccount=(request,response,next)=>{
    let username=request.body.username;
    let tempPasswordHash=request.body.tempPassword;
    let password=request.body.password;
    userRA.GetUseDetailsByUserName(username).then((result)=>{
        let userDetails=result.UserDetails;
        if(tempPasswordHash===userDetails.TemporaryPasswordHash){
            bcrypt.genSalt(12).then(salt=>{
                bcrypt.hash(password,salt).then(passwordHash=>{
                    userDetails.PasswordHash=passwordHash;
                    userDetails.PasswordSalt=salt;
                    userRA.ActivateUser(userDetails).then(doc=>{
                        let chatApp= new jwtHelper.TokenFactory("chatapp");
                        let payLoad={
                            "emailid":`${doc.EmailId}`,
                            "username":`${username}`
                        };
                        chatApp.CreateJsonWebToken(payLoad)
                        .then(({token})=>{ 
                            return chatApp.CreateRefreshToken({"emailid":payLoad.emailid})
                        .then(({refreshtoken})=>Promise.resolve({"token":token,"refershtoken":refreshtoken}));
                        })
                        .then((token)=>{
                        var loginTime=new Date();
                        userRA.UpdateLastLoginDetails(doc.Username,loginTime,token.refershtoken);
                        response.contentType = 'json';
                        response.send({Code:200,data:token});
                        }).catch(erro=>{
                        response.contentType="json",
                        response.send({Code:500,Message:"Something bad happened"})
                    });;
                    });
                });
            })
        }
        else{
            response.contentType="json";
            response.send({Code:404,Message:"Username or Password is Invalid"})
        }
    });
}
