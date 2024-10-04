const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "natantamiru18@gmail.com",
    pass: "zwwg qidc wajc mijd",
  },
});

const mailOptions = {
  from: "natantamiru18@gmail.com",
  to: "mnati5822@gmail.com",
  subject: "Test Email",
  text: "Hello from Node.js!",
};

transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    console.error("Error sending test email:", error);
  } else {
    console.log("Test email sent:", info.response);
  }
});
