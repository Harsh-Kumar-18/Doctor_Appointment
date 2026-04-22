import express from "express";
import cors from "cors";

const app = express();

app.use(express.json());
app.use(cors());

app.use("/uploads", express.static("uploads"));

app.get('/', (req, res) => {
    res.send('Hello World! This is the backend server.');
});

export default app;