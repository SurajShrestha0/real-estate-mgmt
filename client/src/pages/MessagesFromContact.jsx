import { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import { io } from 'socket.io-client';

export default function MessagesFromContactUs() {
    const [messages, setMessages] = useState([]);

    useEffect(() => {
        // Establish socket connection
        const socket = io('http://localhost:3000');

        // Listen for 'newMessage' event from the server
        socket.on('newMessage', (message) => {
            // Update messages state with the new message
            setMessages((prevMessages) => [...prevMessages, message]);
        });

        // Fetch messages from the server
        const fetchMessages = async () => {
            try {
                const response = await fetch('/api/contact/messages');
                if (!response.ok) {
                    throw new Error('Failed to fetch messages');
                }
                const data = await response.json();
                setMessages(data); // Update messages state with fetched messages
            } catch (error) {
                console.error('Error fetching messages:', error);
            }
        };

        fetchMessages(); // Call fetchMessages function when component mounts

        // Cleanup function to disconnect socket when component unmounts
        return () => {
            socket.disconnect();
        };
    }, []); // Empty dependency array means this effect runs only once, when component mounts

    return (
        <div className='flex gap-4'>
            <Sidebar />
            <div className='container mx-auto px-4 py-8'>
                <h2 className='text-3xl font-bold mb-4'>Messages from Contact Us</h2>
                <ul>
                    {messages.map((message, index) => (
                        <li key={index}>
                            {message.email}: {message.subject}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
