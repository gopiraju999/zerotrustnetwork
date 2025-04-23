// index.js
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();

app.use(
  cors({
    origin: "https://zerotrustnetwork.vercel.app",
  })
);
app.use(express.json());

// In‑memory OTP store (resets on cold starts / server restarts)
const otpStore = {};

// Hard‑coded credentials (not secure for public repos!)
const EMAIL_USER = 'vigo1business@gmail.com';
const EMAIL_PASS = 'gbbd vtdm rsrk qjks';

// Create a reusable transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});

// Send OTP endpoint
app.post('/send-otp', async (req, res) => {

  console.log("sending otp");
  const { email } = req.body;
  if (!email) {
    return res
      .status(400)
      .json({ success: false, error: 'Missing `email` in request body.' });
  }

  // Generate and store OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  otpStore[email] = otp;

  try {
    await transporter.sendMail({
      from: EMAIL_USER,
      to: email,
      subject: 'Your OTP Code',
      text: `Your one-time OTP is ${otp}. It expires in 2 minutes.`,
    });
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Error sending mail:', err);
    return res
      .status(500)
      .json({ success: false, error: 'Failed to send OTP email.' });
  }
});

// Verify OTP endpoint
app.post('/verify-otp', (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) {
    return res
      .status(400)
      .json({ success: false, error: 'Missing `email` or `otp`.' });
  }

  if (otpStore[email] === otp) {
    delete otpStore[email];
    return res.status(200).json({ success: true });
  } else {
    return res.status(200).json({ success: false, error: 'Invalid OTP.' });
  }
});

// Start local server if run directly
if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () =>
    console.log(`Server listening on http://localhost:${PORT}`)
  );
}

// Export for serverless (Vercel)
// If you deploy to Vercel, rename this file to `api/index.js` (or link via vercel.json)
module.exports = app;
