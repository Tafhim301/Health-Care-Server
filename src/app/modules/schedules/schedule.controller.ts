import { NextFunction, Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import { scheduleService } from "./schedule.service";
import sendResponse from "../../shared/sendResponse";
import pick from "../../helper/pick";

const createSchedule = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await scheduleService.createSchedule(req.body);

    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Schedule created successfully",
      data: result,
    });
  }
);

const deleteSchedule = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    await scheduleService.deleteSchedule(req.params.id);

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Schedule deleted successfully",
      data: null,
    });
  }
);

const getSchedulesForDoctor = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const options = pick(req.query, [
      "page",
      "limit",
      "sortBy",
      "sortOrder",
      "status",
    ]);
    const filters = pick(req.query, ["starDateTime", "endDateTime"]);

    const result = await scheduleService.getSchedulesForDoctor(
      req.user,
      filters,
      options
    );

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Schedule retrieved successfully",
      meta : result.metaData,
      data: result.data,
    });
  }
);

export const scheduleController = {
  createSchedule,
  getSchedulesForDoctor,
  deleteSchedule
};
