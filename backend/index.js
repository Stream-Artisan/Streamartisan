require("dotenv").config(); // Add this line to load environment variables
const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = 5000;
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post("/send", async (req, res) => {
  const { name, email, message } = req.body;
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER, // Use environment variable
      pass: process.env.EMAIL_PASS, // Use environment variable
    },
  });
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER, // Use the authenticated email
      to: process.env.EMAIL_TO, // Use environment variable for recipient
      subject: `New message from ${name}`, // Optional: Add a subject
      text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`, // Include user's email in the message body
    });
    res.status(200).send("Email Sent");
  } catch (error) {
    console.error("Error sending email:", error.message);
    res.status(500).send("Error sending email");
  }
});
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
