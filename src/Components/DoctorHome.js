import '../App.css'
import '../Styles/Doctor.css'
import '../App.css'
import { useLocation, useNavigate } from 'react-router-dom';
import db from '../firebase';
import { get,ref } from 'firebase/database';
import { use, useEffect, useState } from 'react';

const DoctorHome = () => {
    const [doctorDetail,setDoctorDetail] = useState({});
    const [patientcode, setPatientCode] = useState('');
    const [doctorID,setDoctorID] = useState('');
    const [searchedPatient,setSearchedPatient] = useState({});
    const [searchmessage,setSearchedMessage] = useState('');
    const navigate = useNavigate();
    const location = useLocation();
    const doctorId = location.state?.email;

    useEffect(()=>{
        
    },[doctorDetail])
    console.log(doctorID);
    useEffect(()=>{
        fetchDoctorByEmail(doctorId);
    },[doctorId])

    const handlePatientCode = (e) => {
        setPatientCode(e.target.value);
    };

    const handleSearchedPatient = () => {
        const email = searchedPatient.email;
        console.log(email);
        const doctorname = doctorDetail.firstname;
        navigate('/PatientPanel', { state: { email, patientcode, doctorID,doctorname} });
    }
    
    const searchPatient = async () =>{ 
        if(patientcode.length === 10){
            try{
                const patient = ref(db,`patient/${parseInt(patientcode)}`);
                const snapshot = await get(patient);
                if(snapshot.exists()){
                    setSearchedPatient(snapshot.val());
                    setSearchedMessage('Success');
                    console.log(snapshot.val());
                    document.getElementById('patient-list').style.display = 'flex';
                }else{
                    setSearchedMessage('No Such Patient Found!')
                }
            }catch(error){
                console.log(error.message)
                setSearchedMessage('Having some isssue finding patient')
            }
        }
    }

    const fetchDoctorByEmail = async (email) => {
        try {
            const doctorsRef = ref(db, 'doctor/');
            const snapshot = await get(doctorsRef);
    
            if (snapshot.exists()) {
                const doctorsData = snapshot.val();
    
                // Find doctor by email
                const doctorId = Object.keys(doctorsData).find(id => doctorsData[id].email === email);
                setDoctorID(doctorId);
    
                if (doctorId) {
                    console.log("Doctor Details:", doctorsData[doctorId]);
                    setDoctorDetail({doctorId, ...doctorsData[doctorId]});
                    return { doctorId, ...doctorsData[doctorId] }; // Return doctor details
                } else {
                    console.log("Doctor not found!");
                    return null;
                }
            } else {
                console.log("No doctor records found.");
                return null;
            }
        } catch (error) {
            console.error("Error fetching doctor details:", error);
            return null;
        }
    };
    
  return (
    <>
    <h2 style={{marginLeft:'20px'}}>WELCOME !</h2>
        <div className='doctor-panel'>
            <div className='doctor-profile'>
                <h2>Doctor Detail</h2>
                <p>Name: {doctorDetail.firstname} {doctorDetail.lastname}</p>
                <p>Contact: {doctorDetail.contact}</p>
                <p>Email : {doctorId}</p>
                <p>specialisation : {doctorDetail.specialisation}</p>
            </div>
            <div className='doctor-tools'>
                <div className='patient-search'>
                    <p>Search Patient Using ID</p>
                    <p style={{color:'green',margin:'0px',fontSize:'12px'}}>{searchmessage}</p>
                    <div className='search-bar'>
                        <input type='number' placeholder='Search Here' name='patient-code'maxLength={10} onChange={handlePatientCode}></input>
                        <button onClick={searchPatient}>Search</button>
                    </div>
                    <div className='search-list' onClick={handleSearchedPatient} id='patient-list'>
                        {searchedPatient.firstname} {searchedPatient.lastname}
                    </div>
                    <h3>My Patient</h3>
                    <div className='recentPatinetContainer'>
                        <div className='DoctorsPatient'></div>
                    </div>
                </div>
            </div>
        </div>
    </>
  )
}

export default DoctorHome