const router=require("express").Router();
const CommonValidators=require("../validators/CommonValidators")
const PaymentStoreValidators=require("../validators/PaymentStoreValidator")
const paymentStoreController=require("../controllers/PaymentReportController");
const RoutesUrls=require("./RoutesUrl");
const validatePaymentStoreReqest=require('../middlewares/ValidationMiddleWare')
var searchPaymentsValidators=[CommonValidators.PageValidation,CommonValidators.PageSizeValidation,PaymentStoreValidators.Filter,PaymentStoreValidators.TransactionReferenceValidator,PaymentStoreValidators.ReleaseDateValidator,PaymentStoreValidators.ValueDateValidator]
router.get(RoutesUrls.SeachPayment,searchPaymentsValidators,validatePaymentStoreReqest.ValidatePaymentStoreRequest,paymentStoreController.SearchPayments);
router.get(RoutesUrls.PaymentGeneralDetails,[PaymentStoreValidators.PublicIdRequired],paymentStoreController.PaymentGeneralDetails);
router.get(RoutesUrls.PaymentBeneficiaryDetails,[PaymentStoreValidators.PublicIdRequired],paymentStoreController.PaymentBeneDetails);
router.get(RoutesUrls.PaymentClientDetails,[PaymentStoreValidators.PublicIdRequired],paymentStoreController.PaymentClientDetails);
module.exports=router;