const express=require("express");
const fs=require("fs");
const https=require("https");
const http=require("http")
const path=require("path")
const helper=require("./src/utils/Helper");
const app=express();
const environment=process.env.Environment||"Development";

const authenticationRoutes=require("./src/routes/AuthRoutes")
const PaymentStoreRoutes=require("./src/routes/PaymentStoreRoutes");
const PaymentStoreCountRoutes=require("./src/routes/PaymentStoreCountRoutes")
app.use((request,response,next)=>{
    response.header("Access-Control-Allow-Origin", "*");
    response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.use(authenticationRoutes.IsAuthenticate);
app.use(PaymentStoreRoutes);
app.use(PaymentStoreCountRoutes)
app.use((err,req,resp,next)=>{
    resp.status(500).json({Code:"500",Message:"Something wrong happened.Please try again later."})
})
if(environment==='Development')
{
    const server= http.createServer(app);
    server.listen(4000);
}
else{
    const server= https.createServer({
    cert:fs.readFileSync(path.join(helper.root,"src","security","server-crt.pem")),
    key:fs.readFileSync(path.join(helper.root,"src","security","server-key.pem")),
    requestCert:true,
    rejectUnauthorized:false,
    ca:fs.readFileSync(path.join(helper.root,"src","security","ca-crt.pem"))
    },app);
    server.listen(process.env.PORT||8090);
}

