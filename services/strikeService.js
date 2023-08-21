import { Members } from "../schemas/member.js";
import { Strike } from "../schemas/strike.js";

export const strikeUser = async (payload) => {
  const user = await Members.findById(payload?.member);
  if (!user) return new Error("Member not found");
  return await Strike.create(payload);
};

export const resolveStrike = async (id) => {
  const strike = await Strike.findById(id);
  if (!strike) return new Error("Strike not found");
  return await Strike.findByIdAndUpdate(
    id,
    { status: "resolved" },
    { new: true, runValidators: true }
  );
};
