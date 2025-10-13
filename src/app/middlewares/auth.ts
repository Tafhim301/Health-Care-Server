import { NextFunction, Request, Response } from "express"
import { jwtHelper } from "../helper/jwtHelper";
import config from "../../config";

export const auth = (...roles : string[]) => {
    return async(req : Request, res: Response, next : NextFunction) => {
        console.log(req.cookies)
        try {
            const token = req.cookies.accessToken;
     
            if(!token){
                throw new Error("You are not authorized!")
            }
            const verifyUser = jwtHelper.verifyToken(token,'abcd')

            req.user = verifyUser;


            if(roles.length && !roles.includes(verifyUser.role)){
                throw new Error("You are not authorized!")
            }

            next();
        } catch (error) {
            next(error)
            
        }
    }
}