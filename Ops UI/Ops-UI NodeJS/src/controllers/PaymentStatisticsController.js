const PaymentRAService=require("../repository/PaymentRAService")
const PaymentStoreConstant=require("../contracts/PaymentStoreConstant");
module.exports.InvalidPaymentsCount=(request,response,next)=>{
    PaymentRAService.PaymentsCount(PaymentStoreConstant.InvalidPayments).then(result=>{
        if(result)
        {
            response.status(200).json(result);
        }else
        {
            response.status(404).json({Code:1006,Message:"Not Found"});
        }
    });
};

module.exports.RejectedPaymentsCount=(request,response,next)=>{
    PaymentRAService.PaymentsCount(PaymentStoreConstant.RejectedPayments).then(result=>{
        if(result){
            response.status(200).json(result);
        }
        else{
            response.status(404).json({Code:1006,Message:"Not Found"});
        }
    });
};

module.exports.NoSalesforceInvalidPaymentsCount=(request,response,next)=>{
    PaymentRAService.PaymentsCount(PaymentStoreConstant.NoSalesforcecaseInvalidPayments).then(result=>{
        if(result)
        {
            response.status(200).json(result);
        }else{
            response.status(404).json({Code:1006,Message:"Not Found"});
        }
    });
};
module.exports.NoSalesforceRejectedPaymentsCount=(request,response,next)=>{
    PaymentRAService.PaymentsCount(PaymentStoreConstant.NoSalesforcecaseRejectedPayments).then(result=>{
        if(result){
            response.status(200).json(result);
        }
        else{
            response.status(404).json({Code:1006,Message:"Not Found"});
        }
    });
};

module.exports.AllTypeOfPaymentsCount=(request,response,next)=>{
    PaymentRAService.PaymentsCount(PaymentStoreConstant.AllTypeOfPaymentsCount).then(result=>{
        if(result)
        {
            response.status(200).json(result);
        }
        else{
            response.status(404).json({Code:1006,Message:"Not Found"});
        }
    });
};