import { NextFunction, Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import pick from "../../helper/pick";
import sendResponse from "../../shared/sendResponse";
import { doctorFIlterableFields } from "./doctor.constant";
import { doctorService } from "./doctor.service";

const getAllDoctors = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const options = pick(req.query, [
      "page",
      "limit",
      "searchTerm",
      "sortBy",
      "sortOrder",
      "role",
      "status",
    ]);
    const filters = pick(req.query, doctorFIlterableFields);

    const result = await doctorService.getAllDoctors(filters, options);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Doctors retrieved successfully",
      meta: result.meta,
      data: result.result,
    });
  }
);

const updateDoctor = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
   

    const result = await doctorService.updateDoctor(req.params.id,req.body);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Doctor Updated successfully",
      data: result,
    });
  }
);
const getAISuggestion = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
   

    const result = await doctorService.getAISuggestions(req.body);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Doctor suggestions retrieved successfully",
      data: result,
    });
  }
);


export const doctorController = {
  getAllDoctors,
  updateDoctor,
  getAISuggestion
}