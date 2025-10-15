import { NextFunction, Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { doctorScheduleService } from "./doctorSchedules.service";

const createDoctorSchedule = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await doctorScheduleService.createDoctorSchedule(req.user,req.body);

    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Doctor schedule created successfully",
      data: result,
    });
  }
);

export const doctorScheduleController = {
    createDoctorSchedule
}