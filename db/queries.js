import { userModel } from "@/app/models/user-model";
import { replaceMongoIdInObject } from "@/utils/data-utils";


import { dbConnect } from "@/app/service/mongo";
async function getAllProductionData() {
  await dbConnect();
  const data = await productionModel.find({}).sort({ date: -1 }).lean();
  return replaceMongoIdInArray(data);
}


async function findUserByCredentials(credentials) {
  await dbConnect();
  const user = await userModel.findOne(credentials).lean();
  if (user) {
    return replaceMongoIdInObject(user);
  }
  return null;
}





export { findUserByCredentials
};