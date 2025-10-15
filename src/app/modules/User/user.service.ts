import { assert } from "console";
import config from "../../../config";
import { prisma } from "../../shared/prisma";
import bcrypt from "bcryptjs";
import { Request } from "express";
import { fileUploader } from "../../helper/fileUploader";
import { IOptions, paginationHelper } from "../../helper/paginationHelper";
import { Prisma } from "@prisma/client";
import { userSearchableFields } from "./user.constant";

const createPatient = async (req: Request) => {
  if (req.file) {
    const uploadedResult = await fileUploader.uploadToCloudiary(req.file);

    req.body.user.profilePhoto = uploadedResult?.secure_url;
  }

  const hashedPassword = await bcrypt.hash(
    req.body.password,
    config.bcrypt_salt_round
  );

  const result = await prisma.$transaction(async (tnx) => {
    await tnx.user.create({
      data: {
        email: req.body.user.email,
        password: hashedPassword,
      },
    });

    return await tnx.patients.create({
      data: req.body.user,
    });
  });
  return result;
};
const createAdmin = async (req: Request) => {
  console.log(req.body)
  if (req.file) {
    const uploadedResult = await fileUploader.uploadToCloudiary(req.file);

    req.body.user.profilePhoto = uploadedResult?.secure_url;
  }

  const hashedPassword = await bcrypt.hash(
    req.body.password,
    config.bcrypt_salt_round
  );

  const result = await prisma.$transaction(async (tnx) => {
    await tnx.user.create({
      data: {
        email: req.body.user.email,
        password: hashedPassword,
        role : "ADMIN"
      },
    });

    return await tnx.admin.create({
      data: req.body.user,
    });
  });
  return result;
};
const createDoctor = async (req: Request) => {
  if (req.file) {
    const uploadedResult = await fileUploader.uploadToCloudiary(req.file);
    console.log(req);
    req.body.user.profilePhoto = uploadedResult?.secure_url;
  }

  const hashedPassword = await bcrypt.hash(
    req.body.password,
    config.bcrypt_salt_round
  );

  const result = await prisma.$transaction(async (tnx) => {
    await tnx.user.create({
      data: {
        email: req.body.user.email,
        password: hashedPassword,
        role : "DOCTOR"
      },
    });

    return await tnx.doctor.create({
     data: req.body.user,
    });
  });
  return result;
};

const getAllUsers = async (params: any, options: IOptions) => {
  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(options);

  const { searchTerm, ...filterData } = params;

  const andConditions: Prisma.UserWhereInput[] = [];

  if (searchTerm) {
    andConditions.push({
      OR: userSearchableFields.map((field) => ({
        [field]: {
          contains: searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: {
          equals: filterData as any,
        },
      })),
    });
  }

  const orderByClause = { [sortBy]: sortOrder };

  const whereConditions : Prisma.UserWhereInput = andConditions.length > 0 ? {
    AND : andConditions
  } : {}

  const result = await prisma.user.findMany({
    skip,
    take: limit,
    where: whereConditions,
    orderBy: orderByClause,
  });
  

  const total = await prisma.user.count({
    where: whereConditions
  })

  const metaData = {
    total,
    page,
    limit
  }

  return {metaData,data : result};
};

export const UserService = {
  createPatient,
  createDoctor,
  createAdmin,
  getAllUsers,
};
