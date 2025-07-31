import rateLimit from "../config/upstash.js";

const rateLimiter = async(req, res, next) =>{
    try{
        //here we just kept it simple, irl you would like to use user_id or ip_address as your key
        const {success} = await rateLimit.limit("my-rate-limit");

        if(!success){
            return res.status(429).json({
                message: "too many requests, please try again later."
            });
        }
        next();

    }catch(error){
        console.log("Rate limit error", error);
        next(error);
    }
};
export default rateLimiter;
