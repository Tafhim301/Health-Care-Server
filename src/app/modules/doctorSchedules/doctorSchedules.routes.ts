import { Router } from "express";
import { doctorScheduleController } from "./doctorSchedules.controller";
import { UserRole } from "@prisma/client";
import { auth } from "../../middlewares/auth";


const router = Router();

router.post('/',auth(UserRole.DOCTOR),doctorScheduleController.createDoctorSchedule)

export const doctorSchedulesRoutes = router;