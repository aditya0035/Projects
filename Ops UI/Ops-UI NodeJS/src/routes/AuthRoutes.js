const router=require("express").Router();
const authController=require("../controllers/AuthController")
module.exports.IsAuthenticate=router.use(authController.IsAuthenticate);