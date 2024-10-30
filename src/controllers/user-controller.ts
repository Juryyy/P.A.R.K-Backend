import { Response } from "express";
import userService from "../services/user-service";
import { MURequest, URequest } from "../types/URequest";
import sharp from "sharp";
import logger from "../configs/logger";
import util from "util";
import { userActivationSchema, userInfoSchema } from "../helpers/Schemas/user-schema";
import path from "path";
import fs from "fs/promises";

const unlink = util.promisify(fs.unlink); // Promisify the unlink function

export default {
  updateAvatar: async (req: MURequest, res: Response) => {
    const userId = req.user?.id;
    const avatar = req.file;

    if (!userId) {
        return res.status(401).json({ error: "Unauthorized: Please login" });
    }

    if (!avatar) {
        return res.status(400).json({ error: "Bad Request: No file uploaded" });
    }

    try {
        const user = await userService.getUserById(userId);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Delete old avatar if it exists
        if (user.avatarUrl !== "testMan.jpg" && user.avatarUrl) {
            const oldAvatarPath = path.join('static/images', user.avatarUrl);
            await fs.unlink(oldAvatarPath).catch(err => logger.warn(`Failed to delete old avatar: ${err.message}`));
        }

        // Update user's avatar URL in the database
        await userService.updateAvatarUrl(userId, avatar.filename);

        res.status(200).json({ message: "Avatar updated successfully", avatarUrl: avatar.filename });
    } catch (error) {
        logger.error('Error in updateAvatar:', error);
        res.status(500).json({ error: "Internal server error: Failed to update avatar" });
    }
  },

  getAllUsers: async (req: URequest, res: Response) => {
    const users = await userService.getAllUsers();
    return res.status(200).json(users);
  },

  getProfile: async (req: URequest, res: Response) => {
    const profileId = Number(req.params.id);

    if (!profileId) {
      return res.status(400).json({ error: "Invalid data" });
    }

    const user = await userService.getProfileById(profileId);
    if (!user) {
      return res.status(404).json({ error: "User does not exists" });
    }
    return res.status(200).json(user);
  },

  getUserInfo: async (req: URequest, res: Response) => {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: "Please login" });
    }

    const user = await userService.getUserById(userId);
    if (!user) {
      return res.status(404).json({ error: "User does not exists" });
    }

    const { password: pass, ...userWithoutPassword } = user;
    return res.status(200).json(userWithoutPassword);
  },

  updateUser: async (req: URequest, res: Response) => {
    const userId = req.user?.id;

    const {
      id,
      email,
      phone,
      note,
      firstName,
      lastName,
      noteLonger,
      drivingLicense,
      dateOfBirth,
      totaraDate,
      totaraDone,
      insperaAccount
    } = req.body;

    if (!userId) {
      return res.status(401).json({ error: "Please login" });
    }

    let parsedDateOfBirth = undefined;
    let parsedTotaraDate = undefined

    if(dateOfBirth){
      parsedDateOfBirth = new Date(dateOfBirth);
    }

    if(totaraDate){
      parsedTotaraDate = new Date(totaraDate);
    }

    if (!parsedDateOfBirth && dateOfBirth || !parsedTotaraDate && totaraDate) return res.status(400).json({ error: "Invalid date of birth" });   
    try {
      userInfoSchema.parse({
        id,
        email,
        firstName,
        lastName,
        phone,
        note,
        noteLonger,
        drivingLicense,
        parsedDateOfBirth,
        parsedTotaraDate,
        totaraDone,
        insperaAccount
      });
      if (id !== userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }
    } catch (error) {
        logger.error(error);
        return res.status(400).json({ error: "Invalid data" });
    }

    const userExists = await userService.getUserById(userId);

    if (!userExists) {
      return res.status(400).json({ error: "User does not exists" });
    }

    if (userExists.email !== email) {
      if (!email || !email.includes("@") || !email.includes(".")) {
        return res.status(400).json({ error: "Invalid email" });
      }

      const emailExists = await userService.getUserByEmail(email);
      if (emailExists) {
        return res.status(400).json({ error: "Email already exists" });
      }

    }

    const currentYear = new Date().getFullYear();
    if (totaraDone && (!totaraDate || !parsedTotaraDate || parsedTotaraDate.getFullYear() !== currentYear)) {
      return res.status(400).json({ error: "Invalid totara date" });
    }

    try {
      const user = await userService.updateUserProfile(
        id,
        email,
        firstName,
        lastName,
        note,
        noteLonger,
        drivingLicense,
        phone,
        totaraDone,
        insperaAccount,
        parsedDateOfBirth,
        parsedTotaraDate
      );

      try{
        userActivationSchema.parse({
          user
        });
        
        await userService.activateAccount(id);

      }catch(error){
        logger.error(error);
      }

      return res.status(200).json({ success: "User updated" });
    } catch (error) {
      logger.error(error);
      console.log(error);
      return res.status(400).json({ error: "Invalid data" });
    }
  },

  updateAdminNote: async (req: URequest, res: Response) => {
    const userId = req.user?.id;
    const { id, adminNote } = req.body;

    if (!userId) {
      return res.status(401).json({ error: "Please login" });
    }

    const userExists = await userService.getUserById(userId);

    if (!userExists) {
      return res.status(400).json({ error: "User does not exists" });
    }

    try {
      await userService.updateAdminNoteById(id, adminNote);
      return res.status(200).json({ success: "Admin note updated" });
    } catch (error) {
      logger.error(error);
      return res.status(400).json({ error: "Invalid data" });
    }
  },

  updateInsperaAccount: async (req: URequest, res: Response) => {
    const userId = req.user?.id;
    const { id, insperaAccount } = req.body;

    if (!userId) {
      return res.status(401).json({ error: "Please login" });
    }

    const userExists = await userService.getUserById(userId);

    if (!userExists) {
      return res.status(400).json({ error: "User does not exists" });
    }

    try {
      await userService.updateInsperaAccountById(id, insperaAccount);
      return res.status(200).json({ success: "Inspera account updated" });
    } catch (error) {
      logger.error(error);
      return res.status(400).json({ error: "Invalid data" });
    }
  }

};
