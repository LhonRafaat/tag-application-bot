import { ISetting, Setting } from "../schemas/settings";

export const getRequiredPoints = async () => {
  const setting = await Setting.find();
  if (setting.length === 0) return null;
  return setting[0].requiredPoints;
};

export const setRequiredPoints = async (requiredPoints: number) => {
  const settings = await Setting.find();
  if (settings.length === 0) {
    return await Setting.create({
      requiredPoints,
    });
  } else {
    const setting = await Setting.findById(settings[0]._id);

    if (setting) setting.requiredPoints = requiredPoints;

    await setting?.save();
    return setting;
  }
};

export const getSettings = async () => {
  const setting = await Setting.find();

  return setting;
};

export const setSettings = async (settingsData: ISetting) => {
  const settings = await Setting.create(settingsData);
  return settings;
};

export const editSettings = async (settingsData: ISetting) => {
  const allSettings = await Setting.find();

  if (allSettings.length === 0) throw new Error("No settings found");
  const settings = await Setting.findByIdAndUpdate(
    allSettings[0]._id,
    settingsData,
    {
      new: true,
      runValidators: true,
    }
  );

  return settings;
};
