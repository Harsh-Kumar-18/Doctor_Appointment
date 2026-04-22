import { useContext, useEffect } from "react";
import { DoctorContext } from "../../context/DoctorContext";
import { AppContext } from "../../context/AppContext";

const DoctorAppointments = () => {
  const { dToken, appointments, getAppointments, cancelAppointment, completeAppointment } = useContext(DoctorContext);
  const { slotDateFormat, calculateAge } = useContext(AppContext);

  useEffect(() => {
    if (dToken) getAppointments();
  }, [dToken]);

  return (
    <div className="w-full px-4 sm:px-6 lg:px-10 py-8 bg-gray-50 min-h-screen">

      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-semibold text-gray-800">
          Appointments
        </h2>
        <span className="text-sm text-gray-500">
          {appointments.length} total
        </span>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

        {appointments.map((item, index) => (
          <div
            key={index}
            className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm hover:shadow-md transition-all duration-200"
          >

            {/* Top */}
            <div className="flex justify-between items-start mb-5">

              {/* Patient */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center text-xs font-semibold">
                  {item.userData?.name
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase()}
                </div>

                <div>
                  <p className="text-sm font-semibold text-gray-900">
                    {item.userData?.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    Age {calculateAge(item.userData?.dob || "2000-01-01")}
                  </p>
                </div>
              </div>

              {/* Status */}
              {item.cancel ? (
                <span className="text-xs px-2.5 py-1 rounded-full bg-red-50 text-red-600 font-medium">
                  Cancelled
                </span>
              ) : item.isCompleted ? (
                <span className="text-xs px-2.5 py-1 rounded-full bg-green-50 text-green-600 font-medium">
                  Completed
                </span>
              ) : item.payment ? (
                <span className="text-xs px-2.5 py-1 rounded-full bg-blue-50 text-blue-600 font-medium">
                  Paid
                </span>
              ) : (
                <span className="text-xs px-2.5 py-1 rounded-full bg-yellow-50 text-yellow-600 font-medium">
                  Pending
                </span>
              )}
            </div>

            {/* Divider */}
            <div className="border-t border-gray-100 mb-4"></div>

            {/* Details */}
            <div className="space-y-2 text-sm text-gray-600 mb-5">
              <p>
                <span className="text-gray-400">Date:</span>{" "}
                {slotDateFormat(item.slotDate)}
              </p>
              <p>
                <span className="text-gray-400">Time:</span>{" "}
                {item.slotTime}
              </p>
              <p className="font-medium text-gray-900">
                ₹{item.amount}
              </p>
            </div>

            {/* Actions */}
            {!item.cancel && !item.isCompleted && (
              <div className="flex gap-2">
                <button
                  onClick={() => completeAppointment(item._id)}
                  className="flex-1 py-2 text-xs font-medium rounded-lg border border-green-200 text-green-600 hover:bg-green-50 transition"
                >
                  Mark Complete
                </button>

                <button
                  onClick={() => cancelAppointment(item._id)}
                  className="flex-1 py-2 text-xs font-medium rounded-lg border border-red-200 text-red-500 hover:bg-red-50 transition"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        ))}

      </div>
    </div>
  );
};

export default DoctorAppointments;