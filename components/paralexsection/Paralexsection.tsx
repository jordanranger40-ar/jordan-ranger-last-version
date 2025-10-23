"use client";

import React from "react";
import VideoHeroSection from "@/components/video-section";
import Manakesh from "@/public/images/manakesh.webp";
import lobby from "@/public/images/lobby.webp";

export default function Paralexsection() {
  return (
    <div className="relative">

   
      <section
        id="section-1"
        className="relative min-h-screen flex flex-col justify-center items-center text-center bg-white z-10"
        style={{
          backgroundColor: "#fff",
        }}
      >
        <VideoHeroSection />
      </section>


      <div className="h-screen bg-white flex flex-col justify-center items-center px-6 text-center">
        <h2 className="text-3xl font-semibold mb-4">Welcome to Our Restaurant</h2>
        <p className="max-w-3xl text-gray-700 text-lg leading-relaxed">
          Experience the finest dining with our exquisite menu and warm atmosphere.
          Our chefs bring traditional flavors with a modern twist.
        </p>
      </div>

     
      <section
        id="section-2"
        className="relative h-screen flex flex-col justify-center items-center text-center text-white z-10 px-6"
        style={{
          backgroundImage: `url(${lobby.src})`,
          backgroundAttachment: "fixed",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
      
        <div className="absolute inset-0 bg-black opacity-40 z-0"></div>

       
        <div className="relative z-10 max-w-3xl">
          <h1 className="text-4xl font-bold mb-4">Discover Our Unique Atmosphere</h1>
          <p className="max-w-xl text-lg">
            Enjoy a warm, inviting ambiance perfect for family dinners and special occasions.
          </p>
        </div>
      </section>

   
      <div className="h-screen bg-white flex flex-col justify-center items-center px-6 text-center">
        <h2 className="text-3xl font-semibold mb-6">Our Signature Dishes</h2>
        <ul className="max-w-3xl text-gray-800 text-lg list-disc list-inside space-y-2">
          <li>Fresh Manakish with Zaatar and Cheese</li>
          <li>Grilled Lamb Chops with Rosemary</li>
          <li>Seasonal Salads with Local Ingredients</li>
          <li>Traditional Lentil Soup</li>
          <li>Homemade Desserts</li>
        </ul>
      </div>

   
      <section
        id="section-3"
        className="relative h-screen flex flex-col justify-center items-center text-center text-white z-10 px-6"
        style={{
          backgroundImage: `url(${Manakesh.src})`,
          backgroundAttachment: "fixed",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
   
        <div className="absolute inset-0 bg-black opacity-40 z-0"></div>

        <div className="relative z-10 max-w-3xl">
          <h1 className="text-4xl font-bold mb-4">Taste Authentic Flavors</h1>
          <p className="max-w-xl text-lg">
            Our traditional recipes are prepared fresh daily, ensuring an unforgettable experience.
          </p>
        </div>
      </section>

    
      <div className="h-screen bg-white flex flex-col justify-center items-center px-6 text-center">
        <h2 className="text-3xl font-semibold mb-4">Contact & Opening Hours</h2>
        <p className="text-gray-700 text-lg mb-2">Monday - Friday: 11:00 AM - 10:00 PM</p>
        <p className="text-gray-700 text-lg mb-2">Saturday - Sunday: 12:00 PM - 11:00 PM</p>
        <p className="text-gray-700 text-lg">
          Phone: <a href="tel:+1234567890" className="text-blue-600 underline">+1 (234) 567-890</a><br />
          Email: <a href="mailto:info@restaurant.com" className="text-blue-600 underline">info@restaurant.com</a>
        </p>
      </div>

    </div>
  );
}
