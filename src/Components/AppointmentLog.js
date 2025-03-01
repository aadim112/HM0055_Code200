import { useState } from 'react';
import './AppointmentLog.css'
import { useLocation } from 'react-router-dom';
const AppointmentLog = (prop) => {
    const location = useLocation()
    const [patient,setPatient] = useState();
    if(prop){
        setPatient(prop)
    }else{
        setPatient(location.state?.patient)
    }
  return (
    <>
    <div className='patient-app'>

        <p style={{marginLeft:'30px',fontWeight:'bold',fontSize:'20px'}}>Upcomming Appointment's</p>
        <div className='upcomming-appointments'>
            {Array.isArray(patient.nextappointment) && patient.nextappointment.length > 0 ? (
                <div></div>
            ) : (
                <p style={{marginLeft:'30px',textAlign:'center'}}>No Appointments further</p>
            )}
        </div>
        <p style={{marginLeft:'30px',fontWeight:'bold',fontSize:'20px'}}>Appointment</p>
        {patient.appointment ?
            <div className='appointment-container'>
                <div className='appointments'>
                    <p>Doctor Name</p>
                    <p>Date</p>
                </div>
            </div>
        :
            <p style={{marginLeft:'30px',textAlign:'center'}}>No Appointments to show</p>
        }
        </div>
        <div className='add-appointment-containner'>
            <div className='add-app'>
                Add Appointment
                <i class="fa-solid fa-plus fa-lg"></i>
            </div>
        </div>
    </>
  )
}

export default AppointmentLog