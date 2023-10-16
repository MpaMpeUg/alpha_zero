const { Withdraw } = require("../models");
const constants = require("../constants");
const axios = require("axios");
const uuid = require("uuid");
const { fundCampaign } = require("./donate.service");
const { setConfig } = require("dompurify");

exports.getToken = function () {
  var config = {
    method: "post",
    url: `${constants.MTN_MOMO.url}/collection/token/`,
    headers: {
      "Ocp-Apim-Subscription-Key": constants.MTN_MOMO.subscription_key,
      Authorization:
        "Basic YTQxN2UwMTktOTc4YS00MTMwLWJhNzYtYTQzYWYwZWY0YjVhOjUyNmEwNzMwOTYyOTRlNzdiMjE1NDI3MTJiYzY4MzM5",
    },
  };

  return axios(config)
    .then(function (response) {
      return response.data.access_token;
    })
    .catch(function (error) {
      throw new Error(error.message);
    });
};

exports.reqToPayMpaMpe = async function (fund) {
  var data = JSON.stringify({
    amount: fund.amount,
    currency: fund.currency_code,
    externalId: "1237",
    payer: {
      partyIdType: "MSISDN",
      partyId: fund.donorNumber,
    },
    payerMessage: "Donating to MpaMpe ",
    payeeNote: "Donating to MpaMpe",
  });
console.log(data);
  let token = await exports.getToken();
  let ref_uuid = uuid.v4();

  var config = {
    method: "post",
    url: `${constants.MTN_MOMO.url}/collection/v1_0/requesttopay`,
    headers: {
      "X-Reference-Id": ref_uuid,
      "Content-Type": "application/json",
      "X-Target-Environment": constants.MTN_MOMO.enviroment,
      "Ocp-Apim-Subscription-Key": constants.MTN_MOMO.subscription_key,
      Authorization: "Bearer " + token.replace(/['"]+/g, ""),
    },
    data,
  };
  return axios(config)
    .then(async function (response) {
      const checkStatus = async () => {
        let result = await exports.reqToPayStatus(token, ref_uuid);
        switch (result?.data?.status) {
          case "SUCCESSFUL":
            await fundCampaign({
              ...fund,
              status: "Received",
            });

            return {
              message: "Payment made successfully",
            };

          case "PENDING":
            setTimeout(checkStatus, 5000);
            break;

          default:
            throw new Error("Failed to process transaction");
        }
      };

      if (response.status === 202) {
        return await checkStatus();
      }
    })

    .catch(function (error) {
      throw new Error(error.message);
    });
};


exports.reqToPay = async function (fund) {
  var data = JSON.stringify({
    amount: fund.amount,
    currency: fund.currency,
    externalId: "123",
    payer: {
      partyIdType: "MSISDN",
      partyId: fund.donorNumber,
    },
    payerMessage: "paying " + fund.campaign,
    payeeNote: "paying " + fund.campaign,
  });

  let token = await exports.getToken();
  let ref_uuid = uuid.v4();

  var config = {
    method: "post",
    url: `${constants.MTN_MOMO.url}/collection/v1_0/requesttopay`,
    headers: {
      "X-Reference-Id": ref_uuid,
      "Content-Type": "application/json",
      "X-Target-Environment": constants.MTN_MOMO.enviroment,
      "Ocp-Apim-Subscription-Key": constants.MTN_MOMO.subscription_key,
      Authorization: "Bearer " + token.replace(/['"]+/g, ""),
    },
    data,
  };

  return axios(config)
    .then(async function (response) {
      const checkStatus = async () => {
        let result = await exports.reqToPayStatus(token, ref_uuid);

        switch (result?.data?.status) {
          case "SUCCESSFUL":
            await fundCampaign({
              ...fund,
              status: "Received",
            });

            return {
              message: "Payment made successfully",
            };

          case "PENDING":
            setTimeout(checkStatus, 5000);
            break;

          default:
            throw new Error("Failed to process transaction");
        }
      };

      if (response.status === 202) {
        return await checkStatus();
      }
    })

    .catch(function (error) {
      throw new Error(error.message);
    });
};

exports.reqToPayStatus = async function reqToPayStatus(token, ref_uuid) {
  var config = {
    method: "get",
    url: `${constants.MTN_MOMO.url}/collection/v1_0/requesttopay/${ref_uuid}`,
    headers: {
      "X-Target-Environment": constants.MTN_MOMO.enviroment,
      "Ocp-Apim-Subscription-Key": constants.MTN_MOMO.subscription_key,
      Authorization: "Bearer " + token.replace(/['"]+/g, ""),
    },
  };

  return axios(config);
};

exports.getDisbursementToken = async function getmsisdnDisbursementToken() {
  var config = {
    method: "post",
    url: `${constants.MTN_MOMO.url}/disbursement/token/`,
    headers: {
      "Ocp-Apim-Subscription-Key":
        constants.MTN_MOMO.disbursement_subscription_key,
      Authorization:
        "Basic YTQxN2UwMTktOTc4YS00MTMwLWJhNzYtYTQzYWYwZWY0YjVhOjUyNmEwNzMwOTYyOTRlNzdiMjE1NDI3MTJiYzY4MzM5",
    },
  };

  return axios(config)
    .then(function (response) {
      return response.data.access_token;
    })
    .catch(function (error) {
      throw error;
    });
};

exports.getUserInfo = async function getUserInfo(msisdn) {
  let token = await exports.getDisbursementToken();

  var config = {
    method: "get",
    url: `${constants.MTN_MOMO.url}/disbursement/v1_0/accountholder/msisdn/${msisdn}/basicuserinfo`,
    headers: {
      "Ocp-Apim-Subscription-Key":
        constants.MTN_MOMO.disbursement_subscription_key,
      "X-Target-Environment": "sandbox",
      Authorization: "Bearer " + token.replace(/['"]+/g, ""),
    },
  };

  return axios(config)
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      throw error;
    });
};

exports.deposit = async function deposit(transaction) {
  var data = {
    amount: transaction.amount,
    currency: transaction.currency,
    externalId: transaction.transactionId,
    payee: { partyIdType: "MSISDN", partyId: transaction.idValue },
    payerMessage: "withdraw",
    payeeNote: "withdraw",
  };

  let token = await exports.getDisbursementToken();

  var config = {
    method: "post",
    url: `${constants.MTN_MOMO.url}/disbursement/v2_0/deposit`,
    headers: {
      "X-Reference-Id": transaction.transactionId,
      "X-Target-Environment": "sandbox",
      "Ocp-Apim-Subscription-Key":
        constants.MTN_MOMO.disbursement_subscription_key,
      Authorization: "Bearer " + token.replace(/['"]+/g, ""),
    },
    data,
  };

  const checkStatus = async () => {
    const result = await exports.depositStatus(
      token,
      transaction.transactionId
    );

    switch (result?.status) {
      case "SUCCESSFUL":
        await Withdraw.create({
          ...transaction,
          status: "Received",
        });

        return {
          message: "Withdraw performed successfully.",
        };

      case "PENDING":
        setTimeout(checkStatus, 5000);
        break;

      default:
        throw new Error("Failed to process transaction");
    }
  };

  return axios(config)
    .then(checkStatus)
    .catch(function (error) {
      throw error;
    });
};

exports.depositStatus = async function depositStatus(token, ref_uuid) {
  var config = {
    method: "get",
    url: `${constants.MTN_MOMO.url}/disbursement/v1_0/deposit/${ref_uuid}`,
    headers: {
      "Ocp-Apim-Subscription-Key":
        constants.MTN_MOMO.disbursement_subscription_key,
      "X-Target-Environment": "sandbox",
      Authorization: "Bearer " + token.replace(/['"]+/g, ""),
    },
  };

  return axios(config)
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      throw error;
    });
};

exports.initializeTransfer = async function (transaction) {
  let userInfo = await exports.getUserInfo(transaction.idValue);
  return userInfo;
};

exports.confirmTransfer = async function (transaction) {
  return exports.deposit(transaction);
};
