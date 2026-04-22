import React, { useContext, useState } from "react";
import { assets } from "../../assets/assets";
import { AdminContext } from "../../context/AdminContext";
import { toast } from "react-toastify";
import axios from "axios";

const AddDoctor = () => {
  const [docImage, setDocImage] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [experience, setExperience] = useState("1 Year");
  const [fees, setFees] = useState("");
  const [about, setAbout] = useState("");
  const [speciality, setSpeciality] = useState("General physician");
  const [degree, setDegree] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");

  const { backendUrl, aToken } = useContext(AdminContext);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      if (!docImage) {
        return toast.error("Image Not Selected");
      }
      const formData = new FormData();
      formData.append("image", docImage);
      formData.append("name", name);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("experience", experience);
      formData.append("fees", Number(fees));
      formData.append("about", about);
      formData.append("speciality", speciality);
      formData.append("degree", degree);
      formData.append(
        "address",
        JSON.stringify({ line1: address1, line2: address2 }),
      );

      const { data } = await axios.post(
        backendUrl + "/api/admin/add-doctor",
        formData,
        { headers: { aToken } },
      );

      if (data.success) {
        toast.success(data.message);
        setDocImage(false);
        setName("");
        setEmail("");
        setPassword("");
        setAddress1("");
        setAddress2("");
        setFees("");
        setAbout("");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <form
      onSubmit={onSubmitHandler}
      className="p-6 w-full flex flex-col items-center bg-gray-50 min-h-screen"
    >
      <div className="mb-4 text-center">
        <h1 className="text-xl font-semibold text-gray-900">Add Doctor</h1>
        <p className="text-sm text-gray-500 mt-1">
          Register a new doctor to the platform
        </p>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl p-7 space-y-7 w-full max-w-4xl max-h-[85vh] overflow-y-auto shadow-sm">
        {/* Upload */}
        <div className="flex items-center gap-6 mb-10">
          <label htmlFor="docImage" className="cursor-pointer group">
            <div className="w-24 h-24 border-2 border-dashed rounded-xl flex items-center justify-center bg-gray-100 group-hover:border-primary transition">
              <img
                src={
                  docImage ? URL.createObjectURL(docImage) : assets.upload_area
                }
                alt=""
                className="w-18"
              />
            </div>
          </label>

          <input
            onChange={(e) => setDocImage(e.target.files[0])}
            type="file"
            id="docImage"
            hidden
          />

          <div>
            <p className="font-medium text-gray-700">Upload Doctor Picture</p>
            <p className="text-sm text-gray-500">PNG, JPG up to 2MB</p>
          </div>
        </div>

        <hr className="border-gray-100" />

        {/* Personal info */}
        <section>
          <p className="text-[11px] font-medium text-gray-400 uppercase tracking-widest mb-4">
            Personal information
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-gray-600">
                Full name
              </label>
              <input
                onChange={(e) => setName(e.target.value)}
                value={name}
                type="text"
                placeholder="Dr. John Smith"
                className="w-full mt-1 px-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-gray-600">
                Email address
              </label>
              <input
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                type="email"
                placeholder="you@gmail.com"
                className="w-full mt-1 px-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-gray-600">
                Password
              </label>
              <input
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                type="password"
                placeholder="Enter Password"
                className="w-full mt-1 px-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-gray-600">
                Education
              </label>
              <input
                onChange={(e) => setDegree(e.target.value)}
                value={degree}
                type="text"
                className="w-full mt-1 px-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition"
                placeholder="MBBS"
              />
            </div>
          </div>
        </section>

        <hr className="border-gray-100" />

        {/* Professional */}
        <section>
          <p className="text-[11px] font-medium text-gray-400 uppercase tracking-widest mb-4">
            Professional details
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-medium text-gray-600">
                Speciality
              </label>
              <select
                onChange={(e) => setSpeciality(e.target.value)}
                value={speciality}
                className="w-full mt-1 px-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition"
              >
                <option>General physician</option>
                <option>Gynecologist</option>
                <option>Dermatologist</option>
                <option>Pediatricians</option>
                <option>Neurologist</option>
                <option>Gastroenterologist</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-medium text-gray-600">
                Experience
              </label>
              <select
                onChange={(e) => setExperience(e.target.value)}
                value={experience}
                className="w-full mt-1 px-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition"
              >
                <option value="1 Year">1 Year</option>
                <option value="2 Year">2 Year</option>
                <option value="3 Year">3 Year</option>
                <option value="4 Year">4 Year</option>
                <option value="5 Year">5 Year</option>
                <option value="6 Year">6 Year</option>
                <option value="7 Year">7 Year</option>
                <option value="8 Year">8 Year</option>
                <option value="9 Year">9 Year</option>
                <option value="10 Year">10 Year</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-medium text-gray-600">
                Consultation fees (₹)
              </label>
              <input
                onChange={(e) => setFees(e.target.value)}
                value={fees}
                type="number"
                className="w-full mt-1 px-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition"
                placeholder="50"
              />
            </div>
          </div>
        </section>

        <hr className="border-gray-100" />

        {/* Address */}
        <section>
          <p className="text-[11px] font-medium text-gray-400 uppercase tracking-widest mb-4">
            Location
          </p>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <input
              onChange={(e) => setAddress1(e.target.value)}
              value={address1}
              placeholder="Address line 1"
              className="px-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition"
            />
            <input
              onChange={(e) => setAddress2(e.target.value)}
              value={address2}
              placeholder="Address line 2"
              className="px-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition"
            />
          </div>
        </section>

        <hr className="border-gray-100" />

        {/* About */}
        <section>
          <p className="text-[11px] font-medium text-gray-400 uppercase tracking-widest mb-4">
            About
          </p>

          <textarea
            onChange={(e) => setAbout(e.target.value)}
            value={about}
            rows={4}
            placeholder="About Doctor..."
            className="w-full px-4 py-3 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition"
          />
        </section>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl transition active:scale-95 shadow-sm"
          >
            Add doctor
          </button>
        </div>
      </div>
    </form>
  );
};

export default AddDoctor;
