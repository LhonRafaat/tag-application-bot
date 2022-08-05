import mongoose from "mongoose";

const tournamentSchema = new mongoose.Schema(
  {
    members: [
      {
        member: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Member",
          required: true,
          unique: true,
        },
        points: {
          type: Number,
          default: 0,
        },
        kills: {
          type: Number,
          default: 0,
        },
        deaths: {
          type: Number,
          default: 0,
        },
      },
    ],

    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
    },
    name: {
      type: String,
      required: false,
    },
    description: {
      type: String,
      required: false,
    },
    game: {
      type: String,
      required: true,
    },
    platform: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: false,
      default: "pending",
    },
  },
  {
    timestamps: true,
  }
);

export const Tournament = mongoose.model("Tournament", tournamentSchema);
