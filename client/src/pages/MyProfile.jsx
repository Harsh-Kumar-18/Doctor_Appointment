import React, { useContext, useState } from "react";
import { AppContext } from "../context/AppContext";
import { assets } from "../assets/assets_frontend/assets";
import axios from "axios";
import { toast } from "react-toastify";

const MyProfile = () => {
  const { userData, setUserData, token, backendUrl, loadUserProfileData } =
    useContext(AppContext);
  const [image, setImage] = useState(false);

  const [isEdit, setIsEdit] = useState(false);
  const updateUserProfileData = async () => {
    try {
      const formData = new FormData();
      formData.append("name", userData.name);
      formData.append("phone", userData.phone);
      formData.append("address", JSON.stringify(userData.address));
      formData.append("gender", userData.gender);
      formData.append("dob", userData.dob);
      image && formData.append("image", image);

      const { data } = await axios.post(
        backendUrl + "/api/user/update-profile",
        formData,
        {
          headers: { token },
        },
      );
      if (data.success) {
        toast.success(data.message);
        await loadUserProfileData();
        setIsEdit(false);
        setImage(false);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white border border-gray-200 shadow-lg rounded-xl p-6">
      {/* Image + Name */}
      <div className="flex flex-col items-center gap-4">
        {isEdit ? (
          <label htmlFor="image">
            <div className="inline-block cursor-pointer relative">
              <img
                className="w-36 rounded opacity-75"
                src={image ? URL.createObjectURL(image) : userData.image}
                alt=""
              />
              {!image && (
                <img
                  className="w-10 absolute bottom-12 right-12"
                  src={assets.upload_icon}
                  alt=""
                />
              )}
            </div>
            <input
              onChange={(e) => {
                setImage(e.target.files[0]);
              }}
              type="file"
              id="image"
              hidden
            />
          </label>
        ) : (
          <img
            className="w-24 h-24 rounded-full object-cover"
            src={userData.image}
          />
        )}

        {isEdit ? (
          <input
            className="border px-3 py-2 rounded-lg text-center"
            value={userData.name}
            onChange={(e) =>
              setUserData((prev) => ({ ...prev, name: e.target.value }))
            }
            type="text"
          />
        ) : (
          <p className="text-2xl font-semibold">{userData.name}</p>
        )}
      </div>

      {/* CONTACT INFORMATION */}
      <div className="mt-8">
        <p className="text-sm font-semibold text-gray-700 underline underline-offset-4">
          CONTACT INFORMATION
        </p>

        <div className="mt-4 flex flex-col gap-4 text-sm text-gray-600">
          <div>
            <p className="font-medium text-gray-800">Email</p>
            <p className="text-blue-400">{userData.email}</p>
          </div>

          <div>
            <p className="font-medium text-gray-800">Phone</p>
            {isEdit ? (
              <input
                className="border px-3 py-2 rounded-lg w-full"
                value={userData.phone}
                onChange={(e) =>
                  setUserData((prev) => ({ ...prev, phone: e.target.value }))
                }
                type="text"
              />
            ) : (
              <p className="text-blue-400">{userData.phone}</p>
            )}
          </div>

          <div>
            <p className="font-medium text-gray-800">Address</p>
            {isEdit ? (
              <div className="flex flex-col gap-2">
                <input
                  className="border px-3 py-2 rounded-lg"
                  value={userData.address?.line1}
                  onChange={(e) =>
                    setUserData((prev) => ({
                      ...prev,
                      address: {
                        ...(prev.address || {}),
                        line1: e.target.value,
                      },
                    }))
                  }
                />
                <input
                  className="border px-3 py-2 rounded-lg"
                  value={userData.address?.line2}
                  onChange={(e) =>
                    setUserData((prev) => ({
                      ...prev,
                      address: {
                        ...(prev.address || {}),
                        line2: e.target.value,
                      },
                    }))
                  }
                />
              </div>
            ) : (
              <p>
                {userData.address?.line1}, {userData.address?.line2}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* BASIC INFORMATION */}
      <div className="mt-8">
        <p className="text-sm font-semibold text-gray-700 underline underline-offset-4">
          BASIC INFORMATION
        </p>

        <div className="mt-4 flex flex-col gap-4 text-sm text-gray-600">
          <div>
            <p className="font-medium text-gray-800">Gender</p>
            {isEdit ? (
              <select
                className="border px-3 py-2 rounded-lg"
                value={userData.gender}
                onChange={(e) =>
                  setUserData((prev) => ({
                    ...prev,
                    gender: e.target.value,
                  }))
                }
              >
                <option>Male</option>
                <option>Female</option>
              </select>
            ) : (
              <p>{userData.gender}</p>
            )}
          </div>

          <div>
            <p className="font-medium text-gray-800">Date of Birth</p>
            {isEdit ? (
              <input
                className="border px-3 py-2 rounded-lg"
                value={userData.dob}
                onChange={(e) =>
                  setUserData((prev) => ({
                    ...prev,
                    dob: e.target.value,
                  }))
                }
                type="date"
              />
            ) : (
              <p>{userData.dob}</p>
            )}
          </div>
        </div>
      </div>

      {/* Button */}
      <div className="mt-8 flex justify-center">
        <button
          onClick={isEdit ? updateUserProfileData : () => setIsEdit(true)}
          className="border border-primary text-primary px-8 py-2 rounded-full hover:bg-primary hover:text-white transition-all"
        >
          {isEdit ? "Save Information" : "Edit"}
        </button>
      </div>
    </div>
  );
};

export default MyProfile;
