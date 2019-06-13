const Koa = require("koa");
const Router = require("koa-router");
const cors = require("@koa/cors");
const bodyParser = require("koa-bodyparser");
const { BraintreeGateway, Environment } = require("braintree");

const gateway = new BraintreeGateway({
  environment: Environment.Sandbox,
  merchantId: "bdgnjz46n34q9nzv",
  publicKey: "rjwm746y3dzwmdpg",
  privateKey: "86be54171e03c725492db8114a41e025"
});

const router = new Router();
router.get("/:customerId/token", async ctx => {
  const response = await gateway.clientToken.generate({
    // customerId: ctx.params.customerId
  });
  ctx.status = 201;
  ctx.body = response.clientToken;
});

router.post("/payments", async ctx => {
  const { gatewayParams, amount, currency, orderId } = ctx.request.body;
  const { nonce } = gatewayParams;

  const { transaction, success } = await gateway.transaction.sale({
    paymentMethodNonce: nonce,
    amount,
    orderId,
    options: {
      submitForSettlement: true
    }
  });

  ctx.body = {
    success,
    transaction
  };

  console.log(transaction, success);
});

const app = new Koa();
app.use(cors());
app.use(bodyParser({ enableTypes: ["json"] }));
app.use(router.routes());

app.listen(8080);
