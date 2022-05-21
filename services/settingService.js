import { Setting } from "../schemas/settings.js";

export const getRequiredPoints = async () => {
  const setting = await Setting.find();
  if (setting.length === 0) return null;
  return setting[0].requiredPoints;
};

export const setRequiredPoints = async (requiredPoints) => {
  const settings = await Setting.find();
  if (settings.length === 0) {
    return await Setting.create({
      requiredPoints,
    });
  } else {
    const setting = await Setting.findById(settings[0]._id);

    setting.requiredPoints = requiredPoints;

    await setting.save();
    return setting;
  }
};

export const getSettings = async () => {
  const setting = await Setting.find();

  return setting;
};