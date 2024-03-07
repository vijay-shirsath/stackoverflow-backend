import User from "../models/auth.js";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer"

export const sendOtp = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ error: "user not found in database" });

    const generateOtp = Math.floor(Math.random() * 10000); // 4-digit OTP

    // Create nodemailer transporter
    const transporter = nodemailer.createTransport({
      host: "sandbox.smtp.mailtrap.io",
      port: 2525,
      auth: {
        user: process.env.NODEMAILERUSER,
        pass: process.env.NODEMAILERPASS,
      },
    });

    // Send OTP via email
    const info = await transporter.sendMail({
      from: "vijay.shirsath37@yahoo.com",
      to: email,
      subject: "Reset Password OTP",
      html: `<b>OTP is <i>${generateOtp}</i></b>`,
    });

    if (info.messageId) {
      user.otp = generateOtp;
      await user.save();
    }

    res.status(200).json({ message: "OTP sent successfully" });
  } catch (error) {
    // Handle errors
    console.error("Error in sending OTP:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const verifyOtp = async(req,res) => {
  const {email,otp} = req.body;
  console.log(email,otp)
  try {
    const user = await User.findOne({email});
    if(!user || user.otp !== otp) return res.status(400).json({error : "Invalid OTP"});

    return res.status(200).json({message : "OTP Varified Succefully"});
  } catch (error) {
    console.log(error);
    return res.status(500).json({error : error});
  }
};

export const resetPassword = async(req,res) => {
  const {email,newPassword} = req.body;

  try {
    if(!newPassword) return res.status(400).json({error : "New Password Is required"});

    if(newPassword.length < 6) return res.status(400).json({error : "Password Should be more that 6 character"});

    const user = await User.findOne({email});
    if(!user) return res.status(400).json({error : "user is not found please retry"});

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword,salt);
    user.password = hashedPassword;
    user.otp = "",
    await user.save();

    return res.status(200).json({message : "Password Reset Successfully"});
  } catch (error) {
    console.log(error);
    return res.status(400).json({error : error});
  }
};