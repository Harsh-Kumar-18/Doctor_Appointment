import React, { useContext, useEffect } from "react";
import { AdminContext } from "../../context/AdminContext";
import { AppContext } from "../../context/AppContext";

const AllAppointments = () => {
  const { aToken, appointments, getAllAppointments, cancelAppointment } =
    useContext(AdminContext);
  const { calculateAge, slotDateFormat } = useContext(AppContext);

  useEffect(() => {
    if (aToken) getAllAppointments();
  }, [aToken]);

  return (
    <div className="w-full px-6 lg:px-10 py-6 bg-gray-100 min-h-screen">

      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-semibold text-gray-900">
          Appointments
        </h2>

        <span className="text-sm text-gray-500">
          {appointments.length} total
        </span>
      </div>

      {/* EMPTY STATE */}
      {appointments.length === 0 ? (
        <div className="w-full flex flex-col items-center justify-center py-24 text-center">
          
          {/* Icon */}
          <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center mb-4">
            <span className="text-2xl text-gray-500">📅</span>
          </div>

          {/* Text */}
          <h3 className="text-lg font-semibold text-gray-800">
            No Appointments Found
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            There are no appointments yet.
          </p>
        </div>
      ) : (

        /* CARDS */
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {appointments.map((item, index) => {

            const statusStyles = item.cancel
              ? "bg-red-50 border-red-200"
              : item.isCompleted
              ? "bg-purple-50 border-purple-200"
              : item.payment
              ? "bg-green-50 border-green-200"
              : "bg-blue-50 border-blue-200";

            const badgeStyles = item.cancel
              ? "bg-red-100 text-red-600"
              : item.isCompleted
              ? "bg-purple-100 text-purple-700"
              : item.payment
              ? "bg-green-100 text-green-700"
              : "bg-blue-100 text-blue-700";

            return (
              <div
                key={index}
                className={`rounded-xl border p-5 transition-all duration-200 hover:shadow-md hover:-translate-y-1 ${statusStyles}`}
              >

                {/* Top */}
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-gray-900 font-medium text-base">
                      {item.userData?.name}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Patient
                    </p>
                  </div>

                  {/* Status */}
                  <span
                    className={`text-xs px-3 py-1 rounded-md font-medium ${badgeStyles}`}
                  >
                    {item.cancel
                      ? "Cancelled"
                      : item.isCompleted
                      ? "Completed"
                      : item.payment
                      ? "Paid"
                      : "Pending"}
                  </span>
                </div>

                {/* Divider */}
                <div className="border-t my-4"></div>

                {/* Details */}
                <div className="space-y-2 text-sm text-gray-600">

                  <div className="flex justify-between">
                    <span>Date</span>
                    <span className="text-gray-800">
                      {slotDateFormat(item.slotDate)}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span>Time</span>
                    <span className="text-gray-800">
                      {item.slotTime}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span>Doctor</span>
                    <span className="text-gray-800">
                      {item.docData?.name}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span>Age</span>
                    <span className="text-gray-800">
                      {calculateAge(item.userData?.dob || "2000-01-01")}
                    </span>
                  </div>

                  <div className="flex justify-between font-medium">
                    <span>Fees</span>
                    <span className="text-gray-900">
                      ₹{item.amount}
                    </span>
                  </div>
                </div>

                {/* Action */}
                {!item.cancel && !item.payment && !item.isCompleted && (
                  <button
                    onClick={() => cancelAppointment(item._id)}
                    className="mt-5 w-full py-2 text-sm border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition"
                  >
                    Cancel Appointment
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AllAppointments;