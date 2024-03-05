import { useRef, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { app } from '../firebase';
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  clearCurrentUser,
} from '../redux/user/userSlice';

export default function Profile() {
  const fileRef = useRef(null);
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file]);

  useEffect(() => {
    // Check if user is deleted in the Redux store, then redirect
    if (error && error.includes('deleted')) {
      dispatch(clearCurrentUser()); // Clear user-related state
      navigate('/sign-in'); // Redirect to the sign-in page
    }
  }, [error, dispatch, navigate]);

  useEffect(() => {
    // Redirect to sign-in page if currentUser is null
    if (!currentUser) {
      navigate('/sign-in'); // Redirect to the sign-in page
    }
  }, [currentUser, navigate]);

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress));
      },
      (error) => {
        setFileUploadError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          setFormData({ ...formData, avatar: downloadURL })
        );
      }
    );
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`http://localhost:3000/api/user/update/${currentUser._id}`, {
        credentials: "include",
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }

      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  };

  const handleDeleteUser = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`http://localhost:3000/api/user/delete/${currentUser._id}`, {
        method: 'DELETE',
        credentials: "include"
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  return (
    <div className='max-w-lg p-3 mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
      {currentUser ? (
        <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input
        onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
        type='file'
        ref={fileRef}
       hidden
        accept='image/*'
/>
          <img
            onClick={() => fileRef.current.click()}
            src={formData.avatar || currentUser.avatar}
            alt='profile'
            className='self-center object-cover w-24 h-24 mt-2 rounded-full cursor-pointer'
          />
          <input
            type='text'
            placeholder='username'
            defaultValue={currentUser.username}
            id='username'
            className='p-3 border rounded-lg'
            onChange={handleChange}
          />
          <input
            type='email'
            placeholder='email'
            id='email'
            defaultValue={currentUser.email}
            className='p-3 border rounded-lg'
            onChange={handleChange}
          />
          <input
            type='password'
            placeholder='password'
            onChange={handleChange}
            id='password'
            className='p-3 border rounded-lg'
          />
          <button
            disabled={loading}
            className='p-3 text-white uppercase rounded-lg bg-slate-700 hover:opacity-95 disabled:opacity-80'
          >
            {loading ? 'Loading...' : 'Update'}
          </button>
        </form>
      ) : (
        <div className='text-center'>
          <p className='text-red-700'>User not found or deleted.</p>
        </div>
      )}
      {currentUser && (
        <div className='flex justify-between mt-5'>
          <span onClick={handleDeleteUser} className='text-red-700 cursor-pointer'>
            Delete account
          </span>
          <span className='text-red-700 cursor-pointer'>
            Sign out
          </span>
        </div>
      )}
      <p className='text-red-700'>{error ? error : '' }</p>
      <p className='mt-5 text-green-700'>{updateSuccess ? 'User is updated successfully' : ''}</p>
    </div>
  );
}
