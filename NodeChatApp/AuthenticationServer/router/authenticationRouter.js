const restify=require("restify");
const authenticationController=require("../controller/authenticationController")
module.exports=(server)=>{
    server.post("/authenticate",authenticationController.Post_Login)
    server.post("/register",authenticationController.Post_Register);
    server.get("/token",authenticationController.Get_JsonWebToken);
    server.get("/checkusername",authenticationController.Get_CheckUserNameExists);
};