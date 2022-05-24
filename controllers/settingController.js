import {
  getSettings as settingService,
  setSettings,
} from "../services/settingService.js";

export const getSetting = async (req, res) => {
  const setting = await settingService();

  res.status(200).json(setting);
};

export const postSettings = async (req, res) => {
  try {
    const settings = await setSettings(req.body);
    res.status(200).json(settings);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};
