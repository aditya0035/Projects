const {query}=require("express-validator/check")
const MaxPageSize=process.env.MaxPageSize||100
module.exports.PageValidation=query("page").custom(value=>{
   if(!value||value===''){
        return Promise.reject({Code:1003,Message:"Page or PageSize is invalid."});
   }
   else{
    if(isNaN(value)||value<=0){
        return Promise.reject({Code:1003,Message:"Page or PageSize is invalid."});
    }
   }
   return Promise.resolve();
});

module.exports.PageSizeValidation=query("pagesize").custom(value=>{
    if(!value||value===''){
         return Promise.reject({Code:1003,Message:"Page or PageSize is invalid."});
    }
    else{
     if(isNaN(value)||value<=0||value>MaxPageSize){
         return Promise.reject({Code:1003,Message:"Page or PageSize is invalid."});
     }
    }
    return Promise.resolve();
 });
