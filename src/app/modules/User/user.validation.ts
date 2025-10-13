import { z } from "zod";

const createPatientValidationSchema = z.object({
  password: z.string({
    error: "Password is required",
  }),
  user: z.object({
    name: z.string().nonempty("Name is required"),
    email: z.string().nonempty("Email is required"),
    address: z.string().optional(),
    contactNumber : z.string().optional()
  }),
});

export const userValidation = {
  createPatientValidationSchema,
};
