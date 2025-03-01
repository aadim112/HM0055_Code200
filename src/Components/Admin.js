import { useEffect, useState } from 'react';
import '../App.css';
import '../Styles/Admin.css';
import db from '../firebase';
import { ref, get, update } from 'firebase/database';

const Admin = () => {
    const [appointmentData, setAppointmentData] = useState(null);
    const [appointCode, setAppointCode] = useState('');
    const [medicines, setMedicines] = useState([]);
    const [selectedMedicine, setSelectedMedicine] = useState('');
    const [quantity, setQuantity] = useState('');
    const [addedMedicines, setAddedMedicines] = useState([]);

    useEffect(() => {
        fetchMedicines();
    }, []);

    const fetchMedicines = async () => {
        try {
            const medicineRef = ref(db, 'medicine/');
            const snapshot = await get(medicineRef);
            if (snapshot.exists()) {
                setMedicines(Object.keys(snapshot.val()));
            }
        } catch (error) {
            console.error("Error fetching medicines:", error);
        }
    };

    const handleChange = (e) => {
        setAppointCode(e.target.value);
    };

    const fetchAppointment = async () => {
        if (appointCode.length > 1) {
            try {
                const appointmentRef = ref(db, `Appointment/${appointCode}`);
                const snapshot = await get(appointmentRef);
                if (snapshot.exists()) {
                    setAppointmentData(snapshot.val());
                    setAddedMedicines(snapshot.val().medicines ? Object.values(snapshot.val().medicines) : []);
                } else {
                    setAppointmentData(null);
                    setAddedMedicines([]);
                    alert("Appointment not found!");
                }
            } catch (error) {
                console.error("Error fetching appointment:", error);
                alert("Error fetching appointment data");
            }
        } else {
            alert("Please enter a valid appointment code");
        }
    };

    const handleAddMedicine = async () => {
        if (!appointmentData) {
            alert("Please fetch appointment details first");
            return;
        }
        
        if (!selectedMedicine || !quantity) {
            alert("Please select a medicine and enter quantity.");
            return;
        }
        
        try {
            const medicineRef = ref(db, `medicine/${selectedMedicine}`);
            const snapshot = await get(medicineRef);
            if (snapshot.exists()) {
                const medicineData = snapshot.val();
                if (medicineData.quantity >= quantity) {
                    setAddedMedicines([...addedMedicines, {
                        name: selectedMedicine,
                        quantity,
                        batchNumber: medicineData.batchNumber,
                        brand: medicineData.brand,
                        expiryDate: medicineData.expiryDate,
                        sellPrice: medicineData.sellPrice
                    }]);
                    
                    // Reset selection after adding
                    setSelectedMedicine('');
                    setQuantity('');
                } else {
                    alert("Insufficient stock!");
                }
            }
        } catch (error) {
            console.error("Error fetching medicine data:", error);
        }
    };

    const handleDeleteMedicine = (index) => {
        const updatedMedicines = [...addedMedicines];
        updatedMedicines.splice(index, 1);
        setAddedMedicines(updatedMedicines);
    };

    const handleConfirmUpload = async () => {
        if (addedMedicines.length === 0) {
            alert("No medicines to upload.");
            return;
        }
        try {
            for (const med of addedMedicines) {
                const medicineRef = ref(db, `medicine/${med.name}`);
                const medicineSnapshot = await get(medicineRef);
                if (medicineSnapshot.exists()) {
                    const medicineData = medicineSnapshot.val();
                    await update(medicineRef, { quantity: medicineData.quantity - med.quantity });
                }
                const appointmentMedRef = ref(db, `Appointment/${appointCode}/medicines/${med.name}`);
                await update(appointmentMedRef, med);
            }
            alert("Medicines updated successfully!");
        } catch (error) {
            console.error("Error updating medicine data:", error);
        }
    };

    return (
        <>
            <div className="admin">
            <h2 style={{color: '#0ea5e9', fontSize: '1.75rem',marginLeft:'20px',paddingTop:'20px'}}>Issue Medicine</h2>
                <div className="medical-patient-search">
                    <p>Appointment Number</p>
                    <input
                        type="text"
                        placeholder="Appointment Number"
                        value={appointCode}
                        onChange={handleChange}
                    />
                    <button onClick={fetchAppointment}>Fetch</button>
                </div>
                {appointmentData && (
                    <div className="medical-data">
                        <h3>Appointment Details</h3>
                        <p><strong>Doctor ID:</strong> {appointmentData.doctorID}</p>
                        <p><strong>Patient ID:</strong> {appointmentData.patientID}</p>
                        <p><strong>Date:</strong> {appointmentData.date}</p>
                    </div>
                )}
                <div className='Add-medicine'>
                    <h3>Add Medicine to Appointment</h3>
                    <select 
                        value={selectedMedicine}
                        onChange={(e) => setSelectedMedicine(e.target.value)}
                        disabled={!appointmentData}
                    >
                        <option value="">Select Medicine</option>
                        {medicines.map((med) => (
                            <option key={med} value={med}>{med}</option>
                        ))}
                    </select>
                    <input
                        type="number"
                        placeholder="Quantity"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        disabled={!appointmentData}
                    />
                    <button 
                        onClick={handleAddMedicine} 
                        disabled={!appointmentData}
                    >
                        Add
                    </button>
                </div>
                <div className='added-medicine'>
                    <h3>Added Medicines</h3>
                    <div className='entries'>
                        <p>Medicine Name</p>
                        <p>Batch Number</p>
                        <p>Brand</p>
                        <p>Expiry Date</p>
                        <p>Sell Price</p>
                        <p>Actions</p>
                    </div>
                    {addedMedicines.map((med, index) => (
                        <div key={index} className='entries'>
                            <p>{med.name}</p>
                            <p>{med.batchNumber}</p>
                            <p>{med.brand}</p>
                            <p>{med.expiryDate}</p>
                            <p>{med.sellPrice}</p>
                            <p>
                                <button 
                                    onClick={() => handleDeleteMedicine(index)}
                                    className="delete-btn"
                                >
                                    Delete
                                </button>
                            </p>
                        </div>
                    ))}
                    {addedMedicines.length > 0 && 
                        <button 
                            onClick={handleConfirmUpload}
                            className="confirm-upload-btn"
                        >
                            Confirm Upload
                        </button>
                    }
                </div>
            </div>
        </>
    );
};

export default Admin;