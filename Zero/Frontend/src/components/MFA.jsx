import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const MFA = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']); // 6 boxes for OTP
  const [timer, setTimer] = useState(120); // 2 minutes in seconds
  const [message, setMessage] = useState('Sending OTP...');
  const [canResend, setCanResend] = useState(false);
  const navigate = useNavigate();
  const email = localStorage.getItem('email');
  const inputRefs = useRef([]); // Refs for input focus management
  const hasSentOtp = useRef(false); // Prevent duplicate OTP sending

  // Send OTP function
  const sendOtp = () => {
    if (hasSentOtp.current) return; // Prevent duplicate sends
    hasSentOtp.current = true;

    fetch('http://localhost:5000/send-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })
      .then((res) => res.json())
      .then((data) => setMessage('OTP sent to your email!'))
      .catch(() => setMessage('Error sending OTP'));
  };

  // Send OTP on component mount
  useEffect(() => {
    sendOtp();
  }, [email]);

  // Timer logic
  useEffect(() => {
    if (timer > 0) {
      const countdown = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(countdown);
    } else {
      setCanResend(true); // Enable resend after timer expires
    }
  }, [timer]);

  // Handle OTP input change
  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return; // Allow only digits
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1); // Take only the last digit
    setOtp(newOtp);

    // Move focus to next input
    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  // Handle backspace
  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  // Verify OTP
  const verifyOtp = (e) => {
    e.preventDefault();
    const otpCode = otp.join('');
    fetch('http://localhost:5000/verify-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, otp: otpCode }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          navigate('/dashboard');
        } else {
          alert('Invalid OTP');
        }
      });
  };

  // Resend OTP
  const resendOtp = () => {
    setOtp(['', '', '', '', '', '']); // Reset OTP inputs
    setTimer(120); // Reset timer
    setCanResend(false); // Disable resend until timer expires again
    hasSentOtp.current = false; // Allow sending OTP again
    sendOtp();
  };

  // Format timer as MM:SS
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="body">
      <div className="title">Vigo</div>
      <div className="container">
        <h2>Multi-Factor Authentication</h2>
        <p>{message}</p>
        <form onSubmit={verifyOtp}>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '20px' }}>
            {otp.map((digit, index) => (
              <input
                key={index}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                ref={(el) => (inputRefs.current[index] = el)}
                style={{
                  width: '40px',
                  height: '40px',
                  textAlign: 'center',
                  fontSize: '1.2em',
                  background: 'rgba(255, 255, 255, 0.2)',
                  border: 'none',
                  borderRadius: '8px',
                  color: 'white',
                }}
              />
            ))}
          </div>
          <p>Time remaining: {formatTime(timer)}</p>
          <button type="submit" className="btn" disabled={otp.some((digit) => !digit)}>
            Verify
          </button>
        </form>
        <button
          className="btn"
          onClick={resendOtp}
          disabled={!canResend}
          style={{ marginTop: '10px', background: canResend ? 'white' : 'gray' }}
        >
          Resend OTP
        </button>
      </div>
    </div>
  );
};

export default MFA;