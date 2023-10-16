module.exports = Object.freeze({
  database: {
    url: process.env.MPAMPE_MONGODB_SERVER || "mongodb://localhost",
    name: process.env.DATABASE_NAME || "mpa-mpe",
    connectRetry: 5,
  },
  SECRET_KEY: "dsW7UoHqhl1FnQJmXm75NgpGb8243z7s",
  // SECRET_KEY:"4a292974-a4db-4333-96ac-164255e1b01b",
  // SECRET_KEY:"vT82qxVcsWpMFBoPCIYhyjDRiDbvalVyvOfdGePQNGT3RaOpvSoO370wKPJYqKtU",
  DEFAULT_ADMIN: {
    USERNAME: "admin",
    PASSWORD: "admin",
  },

  MOJALOOP: {
    url:
      process.env.MOJALOOP_URL ||
      "http://jcash-sdk-scheme-adapter-outbound.sandbox.mojaloop.io",
    idType: process.env.ID_TYPE || "MSISDN",
    idValue: process.env.ID_VALUE || "589408120",
  },

  MTN_MOMO:{
    user: "a417e019-978a-4130-ba76-a43af0ef4b5a",
    enviroment: 'sandbox',
    url:"https://sandbox.momodeveloper.mtn.com",
    subscription_key: process.env.MTN_MOMO_SUBSCRIPTION_KEY || "3d766fa471b84cf0a9393f15dbdada37",
    disbursement_subscription_key: process.env.MTN_MOMO_SUBSCRIPTION_KEY || "f320a11c40444697a5319598baab9f60",
    api_key: process.env.MTN_MOMO_API_KEY || "e2c24b07429f4875b791bf4eddbb10b7"
  }
});
