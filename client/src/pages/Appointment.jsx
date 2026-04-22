import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { assets } from "../assets/assets_frontend/assets";
import RelatedDoctors from "../components/RelatedDoctors";
import { toast } from "react-toastify";
import axios from "axios";

const Appointment = () => {
  const { docId } = useParams();
  const { doctors, backendUrl, token, getDoctorsData } = useContext(AppContext);
  const navigate = useNavigate();
  const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  const [doctorInfo, setDoctorInfo] = useState(null);
  const [docSlot, setDocSlot] = useState([]);
  const [slotIndex, setSlotIndex] = useState(0);
  const [slotTime, setSlotTime] = useState("");

  const fetchDocInfo = () => {
    const docInfo = doctors.find((doc) => doc._id === docId);
    setDoctorInfo(docInfo);
  };

  const getSlot = () => {
    let today = new Date();
    let allSlots = [];

    for (let i = 0; i < 7; i++) {
      let currentDate = new Date(today);
      currentDate.setDate(today.getDate() + i);

      let endTime = new Date(currentDate);
      endTime.setHours(21, 0, 0, 0);

      if (i === 0) {
        currentDate.setHours(
          currentDate.getHours() > 10 ? currentDate.getHours() + 1 : 10,
        );
        currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0);
      } else {
        currentDate.setHours(10);
        currentDate.setMinutes(0);
      }

      let timeSlot = [];

      while (currentDate < endTime) {
        let formattedTime = currentDate.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });

        let day = currentDate.getDate();
        let month = currentDate.getMonth() + 1;
        let year = currentDate.getFullYear();
        const slotDate = day + "_" + month + "_" + year;
        const slotTime = formattedTime;

        const isSlotAvailable =
          doctorInfo.slots_booked[slotDate] &&
          doctorInfo.slots_booked[slotDate].includes(slotTime)
            ? false
            : true;

        if (isSlotAvailable) {
          timeSlot.push({
            datetime: new Date(currentDate),
            time: formattedTime,
          });
        }

        currentDate.setMinutes(currentDate.getMinutes() + 30);
      }

      allSlots.push(timeSlot);
    }

    setDocSlot(allSlots);
  };

  const bookAppointment = async () => {
    if (!token) {
      toast.warn("Login to book appointment");
      return navigate("/login");
    }

    // ✅ Ye check add karo
    if (!slotTime) {
      toast.warn("Please select a time slot");
      return;
    }

    try {
      // ✅ [0] ki jagah selected slot dhundo
      const selectedSlot = docSlot[slotIndex].find(
        (slot) => slot.time === slotTime,
      );
      const date = selectedSlot.datetime;

      let day = date.getDate();
      let month = date.getMonth() + 1;
      let year = date.getFullYear();
      const slotDate = day + "_" + month + "_" + year;

      const { data } = await axios.post(
        backendUrl + "/api/user/book-appointment",
        { docId, slotDate, slotTime },
        { headers: { token } },
      );

      if (data.success) {
        toast.success(data.message);
        await getDoctorsData();
        navigate("/my-appointments");
      } else if (data.profileIncomplete) {
        // ✅ Profile incomplete hai toh redirect karo
        toast.warn("Please complete your profile first!");
        navigate("/my-profile");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchDocInfo();
  }, [doctors, docId]);

  useEffect(() => {
    if (doctorInfo) {
      getSlot();
    }
  }, [doctorInfo]);

  return (
    doctorInfo && (
      <div>
        {/*----Details----*/}
        <div className="flex flex-col sm:flex-row gap-4">
          <div>
            <img
              className="bg-primary w-full sm:max-w-72 rounded-lg"
              src={doctorInfo.image}
              alt=""
            />
          </div>
          <div className="flex-1 border border-gray-400 rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0 -mt-20 sm:mt-0">
            <p className="flex items-center gap-2 text-2xl font-medium text-gray-900">
              {doctorInfo.name}{" "}
              <img className="w-5" src={assets.verified_icon} alt="" />
            </p>
            <div className="flex items-center gap-2 text-sm mt-1 text-gray-600">
              <p>
                {doctorInfo.degree} - {doctorInfo.speciality}
              </p>
              <button className="py-0.5 px-2 border text-xs rounded-full">
                {doctorInfo.experience}
              </button>
            </div>
            <div>
              <p className="flex items-center gap-1 text-sm font-medium text-gray-900 mt-3">
                About <img src={assets.info_icon} alt="" />
              </p>
              <p className="text-sm text-gray-500 max-w-175 mt-1">
                {doctorInfo.about}
              </p>
            </div>
            <p className="text-gray-500 font-medium mt-4">
              Appointment fee:{" "}
              <span className="text-rose-600">{`$ ${doctorInfo.fees}`}</span>
            </p>
          </div>
        </div>
        {/*----Booking Slot----*/}
        <div className="sm:ml-72 sm:pl-4 mt-4 font-medium text-gray-700">
          <p>Booking slots</p>
          <div className="flex gap-3 items-center w-full overflow-x-scroll mt-4">
            {docSlot.length > 0 &&
              docSlot.map((item, index) => (
                <div
                  onClick={() => setSlotIndex(index)}
                  className={`text-center py-6 min-w-16 rounded-full cursor-pointer ${slotIndex === index ? "bg-primary text-white" : "border border-gray-200"}`}
                  key={index}
                >
                  <p>{item[0] && daysOfWeek[item[0].datetime.getDay()]}</p>
                  <p>{item[0] && item[0].datetime.getDate()}</p>
                </div>
              ))}
          </div>
          <div>
            <div className="flex items-center gap-3 w-full overflow-x-scroll mt-4">
              {docSlot.length > 0 &&
                docSlot[slotIndex] &&
                docSlot[slotIndex].map((item, index) => (
                  <p
                    onClick={() => setSlotTime(item.time)}
                    key={index}
                    className={`text-sm font-light shrink-0 px-5 py-2 rounded-full cursor-pointer ${item.time === slotTime ? "bg-primary text-white" : "text-gray-400 border border-gray-300"}`}
                  >
                    {item.time.toLowerCase()}
                  </p>
                ))}
            </div>
            <button
              onClick={bookAppointment}
              className="bg-primary text-white text-sm font-light px-14 py-3 rounded-full my-6"
            >
              Book an appointment
            </button>
          </div>
          <RelatedDoctors docId={docId} speciality={doctorInfo.speciality} />
        </div>
      </div>
    )
  );
};

export default Appointment;
