const checkoutNodeJssdk = require("@paypal/checkout-server-sdk");

const client = () => {
  return new checkoutNodeJssdk.core.PayPalHttpClient(enviroment());
};

const enviroment = () => {
  let clientId =
    "AQMqiHoeCykCYWXMZD73debxm35IPMYZhJPvT0xfOjP5yzv5x0RM9FfJH6eLvNlIDNW9mrIC2qkFCQ5J";
  let clientsecret =
    "EFagllEK7hizOFax9Xa2uxFMhORaSJk8U_7ksfstse2UrJhIwIvwJXPTMCfr2q1HRdmu2DtybywkKiIj";

  return new checkoutNodeJssdk.core.SandboxEnvironment(clientId, clientsecret);
};

module.exports = { client };
