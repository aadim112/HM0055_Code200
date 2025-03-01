import React, { useState, useEffect } from "react";
import '../Styles/AppointmentPage.css';

const AppointmentPage = () => {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [patientName, setPatientName] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [selectedDisease, setSelectedDisease] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch doctors from Firebase
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        setLoading(true);
        // Replace with your actual Firebase path
        const response = await fetch('/hospital/Doctors');
        if (!response.ok) {
          throw new Error('Failed to fetch doctors');
        }
        const data = await response.json();
        setDoctors(data);
      } catch (error) {
        console.error("Error fetching doctors from Firebase:", error);
        setDoctors([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  // List of common diseases/conditions
  const diseases = [
    "General Check-up",
    "Cardiovascular Issues",
    "Respiratory Problems",
    "Digestive Disorders",
    "Neurological Concerns",
    "Skin Conditions",
    "Joint/Bone Problems",
    "Mental Health",
    "Pediatric Care",
    "Women's Health"
  ];

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
    if (selectedDate && selectedTime && patientName && selectedDoctor && selectedDisease) {
      setIsSubmitted(true);
      
      // Find the selected doctor object using the ID
      const doctorObj = doctors.find(doctor => doctor.id === selectedDoctor);
      const doctorInfo = doctorObj ? `${doctorObj.name} (${doctorObj.specialty})` : selectedDoctor;
      
      console.log("Appointment Booked:", {
        date: selectedDate,
        time: selectedTime,
        patientName,
        doctorId: selectedDoctor,
        doctorInfo: doctorInfo,
        condition: selectedDisease
      });
    } else {
      alert("Please fill out all fields.");
    }
  };

  // Get full doctor info for display
  const getSelectedDoctorInfo = () => {
    const doctor = doctors.find(doc => doc.id === selectedDoctor);
    return doctor ? `${doctor.name} (${doctor.specialty})` : "";
  };

  return (
    <div className="appointment-page">
      <h1>Book Your Doctor Appointment</h1>
      
      <div className="appointment-form">
        {isSubmitted ? (
          <div className="confirmation-message">
            <h2>Thank you, {patientName}!</h2>
            <p>
              Your appointment with <strong>{getSelectedDoctorInfo()}</strong> for <strong>{selectedDisease}</strong> has been booked for <strong>{selectedDate}</strong> at{" "}
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
              <label htmlFor="diseaseSelect">Select Reason for Visit</label>
              <select
                id="diseaseSelect"
                value={selectedDisease}
                onChange={(e) => setSelectedDisease(e.target.value)}
                required
              >
                <option value="" disabled>
                  Choose reason for visit
                </option>
                {diseases.map((disease, index) => (
                  <option key={index} value={disease}>
                    {disease}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="doctorSelect">Select Doctor</label>
              <select
                id="doctorSelect"
                value={selectedDoctor}
                onChange={(e) => setSelectedDoctor(e.target.value)}
                
                disabled={loading}
              >
                <option value="" disabled>
                  {loading ? "Loading doctors..." : "Choose a doctor"}
                </option>
                {doctors.map((doctor) => (
                  <option key={doctor.id} value={doctor.id}>
                    {doctor.name} ({doctor.specialty})
                  </option>
                ))}
                <option>Dr Desuza</option>
              </select>
              {doctors.length === 0 && !loading && (
                <p className="error-message">Unable to load doctors. Please try again later.</p>
              )}
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