import { Gender } from "@prisma/client";



export type IDoctorInput = {
    email: string;
    contactNumber: string;
    gender: Gender;
    name: string;
    address: string | null;
    registrationNumber: string;
    experience: number;
    appointmentFee: number;
    qualification: string;
    currentWorkingPlace: string;
    designation: string;
    specialities: [{

        specialityId: string,
        isDeleted?: boolean

    }
]



}