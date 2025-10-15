import { addMinutes, format } from "date-fns";
import { prisma } from "../../shared/prisma";
import { IOptions, paginationHelper } from "../../helper/paginationHelper";
import { Prisma } from "@prisma/client";
import { JwtPayload } from "jsonwebtoken";

const createSchedule = async (payload: any) => {
  const { startTime, endTime, startDate, endDate } = payload;

  const intervalTime = 30; // minutes
  const schedules = [];

  const currentDate = new Date(startDate);
  const lastDate = new Date(endDate);

  while (currentDate <= lastDate) {
    const [startHour, startMinute] = startTime.split(":").map(Number);
    const [endHour, endMinute] = endTime.split(":").map(Number);

    const dayStart = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate(),
      startHour,
      startMinute
    );

    const dayEnd = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      currentDate.getDate(),
      endHour,
      endMinute
    );

    let slotStartTime = dayStart;

    while (slotStartTime < dayEnd) {
      const slotEndTime = addMinutes(slotStartTime, intervalTime);

      const scheduleData = {
        startTime: slotStartTime,
        endTime: slotEndTime,
      };

      const existingSchedule = await prisma.schedule.findFirst({
        where: {
          startTime: scheduleData.startTime,
          endTime: scheduleData.endTime,
        },
      });

      if (!existingSchedule) {
        const result = await prisma.schedule.create({ data: scheduleData });
        schedules.push(result);
      }

      slotStartTime = addMinutes(slotStartTime, intervalTime);
    }

    currentDate.setDate(currentDate.getDate() + 1);
  }

  return schedules;
};

const getSchedulesForDoctor = async (
  user: JwtPayload,
  filters: any,
  options: IOptions
) => {
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(options);

  const { starDateTime: filterStartDateTime, endDateTime: filterEndDateTime } =
    filters;

  const andConditions: Prisma.ScheduleWhereInput[] = [];

  if (filterStartDateTime && filterEndDateTime) {
    andConditions.push({
      AND: [
        {
          startTime: {
            gte: filterStartDateTime,
          },
        },
        {
          endTime: {
            lte: filterEndDateTime,
          },
        },
      ],
    });
  }

  const whereConditions: Prisma.ScheduleWhereInput =
    andConditions.length > 0
      ? {
          AND: andConditions,
        }
      : {};

  const doctorSchedules = await prisma.doctorSchedules.findMany({
    where: {
      doctor: {
        email: user.email,
      },
    },

    select: {
      scheduleId: true,
    },
  });

  const doctorScheduleIds = doctorSchedules.map(
    (schedule) => schedule.scheduleId
  );

  const result = await prisma.schedule.findMany({
    where: {
      ...whereConditions,
      id: {
        notIn: doctorScheduleIds,
      },
    },
    skip,
    take: limit,
    orderBy: {
      [sortBy]: sortOrder,
    },
  });

  const total = await prisma.schedule.count({
    where: {
      ...whereConditions,
      id: {
        notIn: doctorScheduleIds,
      },
    },
  });

  return {
    metaData: {
      page,
      limit,
      total,
    },
    data: result,
  };
};

const deleteSchedule = async (id: string) => {
  return await prisma.schedule.delete({
    where: {
      id: id,
    },
  });
};

export const scheduleService = {
  createSchedule,
  getSchedulesForDoctor,
  deleteSchedule,
};
