import { prisma } from "../../shared/prisma";

const createDoctorSchedule = async (user: any, payload: {
  scheduleIds : string[]
}) => {

  const doctorData = await prisma.doctor.findUniqueOrThrow({
    where : {
      email : user.email
    }

  })

  const doctorScheduleData = payload.scheduleIds.map(scheduleId => ({
    doctorId : doctorData.id,
    scheduleId
  }))

  await prisma.doctorSchedules.createMany({
    data : doctorScheduleData
  })
};

export const doctorScheduleService = {
  createDoctorSchedule,
};
