import React from "react";
import DashboardClient from "../Components/DashboardClient";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function Clock(){
    const [dateTime, setDateTime] = useState(new Date());
    
      // Update every second
      useEffect(() => {
        const timer = setInterval(() => {
          setDateTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
      }, []);
    
      // Format date and time
      const formattedDate = dateTime.toLocaleDateString("en-GB", {
        weekday: "short",
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    
      const formattedTime = dateTime.toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
    
    return (
         <div className="absolute top-8 right-12 bg-white/70 backdrop-blur-md px-6 py-3 rounded-2xl shadow-lg border border-white/30 text-gray-800 text-center">
        <div className="text-lg font-semibold tracking-wider">
          {formattedDate}
        </div>
        <div className="text-3xl font-bold text-indigo-700 mt-1 animate-pulse">
          {formattedTime}
        </div>
      </div>
    );
}