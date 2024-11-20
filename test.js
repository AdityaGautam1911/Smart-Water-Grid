const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "adityagautam1911@gmail.com",
    pass: "bguk untz vuln varm",
  },
});

const mailOptions = {
  from: "adityagautam1911@gmail.com",
  to: "adityagautam1911@gmail.com",
  subject: "Test Email",
  text: "This is a test email.",
};

transporter.sendMail(mailOptions, (error, info) => {
  if (error) {
    console.error("Error:", error);
  } else {
    console.log("Email sent:", info.response);
  }
});
