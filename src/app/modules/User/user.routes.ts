import { NextFunction, Request, Response, Router } from "express";
import { userController } from "./user.controller";
import { fileUploader } from "../../helper/fileUploader";
import { userValidation } from "./user.validation";
import { auth } from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = Router();

router.get('/',auth(UserRole.ADMIN),userController.getAllUsers)

router.post(
  "/create-patient",
  fileUploader.upload.single("file"),
  
  (req: Request, res: Response, next: NextFunction) => {
    req.body = userValidation.createPatientValidationSchema.parse(
      JSON.parse(req.body.data)
    );
    next();
  },
  userController.createPatient
);
router.post(
  "/create-admin",
  auth(UserRole.ADMIN),
  fileUploader.upload.single("file"),
  
   

  userController.createAdmin
);
router.post(
  "/create-doctor",
  auth(UserRole.ADMIN),
  fileUploader.upload.single("file"),
  userController.createDoctor
);

export const userRoutes = router;
