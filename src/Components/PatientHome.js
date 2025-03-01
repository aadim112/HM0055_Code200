import { useState, useEffect} from 'react';
import '../App.css'
import '../Styles/PatientHome.css'

import { useLocation } from 'react-router-dom'
import db from '../firebase';
import { get,ref, update } from 'firebase/database';
import Notification from './Notification';
const PatientHome = () => {
    const location = useLocation();
    const [showToast, setShowToast] = useState(false);
    const [currentDateTime, setCurrentDateTime] = useState(new Date());
    const [appoint,setAppoint] = useState(false);
    const [processing,setProcessing] = useState(false);
    const [notificationMessage,setNotificationMessage] = useState('');

    //files for
    const [note, setNote] = useState("");
    const [file, setFile] = useState(null);
    const [treatmentOn, setTreatmentOn] = useState("");

    const patientemail = location.state?.email;
    const doctorname = location.state?.doctorname;
    const doctorID = location.state?.doctorID;
    const [patient,setPatientDetail] = useState({});
    const [userType,setUserType] = useState(true);//true for doctor and false for patient
    const [appointments, setAppointments] = useState([]);
    const [appointmentToDisplay,setAppointmentsToDisplay] = useState({});



    useEffect(() => {
        // Update time every second
        const timer = setInterval(() => {
            setCurrentDateTime(new Date());
        }, 1000);

        return () => clearInterval(timer); // Cleanup interval on unmount
    }, []);

    useEffect(() => {
        if (!patient?.MyAppointments) return; // Prevent errors if patient has no appointments

        const fetchAppointments = async () => {
            let fetchedAppointments = [];

            for (let value of patient.MyAppointments) {
                const appointmentRef = ref(db, `Appointment/${value}`);
                const snapshot = await get(appointmentRef);

                if (snapshot.exists()) {
                    fetchedAppointments.push({ id: value, ...snapshot.val() });
                }
            }

            setAppointments(fetchedAppointments); // Update state with fetched appointments
        };
        fetchAppointments();
    }, [patient,patient?.MyAppointments]);


    useEffect(()=>{
        fetchPatientByEmail(patientemail);
        },[patientemail])
        
        useEffect(() => {
            const storedUserType = localStorage.getItem('userType'); // Retrieve from localStorage
            
            if (storedUserType === 'doctor') {
                setUserType(true);
            } else {
                setUserType(false);
            }
        }, []);


    const AddPatientToDoctor = async () => {
        const doctorRef = ref(db,`doctor/${doctorID}/MyPatients`);
        
        const snapshot = await get(doctorRef);
        let existingpatients = [];
         if(snapshot.exists()){
            existingpatients= snapshot.val();
         }
         const patientID = patient.patientid;
         const updatedPatients = [...existingpatients,patientID];

         await update(ref(db,`doctor/${doctorID}`),{
            MyPatients : updatedPatients,
         });
        console.log('Patient Added!');
        setNotificationMessage('Patient Added!')
        setShowToast(true);
        setTimeout(() => {setShowToast(false);}, 3000);
    }

    const fetchPatientByEmail = async (email) => {
        try {
            const patientsRef = ref(db, 'patient/'); // Update the reference to 'patients' node
            const snapshot = await get(patientsRef);
    
            if (snapshot.exists()) {
                const patientsData = snapshot.val();
    
                // Find patient by email
                const patientId = Object.keys(patientsData).find(id => patientsData[id].email === email);
    
                if (patientId) {
                    console.log("Patient Details:", patientsData[patientId]);
                    setPatientDetail({ patientId, ...patientsData[patientId] });
                    return { patientId, ...patientsData[patientId] }; // Return patient details
                } else {
                    console.log("Patient not found!");
                    return null;
                }
            } else {
                console.log("No patient records found.");
                return null;
            }
        } catch (error) {
            console.error("Error fetching patient details:", error);
            return null;
        }
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file) return alert("Please upload a report!");
    
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "unsigned_upload"); // Replace with your Cloudinary preset
        setProcessing(true);
        try {
            // Upload file to Cloudinary
            const response = await fetch(
                `https://api.cloudinary.com/v1_1/duhqwj0o6/raw/upload`, // Replace with your Cloudinary cloud name
                {
                    method: "POST",
                    body: formData,
                }
            );
    
            const data = await response.json();
            if (data.secure_url) {
                // Save data to Firebase
                const appointmentID = `Appointment_${Date.now()}`;
                await update(ref(db, `Appointment/${appointmentID}`), {
                    note,
                    doctorID,
                    doctorname,
                    patientID: patient.patientId, 
                    date: currentDateTime.toISOString(),
                    treatmentOn,
                    file: data.secure_url, // Cloudinary file URL
                });
    
                const patientRef = ref(db,`patient/${patient.patientid}/MyAppointments`);
                const snapshot = await get(patientRef);
                let existingAppointments = [];
                if(snapshot.exists()){
                    existingAppointments = snapshot.val();
                }
                const updatedAppointment = [...existingAppointments,appointmentID];
                await update(ref(db,`patient/${patient.patientid}`),{
                    MyAppointments : updatedAppointment,
                });
                setNotificationMessage('Appointment Added!')
                setShowToast(true);
                setTimeout(() => {setShowToast(false);}, 3000);
                setProcessing(false);
            } else {
                alert("Upload failed!");
            }
        } catch (error) {
            console.error("Upload error:", error);
            alert("Upload failed!");
        }
    };

    const showAppointment = (appointmentDetail) => {
        document.getElementById('Appointment-Display').style.display = 'flex';
        setAppointmentsToDisplay(appointmentDetail);
        console.log(appointmentDetail);
    }
    

  return (
    <>
        <div className='patient-panel'>
            <h2>Welcome {!userType && patient.firstname}</h2>
            {userType && <div className='add-patient' id='add-patient' onClick={AddPatientToDoctor}>Add Patient</div>}
            <div className='patient-container'>
                <div className='patient-info'>
                    <div style={{display:'flex',fontWeight:'bold',width:'auto',alignItems:'center',gap:'10px'}}>
                        <p>Id : {patient.patientid}</p>
                        <i class="fa-solid fa-copy fa-lg"></i>
                    </div>
                    <p>Name : {patient.firstname} {patient.lastname}</p>
                    <p>Contact : {patient.contact}</p>
                    <p>Email : {patient.email}</p>
                    <div className='diseases'>
                        <p>Disease :</p> 
                        {Array.isArray(patient.disease) && patient.disease.length > 0 ? (
                        patient.disease.map((disease, index) => (
                            <p key={index}>{disease}</p>
                        ))
                        ) : (
                            <p>No diseases recorded</p> // Fallback message if disease data is missing or empty
                        )}
                    </div>
                </div>
            </div>
            <div className='patient-app'>
                <div className='sorting-container'>
                    <div className='sorting-bar'>
                        <p>Sort appointments based on : </p>
                        <button>Disease</button>
                        <button>Doctor</button>
                    </div>
                </div>
                {!userType &&
                <>
                    <p style={{marginLeft:'30px',fontWeight:'bold',fontSize:'20px'}}>Upcomming Appointment's</p>
                    <div className='upcomming-appointments'>
                        {Array.isArray(patient.nextappointment) && patient.nextappointment.length > 0 ? (
                            <div></div>
                        ) : (
                            <p style={{marginLeft:'30px',textAlign:'center'}}>No Appointments further</p>
                        )}
                    </div>
                    </>
                }
                <p style={{marginLeft:'30px',fontWeight:'bold',fontSize:'20px'}}>Appointment</p>
                {patient.MyAppointments ?
                    <div className='appointment-container'>
                        
                        {appointments.map((value,index)=>(
                            <div className='appointments' key={index} onClick={() => showAppointment(value)}>
                                <p>Date : {value.date}</p>
                                <p>Doctor: {value.doctorname}</p>
                            </div>
                        ))}
                    </div>
                :
                    <p style={{marginLeft:'30px',textAlign:'center'}}>No Appointments to show</p>
                }
            </div>
            {userType
            &&<div className='add-appointment-containner' id='add-appointment'>
                <div className='add-app' onClick={() => setAppoint(true)}>
                    Add Appointment
                    <i class="fa-solid fa-plus fa-lg"></i>
                </div>
            </div>
            }
        </div>

        {userType && appoint && (
                <div className="appointment-form-container" id="appointmentContainer">
                    <div className="appointment-form-div">
                        <p>Add Appointment</p>
                        <div className="doctor-details">
                            <p>Doctor Detail</p>
                            <p>
                                Consulted By: {doctorname} | Doctor Id: {doctorID} | On Date:{" "}
                                {currentDateTime.toLocaleString()}
                            </p>
                        </div>
                        <form className="appointment-form" onSubmit={handleUpload}>
                            <label>Treatment On</label>
                            <select onChange={(e) => setTreatmentOn(e.target.value)}>
                                {Array.isArray(patient.disease) && patient.disease.length > 0 ? (
                                    patient.disease.map((disease, index) => (
                                        <option key={index}>{disease}</option>
                                    ))
                                ) : (
                                    <option>Other</option>
                                )}
                                <option>Other</option>
                            </select>
                            <label>Upload Reports</label>
                            <label htmlFor="reports" className="reports-label">
                                Upload here
                            </label>
                            <input type="file" id="reports" className="reports" onChange={(e) => setFile(e.target.files[0])}  />

                            <label>Note</label>
                            <input type="text" placeholder="Note" onChange={(e) => setNote(e.target.value)} />
                            <div style={{ display: "flex", gap: "10px" }}>
                                <button type="submit">{processing ? 'Adding...' : 'Add Appointment'}</button>
                                <button>Schedule Next Appointment</button>
                            </div>
                            <button type="button" onClick={() => setAppoint(false)}>
                                Close
                            </button>
                        </form>
                    </div>
                </div>
            )}
            <div className='Appointment-Display' id='Appointment-Display'>
                <div className='appointment-display-container'>
                    <button onClick={()=>{document.getElementById('Appointment-Display').style.display = 'none'}}>Close</button>
                    <div className='Detail'>
                        <span style={{fontWeight:'bold'}}>Appointment Id :</span><span> {appointmentToDisplay.id}</span>
                    </div>
                    <div className='Detail'>
                        <span style={{fontWeight:'bold'}}>Treatment On :</span><span> {appointmentToDisplay.treatmentOn}, Treated On : {appointmentToDisplay.date}</span>
                    </div>
                    <div className='Detail'>
                        <span style={{fontWeight:'bold'}}>Treatment By :</span><span> {appointmentToDisplay.doctorname}</span>
                    </div>
                    <div className='Detail'>
                        <span style={{fontWeight:'bold'}}>Note By Doctor :</span><span> {appointmentToDisplay.note}</span>
                    </div>
                    <div className='filesDisplay'>
                        <p>Reports :</p>
                        {/* <img src={appointmentToDisplay.file}></img> */}
                        <iframe src={appointmentToDisplay.file} title={appointmentToDisplay.file} width="100%" height="600px"></iframe>
                    </div>
                </div>
            </div>
        <Notification showToast={showToast} message={'Patient Added'}/>
    </>
  )
}

export default PatientHome