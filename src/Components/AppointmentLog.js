import { useState, useEffect } from 'react';
import './AppointmentLog.css';
import { useLocation } from 'react-router-dom';

const AppointmentLog = (prop) => {
    const location = useLocation();
    const [patient, setPatient] = useState(null);

    useEffect(() => {
        if (prop) {
            setPatient(prop);
        } else {
            setPatient(location.state?.patient);
        }
    }, [prop, location.state]);

    // Function to convert a date to IST
    const convertToIST = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString('en-IN', {
            timeZone: 'Asia/Kolkata',
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        });
    };

    return (
        <>
            <div className='patient-app'>
                <p style={{ marginLeft: '30px', fontWeight: 'bold', fontSize: '20px' }}>Upcoming Appointments</p>
                <div className='upcoming-appointments'>
                    {Array.isArray(patient?.nextappointment) && patient.nextappointment.length > 0 ? (
                        patient.nextappointment.map((appointment, index) => (
                            <div key={index} className='appointment-item'>
                                <p>Doctor: {appointment.doctorName}</p>
                                <p>Date: {convertToIST(appointment.date)}</p>
                            </div>
                        ))
                    ) : (
                        <p style={{ marginLeft: '30px', textAlign: 'center' }}>No Appointments scheduled</p>
                    )}
                </div>

                <p style={{ marginLeft: '30px', fontWeight: 'bold', fontSize: '20px' }}>Past Appointments</p>
                {patient?.appointment ? (
                    <div className='appointment-container'>
                        <div className='appointments'>
                            <p>Doctor Name</p>
                            <p>Date</p>
                        </div>
                        {patient.appointment.map((appointment, index) => (
                            <div key={index} className='appointment-item'>
                                <p>{appointment.doctorName}</p>
                                <p>{convertToIST(appointment.date)}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p style={{ marginLeft: '30px', textAlign: 'center' }}>No Appointments to show</p>
                )}
            </div>

            <div className='add-appointment-container'>
                <div className='add-app'>
                    Add Appointment
                    <i className="fa-solid fa-plus fa-lg"></i>
                </div>
            </div>
        </>
    );
};

export default AppointmentLog;