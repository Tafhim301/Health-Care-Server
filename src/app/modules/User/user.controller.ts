import { NextFunction, Request, request, Response } from "express";

import { UserService } from "./user.service";
import sendResponse from "../../shared/sendResponse";
import catchAsync from "../../shared/catchAsync";

const createPatient = catchAsync(async (req : Request, res : Response,  next: NextFunction) => {
    const result = await UserService.createPatient(req);

    sendResponse(res,{
        statusCode : 201,
        success : true,
        message : "Patient created successfully",
        data : result
    })

}) 


export const userController = {
    createPatient
}
