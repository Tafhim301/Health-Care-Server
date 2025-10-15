import { NextFunction, Request, request, Response } from "express";
import sendResponse from "../../shared/sendResponse";
import catchAsync from "../../shared/catchAsync";
import { authService } from "./auth.service";

const login = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
      console.log(req.body)
    const result = await authService.login(req.body);


    const { accessToken, refreshToken, needPasswordChange,user } = result;

    res.cookie("accessToken", accessToken, {
      secure: true,
      httpOnly: true,
      sameSite: "none",
      maxAge: 1000 * 60 * 60,
    });
    res.cookie("refreshToken", refreshToken, {
      secure: true,
      httpOnly: true,
      sameSite: "none",
      maxAge: 1000 * 60 * 60 * 24 * 90,
    });

    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Logged in successfully",
      data: {
        needPasswordChange,
        user
      },
    });
  }
);

export const authController = {
  login,
};
