import { useState } from 'react';
import '../App.css'
import '../Styles/Account.css'
import { set, ref, get, update } from 'firebase/database';
import db from '../firebase';
import { auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, setDoc, doc } from '../firebase';
import { Navigate, useNavigate } from 'react-router-dom';
const Account = () => {
    const navigate = useNavigate();
    const [login, setLogin] = useState(true);
    const [patlogin, setPatLogin] = useState(true);
    const [diseaselist, setDiseaseList] = useState([]);
    const [processing, setProcessing] = useState(false);
    const [warning, setWarning] = useState('');
    const [formData, setFormData] = useState({
        email: '',
        contact: '',
        password: '',
        firstname: '',
        lastname: '',
        confirmPassword: '',
        specialisation: '',
        degree: '',
        hospitalId: '', // Added hospital ID field
    });

    const setAccount = (e) => {
        e.preventDefault();
        setPatLogin(!patlogin);
    }

    const addDisease = (e) => {
        e.preventDefault();
        const d = document.getElementById('disease').value.trim(); // Trim whitespace
        if (!d) return; // Prevent adding empty values
    
        setDiseaseList(prevList => {
            if (prevList.includes(d)) {
                alert("This disease is already added!"); // Show alert if duplicate
                return prevList; // Return the same list without adding
            }
            return [...prevList, d]; // Add disease if it's unique
        });
    
        document.getElementById('disease').value = ''; // Clear input after adding
    };
    
    const handleaccount = (e) => {
        e.preventDefault();
        setLogin(!login);
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Function to generate a 10-digit unique ID
    const generateUniqueId = () => {
        return Math.floor(1000000000 + Math.random() * 9000000000).toString();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const userType = patlogin ? "doctor" : "patient"; 
        if (login) {
            setProcessing(true);
            // Sign In
            try {
                await signInWithEmailAndPassword(auth, formData.email, formData.password);
                const email = formData.email;

                //creating sessions
                localStorage.setItem("userEmail", email);
                localStorage.setItem("userType", userType);
                console.log("local: ", localStorage.getItem('userType'))
                if(patlogin){
                    navigate('/DoctorPanel', { state: { email } });
                    alert("Login Doctor Successful!");
                    setProcessing(false);
                }else{
                    navigate('/PatientPanel', { state: { email } });
                    alert("Login patient Successful!");
                    setProcessing(false);
                }
            } catch (error) {
                setWarning(error.message);
                setProcessing(false);
            }
        } else {
            setProcessing(true);
            // Sign Up
            if (formData.password !== formData.confirmPassword) {
                setWarning("Passwords do not match!");
                setProcessing(false);
                return;
            }
            try {
                // Register user in Firebase Authentication
                const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
                const userId = userCredential.user.uid; // Firebase Auth User ID
                
                if(patlogin){
                    // Validate hospitalId for doctor registration
                    if (!formData.hospitalId || formData.hospitalId.trim() === '') {
                        setWarning("Hospital ID is required for doctor registration");
                        setProcessing(false);
                        return;
                    }
                    
                    // Generate a 10-digit unique doctor ID
                    const doctorId = generateUniqueId();
                    const fileName = `${doctorId}.json`;

                    const doctor = {
                        firstname: formData.firstname,
                        lastname: formData.lastname,
                        email: formData.email,
                        contact: formData.contact,
                        specialisation: formData.specialisation,
                        fileName: fileName,
                        doctorid: doctorId,
                        hospitalId: formData.hospitalId, // Save hospital ID with doctor data
                        RecentPatients: [],
                        Ratting: [0,0],
                    }

                    // Save doctor data
                    await set(ref(db, `doctor/${doctorId}`), doctor);
                    
                    // Add doctor to hospital's doctors list as array element
                    // First, check if the Hospital/hospitalId/Doctor path exists
                    const hospitalRef = ref(db, `Hospital/${formData.hospitalId}`);
                    const hospitalSnapshot = await get(hospitalRef);
                    
                    if (hospitalSnapshot.exists()) {
                        // Get the existing Hospital data
                        const hospitalData = hospitalSnapshot.val();
                        
                        // Check if Doctor array already exists
                        if (hospitalData.Doctor && Array.isArray(hospitalData.Doctor)) {
                            // Add the new doctor ID to the existing array
                            const updatedDoctors = [...hospitalData.Doctor, doctorId];
                            await update(hospitalRef, { Doctor: updatedDoctors });
                        } else {
                            // Create new Doctor array with the doctor ID
                            await update(hospitalRef, { Doctor: [doctorId] });
                        }
                    } else {
                        // If hospital doesn't exist, create it with the Doctor array
                        await set(hospitalRef, {
                            Doctor: [doctorId],
                            // You can add other hospital fields here if needed
                        });
                    }
                    
                    const email = doctor.email;

                    //creating sessions
                    localStorage.setItem("userEmail", email);
                    localStorage.setItem("userType", 'doctor');
                    navigate('/DoctorPanel', { state: { email } });
                    setProcessing(false);
                } else {
                    const patientid = generateUniqueId();
                    const patient = {
                        firstname: formData.firstname,
                        lastname: formData.lastname,
                        email: formData.email,
                        contact: formData.contact,
                        disease: diseaselist,
                        appointments: [],
                        InsuranceInfo: {},
                        DoctorsAppointed: [],
                        patientid: patientid,
                        NextAppointment: [],
                    }
                    await set(ref(db, `patient/${patientid}`), patient);
                    const patientemail = patient.email;

                    //creating sessions
                    localStorage.setItem("userEmail", patientemail);
                    localStorage.setItem("userType", 'patient');
                    navigate('/Account');
                    setProcessing(false);
                }

            } catch (error) {
                setWarning(error.message);
                setProcessing(false);
            }
        }
    };

  return (
    <>
        <div className='account-container'>
            <div className='chose-type'>
                <h2>{patlogin ? 'Doctor Account' : 'Patient Account'}</h2>
                <a href='#' onClick={setAccount}>{patlogin ? 'Shift to Patient' : 'Shift to Doctor'}</a>
            </div>
            {patlogin ? 
            <div className='account-div'>
                {login ? 
                    <div className='login-div' id='login-div'>
                        <h3>Doctor Login</h3>
                        <form className='login-form' onSubmit={handleSubmit}>
                            <label>Email</label>
                            <input type='email' name='email' placeholder='Email' onChange={handleChange}/>
                            <label>Password</label>
                            <input type='password' name='password' placeholder='Password' onChange={handleChange}/>
                            <button type='submit'>{processing ? 'Logining...':'Login'}</button>
                        </form>
                        <span>Don't have an account? <a href='#' onClick={handleaccount}>Register</a></span>
                    </div> 
                : 
                    <div className='register-div' id='register-div'>
                        <form className='register-form' onSubmit={handleSubmit}>
                            <h3>Doctor Register</h3>
                            <p>{warning}</p>
                            <div className='special-register-container'>

                                <div className='input-container'>
                                    <label>First Name*</label>
                                    <input type='text' placeholder='First Name' name='firstname' onChange={handleChange}  required/>
                                </div>

                                <div className='input-container'>
                                    <label>Last Name*</label>
                                    <input type='text' placeholder='Last Name' name='lastname' onChange={handleChange}  required/>
                                </div>

                                <div className='input-container'>
                                    <label>Email*</label>
                                    <input type='email' placeholder='Email' name='email' onChange={handleChange}  required/>
                                </div>

                                <div className='input-container'>
                                    <label>Phone No*</label>
                                    <input type='number' placeholder='Phone No' name='contact' onChange={handleChange}  required/>
                                </div>

                                <div className='input-container'>
                                    <label>Password*</label>
                                    <input type='text' placeholder='Password' name='password' onChange={handleChange}  required/>
                                </div>

                                <div className='input-container'>
                                    <label>Confirm Password*</label>
                                    <input type='text' placeholder='Confirm Password' name='confirmPassword' onChange={handleChange}  required/>
                                </div>

                                <div className='input-container'>
                                    <label>Hospital ID*</label>
                                    <input type='text' placeholder='Hospital ID' name='hospitalId' onChange={handleChange} required/>
                                </div>

                                <div className='input-container'>
                                    <label>Specialiesd In*</label>
                                    <select name='specialisation' onChange={handleChange} >
                                        <option>Cancer</option>
                                        <option>Dental</option>
                                    </select>
                                </div>
                                <div className='input-container'>
                                    <label>Medical Degree Certificate</label>
                                    <input type='file' id='file-upload' className='file-upload' name='degree'  required></input>
                                    <label htmlFor='file-upload' className='label-file'>Click here to add degree here</label>
                                </div>
                            </div>
                            <button type='submit' id='rsubmit'>{processing ? 'Registering...':'Register'}</button>
                        </form>
                        <span>Already have an account? <a href='#' onClick={handleaccount}>Login</a></span>
                    </div>
                }
            </div>
            : 
            <div className='account-div'>
                {login ? 
                    <div className='login-div' id='login-div'>
                        <h3>Patient login</h3>
                        <form className='login-form' onSubmit={handleSubmit}>
                            <label>Email</label>
                            <input type='email' name='email' placeholder='Email' onChange={handleChange}/>
                            <label>Password</label>
                            <input type='password' name='password' placeholder='Password' onChange={handleChange}/>
                            <button type='submit'>{processing ? 'Logining...':'Login'}</button>
                        </form>
                        <span>Don't have an account? <a href='#' onClick={handleaccount}>Register</a></span>
                    </div>
                :
                <div className='register-div' id='register-div'>
                    <form className='register-form' onSubmit={handleSubmit}>
                        <h3>Patient Register</h3>
                        <p>{warning}</p>
                        <div className='special-register-container'>

                            <div className='input-container'>
                                <label>First Name*</label>
                                <input type='text' placeholder='First Name' name='firstname' onChange={handleChange}  required/>
                            </div>

                            <div className='input-container'>
                                <label>Last Name*</label>
                                <input type='text' placeholder='Last Name' name='lastname' onChange={handleChange}  required/>
                            </div>

                            <div className='input-container'>
                                <label>Email*</label>
                                <input type='email' placeholder='Email' name='email' onChange={handleChange}  required/>
                            </div>

                            <div className='input-container'>
                                <label>Phone No*</label>
                                <input type='number' placeholder='Phone No' name='contact' onChange={handleChange}  required/>
                            </div>

                            <div className='input-container'>
                                <label>Password*</label>
                                <input type='text' placeholder='Password' name='password' onChange={handleChange}  required/>
                            </div>

                            <div className='input-container'>
                                <label>Confirm Password*</label>
                                <input type='text' placeholder='Confirm Password' name='confirmPassword' onChange={handleChange}  required/>
                            </div>

                            <div className='input-container'>
                                <label>Disease</label>
                                <div className='add-disease'>
                                    <select name='specialisation' id='disease'>
                                    <option>Cancer</option>
                                    <option>Diabetes</option>
                                    <option>Heart Disease</option>
                                    <option>Stroke</option>
                                    <option>Alzheimer's Disease</option>
                                    <option>Parkinson's Disease</option>
                                    <option>Asthma</option>
                                    <option>Arthritis</option>
                                    <option>Hypertension</option>
                                    <option>Obesity</option>
                                    <option>Tuberculosis</option>
                                    <option>HIV/AIDS</option>
                                    <option>COVID-19</option>
                                    <option>Influenza</option>
                                    <option>Pneumonia</option>
                                    <option>Hepatitis</option>
                                    <option>Kidney Disease</option>
                                    <option>Liver Disease</option>
                                    <option>Epilepsy</option>
                                    <option>Multiple Sclerosis</option>
                                    <option>Sickle Cell Disease</option>
                                    <option>Cystic Fibrosis</option>
                                    <option>Dengue</option>
                                    <option>Malaria</option>
                                    <option>Cholera</option>
                                    <option>Typhoid</option>
                                    <option>Leprosy</option>
                                    <option>Lupus</option>
                                    <option>Psoriasis</option>
                                    <option>Gout</option>
                                    <option>Endometriosis</option>
                                    <option>Osteoporosis</option>
                                    <option>Migraine</option>
                                    <option>Depression</option>
                                    <option>Anxiety Disorder</option>
                                    <option>Schizophrenia</option>
                                    <option>Bipolar Disorder</option>
                                    <option>Autism Spectrum Disorder</option>
                                    <option>ADHD</option>
                                    <option>Glaucoma</option>
                                    <option>Cataracts</option>
                                    <option>Conjunctivitis</option>
                                    <option>Measles</option>
                                    <option>Mumps</option>
                                    <option>Rubella</option>
                                    <option>Tetanus</option>
                                    <option>Polio</option>
                                    <option>Rabies</option>
                                    <option>Yellow Fever</option>
                                    <option>Zika Virus</option>
                                    <option>Ebola</option>
                                    <option>Leishmaniasis</option>
                                    <option>Histoplasmosis</option>
                                    <option>Lyme Disease</option>
                                    <option>Syphilis</option>
                                    <option>Gonorrhea</option>
                                    <option>Chlamydia</option>
                                    <option>Ulcerative Colitis</option>
                                    <option>Crohn's Disease</option>
                                    <option>Celiac Disease</option>
                                    <option>Hemophilia</option>
                                    <option>Thalassemia</option>
                                    <option>Huntington's Disease</option>
                                    <option>Duchenne Muscular Dystrophy</option>
                                    <option>Marfan Syndrome</option>
                                    <option>Rheumatic Fever</option>
                                    <option>Whooping Cough</option>
                                    <option>Scarlet Fever</option>
                                    <option>Hansen's Disease</option>
                                    </select>
                                    <button onClick={addDisease}>Add</button>
                                </div>
                            </div>
                    </div>
                    {diseaselist.length > 0 && 
                            <div className='disease-list'>
                                {diseaselist.map((disease,index)=>(
                                    <div key={index}>{disease}</div>
                                ))}
                            </div>
                            }
                    <button type='submit' id='rsubmit'>{processing ? 'Registering...':'Register'}</button>
                </form>
                <span>Already have an account? <a href='#' onClick={handleaccount}>Login</a></span>
            </div>
            }
            </div>
            }
        </div>
    </>
  )
}

export default Account