import React from 'react';

export default function Notification() {
    
  return (
    <div className="notification-bar">
            <button onClick={onClose}>Close</button>
            <ul>
                {notifications.map((notification, index) => (
                    <li key={index}>
                        New message from {notification.email}: {notification.subject}
                    </li>
                ))}
            </ul>
        </div>
    );
};

