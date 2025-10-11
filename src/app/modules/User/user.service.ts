import { assert } from "console";
import config from "../../../config";
import { prisma } from "../../shared/prisma";
import bcrypt from "bcryptjs";
import { Request } from "express";
import { fileUploader } from "../../helper/fileUploader";

const createPatient = async (req: Request) => {
  if (req.file) {
    const uploadedResult = await fileUploader.uploadToCloudiary(req.file);
    console.log(req);
    req.body.patient.profilePhoto = uploadedResult?.secure_url;
  }

  const hashedPassword = await bcrypt.hash(
    req.body.password,
    config.bcrypt_salt_round
  );

  const result = await prisma.$transaction(async (tnx) => {
    await tnx.user.create({
      data: {
        email: req.body.patient.email,
        password: hashedPassword,
      },
    });

    return await tnx.patients.create({
      data: req.body.patient,
    });
  });
  return result;
};

export const UserService = {
  createPatient,
};
