import validator from "validator";
import bcrypt from "bcrypt";
import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import doctorModel from "../models/doctorModel.js";
import appointmentModel from "../models/appointmentModel.js";
import razorpay from "razorpay";
import crypto from "crypto";

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !password || !email) {
      return res.json({
        success: false,
        message: "Missing Details",
      });
    }
    if (!validator.isEmail(email)) {
      return res.json({
        success: false,
        message: "Enter a valid email",
      });
    }
    if (password.length < 8) {
      return res.json({
        success: false,
        message: "Enter a strong password",
      });
    }
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    const userData = {
      name,
      email,
      password: hashPassword,
    };

    const newUser = new userModel(userData);
    const user = await newUser.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.json({
      success: true,
      token,
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User not exist" });
    }
    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
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

const getProfile = async (req, res) => {
  try {
    const userId = req.userId;
    const userData = await userModel.findById(userId).select("-password");
    res.json({
      success: true,
      userData,
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    const userId = req.userId; // ✅ middleware se lo
    const { name, phone, address, dob, gender } = req.body;
    const imageFile = req.file;

    if (!name || !phone || !dob || !gender) {
      return res.json({ success: false, message: "Data Missing" });
    }

    // ✅ address safe parse
    const parsedAddress =
      typeof address === "string" ? JSON.parse(address) : address;

    // ✅ image URL (same as admin controller)
    let imageUrl;
    if (imageFile) {
      imageUrl = `http://localhost:${process.env.PORT}/uploads/${imageFile.filename}`;
    }

    // ✅ update object
    const updateData = {
      name,
      phone,
      address: parsedAddress,
      dob,
      gender,
    };

    // image add only if uploaded
    if (imageUrl) {
      updateData.image = imageUrl;
    }

    await userModel.findByIdAndUpdate(userId, updateData);

    res.json({
      success: true,
      message: "Profile Updated Successfully",
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const bookAppointment = async (req, res) => {
  try {
    const userId = req.userId;
    const { docId, slotDate, slotTime } = req.body;

    const userData = await userModel.findById(userId).select('-password')

    if (
      !userData.phone ||
      userData.phone === '' ||
      !userData.dob ||
      userData.dob === 'Not Selected' ||
      !userData.gender ||
      userData.gender === 'Not Selected' ||
      !userData.address?.line1 ||
      userData.address?.line1 === 'Not Provided'
    ) {
      return res.json({
        success: false,
        message: 'Please complete your profile before booking',
        profileIncomplete: true
      })
    }

    const docData = await doctorModel.findById(docId).select("-password");
    if (!docData.available) {
      return res.json({
        success: false,
        message: "Doctor not available",
      });
    }
    let slots_booked = docData.slots_booked || {};
    if (slots_booked[slotDate]) {
      if (slots_booked[slotDate].includes(slotTime)) {
        return res.json({
          success: false,
          message: "Slot not available",
        });
      } else {
        slots_booked[slotDate].push(slotTime);
      }
    } else {
      slots_booked[slotDate] = [];
      slots_booked[slotDate].push(slotTime);
    }
    const docDataCopy = docData.toObject();
    delete docDataCopy.slots_booked;

    const appointmentData = {
      userId,
      docId,
      userData,
      docData: docDataCopy,
      amount: docData.fees,
      slotTime,
      slotDate,
      date: Date.now(),
    };

    const newAppointment = new appointmentModel(appointmentData);
    await newAppointment.save();
    await doctorModel.findByIdAndUpdate(docId, { slots_booked });
    res.json({
      success: true,
      message: "Appointment Booked",
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};

const listAppointment = async (req, res) => {
  try {
    const userId = req.userId;
    const appointments = await appointmentModel.find({ userId });

    res.json({
      success: true,
      appointments,
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

const cancelAppointment = async (req, res) => {
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

    if (appointmentData.userId !== req.userId) {
      return res.json({ success: false, message: "Not Authorized" });
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

const paymentRazorpay = async (req, res) => {
  try {
    const razorpayInstance = new razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

    const { appointmentId } = req.body;

    const appointmentData = await appointmentModel.findById(appointmentId);

    if (!appointmentData) {
      return res.json({ success: false, message: "Appointment not found" });
    }

    const options = {
      amount: appointmentData.amount * 100, // paise
      currency: "INR",
      receipt: appointmentId,
    };

    const order = await razorpayInstance.orders.create(options);

    res.json({
      success: true,
      order,
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

const verifyRazorpay = async (req, res) => {
  try {
    const razorpayInstance = new razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature === razorpay_signature) {
      // ✅ Payment success
      await appointmentModel.findByIdAndUpdate(
  req.body.appointmentId,
  { payment: true }
)

      res.json({
        success: true,
        message: "Payment Successful",
      });
    } else {
      res.json({
        success: false,
        message: "Invalid Signature",
      });
    }
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  bookAppointment,
  listAppointment,
  cancelAppointment,
  paymentRazorpay,
  verifyRazorpay
};
