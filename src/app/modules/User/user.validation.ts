import { z } from "zod";

const createPatientValidationSchema = z.object({
  password: z.string({
    error: "Password is required",
  }),
  patient: z.object({
    name: z.string().nonempty("Name is required"),
    email: z.string().nonempty("Email is required"),
    address: z.string().optional(),
  }),
});

export const userValidation = {
  createPatientValidationSchema,
};
