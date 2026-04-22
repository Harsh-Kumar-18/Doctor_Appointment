import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const MyAppointment = () => {
  const { backendUrl, token, getDoctorsData } = useContext(AppContext);
  const [appointments, setAppointments] = useState([]);
  const navigate = useNavigate();

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  // ✅ Proper date format
  const slotDateFormat = (slotDate) => {
    const dateArray = slotDate.split("_");
    return `${dateArray[0]} ${months[dateArray[1] - 1]} ${dateArray[2]}`;
  };

  // ✅ Fetch appointments
  const getUserAppointments = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/user/appointments", {
        headers: { token },
      });

      if (data.success) {
        setAppointments(data.appointments.reverse());
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // ✅ Cancel appointment
  const cancelAppointment = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/user/cancel-appointment",
        { appointmentId },
        { headers: { token } },
      );

      if (data.success) {
        toast.success("Appointment Cancelled");
        getUserAppointments();
        getDoctorsData();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const initPay = (order) => {
    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: order.amount,
      currency: order.currency,
      name: "Appointment Payment",
      description: "Appointment Payment",
      order_id: order.id,
      receipt: order.receipt,
      handler: async (response) => {
        try {
          const { data } = await axios.post(
            backendUrl + "/api/user/verify-razorpay",
            {
              ...response,
              appointmentId: order.receipt, // 👈 important
            },
            { headers: { token } },
          );

          if (data.success) {
            toast.success("Payment Successful");
            getUserAppointments();
            navigate("/my-appointments");
          }
        } catch (error) {
          toast.error(error.message);
        }
      },
    };
    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  const appointmentRazorpay = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/user/payment-razorpay",
        { appointmentId },
        { headers: { token } },
      );
      if (data.success) {
        initPay(data.order);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (token) {
      getUserAppointments();
    }
  }, [token]);

  return (
    <div className="px-4 sm:px-10">
      <p className="pb-3 mt-12 text-lg font-medium text-zinc-700 border-b">
        My Appointments
      </p>

      <div className="mt-6 flex flex-col gap-6">
        {appointments.length > 0 ? (
          appointments.map((item, index) => (
            <div
              key={index}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-6"
            >
              {/* LEFT */}
              <div className="flex gap-4">
                <img
                  className="w-24 h-24 sm:w-28 sm:h-28 object-cover bg-blue-50 rounded-lg"
                  src={item.docData?.image}
                  alt=""
                />

                <div className="text-sm text-gray-600">
                  <p className="text-gray-900 font-medium text-base">
                    {item.docData?.name}
                  </p>

                  <p>{item.docData?.speciality}</p>

                  <div className="mt-2">
                    <p className="font-medium text-gray-700">Address:</p>
                    <p>{item.docData?.address?.line1}</p>
                    <p>{item.docData?.address?.line2}</p>
                  </div>

                  <p className="mt-2">
                    <span className="font-medium text-gray-700">
                      Date & Time:
                    </span>{" "}
                    {slotDateFormat(item.slotDate)} | {item.slotTime}
                  </p>
                </div>
              </div>

              {/* RIGHT */}
              <div className="flex flex-col gap-2 w-full sm:w-auto">
                {item.cancel ? (
                  <p className="text-red-500 font-medium text-sm text-center sm:text-left">
                    Appointment Cancelled
                  </p>
                ) : item.isCompleted ? (
                  <p className="text-green-500 font-medium text-sm text-center sm:text-left">
                    Appointment Completed
                  </p>
                ) : (
                  <>
                    {!item.payment && (
                      <button
                        onClick={() => appointmentRazorpay(item._id)}
                        className="w-full sm:w-auto bg-primary text-white text-sm px-6 py-2 rounded-md hover:bg-indigo-600 transition"
                      >
                        Pay Online
                      </button>
                    )}

                    {item.payment && (
                      <p className="text-green-500 font-medium text-sm text-center sm:text-left">
                        Payment Done ✓
                      </p>
                    )}

                    <button
                      onClick={() => cancelAppointment(item._id)}
                      className="w-full sm:w-auto border text-gray-500 text-sm px-6 py-2 rounded-md hover:bg-red-500 hover:text-white transition"
                    >
                      Cancel appointment
                    </button>
                  </>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 mt-6">No Appointments Found</p>
        )}
      </div>
    </div>
  );
};

export default MyAppointment;
