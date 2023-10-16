// @type {PaymentsClient}
// @private
const tokenizationSpecification = {
    type: "PAYMENT_GATEWAY",
    parameters:{
      gateway: "checkoutltd",
      gatewayMerchantId: "pk_test_30668f80-f8ea-45da-975f-4f4de12a97ca"
    }
};
  
  
const cardPaymentMethod = {
    type: "CARD",
    tokenizationSpecification: tokenizationSpecification,
    parameters:{
    allowedCardNetworks: ["VISA", "MASTERCARD" ],
    allowedAuthMethods: ["PAN_ONLY", "CRYPTOGRAM_3DS"]
    }
};
  
const googlePayConfiguration = {
    apiVersion: 2,
    apiVersionMinor: 0,
    allowedPaymentMethods: [cardPaymentMethod]
  };
  
let googlePayClient;
  
function onGooglePayLoaded(){
    googlePayClient = new google.payments.api.PaymentsClient({
      environment: 'TEST',
    });
    
    googlePayClient.isReadyToPay(googlePayConfiguration)
    .then(response => {
      if(response.result){
        createAndAddButton();
      }
      else{
          // Incase User cant pay with Google
      }
    })
    .catch(err => console.error('isReadyToPay error:', err));
}
  
function createAndAddButton(){
    const googlePayButton= googlePayClient.createButton({
        buttonColor: 'orange',
        buttonType: 'donate',
        buttonSizeMode: 'fill',
        // onClick: () => {},
        onClick: onGooglePayButtonClicked,
    });
    document.getElementById('googleButton').appendChild(googlePayButton);
}

let amount = document.getElementById('gp_amount').value;

function onGooglePayButtonClicked() {
    const paymentDataRequest = { ...googlePayConfiguration}
    
    paymentDataRequest.merchantInfo = {
        merchantId: "BCR2DN4T6CR5JURL",
        merchantName: "MpaMpe"
    };

    paymentDataRequest.transactionInfo = {
        if(amount){
            totalPrice = string(amount);
        },
        totalPriceStatus:"FINAL",
        totalPrice : "5",
        currencyCode:"USD",
        countryCode: 'US'
    };

    googlePayClient.loadPaymentData(paymentDataRequest)
     .then(paymentDataResponse => processPaymentDataResponse(paymentDataResponse))
     .catch(error => console.error("load payment data error" ,error));


}

function processPaymentDataResponse(paymentDataResponse){
    fetch(ordersEndpointUrl, {
        method: 'POST',
        headers: {
            'content-type': 'application/json'
        },
        body : paymentDataResponse
    });
}