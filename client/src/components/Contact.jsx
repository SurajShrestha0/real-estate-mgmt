import { useEffect, useState } from 'react';

export default function Contact({ listing }) {
  const [broker, setBroker] = useState(null);
  const [message, setMessage] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [appointmentMessage, setAppointmentMessage] = useState('');

  const onChangeMessage = (e) => {
    setMessage(e.target.value);
  };

  const onChangeDate = (date) => {
    setSelectedDate(date);
  };

  const onChangeAppointmentMessage = (e) => {
    setAppointmentMessage(e.target.value);
  };

  useEffect(() => {
    const fetchBroker = async () => {
      try {
        const res = await fetch(`/api/user/${listing.userRef}`);
        const data = await res.json();
        setBroker(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchBroker();
  }, [listing.userRef]);

  const openGmailCompose = () => {
    const email = encodeURIComponent(broker.email);
    const subject = encodeURIComponent(`Appointment Request for ${listing.name}`);
    const body = encodeURIComponent(
      `Hello ${broker.username},%0D%0A%0D%0AI am interested in scheduling an appointment with you to discuss the property ${listing.name}.%0D%0A%0D%0AProposed Date: ${selectedDate}%0D%0A%0D%0AMessage: ${appointmentMessage}`
    );
    const gmailUrl = `https://mail.google.com/mail/u/0/?view=cm&fs=1&to=${email}&su=${subject}&body=${body}`;
    window.open(gmailUrl);
  };

  return (
    <>
      {broker && (
        <div className='flex flex-col gap-4'>
          <p>
            Contact <span className='font-semibold'>{broker.username}</span> for{' '}
            <span className='font-semibold'>{listing.name.toLowerCase()}</span>
          </p>
          <textarea
            name='message'
            id='message'
            rows='4'
            value={message}
            onChange={onChangeMessage}
            placeholder='Enter your message here...'
            className='w-full border p-3 rounded-lg'
          ></textarea>

          <div className='flex flex-col gap-4'>
            <p>Schedule Appointment:</p>
            <input
              type='date'
              value={selectedDate}
              onChange={(e) => onChangeDate(e.target.value)}
              className='border p-3 rounded-lg'
            />
            <textarea
              name='appointmentMessage'
              id='appointmentMessage'
              rows='4'
              value={appointmentMessage}
              onChange={onChangeAppointmentMessage}
              placeholder='Enter your appointment message here...'
              className='w-full border p-3 rounded-lg'
            ></textarea>
          </div>

          <div className='flex justify-between'>
            <button
              onClick={() =>
                window.open(
                  `mailto:${broker.email}?subject=Regarding ${listing.name}&body=${message}`
                )
              }
              className='bg-slate-700 text-white text-center p-3 uppercase rounded-lg hover:opacity-95'
            >
              Send Message
            </button>

            <button
              onClick={openGmailCompose}
              className='bg-slate-700 text-white text-center p-3 uppercase rounded-lg hover:opacity-95'
            >
              Schedule Appointment
            </button>
          </div>
        </div>
      )}
    </>
  );
}
