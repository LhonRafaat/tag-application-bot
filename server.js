import app from "./app.js";
import mongoose from "mongoose";

mongoose.connect(process.env.DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
app.listen(process.env.PORT, () => {
  console.log(`Listening on port ${process.env.PORT}`);
});
