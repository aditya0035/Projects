const userDb=require("../database/userDatabase");
const bcrypt=require("bcrypt");
const db=userDb();
const mongoose=require("mongoose");
const AccountSchema=new mongoose.Schema({
    Username:mongoose.Schema.Types.String,
    PasswordHash:mongoose.Schema.Types.String,
    PasswordSalt:mongoose.Schema.Types.String,
    EmailId:mongoose.Schema.Types.String,
    IsAccountActive:mongoose.Schema.Types.Boolean,
    CreatedDate:mongoose.Schema.Types.Date,
    LastUpdatedDate:mongoose.Schema.Types.Date,
    LastLoginDate:mongoose.Schema.Types.Date,
    TemporaryPasswordHash:mongoose.Schema.Types.String,
    TemporaryPasswordSalt:mongoose.Schema.Types.String,
    IsLocked:mongoose.Schema.Types.Boolean,
    InvalidAttempts:mongoose.Schema.Types.Number,
    IsDelete:mongoose.Schema.Types.Boolean,
    RefereshToken:mongoose.Schema.Types.String
});
const AccountRecoverySchema=new mongoose.Schema({
        UserId:mongoose.Schema.Types.ObjectId,
        Question1:mongoose.Schema.Types.String,
        Answer1:mongoose.Schema.Types.String,
        Question2:mongoose.Schema.Types.String,
        Answer2:mongoose.Schema.Types.String,
        Question3:mongoose.Schema.Types.String,
        Answer3:mongoose.Schema.Types.String
});
const Account=db.model("Account",AccountSchema)
const AccountRecovery=db.model("AccountRecovery",AccountRecoverySchema)
/**
 * Super User for Maintaining Accounts
 */
bcrypt.genSalt(12).then((salt)=>{
    bcrypt.hash("admin@123",salt).then(hash=>{
        var AdminExists=Account.findOne({Username:"admin"}).exec((err,doc)=>{
            if(err) throw err;
            if(!doc){
            const admin=new Account({Username:"admin",EmailId:"aditya0035@gmail.com",PasswordHash:hash,PasswordSalt:salt,IsAccountActive:true,IsLocked:false});
            admin.save((error,doc)=>{
                if(error) throw error;
                console.log("Account Created",admin);
            });
            }
        });
        
    });
});
module.exports={
    Account:Account,
    AccountRecovery:AccountRecovery
}