import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import User from "../models/userModel.js";
import { ENV } from "../config/env.js";
import transporter from "../config/nodeMailer.js";




export const register = asyncHandler(async (req, res)=>{
    const {name, email, password} = req.body;
    if(!name || !email || !password){
        throw new ApiError(400, "All fields are required.")
    }
    const existingUser = await User.findOne({email});
    if(existingUser){
        throw new ApiError(400, "User Already exists.");
    }
    const hashedPass = await bcrypt.hash(password, 12);
    const user = await User.create({name, email, password:hashedPass});


    const token = jwt.sign({id : user._id, email : user.email}, 
                            ENV.SECRET_KEY, 
                            {expiresIn : '7d'});
    res.cookie('token', token, {
        httpOnly : true,
        secure : ENV.NODE_ENV === 'production',
        sameSite : ENV.NODE_ENV === 'production' ? 'none' : 'lax',
        maxAge : 7 * 24 * 60 * 60 * 1000, // itne miliseconds me ye cookie expire ho jayega
    });

    // sending welcome email for the user 
    const mailOptions = {
        from : ENV.SENDER_EMAIL,
        to : email,
        subject : "Welcome to Samajik Club 🎉",
        text : `Hello,
                Welcome to Samajik!
                Your account has been successfully created with ${email}. You can now log in and start 
                using all features.
                Best regards,  
                Samajik 🙌`,

    }
    await transporter.sendMail(mailOptions);
    const createdUser = await User.findById(user._id).select("-password");
    return res.status(201).json(new ApiResponse(201, createdUser, "User added successfully."));
})

export const login = asyncHandler(async (req, res) => {
    const {email, password} = req.body;
    if(!email || !password){
        throw new ApiError(400, "All Fields are required");
    }
    const user = await User.findOne({email});
    if(!user){
        throw new ApiError(401, "Invalid email or password");
    }

    const isMatched = await bcrypt.compare(password, user.password);
    if(!isMatched){
        throw new ApiError(401, "Inavalid email or password");
    }

    const token = jwt.sign({id : user._id, email : user.email}, 
        ENV.SECRET_KEY,
        {expiresIn : '7d'})

    res.cookie('token', token, {
        httpOnly : true,
        secure : ENV.NODE_ENV === 'production',
        sameSite : ENV.NODE_ENV === 'production' ? 'none' : 'lax',
        maxAge : 7 * 24 * 60 * 60 * 1000
    })

    user.password = undefined;
    return res.status(201).json(new ApiResponse(201, user, "User logged in successfully."));
})

export const logout = asyncHandler ( async (req, res) => {
    res.clearCookie('token', {
        httpOnly : true, 
        secure : ENV.NODE_ENV === 'production',
        sameSite : ENV.NODE_ENV === 'production' ? 'none' : 'lax'
    })
    return res.status(200).json(new ApiResponse(200, {}, "Logged out successfully"));

    // or we can use "return res.status(204).end()" since we could not send any body with status 204
})


// send verification otp to the user email
export const sendVerifyOtp = asyncHandler(async (req, res) =>{
    const userId = req.user.id;
    const user = await User.findById(userId);
    if (!user) {
        throw new ApiError(404, "User not found");
    }
    if(user.verified){
       throw new ApiError(400, "user already verified");
    }
    const otp = String(Math.floor(100000 + Math.random() * 900000));
    user.verifyOtp = otp;
    user.verifyOtpExpireAt = Date.now() + 10 * 60 * 1000;
    await user.save();
    const mailOptions = {
        from : ENV.SENDER_EMAIL,
        to : user.email,
        subject : "Verify your account",
        text :  `Your verification OTP is ${otp}. It will expire in 10 minutes.`,
    }
    await transporter.sendMail(mailOptions);
    return res.status(200).json(new ApiResponse(200, {}, "Verification OTP Send to the email"))
})

export const verifyEmail = asyncHandler(async (req, res) => {
    const {otp} = req.body;
    const userId = req.user.id;
    if(!userId || !otp){
        throw new ApiError(400, "Missing required fields")
    }
    const user = await User.findById(userId);
    if (!user) {
        throw new ApiError(404, "User not found");
    }
    if(user.verifyOtp === '' || user.verifyOtp !== otp){
        throw new ApiError(401, "Invalid OTP.");
    }
    if(user.verifyOtpExpireAt < Date.now()){
        throw new ApiError(401, "OTP expired.");
    }
    user.verified = true;
    user.verifyOtp = '';
    user.verifyOtpExpireAt = 0;
    await user.save();

    return res.status(200).json(new ApiResponse(200, {}, "user Verified successfully"))
})

// check if user is authenticated or not
export const isAuthenticated = asyncHandler(async (req, res)=>{
    const user = await User.findById(req.user.id).select("-password");
    return res.status(200).json(new ApiResponse(200, user, "authenticated"));
})

// send password reset otp
export const sendPassResetOtp = asyncHandler(async (req, res) =>{
    const {email} = req.body;
    if(!email){
        throw new ApiError(400, "Email not found");
    }
    const user = await User.findOne({email});
    if(!user){
        throw new ApiError(404, "User not found with this email");
    }
    const otp = String(100000+Math.floor(Math.random()*900000));
    user.resetOtp = otp;
    user.resetOtpExpireAt = Date.now() + 10 * 60 * 1000;
    await user.save();
    const mailOptions = {
        from : ENV.SENDER_EMAIL,
        to : user.email,
        subject : "Password Reset OTP",
        text :  `Your password reset OTP is ${otp}. It will expire in 10 minutes.`, 
    }
    await transporter.sendMail(mailOptions);
    return res.status(200).json(new ApiResponse(200, {}, "If this email exists, OTP has been sent"))
})

// reset user password
export const resetPass = asyncHandler(async (req, res) =>{
    const {email, otp, newPass} = req.body;
    if(!email || !otp || !newPass){
        throw new ApiError(400, "Required fields can't be empty");
    }
    const user = await User.findOne({email});
    if(!user){
        throw new ApiError(400, "Invalid email or OTP");
    }
    if (newPass.length < 6) {
        throw new ApiError(400, "Password too short");
    }
    if(user.resetOtp === '' || user.resetOtp !== otp){
        throw new ApiError(401, "Invalid OTP")
    }
    if(user.resetOtpExpireAt < Date.now()){
        throw new ApiError(401, "OTP expired.")
    }
    const hashedPass = await bcrypt.hash(newPass, 10);
    user.password = hashedPass;
    user.resetOtp = "";
    user.resetOtpExpireAt = 0;
    await user.save();
    return res.status(200).json(new ApiResponse(200, {}, "Password changed successfully"));
})