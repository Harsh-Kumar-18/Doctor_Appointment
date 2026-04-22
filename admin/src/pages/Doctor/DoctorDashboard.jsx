import { useContext, useEffect } from "react"
import { DoctorContext } from "../../context/DoctorContext"
import { AppContext } from "../../context/AppContext"

const DoctorDashboard = () => {
  const { dToken, dashData, getDashData, cancelAppointment, completeAppointment } = useContext(DoctorContext)
  const { slotDateFormat } = useContext(AppContext)

  useEffect(() => { if (dToken) getDashData() }, [dToken])

  return dashData && (
    <div className="w-full min-h-screen bg-gray-100 px-6 md:px-10 py-8">
      <h2 className="text-2xl font-semibold text-gray-800 mb-8">Doctor Dashboard</h2>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        {[
          { label: "Earnings", value: `₹${dashData.earnings}`, color: "text-yellow-600" },
          { label: "Appointments", value: dashData.appointments, color: "text-blue-600" },
          { label: "Patients", value: dashData.patients, color: "text-purple-600" },
        ].map((s, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <p className="text-gray-500 text-sm">{s.label}</p>
            <h3 className={`text-3xl font-bold mt-2 ${s.color}`}>{s.value}</h3>
          </div>
        ))}
      </div>

      {/* Latest Appointments */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-50">
          <h3 className="text-base font-medium text-gray-800">Latest Appointments</h3>
        </div>

        {dashData.latestAppointments.map((item, index) => (
          <div key={index}
            className="flex flex-col md:flex-row md:items-center justify-between gap-4 px-6 py-4 border-b border-gray-50 last:border-0 hover:bg-gray-50 transition">

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-sm font-medium">
                {item.userData?.name?.split(' ').map(n => n[0]).join('').toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-medium text-gray-800">{item.userData?.name}</p>
                <p className="text-xs text-gray-400">{slotDateFormat(item.slotDate)} • {item.slotTime}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {item.cancel ? (
                <span className="px-3 py-1 text-xs rounded-full bg-red-100 text-red-600">Cancelled</span>
              ) : item.isCompleted ? (
                <span className="px-3 py-1 text-xs rounded-full bg-green-100 text-green-600">Completed</span>
              ) : (
                <>
                  <button onClick={() => completeAppointment(item._id)}
                    className="px-3 py-1 text-xs border border-green-400 text-green-600 rounded-lg hover:bg-green-50 transition">
                    Complete
                  </button>
                  <button onClick={() => cancelAppointment(item._id)}
                    className="px-3 py-1 text-xs border border-red-400 text-red-500 rounded-lg hover:bg-red-50 transition">
                    Cancel
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default DoctorDashboard
