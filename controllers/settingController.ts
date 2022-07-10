import {
  editSettings,
  getSettings as settingService,
  setSettings,
} from "../services/settingService";
import { Request, Response } from "express";

export const getSetting = async (req: Request, res: Response) => {
  const setting = await settingService();

  res.status(200).json(setting);
};

export const postSettings = async (req: Request, res: Response) => {
  try {
    const settings = await setSettings(req.body);
    res.status(200).json(settings);
  } catch (e: any) {
    res.status(400).json({ message: e.message });
  }
};

export const patchSettings = async (req: Request, res: Response) => {
  try {
    const settings = await editSettings(req.body);
    res.status(200).json(settings);
  } catch (e: any) {
    res.status(400).json({ message: e.message });
  }
};
