const {query,param}=require("express-validator/check")
const moment=require("moment")
const PaymentStoreConstant=require("../contracts/PaymentStoreConstant")
const ReleaseDateRange=process.env.ReleaseDateRange||14;
const ValueDateRange=process.env.ValueDateRange||14;

 module.exports.TransactionReferenceValidator=query("TransactionReference").custom((value)=>{
    if(value){
            var pattern =/.+\/$/;
            var res = pattern.test(value);
            if(res){
                return Promise.reject({Code:1004,Message:"Invalid Transaction Reference"})
            }
    }
    return Promise.resolve();
 });

 module.exports.Status=query("Status").custom((value)=>{
    if(value){
           if(isNaN(value))
           {
               Promise.reject({Code:1004,Message:"Invalid Status Parameter"})
           }
    }
    return Promise.resolve();
 });

 module.exports.ReleaseDateValidator=query("FromReleaseDate").custom((value,{req})=>{
        try{
            if(value){
            var FromReleaseDate=moment(value).utc();
            var ToReleaseDate=moment(req.ToReleaseDate).utc()
            var TodaysDate=moment(new Date()).utc();
            if(FromReleaseDate===null||ToReleaseDate===null||moment.duration(ToReleaseDate.diff(TodaysDate)).days>0
            ||(moment.duration(ToReleaseDate.diff(FromReleaseDate)).days<0))
            {
                return Promise.reject({Code:1004,Message:"Invalid or Bad Date Range Filter"})
            }
            else if(moment.duration(ToReleaseDate.diff(FromReleaseDate)).days>ReleaseDateRange)
            {
                return Promise.reject({Code:1004,Message:`Release date range should be within of ${ReleaseDateRange} days from today`})
            }
           
        }
        return Promise.resolve();
        }catch(ex){
            return Promise.reject({Code:1005,Message:"Invalid request parameter:FromReleaseDate"})
        }
 });

 module.exports.PublicIdRequired=param("publicid").isEmpty().withMessage({Code:1003,Message:"PublicId is required"})

 module.exports.ValueDateValidator=query("FromValueDate").custom((value,{req})=>{
    try{
        if(value){
        var FromValueDate=new Date(value);
        var ToValueDate=new Date(req.ToValueDate);
        if(FromValueDate===null||!ToValueDate===null||(moment.duration(ToValueDate.diff(FromValueDate)).days<0))
        {
            return Promise.reject({Code:1004,Message:"Invalid or Bad Date Range Filter"})
        }
        else if(moment.duration(ToValueDate.diff(FromValueDate)).days>ValueDateRange)
        {
            return Promise.reject({Code:1004,Message:`Release date range should be within of ${ValueDateRange} days from today`})
        }
    }
        return Promise.resolve();
    }catch(ex){
        return Promise.reject({Code:1005,Message:"Invalid request parameter:FromReleaseDate"})
    }
});

module.exports.Filter=query("filter").custom(value=>{
    if(value)
    {
            switch (value.toLowerCase()) {
                case PaymentStoreConstant.InvalidPayments:
                case PaymentStoreConstant.RejectedPayments:
                case PaymentStoreConstant.NoSalesforcecaseInvalidPayments:
                case PaymentStoreConstant.NoSalesforcecaseRejectedPayments:
                case PaymentStoreConstant.HoldOfacPayments:
                case PaymentStoreConstant.OfacStatusInProcess:
                case PaymentStoreConstant.OfacStatusComplianceHold :
                case PaymentStoreConstant.OfacStatusComplianceCancel:
                case PaymentStoreConstant.OfacStatusComplianceBlocked:
                    return Promise.resolve();
                default:
                   return Promise.reject({Code:1004,Message:"Invalid or Bad Filter"})
            }
    }
    else if(value===''){
        return Promise.reject({Code:1004,Message:"Invalid or Bad Filter"})
    }else{
        return Promise.resolve();
    }
    
});