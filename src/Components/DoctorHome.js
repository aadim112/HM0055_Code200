import '../App.css';
import '../Styles/Doctor.css';
import { useLocation, useNavigate } from 'react-router-dom';
import db from '../firebase';
import { get, ref } from 'firebase/database';
import { useEffect, useState } from 'react';

const DoctorHome = () => {
    const [doctorDetail, setDoctorDetail] = useState({});
    const [patientCode, setPatientCode] = useState('');
    const [doctorID, setDoctorID] = useState('');
    const [searchedPatient, setSearchedPatient] = useState({});
    const [searchMessage, setSearchMessage] = useState('');
    const [myPatients, setMyPatients] = useState([]); // New state for doctor's patients
    const navigate = useNavigate();
    const location = useLocation();
    const doctorId = location.state?.email;

    useEffect(() => {
        fetchDoctorByEmail(doctorId);
    }, [doctorId]);

    // New useEffect to fetch patients when doctorID changes
    useEffect(() => {
        if (doctorID) {
            fetchDoctorPatients(doctorID);
        }
    }, [doctorID]);

    const handlePatientCode = (e) => {
        setPatientCode(e.target.value);
    };

    const handleSearchedPatient = () => {
        const email = searchedPatient.email;
        const doctorname = doctorDetail.firstname;
        navigate('/PatientPanel', { state: { email, patientCode, doctorID, doctorname } });
    };

    const searchPatient = async () => { 
        if (patientCode.length === 10) {
            try {
                const patient = ref(db, `patient/${parseInt(patientCode)}`);
                const snapshot = await get(patient);
                if (snapshot.exists()) {
                    setSearchedPatient(snapshot.val());
                    setSearchMessage('Success');
                    document.getElementById('patient-list').style.display = 'flex';
                } else {
                    setSearchMessage('No Such Patient Found!');
                }
            } catch (error) {
                console.log(error.message);
                setSearchMessage('Having some issue finding patient');
            }
        }
    };

    const fetchDoctorByEmail = async (email) => {
        try {
            const doctorsRef = ref(db, 'doctor/');
            const snapshot = await get(doctorsRef);
    
            if (snapshot.exists()) {
                const doctorsData = snapshot.val();
                const doctorId = Object.keys(doctorsData).find(id => doctorsData[id].email === email);
                setDoctorID(doctorId);
    
                if (doctorId) {
                    setDoctorDetail({ doctorId, ...doctorsData[doctorId] });
                    return { doctorId, ...doctorsData[doctorId] };
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

    // New function to fetch doctor's patients
    const fetchDoctorPatients = async (doctorId) => {
        try {
            const myPatientsRef = ref(db, `doctor/${doctorId}/MyPatients`);
            const patientsSnapshot = await get(myPatientsRef);
    
            if (patientsSnapshot.exists()) {
                console.log('yes');
                const patientIds = patientsSnapshot.val(); // This is an array
    
                console.log("Patient IDs array:", patientIds);
    
                // Loop directly through the array values
                const patientPromises = patientIds.map(async (patientId) => {
                    const patientRef = ref(db, `patient/${patientId}`);
                    console.log(`Fetching patient/${patientId}`);
                    const patientSnapshot = await get(patientRef);
    
                    if (patientSnapshot.exists()) {
                        const patientData = patientSnapshot.val();
                        console.log(patientData.firstname);
    
                        return {
                            id: patientId,
                            firstname: patientData.firstname,
                            lastname: patientData.lastname,
                            email : patientData.email
                        };
                    }
                    return null;
                });
    
                const patientsList = (await Promise.all(patientPromises)).filter(p => p !== null);
                console.log('last link',patientsList)
                setMyPatients(patientsList);
            } else {
                console.log("No patients found for this doctor.");
                setMyPatients([]);
            }
        } catch (error) {
            console.error("Error fetching doctor's patients:", error);
            setMyPatients([]);
        }
    };
    
    // Handle clicking a patient from the list
    const handlePatientClick = (email) => {
        navigate('/PatientPanel', { 
            state: { email } 
        });
    };

    return (
        <>
            <h2 style={{ marginLeft: '20px' }}>Welcome</h2>
            <div className='doctor-panel'>
                <div className='doctor-profile'>
                    <h2>Doctor Detail</h2>
                    <p>Name: {doctorDetail.firstname} {doctorDetail.lastname}</p>
                    <p>Contact: {doctorDetail.contact}</p>
                    <p>Email: {doctorId}</p>
                    <p>Specialisation: {doctorDetail.specialisation}</p>
                </div>
                <div className='doctor-tools'>
                    <div className='patient-search'>
                        <p>Search Patient</p>
                        <p style={{ color: 'red', margin: '0px', fontSize: '12px' }}>{searchMessage}</p>
                        <div className='search-bar'>
                            <input 
                                type='number' 
                                placeholder='Search Here' 
                                name='patient-code' 
                                maxLength={10} 
                                onChange={handlePatientCode}
                            />
                            <button onClick={searchPatient}>Search</button>
                        </div>
                        <div className='search-list' onClick={handleSearchedPatient} id='patient-list'>
                            {searchedPatient.firstname} {searchedPatient.lastname}
                        </div>
                        <h3>My Patients</h3>
                        <div className='recentPatientContainer'>
                            <div className='DoctorsPatient'>
                                {myPatients.length > 0 ? (
                                    myPatients.map((patient) => (
                                        <div 
                                            key={patient.id} 
                                            className='patient-item'
                                            onClick={() => handlePatientClick(patient.email)}
                                        >
                                            {patient.firstname} {patient.lastname} (ID: {patient.id})
                                        </div>
                                    ))
                                ) : (
                                    <p>No patients assigned yet.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default DoctorHome;