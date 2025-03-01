import { useEffect, useState } from 'react';
import '../App.css';
import db from '../firebase';
import { ref, get } from 'firebase/database';

const Admin = () => {
    const [appointmentData, setAppointmentData] = useState(null);
    const [appointCode, setAppointCode] = useState('');

    const handleChange = (e) => {
        setAppointCode(e.target.value);
    };

    const Fetch = async () => {
        if (appointCode.length > 1) {
            try {
                const appointmentRef = ref(db, `Appointment/${appointCode}`);
                const snapshot = await get(appointmentRef);
                if (snapshot.exists()) {
                    setAppointmentData(snapshot.val());
                } else {
                    setAppointmentData(null);
                }
            } catch (error) {
                console.error("Error fetching appointment:", error);
            }
        }
    };

    useEffect(() => {
        console.log(appointmentData);
    }, [appointmentData]);

    return (
        <>
            <div className="admin">
                <div className="medical-patient-search">
                    <p>Appointment Number</p>
                    <input
                        type="text"
                        placeholder="Appointment Number"
                        name="appointmentCode"
                        value={appointCode}
                        onChange={handleChange}
                    />
                    <button onClick={Fetch}>Fetch</button>
                </div>
                <div className="medical-data">
                    {appointmentData ? (
                        <div>
                            <h3>Appointment Details</h3>
                            <p><strong>Doctor ID:</strong> {appointmentData.doctorID}</p>
                            <p><strong>Patient ID:</strong> {appointmentData.patientID}</p>
                            <p><strong>Date:</strong> {appointmentData.date}</p>
                        </div>
                    ) : appointCode.length > 0 && <p>No appointment found.</p>}
                </div>
            </div>
            <div className='Add-medicine'>

            </div>
        </>
    );
};

export default Admin;
