const {validationResult}=require("express-validator/check")
module.exports.ValidatePaymentStoreRequest=(request,response,next)=>{
    var result=validationResult(request);
    var oneErrorMessageForCommonField={
        pageORpagesize:false
    }
    if(!result.isEmpty()){
        var outGoingErrorMessages=result.array().map(item=>{
            if(item.param==='page'&& !oneErrorMessageForCommonField.pageORpagesize)
            {
                oneErrorMessageForCommonField.pageORpagesize=true
                return item.msg;
            }
            else if(item.param==='pagesize' && !oneErrorMessageForCommonField.pageORpagesize)
            {
               oneErrorMessageForCommonField.pageORpagesize=true
               return item.msg;
            }
            else{
                return item.msg;
            }
        });
        response.status(400).json(outGoingErrorMessages);
    }
    else{
    next();
    }
};