import React, { useState } from "react";

const AppointmentPage = () => {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [patientName, setPatientName] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const timeSlots = [
    "09:00 AM",
    "10:00 AM",
    "11:00 AM",
    "12:00 PM",
    "01:00 PM",
    "02:00 PM",
    "03:00 PM",
    "04:00 PM",
    "05:00 PM",
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedDate && selectedTime && patientName) {
      setIsSubmitted(true);
      console.log("Appointment Booked:", {
        date: selectedDate,
        time: selectedTime,
        patientName,
      });
    } else {
      alert("Please fill out all fields.");
    }
  };

  return (
    <div className="appointment-page">
      <h1>Book Your Doctor Appointment</h1>
      <div className="appointment-form">
        {isSubmitted ? (
          <div className="confirmation-message">
            <h2>Thank you, {patientName}!</h2>
            <p>
              Your appointment has been booked for <strong>{selectedDate}</strong> at{" "}
              <strong>{selectedTime}</strong>.
            </p>
            <button onClick={() => setIsSubmitted(false)}>Book Another Appointment</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="patientName">Patient Name</label>
              <input
                type="text"
                id="patientName"
                value={patientName}
                onChange={(e) => setPatientName(e.target.value)}
                placeholder="Enter your name"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="appointmentDate">Select Date</label>
              <input
                type="date"
                id="appointmentDate"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="appointmentTime">Select Time Slot</label>
              <select
                id="appointmentTime"
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                required
              >
                <option value="" disabled>
                  Choose a time
                </option>
                {timeSlots.map((time, index) => (
                  <option key={index} value={time}>
                    {time}
                  </option>
                ))}
              </select>
            </div>

            <button type="submit" className="submit-button">
              Book Appointment
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default AppointmentPage;