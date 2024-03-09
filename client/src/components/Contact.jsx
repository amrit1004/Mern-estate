import React from 'react'
import { useState ,useEffect } from 'react';
import {Link} from 'react-router-dom'
export default function Contact({listing}) {
  const  [landLord , setLandlord] = useState();
  const [message, setMessage] = useState('');
  const onChange = (e) => {
    setMessage(e.target.value);
  };
  useEffect(() => {
    const fetchLandlord = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/user/${listing.userRef}`);
        const data = await res.json();
        setLandlord(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchLandlord();
  }, [listing.userRef]);
  return (
    <>
      {landLord && (
        <div className='flex flex-col gap-2'>
          <p>
            Contact <span className='font-semibold'>{landLord.username}</span>{' '}
            for{' '}
            <span className='font-semibold'>{listing.name.toLowerCase()}</span>
          </p>
          <textarea
            name='message'
            id='message'
            rows='2'
            value={message}
            onChange={onChange}
            placeholder='Enter your message here...'
            className='w-full p-3 border rounded-lg'
          ></textarea>

          <Link
          to={`mailto:${landLord.email}?subject=Regarding ${listing.name}&body=${message}`}
          className='p-3 text-center text-white uppercase rounded-lg bg-slate-700 hover:opacity-95'
          >
            Send Message          
          </Link>
        </div>
      )}
    </>
  );
}
