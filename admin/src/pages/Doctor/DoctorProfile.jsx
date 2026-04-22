import { useContext, useEffect, useState } from "react";
import { DoctorContext } from "../../context/DoctorContext";
import { toast } from "react-toastify";
import axios from "axios";

const DoctorProfile = () => {
  const { dToken, profileData, getProfileData, backendUrl, setProfileData } =
    useContext(DoctorContext);
  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    if (dToken) getProfileData();
  }, [dToken]);

  const updateProfile = async () => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/doctor/update-profile",
        {
          fees: profileData.fees,
          address: profileData.address,
          available: profileData.available,
          about: profileData.about,
        },
        { headers: { dtoken: dToken } },
      );
      if (data.success) {
        toast.success(data.message);
        setIsEdit(false);
        getProfileData();
      } else toast.error(data.message);
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    profileData && (
      <div className="w-full px-6 lg:px-10 py-8 bg-gray-100 min-h-screen">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          My Profile
        </h2>

        <div className="bg-white rounded-2xl border border-gray-100 p-8 max-w-5xl">
          {/* Top */}
          <div className="flex items-center gap-6 mb-8">
            <img
              src={profileData.image}
              className="w-24 h-24 rounded-2xl object-cover bg-blue-50"
              alt=""
            />
            <div>
              <p className="text-xl font-semibold text-gray-800">
                {profileData.name}
              </p>
              <p className="text-sm text-gray-400 mt-1">
                {profileData.degree} • {profileData.speciality}
              </p>
              <span className="mt-2 inline-block px-3 py-0.5 text-xs bg-blue-100 text-blue-600 rounded-full">
                {profileData.experience}
              </span>
            </div>
          </div>

          <hr className="border-gray-100 mb-6" />

          {/* About */}
          <div className="mb-6">
            <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-2">
              About
            </p>
            {isEdit ? (
              <textarea
                value={profileData.about}
                onChange={(e) =>
                  setProfileData((prev) => ({ ...prev, about: e.target.value }))
                }
                rows={5}
                className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:border-blue-500 outline-none"
              />
            ) : (
              <p className="text-sm text-gray-600">{profileData.about}</p>
            )}
          </div>

          {/* Fees */}
          <div className="mb-6">
            <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-2">
              Consultation Fees
            </p>
            {isEdit ? (
              <input
                type="number"
                value={profileData.fees}
                onChange={(e) =>
                  setProfileData((prev) => ({ ...prev, fees: e.target.value }))
                }
                className="px-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:border-blue-500 outline-none w-40"
              />
            ) : (
              <p className="text-sm text-gray-700 font-medium">
                ₹{profileData.fees}
              </p>
            )}
          </div>

          {/* Address */}
          <div className="mb-6">
            <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-2">
              Address
            </p>
            {isEdit ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  value={profileData.address?.line1}
                  onChange={(e) =>
                    setProfileData((prev) => ({
                      ...prev,
                      address: { ...prev.address, line1: e.target.value },
                    }))
                  }
                  className="px-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:border-blue-500 outline-none"
                  placeholder="Address line 1"
                />
                <input
                  value={profileData.address?.line2}
                  onChange={(e) =>
                    setProfileData((prev) => ({
                      ...prev,
                      address: { ...prev.address, line2: e.target.value },
                    }))
                  }
                  className="px-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:border-blue-500 outline-none"
                  placeholder="Address line 2"
                />
              </div>
            ) : (
              <p className="text-sm text-gray-600">
                {profileData.address?.line1}, {profileData.address?.line2}
              </p>
            )}
          </div>

          {/* Available */}
          <div className="mb-8 flex items-center gap-2">
  {isEdit ? (
    // ✅ Edit mode mein checkbox dikho
    <>
      <input
        type="checkbox"
        checked={profileData.available}
        onChange={e => setProfileData(prev => ({ ...prev, available: e.target.checked }))}
        className="w-4 h-4 cursor-pointer"
      />
      <p className="text-sm text-gray-600">Available for appointments</p>
    </>
  ) : (
    <div className="flex items-center gap-2">
      <div className={`w-3 h-3 rounded-full ${profileData.available ? 'bg-green-500' : 'bg-red-500'}`}></div>
      <p className="text-sm text-gray-600">
        {profileData.available ? 'Available for appointments' : 'Not available'}
      </p>
    </div>
  )}
</div>

          {/* Buttons */}
          <div className="flex gap-3">
            {isEdit ? (
              <>
                <button
                  onClick={updateProfile}
                  className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl transition active:scale-95"
                >
                  Save Changes
                </button>
                <button
                  onClick={() => {
                    setIsEdit(false);
                    getProfileData();
                  }}
                  className="px-6 py-2.5 border border-gray-200 text-gray-600 text-sm rounded-xl hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEdit(true)}
                className="px-6 py-2.5 border border-gray-200 text-gray-700 text-sm rounded-xl hover:bg-gray-50 transition"
              >
                Edit Profile
              </button>
            )}
          </div>
        </div>
      </div>
    )
  );
};

export default DoctorProfile;
