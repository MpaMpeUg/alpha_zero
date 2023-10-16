const xtend = require("xtend");
const { transactionService } = require("../services");

exports.fundCampaign = async function (req, res) {
  let fund = xtend(
    req.body,
    {
      campaign: req.params.campaignId,
    },
    req.session.user ? { donor: req.session.user.id } : {}
  );

  let result = await transactionService.reqToPay(fund);
  // res.redirect('/');
  res.json(result);
};

exports.fundMpaMpe = async (req, res, next) => {
  let fund = xtend(
    req.body,   
    req.session.user ? { donor: req.session.user.id} : {}
  );
  console.log(req.session.user);

  let result = await transactionService.reqToPayMpaMpe(fund);
  res.json(result);

}