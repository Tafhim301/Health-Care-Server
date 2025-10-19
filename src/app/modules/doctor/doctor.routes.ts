import { Router } from "express";
import { doctorController } from "./doctor.controller";

const router = Router();


router.get('/',doctorController.getAllDoctors)
router.post('/suggestion',doctorController.getAISuggestion)
router.patch('/:id',doctorController.updateDoctor)




export const doctorRoutes = router;
