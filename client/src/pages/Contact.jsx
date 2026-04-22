import React from "react";
import { assets } from "../assets/assets_frontend/assets";

const Contact = () => {
  return (
    <div className="px-4 md:px-10">
      {/* Heading */}
      <div className="text-center text-2xl pt-10 text-gray-500">
        <p>
          CONTACT <span className="text-gray-700 font-semibold">US</span>
        </p>
      </div>

      {/* Content */}
      <div className="flex flex-col md:flex-row items-center gap-10 my-10">
        {/* Image */}
        <img
          className="w-full md:max-w-105 rounded-lg"
          src={assets.contact_image}
          alt=""
        />

        {/* Text Section */}
        <div className="flex flex-col gap-6 text-gray-600">
          <b className="text-gray-800 text-lg">OUR OFFICE</b>

          <div>
            <p>Delhi Gate</p>
            <p>Suite 11, Delhi, INDIA</p>
          </div>

          <div>
            <p>Tel: +91-8647645831</p>
            <p>Email: wellvisit@gmail.com</p>
          </div>

          <b className="text-gray-800 text-lg">CAREERS AT WELLVISIT</b>

          <p>Learn more about our teams and job openings.</p>

          <button className="border border-gray-400 px-6 py-3 rounded-lg w-fit transition-all duration-300 hover:bg-primary hover:text-white hover:border-primary">
            Explore Jobs
          </button>
        </div>
      </div>
    </div>
  );
};

export default Contact;
