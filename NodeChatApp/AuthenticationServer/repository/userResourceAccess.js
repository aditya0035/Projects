const UserSchema=require("./schema/User");
const crypt=require("bcrypt");
module.exports.GetActiveUseDetailsByUserName=(username)=>{
   let query= UserSchema.Account.findOne({Username:username,IsAccountActive:true,IsLocked:false}).exec();
   return query.then((result)=>{
      return Promise.resolve({"UserDetails":result});
   }).catch((err)=>{
     return Promise.reject({Error:err});
   })
}
module.exports.GetUseDetailsByUserName=(username)=>{
   let query= UserSchema.Account.findOne({Username:username}).exec();
   return query.then((result)=>{
      return Promise.resolve({"UserDetails":result});
   }).catch((err)=>{
     return Promise.reject({Error:err});
   })
}
module.exports.GetActiveUseDetailsByUserEmailId=(emailId)=>{
   let query= UserSchema.Account.findOne({EmailId:emailId,IsAccountActive:true,IsLocked:false}).exec();
   return query.then((result)=>{
      return Promise.resolve({"UserDetails":result});
   }).catch((err)=>{
     return Promise.reject({Error:err});
   })
}
module.exports.IsUserNameExists=(username)=>{
     let query= UserSchema.Account.findOne({Username:username}).exec();
     return query.then((result)=>{
        let isExists=result?true:false;
        return Promise.resolve({"isExists":isExists});
     }).catch(err=>{
        return Promise.reject(err);
     });
}
module.exports.ActivateUser=(userDetails)=>{
   let username=userDetails.Username
   let query=UserSchema.Account.updateOne({Username:username},
      {"PasswordHash":userDetails.PasswordHash
      ,PasswordSalt:userDetails.PasswordSalt
      ,TemporaryPasswordHash:null
      ,TemporaryPasswordSalt:null
      ,IsAccountActive:true
      }).exec()
  return query.then(doc=>{
      if(doc) return Promise.resolve({"doc":doc})
      else return Promise.reject("Not Found");
  }).catch(err=>{
     return Promise.reject("Something bad happened");
  });
}

module.exports.UpdateLastLoginDetails=(username,lastLoginDate,refershToken)=>{
   let query=UserSchema.Account.updateOne({Username:username},{"LastLoginDate":lastLoginDate,RefereshToken:refershToken}).exec()
  return query.then(doc=>{
      if(doc) return Promise.resolve({"doc":doc})
      else return Promise.reject("Not Found");
  }).catch(err=>{
     return Promise.reject("Something bad happened");
  });
}

module.exports.SaveNewUserDetails=({username,emailId,temporaryPasswordHash,temporaryPasswordSalt})=>{
   return new Promise((resolve,reject)=>{
      try{
         let account=new UserSchema.Account({Username:username,PasswordHash:null,EmailId:emailId,
            IsAccountActive:0,CreatedDate:new Date(),LastUpdatedDate:null,LastLoginDate:null,TemporaryPasswordHash:temporaryPasswordHash
            ,TemporaryPasswordSalt:temporaryPasswordSalt,IsLocked:false,InvalidAttempts:0,IsDelete:false,RefereshToken:null});
         account.save().then(doc=>{
            if(doc){
               resolve({doc:doc});
            }
            else{
               reject("Something bad happened");
            }
         });
      }catch(ex){
         reject("Something bad happened");
      }
   });
};

module.exports.DeleteUserDetails=(id)=>{
   let query=UserSchema.AccountRecovery().findOne({UserId:id}).exec();
   return query.then(doc=>{
      if(doc){
         UserSchema.AccountRecovery.deleteOne({UserId:id}).exec().then(()=>{
         UserSchema.Account.deleteOne({_id:id}).exec();
         return Promise.resolve({Message:"Deleted Succesfully"});
         }).catch(err=>{
            return Promise.reject("Something bad happened");
         });
      }
   }).catch(err=>{
      return Promise.reject("Something bad happened");
   });
}