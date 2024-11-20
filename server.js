const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");

const app = express(); // Initialize the app first
app.use(cors()); // Then apply middleware

app.use(express.json());

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "adityagautam1911@gmail.com",
    pass: "", // Use the generated App Password
  },
});

// API to send email
app.post("/send-alert", (req, res) => {
  const { subject, message } = req.body;

  const mailOptions = {
    from: "adityagautam1911@gmail.com",
    to: "adityagautam1911@gmail.com", // Recipient email address
    subject: subject,
    text: message,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
      return res.status(500).send("Error sending email.");
    }
    console.log("Email sent:", info.response);
    res.status(200).send("Email sent successfully.");
  });
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
