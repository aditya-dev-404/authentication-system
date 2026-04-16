import { asyncHandler } from "../utils/asyncHandler.js";
import User from "../models/userModel.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";

export const getuser = asyncHandler(async(req, res)=>{
    const userId = req.user.id;
    const user = await User.findById(userId);
    if(!user){
        throw new ApiError(400, "user not found");
    }
    return res.status(200).json(new ApiResponse(200, {
        name : user.name,
        isVerified : user.verified,
    }, "user data found"));
})