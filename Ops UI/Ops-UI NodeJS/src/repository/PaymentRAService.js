const PaymentDb=require("./PaymentDb/PaymentDb");
const sql=require("mssql/msnodesqlv8");
const PaymentStoreConstant=require("../contracts/PaymentStoreConstant");
const InvalidPaymentsDuration=process.env.InvalidPaymentsDuration||24;
const RejectedPaymentsDuration=process.env.InvalidPaymentsDuration||24;
const instructionIdIsNotUniqueErrorCode=process.env.instructionIdIsNotUniqueErrorCode||'ER997';
module.exports.SearchPayment=(qsParameters,callback)=>{
   return PaymentDb.GetInstance().then(connectionPool=>{
        var paymentMethodIds=qsParameters.PaymentMethodId?[...qsParameters.PaymentMethodId]:null;
        var confirmationNo = null;
        var itemNo = null;
        var status=qsParameters.Status?qsParameters.Status:null
        var fromReleaseDate =qsParameters.FromReleaseDate?new Date(qsParameters.FromReleaseDate).toUTCString():null;
        var toReleaseDate=qsParameters.ToReleaseDate?new Date(qsParameters.ToReleaseDate).toUTCString():null;
        var fromValueDate=qsParameters.FromValueDate?new Date(qsParameters.FromValueDate):null;
        var toValueDate=qsParameters.ToValueDate?new Date(qsParameters.ToValueDate):null;
        var sortOrder=qsParameters.SortOrder?(qsParameters.SortOrder.toUpperCase()==='ASC'?0:(qsParameters.qsParameters.SortOrder.toUpperCase()==='DESC'?1:null)):null
        var sortby=qsParameters.SortBy?SearchPaymentsSortBy(qsParameters.SortBy):null;
        paymentMethodIds=qsParameters.PaymentMethodId?paymentMethodIds.join(","):null;
        if (qsParameters.TransactionReference)
        {
            pattern = /.+\/[0-9]+$/;
            if (pattern.test(qsParameters.TransactionReference))
            {
                var transactionReference = qsParameters.TransactionReference.split('/');
                confirmationNo = transactionReference[0];
                itemNo = parseInt(transactionReference[1]);
            }
            else
            {
                confirmationNo = qsParameters.TransactionReference.replace("/", '');
            }
        }
        var request=connectionPool.request();
        request.stream=false;
        request.input("PaymentMethodIds",sql.NVarChar({length:50}),paymentMethodIds);
        request.input("Status",sql.Int,status);
        request.input("FromReleaseDate",sql.DateTimeOffset,fromReleaseDate);
        request.input("ToReleaseDate",sql.DateTimeOffset,toReleaseDate);
        request.input("FromValueDate",sql.DateTime,fromValueDate);
        request.input("ToValueDate",sql.DateTime,toValueDate);
        request.input("ConfirmationNo",sql.NVarChar({length:200}),confirmationNo);
        request.input("ItemNo",sql.Int,itemNo);
        request.input("sortby",sql.Int,sortby);
        request.input("sortorder",sql.Int,sortOrder);
        request.input("page",sql.Int,parseInt(qsParameters.page));
        request.input("pagesize",sql.Int,parseInt(qsParameters.pagesize));
        return result=request.execute("SearchPayments");
    }).catch(exception=>{
        console.log("Search Payment",exception);
    });
}

module.exports.PaymentGeneralDetails=(publicId)=>{
   return PaymentDb.GetInstance().then(connectionPool=>{
        var request=connectionPool.request();
        request.stream=false;
        request.input("PublicId",sql.NVarChar(200),publicId);
        result=request.execute("GetPaymentGeneralDetails");
        return result;
    }).catch(exception=>{
        console.log("General Details",exception);
    });
};

module.exports.PaymentClientDetails=(publicId)=>{
    return PaymentDb.GetInstance().then(connectionPool=>{
        var request=connectionPool.request();
        request.input("publicId",sql.NVarChar(200),publicId);
        return request.query(`SELECT payinstr.Body as body, payinstr.PaymentId as PublicId, og.IsCustomerMultiParty, pc.* FROM [Payments].[dbo].[PaymentCustomerDetails] pc
        INNER JOIN[Payments].[dbo].[OutgoingPayment] og ON pc.PaymentId = og.PaymentId
        INNER JOIN[Payments].[dbo].[PaymentEntity] pe ON pc.PaymentId = pe.Id
        INNER JOIN[Payments].[dbo].[PaymentInstruction] payinstr ON pe.PublicId = payinstr.PaymentId where pe.PublicId=@publicId`);
    }).catch(exception=>{
        console.log("Client Details",exception);
        return next(exception);
    });
}
module.exports.PaymentBeneficiaryDetails=(publicId)=>{
   return PaymentDb.GetInstance().then(connectionPool=>{
        var request=connectionPool.request();
        request.input("publicId",sql.NVarChar(200),publicId)
        return request.query("select body from [dbo].[PaymentInstruction] p where p.paymentid = @publicId");
    }).catch(exception=>{
        console.log("Bene Details",exception);
    });
};
module.exports.PaymentsCount=(typeOfPayments)=>{
    var paymentsCount=[];
    if(typeOfPayments){
        switch (typeOfPayments.toLowerCase()){
            case PaymentStoreConstant.InvalidPayments:
                return this.InvalidPaymentsCount().then(result=>{
                    var totalCount=result.recordsets[0][0].TotalCount;
                    paymentsCount.push({[PaymentStoreConstant.InvalidPayments]:totalCount})
                   return Promise.resolve(paymentsCount);
                });
            case PaymentStoreConstant.RejectedPayments:
                return this.RejectedPaymentsCount().then(result=>{
                    var totalCount=result.recordsets[0][0].TotalCount;
                    paymentsCount.push({[PaymentStoreConstant.RejectedPayments]:totalCount});
                    return Promise.resolve(paymentsCount);
                });
            case PaymentStoreConstant.NoSalesforcecaseInvalidPayments:
                return this.NoSalesforceCaseInvalidPaymentCount().then(result=>{
                    var totalCount=result.recordsets[0][0].TotalCount;
                    paymentsCount.push({[PaymentStoreConstant.NoSalesforcecaseInvalidPayments]:totalCount});
                    return Promise.resolve(paymentsCount);
                });
            case PaymentStoreConstant.NoSalesforcecaseRejectedPayments:
                return this.NoSalesforceCaseRejectedPayments().then(result=>{
                    var totalCount=result.recordsets[0][0].TotalCount;
                    paymentsCount.push({[PaymentStoreConstant.NoSalesforcecaseRejectedPayments]:totalCount});
                    return Promise.resolve(paymentsCount);
                });
            case PaymentStoreConstant.AllTypeOfPaymentsCount:
                return (this.InvalidPaymentsCount().then(result=>{
                        var totalCount=result.recordsets[0][0].TotalCount;
                        paymentsCount.push({[PaymentStoreConstant.InvalidPayments]:totalCount});
                        return this.RejectedPaymentsCount();
                }).then(result=>{
                    var totalCount=result.recordsets[0][0].TotalCount;
                    paymentsCount.push({[PaymentStoreConstant.RejectedPayments]:totalCount});
                    return this.NoSalesforceCaseInvalidPaymentCount();
                }).then(result=>{
                    var totalCount=result.recordsets[0][0].TotalCount;
                    paymentsCount.push({[PaymentStoreConstant.NoSalesforcecaseInvalidPayments]:totalCount});
                    return this.NoSalesforceCaseRejectedPayments();
                }).then(result=>{
                    var totalCount=result.recordsets[0][0].TotalCount;
                    paymentsCount.push({[PaymentStoreConstant.NoSalesforcecaseRejectedPayments]:totalCount});
                    return Promise.resolve(paymentsCount);
                }));
        }
        return Promise.resolve(paymentsCount);
    }
};
module.exports.InvalidPaymentsCount=()=>{
   return PaymentDb.GetInstance().then(connectionPool=>{
        var request=connectionPool.request();
        request.input("PaymentInstructionReleaseFailed",sql.Int,PaymentStoreConstant.PaymentInstructionStaus.ReleaseFailed);
        request.input("PaymentInstructionValidationFailed",sql.Int,PaymentStoreConstant.PaymentInstructionStaus.ValidationFailed);
        request.input("PaymentInstructionDisposed",sql.Int,PaymentStoreConstant.PaymentInstructionStaus.Disposed);
        request.input("InvalidPaymentsStatisticsTimeLine",sql.Int,InvalidPaymentsDuration);
        return request.query(`Select count(p.paymentid)  As TotalCount from[dbo].[PaymentInstruction] p with(nolock) join[dbo].[paymententity] pe with(nolock)
        on pe.publicId = p.paymentid and p.status in (@PaymentInstructionReleaseFailed,@PaymentInstructionValidationFailed,@PaymentInstructionDisposed) 
        and  DATEDIFF(hour, p.LastUpdatedOn,GETUTCDATE())<=@InvalidPaymentsStatisticsTimeLine
        join[dbo].[Outgoingpayment] og with(nolock) on og.paymentid = pe.id 
        join PaymentInstruction payinstr with(nolock) on payinstr.PaymentId = pe.PublicId
        Left JOIN PaymentCaseDetails sfcaseDetails with(nolock) On sfcaseDetails.PaymentID=payinstr.PaymentId`)
    });
};
module.exports.RejectedPaymentsCount=()=>{
    return PaymentDb.GetInstance().then(connectionPool=>{
        var request=connectionPool.request();
        request.input("RejectedPaymentsStatisticsTimeline",sql.Int,RejectedPaymentsDuration);
        request.input("InstructionIdIsNotUnique",sql.VarChar(10),instructionIdIsNotUniqueErrorCode);
        request.input("PaymentBatchRJCT",sql.VarChar(10),PaymentStoreConstant.PaymentFileStatusRjct);
        request.input("PaymentBatchREJECT",sql.VarChar(10),PaymentStoreConstant.PaymentFileStatusReject);
        request.input("PaymentBatchDetailDisposed",sql.Int,PaymentStoreConstant.PaymentBatchDetailsStatus.Disposed);
        return request.query(`select Count(pe.publicId) As TotalCount from [dbo].[paymententity] pe with(nolock)
        join PaymentInstruction payinstr with(nolock) on payinstr.PaymentId = pe.PublicId
        join OutgoingPayment ogp with(nolock) on pe.Id=ogp.PaymentId
        join [dbo].[PaymentFulfillmentBatch] pfb with(nolock) on pfb.PaymentId = pe.publicId 
        Join [dbo].[PaymentBatchDetail] pbd with(nolock) on pbd.PaymentBatchDetailID=pfb.PaymentBatchDetailID and DATEDIFF(hour,pbd.LastUpdatedOn,GETUTCDATE())<=@RejectedPaymentsStatisticsTimeline
        join [dbo].[PaymentBatchReturnFileDetail] pbrf with(nolock) on pfb.PaymentBatchDetailID=pbrf.PaymentBatchDetailID and pbrf.ErrorCode<>@InstructionIdIsNotUnique and pbrf.Status in (@PaymentBatchRJCT,@PaymentBatchREJECT) and pbd.Status<>@PaymentBatchDetailDisposed
        LEFT JOIN PaymentCaseDetails sfCaseDetails with(nolock) ON sfCaseDetails.PaymentID=payinstr.PaymentId`);
    });
};
module.exports.NoSalesforceCaseInvalidPaymentCount=()=>{
    return PaymentDb.GetInstance().then(connectionPool=>{
        var request=connectionPool.request();
        request.input("PaymentInstructionReleaseFailed",sql.Int,PaymentStoreConstant.PaymentInstructionStaus.ReleaseFailed);
        request.input("PaymentInstructionValidationFailed",sql.Int,PaymentStoreConstant.PaymentInstructionStaus.ValidationFailed);
        request.input("PaymentInstructionDisposed",sql.Int,PaymentStoreConstant.PaymentInstructionStaus.Disposed);
        request.input("InvalidPaymentsStatisticsTimeLine",sql.Int,InvalidPaymentsDuration);
        return request.query(`SELECT COUNT(pe.publicId) As TotalCount from PaymentEntity pe with(nolock)
        JOIN OutgoingPayment ogp with(nolock) on pe.Id=ogp.PaymentId
        JOIN PaymentInstruction payinstr with(nolock) on payinstr.PaymentId=pe.PublicId 
        and payinstr.status in (@PaymentInstructionReleaseFailed,@PaymentInstructionValidationFailed,@PaymentInstructionDisposed) 
        And DATEDIFF(hour, payinstr.LastUpdatedOn,GETUTCDATE())<=@InvalidPaymentsStatisticsTimeLine
        LEFT JOIN PaymentCaseDetails sfcaseDetails with(nolock) on sfcaseDetails.PaymentID=payinstr.PaymentId 
        Where sfcaseDetails.SFCaseNumber IS NULL`)
    });
};
module.exports.NoSalesforceCaseRejectedPayments=()=>{
    return PaymentDb.GetInstance().then(connectionPool=>{
        var request=connectionPool.request();
        request.input("RejectedPaymentsStatisticsTimeline",sql.Int,RejectedPaymentsDuration);
        request.input("InstructionIdIsNotUnique",sql.VarChar(10),instructionIdIsNotUniqueErrorCode);
        request.input("PaymentBatchRJCT",sql.VarChar(10),PaymentStoreConstant.PaymentFileStatusRjct);
        request.input("PaymentBatchREJECT",sql.VarChar(10),PaymentStoreConstant.PaymentFileStatusReject);
        request.input("PaymentBatchDetailDisposed",sql.Int,PaymentStoreConstant.PaymentBatchDetailsStatus.Disposed);
        return request.query(`SELECT COUNT(pe.publicId) As TotalCount from PaymentEntity pe with(nolock)
        INNER JOIN OutgoingPayment ogp with(nolock) on pe.Id=ogp.PaymentId
        INNER JOIN PaymentInstruction payinstr with(nolock) on payinstr.PaymentId = pe.PublicId
        INNER JOIN PaymentFulfillmentBatch payfullfillmentbatch with(nolock) on payfullfillmentbatch.PaymentId=pe.PublicId
        INNER JOIN PaymentBatchReturnFileDetail pbrf with(nolock) on payfullfillmentbatch.PaymentBatchDetailID=pbrf.PaymentBatchDetailID
        and  pbrf.ErrorCode<>@InstructionIdIsNotUnique and pbrf.Status in (@PaymentBatchRJCT,@PaymentBatchREJECT)
        INNER JOIN PaymentBatchDetail pbd with(nolock) on pbd.PaymentBatchDetailID = pbrf.PaymentBatchDetailID and DATEDIFF(hour,pbd.LastUpdatedOn,GETUTCDATE())<=@RejectedPaymentsStatisticsTimeline
        and pbd.Status<>@PaymentBatchDetailDisposed
        LEFT JOIN PaymentCaseDetails sfCaseDetails with(nolock) ON sfCaseDetails.PaymentID=payinstr.PaymentId 
        WHERE sfCaseDetails.SFCaseNumber IS NULL`)
    });
};

function SearchPaymentsSortBy(parameter){
    switch (parameter.toLowerCase()) {
        case "transactionreference":
            return 0;
        case "paymentmethod":
            return 1;
        case "paymentstatus":
            return 7;
        case "releasedate":
            return 3;
        case "valuedate":
            return 4;
        case "gmtdeadline":
            return 5;
        case "hold":
            return 6;
        case "cctstatus":
            return 2;
        default:
            return null;
    }
}