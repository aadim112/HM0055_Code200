import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ref, get, onValue } from "firebase/database";
import db, { auth } from "../firebase";
import "../Styles/institution.css";

const Institute = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get hospital code from location state
  const hospitalCode = location.state?.foundHospitalCode;
  
  const [hospitalData, setHospitalData] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Redirect if no hospital code is found
    if (!hospitalCode) {
      navigate("/");
      return;
    }

    const fetchHospitalData = async () => {
      try {
        // Get hospital data
        const hospitalRef = ref(db, `Hospital/${hospitalCode}`);
        onValue(hospitalRef, (snapshot) => {
          if (snapshot.exists()) {
            setHospitalData(snapshot.val());
          } else {
            setError("Hospital not found");
            navigate("/");
          }
        });

        // Get doctors associated with this hospital
        const hospitalDoctorsRef = ref(db, `Hospital/${hospitalCode}/Doctors`);
        onValue(hospitalDoctorsRef, async (snapshot) => {
          if (snapshot.exists()) {
            const doctorIds = snapshot.val();
            const doctorPromises = Object.values(doctorIds).map(async (doctorId) => {
              const doctorRef = ref(db, `doctor/${doctorId}`);
              const doctorSnapshot = await get(doctorRef);
              if (doctorSnapshot.exists()) {
                return { id: doctorId, ...doctorSnapshot.val() };
              }
              return null;
            });

            const doctorsList = await Promise.all(doctorPromises);
            setDoctors(doctorsList.filter(doctor => doctor !== null));
          }
          setLoading(false);
        }, {
          onError: (error) => {
            console.error("Error fetching doctors:", error);
            setLoading(false);
            // If no doctors are found, just continue with empty array
          }
        });
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Error fetching data");
        setLoading(false);
      }
    };

    fetchHospitalData();

    // Check authentication
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        navigate("/");
      }
    });

    return () => unsubscribe();
  }, [hospitalCode, navigate]);

  const handleLogout = () => {
    auth.signOut();
    navigate("/");
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading hospital information...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <p>{error}</p>
        <button onClick={() => navigate("/")}>Go Back</button>
      </div>
    );
  }

  return (
    <div className="institution-container">
      <header className="institution-header">
        <div className="institution-header-content">
          <h1>{hospitalData?.hospitalName}</h1>
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      <div className="institution-content">
        <div className="institution-info-card">
          <h2>Hospital Information</h2>
          <div className="institution-details">
            <div className="detail-item">
              <span className="detail-label">Hospital Code:</span>
              <span className="detail-value">{hospitalCode}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Phone:</span>
              <span className="detail-value">{hospitalData?.phone}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Email:</span>
              <span className="detail-value">{hospitalData?.email}</span>
            </div>
          </div>
        </div>

        <div className="doctors-section">
          <div className="doctors-header">
            <h2>Doctors</h2>
            <span className="doctor-count">{doctors.length} doctors</span>
          </div>

          {doctors.length === 0 ? (
            <div className="no-doctors-message">
              <p>No doctors are currently associated with this hospital.</p>
            </div>
          ) : (
            <div className="doctors-grid">
              {doctors.map((doctor) => (
                <div key={doctor.id} className="doctor-card">
                  <div className="doctor-avatar">
                    <span>{doctor.name?.charAt(0) || "D"}</span>
                  </div>
                  <div className="doctor-info">
                    <h3>{doctor.name}</h3>
                    <p className="doctor-specialty">{doctor.specialty || "General Practitioner"}</p>
                    <p className="doctor-details">{doctor.email}</p>
                    <p className="doctor-details">{doctor.phone}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Institute;