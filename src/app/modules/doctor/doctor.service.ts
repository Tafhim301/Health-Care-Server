import { Doctor, Prisma } from "@prisma/client";
import { IOptions, paginationHelper } from "../../helper/paginationHelper";
import { doctorSearchableFields } from "./doctor.constant";
import { prisma } from "../../shared/prisma";
import { IDoctorInput } from "./doctor.interface";
import ApiError from "../../Errors/ApiError";
import httpStatus from "http-status";
import { openai } from "../../helper/open-router";

const getAllDoctors = async (filter: any, options: IOptions) => {

    const { page, limit, skip, sortBy, sortOrder } = paginationHelper.calculatePagination(options);

    const { searchTerm, specialities, ...filterData } = filter;

    const andConditions: Prisma.DoctorWhereInput[] = []

    if (specialities && specialities.length > 0) {
        andConditions.push({
            DoctorSpecialties: {
                some: {
                    specialities: {
                        title: {
                            contains: specialities,
                            mode: "insensitive"
                        }
                    }
                }
            }

        })
    }


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
        },
        include: {
            DoctorSpecialties: {
                include: {
                    specialities: true
                }
            }
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

    await prisma.$transaction(async (tnx) => {
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

const getAISuggestion = async (payload: { symptom: string }) => {

    if (!payload.symptom) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Symptom is required")
    }

    const doctors = await prisma.doctor.findMany({
        where: {
            isDeleted: false
        },
        include: {
            DoctorSpecialties: {
                include: {
                    specialities: true
                }
            }
        }
    });

    const prompt = `
You are a medical assistant AI. A patient reported the symptom: "${payload.symptom}".
Here is the list of available doctors and their specialties:

${doctors?.map((doc: any) => {
        const specialties = doc.DoctorSpecialties.map((ds: any) => ds.specialities.name).join(", ");
        return `- Dr. ${doc.name} (Specialties: ${specialties})`;
    }).join("\n")}

Based on the symptom, suggest the **top 3 most relevant doctors** and explain briefly why they are suitable. 
Return result in valid JSON like with full individual doctor data
`;


    const completion = await openai.chat.completions.create({
        model: 'z-ai/glm-4.5-air:free',
        messages: [
            {
                role: 'system',
                content: 'You are a helpful medical assistant AI. Which provides doctor suggestions',
            },
            {
                role: 'user',
                content: prompt,
            },
        ],
    });
    console.log(completion.choices[0].message);



    return doctors



}





export const doctorService = {
    getAllDoctors,
    updateDoctor,
    getAISuggestion
}