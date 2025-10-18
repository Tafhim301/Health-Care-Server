import { Doctor, Prisma } from "@prisma/client";
import { IOptions, paginationHelper } from "../../helper/paginationHelper";
import { doctorSearchableFields } from "./doctor.constant";
import { prisma } from "../../shared/prisma";
import { IDoctorInput } from "./doctor.interface";

const getAllDoctors = async (filter: any, options: IOptions) => {

    const { page, limit, skip, sortBy, sortOrder } = paginationHelper.calculatePagination(options);

    const { searchTerm, ...filterData } = filter;

    const andConditions: Prisma.DoctorWhereInput[] = []


    if (searchTerm) {
        andConditions.push({
            OR: doctorSearchableFields.map((field) => ({
                [field]: {
                    contains: searchTerm,
                    mode: "insensitive"
                }
            }))
        })
    }


    if (Object.keys(filterData).length > 0) {
        const filterConditions = Object.keys(filterData).map((key) => ({
            [key]: {
                equals: (filterData)[key]
            }
        }))

        andConditions.push(...filterConditions)
    }


    const whereConditions: Prisma.DoctorWhereInput = andConditions.length > 0 ? { AND: andConditions } : { AND: [] }

    const result = await prisma.doctor.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy: {
            [sortBy]: sortOrder
        }
    })
    const total = await prisma.doctor.count({
        where: whereConditions

    })

    return {
        meta: {
            total,
            page,
            limit

        },

        result


    }
}


const updateDoctor = async (id: string, payload: Partial<IDoctorInput>) => {

    const doctorInfo = await prisma.doctor.findUniqueOrThrow({
        where: {
            id
        }
    });

    const { specialities, ...doctorData } = payload;

    await prisma.$transaction(async(tnx) => {
            if (specialities && specialities.length > 0) {
        const deleteSpecialityIDSs = specialities.filter(speciality => speciality.isDeleted);
        const createSpecialityIds = specialities.filter((speciality) => !speciality.isDeleted)

        for (const speciality of deleteSpecialityIDSs) {
            await tnx.doctorSpecialties.deleteMany({
                where: {
                    doctorId: id,
                    specialitiesId: speciality.specialityId
                }
            })

        }

        for (const speciality of createSpecialityIds) {
            await tnx.doctorSpecialties.create({
                data: {
                    doctorId: id,
                    specialitiesId: speciality.specialityId
                },
            })

        }

    }



    const updatedData = await tnx.doctor.update({
        where: {
            id: doctorInfo.id
        },
        data: doctorData,
        include: {
            DoctorSpecialties: {
                include: {
                    specialities: true
                }
            }
        }
    })

    return updatedData

    })


}





export const doctorService = {
    getAllDoctors,
    updateDoctor
}