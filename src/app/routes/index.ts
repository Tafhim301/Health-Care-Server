import express from 'express';
import { userRoutes } from '../modules/User/user.routes';
import { authRoutes } from '../modules/auth/auth.routes';
import { scheduleRoutes } from '../modules/schedules/schedule.routes';
import { doctorSchedulesRoutes } from '../modules/doctorSchedules/doctorSchedules.routes';


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
];

moduleRoutes.forEach(route => router.use(route.path, route.route))

export default router;