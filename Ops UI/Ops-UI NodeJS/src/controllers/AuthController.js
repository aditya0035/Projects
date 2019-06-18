const environment=process.env.Environment||"Development";
module.exports.IsAuthenticate=(request,response,next)=>{
    //const cert = request.connection.getPeerCertificate();
    if(request.client.authorized||environment==='Development'){
        // response.json({"Message":"Sucessfuly login"})
        next();
    }
    else 
    {
        response.setHeader("status","401");
        response.json({"ErrorCode":"401","Message":"Unautherized User"})
    }
}