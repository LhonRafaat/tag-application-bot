import app from "./app";
import mongoose from "mongoose";

const url: string = process.env.MONGODB_URI ? process.env.MONGODB_URI : "";
mongoose.connect(url);
app.listen(process.env.PORT, () => {
  console.log(`Listening on port ${process.env.PORT}`);
});
