import { useRef, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
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
  signOutUserStart,
  signOutUserFailure,
  signOutUserSuccess,
} from '../redux/user/userSlice';

export default function Profile() {
  const fileRef = useRef(null);
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showListingError , setShowListingError] = useState(false)
  const [userListings, setUserListings] = useState([]);
  console.log(userListings);
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
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
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
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
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
  const handleSignOut = async() =>{
    try {
      dispatch(signOutUserStart())
      const res = await fetch('/api/auth/signOut')
      const data = await res.json();
      if(data.success === false){
        dispatch(signOutUserFailure(data.message));
      }
      dispatch(signOutUserSuccess(data))
    } catch (error) {
       dispatch(deleteUserFailure(error.message))
    }
  }
  const handleShowListings = async () => {
    try {
      setShowListingError(false);
      const res = await fetch(`/api/user/listings/${currentUser._id}` ,{
        credentials : 'include' ,
      });
      const data = await res.json();
      if (data.success === false) {
        setShowListingError(true);
        return;
      }

      setUserListings(data);
    } catch (error) {
      setShowListingError(true);
    }
  };
  const handleListingDelete = async (listingId) => {
    try {
      const res = await fetch(`/api/listing/delete/${listingId}`, {
        credentials :"include" ,
        method: 'DELETE',
      });
      const data = await res.json();
      if (data.success === false) {
        console.log(data.message);
        return;
      }

      setUserListings((prev) =>
        prev.filter((listing) => listing._id !== listingId)
      );
    } catch (error) {
      console.log(error.message);
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
          <Link className='p-3 text-center text-white uppercase bg-green-700 rounded-lg hover:opacity-95' to = {"/create-listing"}>Create Listing</Link>
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
          <span onClick ={handleSignOut}className='text-red-700 cursor-pointer'>
            Sign out
          </span>
        </div>
      )}
      <p className='text-red-700'>{error ? error : '' }</p>
      <p className='mt-5 text-green-700'>{updateSuccess ? 'User is updated successfully' : ''}</p>
      <button  onClick ={handleShowListings} className='w-full text-green-700'>Show Listings</button>
      <p className='mt-5 text-red-700'>
        {showListingError ? 'Error showing listings' : ''}
      </p>
      
      {userListings && userListings.length > 0 && (
        <div className='flex flex-col gap-4'>
          <h1 className='text-2xl font-semibold text-center mt-7'>
            Your Listings
          </h1>
          {userListings.map((listing) => (
            <div
              key={listing._id}
              className='flex items-center justify-between gap-4 p-3 border rounded-lg'
            >
              <Link to={`/listing/${listing._id}`}>
                <img
                  src={listing.imageUrls[0]}
                  alt='listing cover'
                  className='object-contain w-16 h-16'
                />
              </Link>
              <Link
                className='flex-1 font-semibold truncate text-slate-700 hover:underline'
                to={`/listing/${listing._id}`}
              >
                <p>{listing.name}</p>
              </Link>

              <div className='flex flex-col item-center'>
                <button
                  onClick={() => handleListingDelete(listing._id)}
                  className='text-red-700 uppercase'
                >
                  Delete
                </button>
                <Link to={`/update-listing/${listing._id}`}>
                  <button className='text-green-700 uppercase'>Edit</button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      
    </div>
  );
}
