import 'dotenv/config';
import connectDB from "./config/db.js";
import { app } from "./app.js";
import { ENV } from "./config/env.js";

connectDB()
    .then(()=>{
        app.listen(ENV.PORT, ()=>{
            console.log(`Server running on Port ${ENV.PORT}`);
        })
    })
    .catch((err)=>{
        console.error(`Server setup failed ${err}`);
        process.exit(1);
    })