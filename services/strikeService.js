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

export const getStrikes = async (member) => {
  const user = await Members.findById(member);
  if (!user) throw new Error("User not found");
  const strikes = await Strike.find({ member });

  let result = `${user.fullName} \n`;
  strikes.map((el) => {
    return (result +=
      `\n degree: ${el.degree} \n reason: ${el.reason}` +
      "\n -----------------");
  });

  return result;
};
