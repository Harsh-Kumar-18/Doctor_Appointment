import validator from "validator";
import bcrypt from "bcrypt";
import doctorModel from "../models/doctorModel.js";
import jwt from "jsonwebtoken";
import appointmentModel from "../models/appointmentModel.js";
import userModel from "../models/userModel.js";

const addDoctor = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      speciality,
      degree,
      experience,
      about,
      fees,
      address,
    } = req.body;
    const imageFile = req.file;

    if (
      !name ||
      !email ||
      !password ||
      !speciality ||
      !degree ||
      !experience ||
      !about ||
      !fees ||
      !address
    ) {
      return res.json({ success: false, message: "Missing Details" });
    }

    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Enter a valid email" });
    }

    if (password.length < 8) {
      return res.json({ success: false, message: "Enter strong password" });
    }

    if (!imageFile) {
      return res.json({ success: false, message: "Image is required" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const imageUrl = `http://localhost:${process.env.PORT}/uploads/${imageFile.filename}`;

    const doctorData = {
      name,
      email,
      image: imageUrl,
      password: hashPassword,
      speciality,
      degree,
      experience,
      about,
      fees,
      address: typeof address === "string" ? JSON.parse(address) : address,
      date: Date.now(),
    };

    const newDoctor = new doctorModel(doctorData);
    await newDoctor.save();

    res.json({ success: true, message: "Doctor Added" });
  } catch (error) {
    console.log("FULL ERROR:", JSON.stringify(error, null, 2));
    res.json({
      success: false,
      message: error.message || JSON.stringify(error),
    });
  }
};

const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      const token = jwt.sign(email + password, process.env.JWT_SECRET);
      res.json({
        success: true,
        token,
      });
    } else {
      res.json({ success: false, message: "Invalid credentials" });
    }
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const allDoctors = async (req,res) => {
  try {
    const doctors = await doctorModel.find({}).select("-password");
    res.json({
      success: true,
      doctors,
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const adminDashboard = async (req, res) => {
  try {
    const appointments = await appointmentModel.find({});
    const users = await userModel.find({});
    const doctors = await doctorModel.find({});

    // earnings calculate
    const totalEarnings = appointments
      .filter((item) => item.payment && !item.cancel)
      .reduce((sum, item) => sum + item.amount, 0);

    const dashData = {
      appointments: appointments.length,
      patients: users.length,
      doctors: doctors.length,
      earnings: totalEarnings,
      latestAppointments: appointments.reverse().slice(0, 5),
    };

    res.json({ success: true, dashData });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

const adminAppointments = async (req, res) => {
  try {
    const appointments = await appointmentModel.find({});

    res.json({
      success: true,
      appointments,
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

const appointmentCancel = async (req, res) => {
  try {
    const { appointmentId } = req.body;

    // 🔍 Find appointment
    const appointmentData = await appointmentModel.findById(appointmentId);

    if (!appointmentData) {
      return res.json({
        success: false,
        message: "Appointment not found",
      });
    }

    // ✅ Mark as cancelled
    await appointmentModel.findByIdAndUpdate(appointmentId, {
      cancel: true,
    });

    // 🔄 Remove slot from doctor
    const { docId, slotDate, slotTime } = appointmentData;

    const doctorData = await doctorModel.findById(docId);

    let slots_booked = doctorData.slots_booked;

    if (slots_booked[slotDate]) {
      slots_booked[slotDate] = slots_booked[slotDate].filter(
        (time) => time !== slotTime,
      );
    }

    await doctorModel.findByIdAndUpdate(docId, { slots_booked });

    res.json({
      success: true,
      message: "Appointment Cancelled",
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

export { addDoctor, loginAdmin, allDoctors, adminAppointments, appointmentCancel, adminDashboard };
