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
  strikes.map((el, index) => {
    return (result +=
      `\n${index + 1}-` +
      `\n Degree: ${el.degree} \n Reason: ${el.reason}` +
      `\n Status: ${el.status}` +
      `\n Date: ${el.createdAt}` +
      "\n -----------------");
  });

  return result;
};

export const getAllStrikes = async () => {
  const strikes = await Strike.find();
  return strikes;
};
