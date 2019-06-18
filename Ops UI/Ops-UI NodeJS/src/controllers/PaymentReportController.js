const paymentRAService=require("../repository/PaymentRAService");
const PaymentStoreTransalator=require("../translators/PaymentStoreResponse");
module.exports.SearchPayments=(request,response,next)=>{
    try{
    var qsParameters=request.query;
    (paymentRAService.SearchPayment(qsParameters)
    .then(result=>PaymentStoreTransalator.TranslateResulToSearchPaymentResponse(result))
    .then((paymentStoreResponse)=>{
                paymentStoreResponse.page=qsParameters.page;
                paymentStoreResponse.pagesize=qsParameters.pagesize;
                if(paymentStoreResponse.TotalSearchResults==0){
                    response.status(404).json({Code:1006,Message:"Not Found"});
                }
                else{
                    response.json(paymentStoreResponse);
                }
        }).catch(exception=>{
            console.log("SearchPayments Controller",exception);
            return next(exception);
        })
    )
}catch(exception){
    console.log("Controller",exception)
    return next(exception);
}
}

module.exports.PaymentGeneralDetails=(request,response,next)=>{
    try{
        var publicId=request.params.publicid;
        (paymentRAService.PaymentGeneralDetails(publicId)
        .then(result=>PaymentStoreTransalator.TransalteResultToPaymentGeneralDetails(result))
        .then((paymentGenralDetailsResponse)=>{
            if(paymentGenralDetailsResponse){
                response.json(paymentGenralDetailsResponse);
            }
            else{
                response.status(404).json({Code:1006,Message:"Not Found"});
            }
        }).catch(exception=>{
            console.log("PaymentGeneralDetails Controller",exception);
            return next(exception);
        })
        )
    }catch(exception){
        console.log("Controller",exception)
        return next(exception);
    }
};

module.exports.PaymentBeneDetails=(request,response,next)=>{
    try{
        var public=request.params.publicid
        paymentRAService.PaymentBeneficiaryDetails(public).then((result)=>PaymentStoreTransalator.TransalteResultToPaymentBeneficiaryDetails(result))
        .then((PaymentBeneficiaryDetailsResponse)=>{
            if(PaymentBeneficiaryDetailsResponse){
                response.json(PaymentBeneficiaryDetailsResponse);
            }
            else{
                response.status(404).json({Code:1006,Message:"Not Found"});
            }
        }).catch(exception=>{
            console.log("PaymentBeneDetails Controller",exception);
            return next(exception);
        })
    }catch(exception){
       console.log("Controller",exception)
       return next(exception)
    }
};

module.exports.PaymentClientDetails=(request,response,next)=>{
    try{
        var publicId=request.params.publicid;
        paymentRAService.PaymentClientDetails(publicId).then(result=>PaymentStoreTransalator.TransalateResultToPaymentClientDetails(result))
        .then(paymentClientDetailResponse=>{
            if(paymentClientDetailResponse){
                response.json(paymentClientDetailResponse);
            }
            else{
                response.status(404).json({Code:1006,Message:"Not Found"});
            }
        }).catch(exception=>{
            console.log("PaymentClientDetails Controller",exception);
            return next(exception);
        })
    }catch(exception){
        console.log("Controller",exception)
        return next(exception);
    }
}