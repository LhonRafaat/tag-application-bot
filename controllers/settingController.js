import { getSettings as settingService } from "../services/settingService.js";

export const getSetting = async (req, res) => {
  const setting = await settingService();

  res.status(200).json(setting);
};
