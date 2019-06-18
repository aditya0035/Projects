const paymentStatisticsController=require("../controllers/PaymentStatisticsController");
const routesUrl=require("./RoutesUrl")
const router=require("express").Router();
router.get(routesUrl.InvalidPaymentsCount,paymentStatisticsController.InvalidPaymentsCount);
router.get(routesUrl.RejectedPaymentsCount,paymentStatisticsController.RejectedPaymentsCount);
router.get(routesUrl.NoSalesforceCaseInvalidPaymentsCount,paymentStatisticsController.NoSalesforceInvalidPaymentsCount);
router.get(routesUrl.NoSalesforceCaseRejectedPaymentsCount,paymentStatisticsController.NoSalesforceRejectedPaymentsCount);
router.get(routesUrl.AllTypeOfPaymentsCount,paymentStatisticsController.AllTypeOfPaymentsCount);
module.exports=router;