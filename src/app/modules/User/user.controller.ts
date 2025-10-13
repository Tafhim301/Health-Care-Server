import { NextFunction, Request, request, Response } from "express";

import { UserService } from "./user.service";
import sendResponse from "../../shared/sendResponse";
import catchAsync from "../../shared/catchAsync";
import pick from "../../helper/pick";

const createPatient = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await UserService.createPatient(req);

    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Patient created successfully",
      data: result,
    });
  }
);
const createAdmin = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const result = await UserService.createAdmin(req);

    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Admin created successfully",
      data: result,
    });
  }
);
const createDoctor = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
      console.log(req.body)
    const result = await UserService.createDoctor(req);

    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Doctors created successfully",
      data: result,
    });
  }
);
const getAllUsers = catchAsync(
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
    const filters = pick(req.query, ["status", "role", "email"]);

    const result = await UserService.getAllUsers(filters, options);

    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Users retrieved successfully",
      meta: result.metaData,
      data: result.data,
    });
  }
);

export const userController = {
  createPatient,
  createAdmin,
  createDoctor,
  getAllUsers,
};
