import '../App.css';

function Notification({ showToast,message }) {
    if (!showToast) return null;

    return (
        <div className="notification-container" id="notification">
            <p>{message}</p>
        </div>
    );
}

export default Notification;
