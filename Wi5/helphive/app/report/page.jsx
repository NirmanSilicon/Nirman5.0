"use client";

import { useState } from "react";

export default function ReportIssue() {
  const [location, setLocation] = useState({ lat: "", lng: "" });

  const getLocation = () => {
    navigator.geolocation.getCurrentPosition((pos) =>
      setLocation({
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
      })
    );
  };

  const submitForm = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    formData.append("lat", location.lat);
    formData.append("lng", location.lng);

    await fetch("/api/tickets", { method: "POST", body: formData });
    alert("Issue Submitted!");
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Report a Campus Issue</h1>

      <form onSubmit={submitForm} className="space-y-4">
        <input name="title" className="w-full border p-2" placeholder="Issue Title" required />
        <textarea name="description" className="w-full border p-2" placeholder="Describe the issue..." required />
        <input type="file" name="image" required />

        <button type="button" onClick={getLocation} className="bg-blue-600 text-white px-4 py-2 rounded">
          Get Location
        </button>

        <button className="bg-green-600 text-white px-4 py-2 w-full rounded">
          Submit
        </button>
      </form>
    </div>
  );
}
