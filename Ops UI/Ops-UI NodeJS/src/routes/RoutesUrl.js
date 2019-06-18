const apiVersion=process.env.version||"v1"
module.exports={
    SeachPayment:`/${apiVersion}/Payments`,
    PaymentGeneralDetails:`/${apiVersion}/Payments/:publicid/Details`,
    PaymentBeneficiaryDetails:`/${apiVersion}/Payments/:publicid/Beneficiary`,
    PaymentClientDetails:`/${apiVersion}/Payments/:publicid/Customer`,
    InvalidPaymentsCount:`/${apiVersion}/Payments/Count/InvalidPayments`,
    RejectedPaymentsCount:`/${apiVersion}/Payments/Count/RejectedPayments`,
    NoSalesforceCaseInvalidPaymentsCount:`/${apiVersion}/Payments/Count/NoSalesforceCaseInvalidPayments`,
    NoSalesforceCaseRejectedPaymentsCount:`/${apiVersion}/Payments/Count/NoSalesforceCaseRejectedPayments`,
    AllTypeOfPaymentsCount:`/${apiVersion}/Payments/Count`
}