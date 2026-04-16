import jwt from 'jsonwebtoken'
import { asyncHandler } from '../utils/asyncHandler.js'
import { ApiError } from '../utils/apiError.js';
import { ENV } from '../config/env.js';

const userAuth = asyncHandler(async (req, res, next) => {
    const token = req.cookies.token;
    if(!token){
        throw new ApiError(401, "Unauthorized! Login to continue")
    }
    const decodedToken = jwt.verify(token, ENV.SECRET_KEY);
    if(!decodedToken.id){
        throw new ApiError(401, 'Invalid Token');
    }
    req.user = decodedToken;
    next();
})

export default userAuth;