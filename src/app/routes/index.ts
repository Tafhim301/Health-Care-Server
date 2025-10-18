import express from 'express';
import { userRoutes } from '../modules/User/user.routes';
import { authRoutes } from '../modules/auth/auth.routes';
import { scheduleRoutes } from '../modules/schedules/schedule.routes';
import { doctorSchedulesRoutes } from '../modules/doctorSchedules/doctorSchedules.routes';
import { SpecialtiesRoutes } from '../modules/specialities/specialities.routes';
import { doctorRoutes } from '../modules/doctor/doctor.routes';


const router = express.Router();

const moduleRoutes = [

    {
        path: '/user',
        route: userRoutes
    },
    {
        path: '/auth',
        route: authRoutes
    },
    {
        path: '/schedules',
        route: scheduleRoutes
    },
    {
        path: '/doctorSchedules',
        route: doctorSchedulesRoutes
    },
    {
        path: '/specialities',
        route: SpecialtiesRoutes
    },
    {
        path: '/doctor',
        route: doctorRoutes
    },
];

moduleRoutes.forEach(route => router.use(route.path, route.route))

export default router;