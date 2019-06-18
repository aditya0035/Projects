const mongoose=require("mongoose");
const config=require("./.config");
let connectionString=null;
if(config.username&& config.password){
    connectionString=`mongodb://${config.username}:${config.username}@${config.host}:${config.port}/${config.database}`;
}
else{
    connectionString=`mongodb://${config.host}:${config.port}/${config.database}`;
}
mongoose.connect(connectionString,{useNewUrlParser:true});

module.exports=()=>{
    return mongoose;
}