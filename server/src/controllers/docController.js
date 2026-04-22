import doctorModel from "../models/doctorModel.js";
import appointmentModel from "../models/appointmentModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const changeAvailability = async (req, res) => {
  try {
    const { docId } = req.body;
    const docData = await doctorModel.findById(docId);
    await doctorModel.findByIdAndUpdate(docId, {
      available: !docData.available,
    });
    res.json({
      success: true,
      message: "Availability changes",
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const doctorList = async (req, res) => {
  try {
    const doctors = await doctorModel.find({}).select("-password -email");
    res.json({
      success: true,
      doctors,
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const loginDoctor = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 🔍 check doctor exists
    const doctor = await doctorModel.findOne({ email });

    if (!doctor) {
      return res.json({
        success: false,
        message: "Doctor not found",
      });
    }

    // 🔐 compare password
    const isMatch = await bcrypt.compare(password, doctor.password);

    if (isMatch) {
      const token = jwt.sign({ id: doctor._id }, process.env.JWT_SECRET);
      res.json({
        success: true,
        token,
      });
    } else {
      res.json({
        success: false,
        message: "Invalid credentials",
      });
    }
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: error.message,
    });
  }
};

// ✅ Doctor Appointments
const doctorAppointments = async (req, res) => {
  try {
    const docId = req.docId;
    const appointments = await appointmentModel.find({ docId });
    res.json({ success: true, appointments });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// ✅ Cancel Appointment (by doctor)
const cancelAppointmentDoctor = async (req, res) => {
  try {
    const { appointmentId } = req.body;
    const docId = req.docId;
    const appointment = await appointmentModel.findById(appointmentId);

    if (appointment.docId !== docId)
      return res.json({ success: false, message: "Not authorized" });

    await appointmentModel.findByIdAndUpdate(appointmentId, { cancel: true });

    // slot free karo
    const { slotDate, slotTime } = appointment;
    const docData = await doctorModel.findById(docId);
    let slots_booked = docData.slots_booked;
    if (slots_booked[slotDate]) {
      slots_booked[slotDate] = slots_booked[slotDate].filter(
        (t) => t !== slotTime,
      );
    }
    await doctorModel.findByIdAndUpdate(docId, { slots_booked });
    res.json({ success: true, message: "Appointment Cancelled" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// ✅ Complete Appointment
const completeAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.body;

    const appointment = await appointmentModel.findById(appointmentId);

    if (!appointment) {
      return res.json({ success: false, message: "Appointment not found" });
    }

    if (appointment.docId !== req.docId) {
      return res.json({ success: false, message: "Not Authorized" });
    }
  
    await appointmentModel.findByIdAndUpdate(appointmentId, {
      isCompleted: true,
    });
    res.json({ success: true, message: "Appointment Completed" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// ✅ Doctor Dashboard
const doctorDashboard = async (req, res) => {
  try {
    const docId = req.docId;
    const appointments = await appointmentModel.find({ docId });

    const earnings = appointments
      .filter((a) => a.payment && !a.cancel)
      .reduce((sum, a) => sum + a.amount, 0);

    const patients = [...new Set(appointments.map((a) => a.userId))].length;

    const dashData = {
      earnings,
      appointments: appointments.length,
      patients,
      latestAppointments: appointments.reverse().slice(0, 5),
    };
    res.json({ success: true, dashData });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// ✅ Get Doctor Profile
const getDoctorProfile = async (req, res) => {
  try {
    const docId = req.docId;
    const doctor = await doctorModel.findById(docId).select("-password");
    res.json({ success: true, profileData: doctor });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// ✅ Update Doctor Profile
const updateDoctorProfile = async (req, res) => {
  try {
    const docId = req.docId;
    const { fees, address, available, about } = req.body;
    await doctorModel.findByIdAndUpdate(docId, {
      fees,
      address,
      available,
      about,
    });
    res.json({ success: true, message: "Profile Updated" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export {
  changeAvailability,
  doctorList,
  loginDoctor,
  doctorAppointments,
  cancelAppointmentDoctor,
  completeAppointment,
  doctorDashboard,
  getDoctorProfile,
  updateDoctorProfile,
};
