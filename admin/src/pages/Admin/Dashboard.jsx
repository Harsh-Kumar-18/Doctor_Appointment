// pages/AdminDashboard.jsx

import React, { useEffect, useContext } from "react";
import { AdminContext } from "../../context/AdminContext";
import { AppContext } from "../../context/AppContext";

const AdminDashboard = () => {
  const { aToken, getDashboardData, dashData, cancelAppointment } =
    useContext(AdminContext);
  const { slotDateFormat } = useContext(AppContext);

  useEffect(() => {
    if (aToken) {
      getDashboardData();
    }
  }, [aToken]);

  return (
    dashData && (
      <div className="w-full min-h-screen bg-gray-100 px-6 md:px-10 py-8">
        {/* Heading */}
        <h2 className="text-3xl font-bold mb-8 text-gray-800">
          Admin Dashboard
        </h2>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-8">
          <div className="bg-white p-6 rounded-2xl shadow-md">
            <p className="text-gray-500 text-sm">Total Appointments</p>
            <h3 className="text-3xl font-bold text-blue-600 mt-2">
              {dashData.appointments}
            </h3>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-md">
            <p className="text-gray-500 text-sm">Total Doctors</p>
            <h3 className="text-3xl font-bold text-green-600 mt-2">
              {dashData.doctors}
            </h3>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-md">
            <p className="text-gray-500 text-sm">Patients</p>
            <h3 className="text-3xl font-bold text-purple-600 mt-2">
              {dashData.patients}
            </h3>
          </div>

          <div className="bg-white p-6 rounded-2xl shadow-md">
            <p className="text-gray-500 text-sm">Total Earnings</p>
            <h3 className="text-3xl font-bold text-yellow-600 mt-2">
              ₹{dashData.earnings}
            </h3>
          </div>
        </div>

        {/* Latest Appointments */}
        <div className="mt-12">
  <h3 className="text-xl font-semibold mb-6 text-gray-800">
    Latest Appointments
  </h3>

  {dashData.latestAppointments.length === 0 ? (
    <div className="bg-white rounded-xl border p-10 text-center text-gray-500">
      No recent appointments
    </div>
  ) : (
    <div className="space-y-4">
      {dashData.latestAppointments.map((item, index) => {
        const userName = item.userData?.name;
        const doctorName = item.docData?.name;

        const initials = userName
          ?.split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase();

        return (
          <div
            key={index}
            className="bg-white rounded-xl border border-gray-100 px-5 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4 hover:shadow-md transition"
          >
            {/* LEFT */}
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-full bg-gray-200 text-gray-700 flex items-center justify-center text-sm font-semibold">
                {initials}
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-900">
                  {userName}
                </p>
                <p className="text-xs text-gray-500">
                  with {doctorName}
                </p>
              </div>
            </div>

            {/* CENTER */}
            <div className="text-sm text-gray-600 flex gap-6">
              <span>{slotDateFormat(item.slotDate)}</span>
              <span>{item.slotTime}</span>
            </div>

            {/* RIGHT */}
            <div className="flex items-center gap-3">
              {item.cancel ? (
                <span className="px-2.5 py-1 text-xs rounded-full bg-red-50 text-red-600 font-medium">
                  Cancelled
                </span>
              ) : item.isCompleted ? (
                <span className="px-2.5 py-1 text-xs rounded-full bg-blue-50 text-blue-600 font-medium">
                  Completed
                </span>
              ) : (
                <>
                  <span className="px-2.5 py-1 text-xs rounded-full bg-green-50 text-green-600 font-medium">
                    Confirmed
                  </span>

                  <button
                    onClick={async () => {
                      await cancelAppointment(item._id);
                      getDashboardData();
                    }}
                    className="text-xs border border-red-200 text-red-500 px-3 py-1 rounded-md hover:bg-red-50 transition"
                  >
                    Cancel
                  </button>
                </>
              )}
            </div>
          </div>
        );
      })}
    </div>
  )}
</div>
      </div>
    )
  );
};

export default AdminDashboard;
