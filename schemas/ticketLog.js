import mongoose from "mongoose";

const { Schema, model } = mongoose;
const ticketsSchema = new Schema(
  {
    ticketId: { type: String, required: true },
    openedBy: { type: String, required: true },
    closedBy: { type: String },
    status: { type: String, default: "OPEN", enum: ["OPEN", "CLOSED"] },
    closedAt: { type: Date },
    closedReason: { type: String },
    messages: [
      {
        message: { type: String },
        sender: { type: String },
        sentAt: { type: Date },
        attachments: [{ type: String }],
      },
    ],
  },
  { timestamps: true }
);

export const TicketsLog = model("TicketsLog", ticketsSchema);
