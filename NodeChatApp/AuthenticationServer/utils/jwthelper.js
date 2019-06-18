const jwt=require("jsonwebtoken");
const fs=require("fs");
const path=require("path");
function TokenFactory(applicationName){
    _self=this;
    _self.applicationName=applicationName;
    switch(applicationName.toLowerCase()){
        case "chatapp":
            _self.signOptions ={
                issuer:  "cloudy tech",
                subject:  "chatapp@gmail.com",
                audience:  "procurement@cloudytech.com",
                expiresIn:  Math.floor(Date.now() / 1000) + (60 * 60),
                algorithm:  "RS256"
            }
            _self.refreshTokenEncString=(process.env.chatAppRefreshTokenEncString||"agaijnasisajosjoisajasojsaijsaijaijsaisa");
    }
}
TokenFactory.prototype.GetKeys=function(){
    switch(this.applicationName)
    {
        case "chatapp":
                return new Promise((resolve,reject)=>{
                   var promise1=new Promise((privateKeyResolve,privatekeyReject)=>{
                    fs.readFile(path.join(__dirname,"keys","chatApp","private.key"),(err,data)=>{
                        privateKeyResolve(data.toString("utf-8"));
                     });
                    });
                    var promise2=new Promise((publicKeyResolve,publicKeyReject)=>{
                        fs.readFile(path.join(__dirname,"keys","chatApp","public.key"),(err,data)=>{
                           publicKeyResolve(data.toString("utf-8"));
                         }); 
                    });
                    resolve(Promise.all([promise1,promise2]));
                });
    }
}

TokenFactory.prototype.CreateJsonWebToken=function(payload){
      return this.GetKeys().then(([privatekey,publicKey])=>{
           let token=jwt.sign(payload,privatekey,);
           return Promise.resolve({"token":token})
        });
};
TokenFactory.prototype.CreateRefreshToken=function(payload){
    let refreshtoken=jwt.sign(payload,this.refreshTokenEncString);
    return Promise.resolve({"refreshtoken":refreshtoken})
}
TokenFactory.prototype.VerifyRefereshToken=function(refereshToken){
    return new Promise((resolve,reject)=>{
        var token=jwt.verify(refereshToken,this.refreshTokenEncString);
        if(token){
            resolve(token);
        }
        else{
            reject("Something bad happened");
        }
    });
};

module.exports={
    "TokenFactory":TokenFactory
}