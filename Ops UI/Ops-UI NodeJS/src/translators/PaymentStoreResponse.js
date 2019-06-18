const PaymentStoreConstant=require("../contracts/PaymentStoreConstant");
module.exports.TranslateResulToSearchPaymentResponse=(result)=>{
   var searchResult={
        TotalSearchResults:0,
        PaymentStoreList:[]
    };
    paymentstoreresponse={}
    if(result===null||!result.recordsets||result.recordsets.length!==2)
    {
       
    }else{
        result.recordset.forEach((row)=>{
            searchResult.TotalSearchResults=row.TotalRecord;
        });
        result.recordsets[1].forEach(row=>{
             searchResult.PaymentStoreList.push(PaymentStoreResult(row));
        });
    }
    return Promise.resolve(searchResult);
};

function PaymentStoreResult(row){
    var paymentStore={};
    paymentStore.PaymentStatus=GetPaymentStatusDescription(row.PaymentInstructionStatus?row.BatchStatus:null,row.BatchStatus);
    paymentStore.TransactionReference =GetTransactionReference(row.ConfirmationNo,row.ItemNo?row.ItemNo:null);
    paymentStore.PayoutBankDetails={
        BankName:row.DebitBankDescription?row.DebitBankDescription:'',
        AccountEntity:row.AccountEntity?row.AccountEntity:'',
        BankSwift:row.DebitBankSwiftAddress?row.DebitBankSwiftAddress:'',
        AccountNumber:row.DebitBankAccountNumber?row.DebitBankAccountNumber:''
    }
    paymentStore.Amount={
        NumberOfDecimals:row.AmountNDec?row.AmountNDec:'',
        Amount:row.Amount?row.Amount:'',
        CurrencyCode:row.Currency?row.Currency:''
    }
    paymentStore.Status=row.CCTPaymentMethod?row.CCTPaymentMethod:'';
    paymentStore.ActualValueDate=row.ActualValueDate?new Date(row.ActualValueDate).toLocaleDateString():null;
    paymentStore.GmtDeadline=row.GmtDeadLine?row.GmtDeadLine:null;
    paymentStore.CustomerAccountNumber=row.ClientAccount?row.ClientAccount:'';
    paymentStore.PaymentMethod=row.PaymentMethodDesc?row.PaymentMethodDesc:'';
    paymentStore.OnHold=row.IsOnHold?row.IsOnHold:false;
    paymentStore.PublicId=row.publicId?row.publicId:'';
    return paymentStore;
}


module.exports.TransalteResultToPaymentGeneralDetails=(result)=>{
    var genralDetails=result.recordsets[0][0]; //First Record First Row Only as Only One Row is returned
    var PaymentGeneralDetailsResponse=null;
    if(genralDetails){
        PaymentGeneralDetailsResponse={}
        var paymentMethod=genralDetails.PaymentMethodDescription?genralDetails.PaymentMethodDescription:'';
        PaymentGeneralDetailsResponse.TransactionReference=GetTransactionReference(genralDetails.ConfirmationNo,genralDetails.ItemNo?genralDetails.itemNo:null)
        PaymentGeneralDetailsResponse.OriginalPaymentId=genralDetails.OriginalPaymentId?genralDetails.OriginalPaymentId:null;
        PaymentGeneralDetailsResponse.OriginalOrderId=genralDetails.OriginalOrderId?genralDetails.OriginalOrderId:null;
        PaymentGeneralDetailsResponse.PaymentMethod=paymentMethod;
        PaymentGeneralDetailsResponse.ServiceFee={
            Amount:genralDetails.ServiceCharges?genralDetails.ServiceCharges:null,
            CurrencyCode:genralDetails.SettlementCurrency?genralDetails.SettlementCurrency:null,
            NumberOfDecimals:genralDetails.SettlementAmountNdec?genralDetails.SettlementAmountNdec:null
        };
        PaymentGeneralDetailsResponse.ItemTotal={
            Amount:genralDetails.GrandTotal?genralDetails.GrandTotal:null,
            CurrencyCode:genralDetails.SettlementCurrency?genralDetails.SettlementCurrency:null,
            NumberOfDecimals:genralDetails.SettlementAmountNdec?genralDetails.SettlementAmountNdec:null
        };
        PaymentGeneralDetailsResponse.SubTotal={
            Amount: genralDetails.SubTotal?genralDetails.SubTotal:null,
            CurrencyCode : genralDetails.SettlementCurrency?genralDetails.SettlementCurrency:null,
            NumberOfDecimals: genralDetails.SettlementAmountNdec?genralDetails.SettlementAmountNdec:null
        };
        PaymentGeneralDetailsResponse.Rate={
            Amount:genralDetails.Rate?genralDetails.Rate:null,
            NumberOfDecimals:genralDetails.RateNdec
        };
        PaymentGeneralDetailsResponse.AchievableValueDate=genralDetails.AchievableValueDate?genralDetails.AchievableValueDate:null;
        PaymentGeneralDetailsResponse.Uetr=genralDetails.Uetr?genralDetails.Uetr:null;
        PaymentGeneralDetailsResponse.PublicId=genralDetails.PublicId?genralDetails.PublicId:null;
        PaymentGeneralDetailsResponse.ValueDate=genralDetails.ValueDate?genralDetails.ValueDate:null;
        PaymentGeneralDetailsResponse.SettlementCurrency=genralDetails.SettlementCurrency?genralDetails.SettlementCurrency:null;
        PaymentGeneralDetailsResponse.ClearDate=genralDetails.ClearDate?genralDetails.ClearDate:null;
        PaymentGeneralDetailsResponse.PaymentInitiatedDateTime=genralDetails.PaymentInitiatedDateTime?genralDetails.PaymentInitiatedDateTime:null;
        PaymentGeneralDetailsResponse.CustomerAccountNumber=genralDetails.ClientAccountNumber?genralDetails.ClientAccountNumber:null;
        PaymentGeneralDetailsResponse.CustomerName=genralDetails.ClientName;
        PaymentGeneralDetailsResponse.PaymentStatus=GetPaymentStatusDescription(genralDetails.PaymentInstructionStatus?genralDetails.paymentInstructionStatus:null,genralDetails.PaymentFileStatus?genralDetails.PaymentFileStatus:null);
        PaymentGeneralDetailsResponse.PaymentFileFormat=GetPainFileFormatDescription(genralDetails.PaymentFileFormat);
        PaymentGeneralDetailsResponse.PaymentFileStatus=GetPaymentFileStatusDescription(genralDetails.FileStatus);
        PaymentGeneralDetailsResponse.PaymentBatchDetailId=genralDetails.PaymentBatchDetailId?genralDetails.PaymentBatchDetailId:null;
        PaymentGeneralDetailsResponse.PaymentBatchId=genralDetails.PaymentBatchId?genralDetails.PaymentBatchId:null;
        PaymentGeneralDetailsResponse.PaymentWarning=GetPaymentWarning(genralDetails.PaymentInstructionStatus,genralDetails.PaymentFileStatus,genralDetails.PaymentInstructionWarning,genralDetails.PaymentFileWarning);
        PaymentGeneralDetailsResponse.ErrorCode=genralDetails.ErrorCode;
        PaymentGeneralDetailsResponse.IsConsumerPayment=genralDetails.IsConsumerPayment;
        PaymentGeneralDetailsResponse.DoddFrankDisclosureDate=genralDetails.DisclosureDate?genralDetails.DisclosureDate:null;
        PaymentGeneralDetailsResponse.DoddFrankAvailableDate=genralDetails.ConsumerPaymentAvailableDate?genralDetails.ConsumerPaymentAvailableDate:null;
        PaymentGeneralDetailsResponse.RequestedValueDate=genralDetails.RequestedValueDate?genralDetails.RequestedValueDate:null;
        PaymentGeneralDetailsResponse.ArPaymentRecieved=null;
        PaymentGeneralDetailsResponse.GpgFileId=null;
        PaymentGeneralDetailsResponse.PaidAndPostedInAr=null;
        PaymentGeneralDetailsResponse.ReleasedDate=null;
        PaymentGeneralDetailsResponse.TimeUntilPaymentReleased=null;
        PaymentGeneralDetailsResponse.Taxes=null;
        PaymentGeneralDetailsResponse.SfCasesNumber=null;
        ParsePaymentInstructionBody(genralDetails.Body).then(instructionBody=>{
            PaymentGeneralDetailsResponse.NostroBankDetails=instructionBody?instructionBody.NostroBankDetails:null;
            PaymentGeneralDetailsResponse.Amount=instructionBody?instructionBody.Amount:null;
            PaymentGeneralDetailsResponse.GuranteedOur =instructionBody? instructionBody.GuranteedOur:null;
            PaymentGeneralDetailsResponse.ChargeType =instructionBody? instructionBody.ChargeType:null;
            PaymentGeneralDetailsResponse.SourceSystem =instructionBody? instructionBody.SourceSystem:null;
            PaymentGeneralDetailsResponse.OrderDetailId =instructionBody? instructionBody.OrderDetailId:null;
            PaymentGeneralDetailsResponse.AutoConvert =instructionBody? instructionBody.AutoConvert:null;
            PaymentGeneralDetailsResponse.BeneficiaryName =instructionBody? instructionBody.BeneficiaryName:null;
            PaymentGeneralDetailsResponse.IsIat =instructionBody? instructionBody.IsIat:null;
            PaymentGeneralDetailsResponse.NostroAccountCode =instructionBody? instructionBody.NostroAccountCode:null;
            PaymentGeneralDetailsResponse.AchType=instructionBody? instructionBody.NostroBankCountryCode&&paymentMethod && instructionBody.CurrencyCode &&(instructionBody.NostroBankCountryCode.toUpperCase()==='US'
            && paymentMethod.toUpperCase()==="ACH"&& instructionBody.CurrencyCode.toUpperCase()==="USD"
            ?(generalDetails.PaymentTypeCode ? genralDetails.PaymentTypeCode : null):null):null;
           
        }).
        catch(exception=>{
            console.log("Transalating General Details",exception);
            return next(exception);
        });
    }
    return Promise.resolve(PaymentGeneralDetailsResponse);
};
module.exports.TransalteResultToPaymentBeneficiaryDetails=(result)=>{
    var BeneficiaryDetailsResponse=null
    var body=result.recordsets[0][0].body
    if(body){
        BeneficiaryDetailsResponse={}
        ParsePaymentInstructionBody(body).then(
            (instruction)=>{
                BeneficiaryDetailsResponse.BeneficiaryName = instruction.BeneficiaryDetailsResponse;
                BeneficiaryDetailsResponse.BeneficiaryFamiliarName = instruction.BeneficiaryFamiliarName;
                BeneficiaryDetailsResponse.BeneficiaryAddress = instruction.BeneficiaryFamiliarName;
                BeneficiaryDetailsResponse.BeneficiaryTelephoneNumber = instruction.BeneficiaryTelephoneNumber;
                BeneficiaryDetailsResponse.BeneficiaryContactName = instruction.BeneficiaryContactName;
                BeneficiaryDetailsResponse.BeneficiaryEmailAddress = instruction.BeneficiaryEmailAddress;
                BeneficiaryDetailsResponse.PurposeofPayment = instruction.PurposeofPayment;
                BeneficiaryDetailsResponse.BankAddress = instruction.BankAddress;
                BeneficiaryDetailsResponse.BankSWIFT = instruction.BankSWIFT;
                BeneficiaryDetailsResponse.RoutingCode = instruction.RoutingCode;
                BeneficiaryDetailsResponse.IBKName = instruction.IBKName;
                BeneficiaryDetailsResponse.IBKAddress = instruction.IBKAddress;
                BeneficiaryDetailsResponse.IBKRoutingCode = instruction.IBKRoutingCode;
                BeneficiaryDetailsResponse.IBKSWIFT = instruction.IBKSWIFT;
                BeneficiaryDetailsResponse.BeneficiaryNotficationEnabled = instruction.BeneficiaryNotficationEnabled;
                BeneficiaryDetailsResponse.PublicId = instruction.PublicId;
                BeneficiaryDetailsResponse.CustomerVendorId = instruction.CustomerVendorId;
                BeneficiaryDetailsResponse.BeneficiaryAccountNumber = instruction.BeneficiaryAccountNumber /*instruction.Beneficiary.Account*/;
                BeneficiaryDetailsResponse.BeneficiaryType = instruction.BeneficiaryType;
                BeneficiaryDetailsResponse.CustomerReference = instruction.CustomerReference;
                BeneficiaryDetailsResponse.BankName = instruction.BankName;
                BeneficiaryDetailsResponse.SWIFTBranchDetails = instruction.SWIFTBranchDetails;
            }
        );
    }
    return Promise.resolve(BeneficiaryDetailsResponse);
}

module.exports.TransalateResultToPaymentClientDetails=(result)=>{
    var paymentClientDetailResponse=null;
    var clientDetails=result.recordsets[0][0];
    
    if(clientDetails)
    {
        paymentClientDetailResponse={};
        paymentClientDetailResponse.CustomerAccountNumber = clientDetails.Account?clientDetails.Account:null;
        paymentClientDetailResponse.CustomerId = clientDetails.CustomerId?clientDetails.CustomerId:null;
        paymentClientDetailResponse.CustomerName = clientDetails.CustomerName?clientDetails.CustomerName:null;
        paymentClientDetailResponse.CustomerAddress ={
                    City :clientDetails.City?clientDetails.City:null,
                    Province :clientDetails.Province?clientDetails.City:null,
                    Country :{
                        Code : clientDetails.CountryCode?clientDetails.CountryCode:null,
                        Description :clientDetails.CountryDescription?clientDetails.CountryDescription:null
                    },
                    StateProvince:clientDetails.State?clientDetails.State:null,
                    StreetAddress1:clientDetails.AddressLine1?clientDetails.AddressLine1:null,
                    StreetAddress2:clientDetails.AddressLine2?clientDetails.AddressLine2:null,
                    StreetAddress3:clientDetails.AddressLine3?clientDetails.AddressLine3:null,
                    ZipPostalCode:clientDetails.PostalCode?clientDetails.PostalCode:null
                };
        paymentClientDetailResponse.ProcessingCenterCode = clientDetails.ProcessingCenterCode?clientDetails.ProcessingCenterCode:null;
        paymentClientDetailResponse.ProcessingCenter = clientDetails.ProcessingCenterDescription?clientDetails.ProcessingCenterDescription:null;
        paymentClientDetailResponse.OfficeCode = clientDetails.OfficeCode?clientDetails.OfficeCode:null;
        paymentClientDetailResponse.Office = clientDetails.OfficeDescription?clientDetails.OfficeDescription:null;
        paymentClientDetailResponse.TypeClassificationCode = clientDetails.TypeClassificationCode?clientDetails.TypeClassificationCode:null;
        paymentClientDetailResponse.TypeClassification = clientDetails.TypeClassificationDescription?clientDetails.TypeClassificationDescription:null;
        paymentClientDetailResponse.CategoryCode = clientDetails.CategoryCode?clientDetails.CategoryCode:null;
        paymentClientDetailResponse.Category = clientDetails.CategoryDescription?clientDetails.CategoryDescription:null;
        paymentClientDetailResponse.PublicId = clientDetails.PublicId?clientDetails.PublicId:null;
        ParsePaymentInstructionBody(clientDetails.body).then(
            (instruction)=>{
                paymentClientDetailResponse.RemitterAccountNumber=clientDetails.IsCustomerMultiParty?instruction.ClientAccount:null;
                paymentClientDetailResponse.RemitterName=clientDetails.IsCustomerMultiParty?instruction.ClientName:null;
                paymentClientDetailResponse.RemitterAddress=clientDetails.IsCustomerMultiParty?instruction.clientAddress:null;
                paymentClientDetailResponse.RemitterAccountNumber=clientDetails.IsCustomerMultiParty?instruction.ClientAccount:null;
                paymentClientDetailResponse.RemitterFISwiftBIC=(instruction.ThirdPartyRemitterBank.SwiftAddress&&clientDetails.IsCustomerMultiParty?
                    instruction.ThirdPartyRemitterBank.SwiftAddress:null)
                paymentClientDetailResponse.RemitterFIAccountNumber=(instruction.ThirdPartyRemitterBank.SwiftAddress&&clientDetails.IsCustomerMultiParty?
                        instruction.ThirdPartyRemitter.Account:null)
                paymentClientDetailResponse.RemitterFIName=(instruction.ThirdPartyRemitterBank.SwiftAddress&&clientDetails.IsCustomerMultiParty?
                            instruction.ThirdPartyRemitter.Name:null)
                paymentClientDetailResponse.RemitterFIAddress=(instruction.ThirdPartyRemitterBank.SwiftAddress&&clientDetails.IsCustomerMultiParty?
                                instruction.ThirdPartyRemitter.Address:null)

            }
        ).
        catch(exception=>{
            console.log("Transalating Client Details",exception);
            return next(exception);
        });
    }
    return Promise.resolve(paymentClientDetailResponse);
}

function ParsePaymentInstructionBody(paymentInstructionBody){
    var paymentInstructions=null;
    if(paymentInstructionBody){
        paymentInstructions={}
        var body=JSON.parse(paymentInstructionBody);
        var currencyCode = body.Amount.CurrencyCode;
        var nostroBankCountryCode = (body.DebitBank.Address &&
                    body.DebitBank.Address.Country
           ? body.DebitBank.Address.Country.Code : '');
        paymentInstructions.NostroBankDetails={
            BankName:body.DebitBank.Description,
            AccountEntity:body.DebitBank.AccountOwnerName,
            BankSwift:body.DebitBank.SwiftAddress,
            AccountNumber:body.DebitBank.AccountNumber
        }
        paymentInstructions.Amount={
            NumberOfDecimals:body.NDec,
            Amount:body.Amount.Amount,
            CurrencyCode:currencyCode
        }
        paymentInstructions.GuranteedOur=body.IsGuaranteedOur?body.IsGuaranteedOur:false;
        paymentInstructions.ChargeType = body.ChargeType?body.ChargeType:null;
        paymentInstructions.SourceSystem = body.SourceSystem?body.SourceSystem:null;
        paymentInstructions.OrderDetailId = body.OrderDetailId?body.OrderDetailId:null;
        paymentInstructions.AutoConvert = body.IsAutoConvert?body.IsAutoConvert:false;
        paymentInstructions.BeneficiaryName = body.Beneficiary.Name?body.Beneficiary.Name:null;
        paymentInstructions.IsIat = body.IsIat?body.IsIat:false;
        paymentInstructions.NostroAccountCode = body.DebitBank.InternalBankCode;
        paymentInstructions.NostroBankCountryCode=nostroBankCountryCode;
        paymentInstructions.CurrencyCode=currencyCode;
        
        //Bene Details//
        paymentInstructions.BeneficiaryName = body.Beneficiary.Name?body.Beneficiary.Name:null;
        paymentInstructions.BeneficiaryFamiliarName=body.Beneficiary.ShortName;
        ToAddress(body.Beneficiary.Address).then(address=>{paymentInstructions.BeneficiaryAddress=address;}).catch(exception=>{
            console.log("Parsing Payment Instructon",exception);
            return next(exception);
        });
        paymentInstructions.BeneficiaryTelephoneNumber = body.Beneficiary.Address.PhoneNumber;
        paymentInstructions.BeneficiaryContactName = body.Beneficiary.ContactName;
        paymentInstructions.BeneficiaryEmailAddress = body.Beneficiary.EmailAddress1;
        paymentInstructions.PurposeofPayment = body.PurposeOfPayment;
    
        ToAddress(body.CreditBank.Address).then((address)=>{
            paymentInstructions.BankAddress=address;
        }).catch(exception=>{
            console.log("Transalating Address",exception);
            return next(exception);
        });
        paymentInstructions.BankSWIFT = body.CreditBank.SwiftAddress;
        paymentInstructions.RoutingCode = body.CreditBank.RoutingCode;
        paymentInstructions.IBKName =body.IntermediaryBank? body.IntermediaryBank.Description:null;
        ToAddress(body.IntermediaryBank?body.IntermediaryBank.Address:null).then(address=>{
            paymentInstructions.IBKAddress=address;
        }).catch(exception=>{
            console.log("Transalating Address",exception);
            return next(exception);
        });
        paymentInstructions.IBKRoutingCode =body.IntermediaryBank? body.IntermediaryBank.RoutingCode:null;
        paymentInstructions.IBKSWIFT = body.IntermediaryBank?body.IntermediaryBank.SwiftAddress:null;
        paymentInstructions.BeneficiaryNotficationEnabled = body.Beneficiary.Notify;
        paymentInstructions.PublicId = body.PaymentId;
        paymentInstructions.CustomerVendorId = body.Beneficiary.Account;
        paymentInstructions.BeneficiaryAccountNumber = body.CreditBank.AccountNumber;
        paymentInstructions.BeneficiaryType = body.CreditBank.AccountType;
        paymentInstructions.CustomerReference = body.InternalReference;
        paymentInstructions.BankName = body.CreditBank.Description;
        paymentInstructions.SWIFTBranchDetails = body.CreditBank.BranchCode;
        //Bene Details//

        //ClientDetails//
        paymentInstructions.ClientAccount=body.Client.Account;
        paymentInstructions.ClientName=body.Client.Name;
        ToClientAddress(body.Client.Address).then((address)=>{
            paymentInstructions.clientAddress=address;
        }).catch(exception=>{
            console.log("Transalating Client Address",exception);
            return next(exception);
        });
        paymentInstructions.ThirdPartyRemitterBank={
            SwiftAddress: body.ThirdPartyRemitterBank?body.ThirdPartyRemitterBank.SwiftAddress:null
        }
        paymentInstructions.ThirdPartyRemitter={
            Name:body.ThirdPartyRemitter?body.ThirdPartyRemitter.Name:null,
            Account:body.ThirdPartyRemitter?body.ThirdPartyRemitter.Account:null,
            SwiftAddress:body.ThirdPartyRemitter?body.ThirdPartyRemitter.SwiftAddress:null
        }
        ToClientAddress(body.ThirdPartyRemitter?body.ThirdPartyRemitter.Address:null).then(
            address=>{
                paymentInstructions.ThirdPartyRemitter.Address=address;
            }
        ).catch(exception=>{
            console.log("Transalating Client Address",exception);
            return next(exception);
        });
        //ClientDetails//
    }
    return Promise.resolve(paymentInstructions);
}

async function  ToClientAddress(address)
{
    var addreeResponse={
        StreetAddress1:null,
        StreetAddress2:null,
        StreetAddress3:null,
        City:null,
        State:null,
        Province:null,
        ZipPostalCode:null,
        Country:{
            Code:null,
            Description:null
        }
    }
    if (address != null)
    {
      
        addreeResponse.StreetAddress1 = address.AddressLine1,
        addreeResponse.StreetAddress2 = address.AddressLine2,
        addreeResponse.StreetAddress3 = address.AddressLine3,
        addreeResponse.City = address.City,
        addreeResponse.StateProvince = address.State,
        addreeResponse.Province = address.Province,
        addreeResponse.ZipPostalCode = address.ZipOrPostalCode,
        addreeResponse.Country.Code= address.Country ? address.Country.Code : null,
        addreeResponse.Country.Description = address.Country ? address.Country.Description : null
        
    }
    return await addreeResponse;
}

function ToAddress(address)
{
    var addreeResponse={
        StreetAddress1:null,
        StreetAddress2:null,
        StreetAddress3:null,
        City:null,
        StateProvince:null,
        ZipPostalCode:null,
        Country:{
            Code:null,
            Description:null
        }
    }
    if(address){
        addreeResponse.StreetAddress1 = address.AddressLine1,
        addreeResponse.StreetAddress2 = address.AddressLine2,
        addreeResponse.StreetAddress3=address.AddressLine3,
        addreeResponse.City=address.City,
        addreeResponse.StateProvince=address.Province,
        addreeResponse.ZipPostalCode=address.ZipOrPostalCode,
        addreeResponse.Country.Code=address.Country ? address.Country.Code : null,
        addreeResponse.Country.Description=address.Country? address.Country.Description : null
        
    }
    return Promise.resolve(addreeResponse);
}

function GetPaymentWarning(paymentInstructionStatus,paymentFileStatus,paymentInstructionWarning,paymentFileAdditionalInfo){
    if(!paymentFileStatus){
        if(paymentInstructionStatus){
            switch (paymentInstructionStatus) {
                case 5:
                case 6:
                case 7:
                    return paymentInstructionWarning;
                default:
                     return null;
            }
        }
        return null;
    }
    return paymentFileAdditionalInfo?paymentFileAdditionalInfo:null;
}

function GetPaymentFileStatusDescription(fileStatus)
{
    if(fileStatus){
        switch (fileStatus) {
            case 1:
                return 'Created';
            case 2:
                return 'Released';
            case 3:
                return 'Failed';
            case 4: 
                return 'Disposed';
            case 5:
                return 'Confirmed Automatically';
            case 6:
                return 'Received by GPG';
            case 7:
                return 'Received by RBFI';
            case 8:
                return 'Release Failed';
            default:
                return ''
        }
    }
    return  '';
}

function GetPaymentStatusDescription(paymentInstructionStatus,paymentFileStatus){
    if(paymentFileStatus===null||paymentFileStatus=='')
    {
        if(paymentInstructionStatus){
            switch (parseInt(paymentInstructionStatus)) {
                case 5:
                    return 'Validation Failed';
                case 9:
                    return 'Released Without Instruction';
                default:
                    return '';
            }
        }
        return ''
    }
    switch (paymentFileStatus.toUpperCase()) {
        case PaymentStoreConstant.PaymentFileStatusAccp:
        case PaymentStoreConstant.PaymentFileStatusAccpept:
            return PaymentStoreConstant.PaymentFileAccepted;
        case PaymentStoreConstant.PaymentFileStatusRjct:
        case PaymentStoreConstant.PaymentFileStatusReject:
            return PaymentStoreConstant.PaymentFileRejected;
        default:
            return '';
    }
}
function GetTransactionReference(confirmationNo,itemNo){
    var  transactionReference=''
    if(confirmationNo&&itemNo){
        transactionReference=confirmationNo.concat("/",itemNo.toString());
    }
    else{
        transactionReference=confirmationNo
    }
    return transactionReference?transactionReference:'';
}

function GetPainFileFormatDescription(painfileFormet){
    if(painfileFormet)
    {
        switch (painfileFormet) {
            case 0:
                return 'None';
            case 1:
                return 'pain.001';
            case 2:
                return 'pain.008';
            case 3:
                return 'MT110';
            case 4:
                return 'Recon';
            default:
                return '';
        }
    }
    return '';
}