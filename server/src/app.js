import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser'
import authRouter from '../src/routes/authRoutes.js'
import userRouter from './routes/userRoutes.js';

const app = express();


// Middlewares 
app.use(cors({ origin: "http://localhost:5173",credentials:true}));
app.use(express.json());// to send json responses
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());


// register routes here 
app.get('/', (req, res)=>{res.send('Welcome Home....')})

app.use('/api/auth', authRouter);
app.use('/api/user', userRouter)


// Global errorHandler at last 
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        success : false,
        message : err.message || "server error.", 
        errors : err.errors || []
    })
})

export {app}