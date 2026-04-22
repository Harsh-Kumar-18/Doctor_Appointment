import dotenv from "dotenv";
dotenv.config();
import app from "./src/app.js"
import fs from 'fs';
import connectDB from "./src/config/mongodb.js";
import adminRouter from "./src/routes/adminRoute.js";
import doctorRouter from "./src/routes/docRoute.js";
import userRouter from "./src/routes/userRoute.js";

if (!fs.existsSync("./uploads")) {
  fs.mkdirSync("./uploads");
  console.log("Created uploads/ folder");
}

connectDB();


app.use('/api/admin',adminRouter)
app.use('/api/admin',doctorRouter)
app.use('/api/doctor',doctorRouter)
app.use('/api/user',userRouter)

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});