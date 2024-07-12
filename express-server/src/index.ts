import express from 'express';
import { createClient } from 'redis';
import rateLimit from 'express-rate-limit';

const app = express()
app.use(express.json())

const otpStore: Record<string, string> = {};

const client = createClient()
client.connect().catch(err => console.error('Redis connect error:', err));

const otpLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 3, // Limit each IP to 3 OTP requests per windowMs
  message: 'Too many requests, please try again after 5 minutes',
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

const passwordResetLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 password reset requests per windowMs
  message: 'Too many password reset attempts, please try again after 15 minutes',
  standardHeaders: true,
  legacyHeaders: false,
});


app.get("/", (req, res) => res.send("Hello World!"))

app.post("/submit", async (req, res) => {
    const { problemId, userId, code, language } = req.body
    // Push this to a database (maybe prisma.submission.create())
    try {
        await client.lPush("submissions", JSON.stringify({ problemId, userId, code, language }))
        res.json({
            message: "Submission received!"
        })
    } catch (error) {
        res.status(500).json({
            message: "Error submitting the code"
        })
    }
})

app.post('/generate-otp', otpLimiter, (req, res) => {
    const email = req.body.email;
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }
    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // generates a 6-digit OTP
    otpStore[email] = otp
  
    console.log(`OTP for ${email}: ${otp}`); // Log the OTP to the console
    res.status(200).json({ message: "OTP generated and logged" });
  });
  
  // Endpoint to reset password
  app.post('/reset-password', passwordResetLimiter, (req, res) => {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword) {
      return res.status(400).json({ message: "Email, OTP, and new password are required" });
    }
    if (otpStore[email] === otp) {
      console.log(`Password for ${email} has been reset to: ${newPassword}`);
      delete otpStore[email]; // Clear the OTP after use
      res.status(200).json({ message: "Password has been reset successfully" });
    } else {
      res.status(401).json({ message: "Invalid OTP" });
    }
  });

app.listen(3000, () => console.log('Server is running on port 3000'))