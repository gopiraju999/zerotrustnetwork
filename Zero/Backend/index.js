const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

const otpStore = {}; // Temporary OTP storage (use a database in production)

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'vigo1business@gmail.com', // Replace with your email
    pass: 'gbbd vtdm rsrk qjks',    // Replace with your app-specific password
  },
});

app.post('/send-otp', (req, res) => {
  const { email } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
  otpStore[email] = otp;

  const mailOptions = {
    from: 'vigo1business@gmail.com',
    to: email,
    subject: 'Vigo Admin OTP',
    text: `Your OTP is ${otp}. It is valid for 2 minutes.`,
  };

  transporter.sendMail(mailOptions, (error) => {
    if (error) {
      return res.status(500).json({ success: false, error });
    }
    res.json({ success: true });
  });
});

app.post('/verify-otp', (req, res) => {
  const { email, otp } = req.body;
  if (otpStore[email] === otp) {
    delete otpStore[email]; // Clear OTP after verification
    res.json({ success: true });
  } else {
    res.json({ success: false });
  }
});

app.listen(5000, () => console.log('Server running on port 5000'));