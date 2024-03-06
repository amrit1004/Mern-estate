import { useState } from 'react';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from 'firebase/storage';
import { app } from '../firebase';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

export default function CreateListing() {
  const { currentUser } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    imageUrls: [],
    name: '',
    description: '',
    address: '',
    type: 'rent',
    bedrooms: 1,
    bathrooms: 1,
    regularPrice: 50,
    discountPrice: 0,
    offer: false,
    parking: false,
    furnished: false,
  });
  const [imageUploadError, setImageUploadError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  console.log(formData);
  const handleImageSubmit = (e) => {
    if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
      setUploading(true);
      setImageUploadError(false);
      const promises = [];

      for (let i = 0; i < files.length; i++) {
        promises.push(storeImage(files[i]));
      }
      Promise.all(promises)
        .then((urls) => {
          setFormData({
            ...formData,
            imageUrls: formData.imageUrls.concat(urls),
          });
          setImageUploadError(false);
          setUploading(false);
        })
        .catch((err) => {
          setImageUploadError('Image upload failed (2 mb max per image)');
          setUploading(false);
        });
    } else {
      setImageUploadError('You can only upload 6 images per listing');
      setUploading(false);
    }
  };

  const storeImage = async (file) => {
    return new Promise((resolve, reject) => {
      const storage = getStorage(app);
      const fileName = new Date().getTime() + file.name;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(`Upload is ${progress}% done`);
        },
        (error) => {
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };
  
  return (
        <main className='max-w-4xl p-3 mx-auto'>
            <h1 className='text-3xl font-semibold text-center my-7'>Create a Listing</h1>
            <form className='flex flex-col gap-4 sm:flex-row'>
                <div className="flex flex-col flex-1 gap-4">
                    <input type="text"  placeholder='Name' className='p-3 border rounded-lg ' id='name' max='62' minLength= '10' required/>
                    <input type="text"  placeholder='Description' className='p-3 border rounded-lg ' id='description' required/>
                    <input type="text"  placeholder='Address' className='p-3 border rounded-lg ' id='address' required/>
                    <div className="flex flex-wrap gap-6">
                        <div className="flex gap-2">
                            <input type="checkbox" id="sale" className='w-5' />
                            <span>Sell</span>
                        </div>
                        <div className="flex gap-2">
                            <input type="checkbox" id="rent" className='w-5' />
                            <span>Rent</span>
                        </div>
                        <div className="flex gap-2">
                            <input type="checkbox" id="parking" className='w-5' />
                            <span>Parking Spot</span>
                        </div>
                        <div className="flex gap-2">
                            <input type="checkbox" id="furnished" className='w-5' />
                            <span>Furnished</span>
                        </div>
                        <div className="flex gap-2">
                            <input type="checkbox" id="offer" className='w-5' />
                            <span>Offer</span>
                        </div>
                    </div>
                    <div className="flex flex-wrap gap-6">
                    <div className="flex items-center gap-2">
                        <input type="number" className="p-3 border rounded-lg borde-gray-300"id='bedrooms' min='1' max='10' required />
                        <p>Beds</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <input type="number" className="p-3 border rounded-lg borde-gray-300"id='bathrooms' min='1' max='10' required />
                        <p>Baths</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <input type="number" className="p-3 border rounded-lg borde-gray-300"id='regularPrice' min='50' max='10000000' required />
                        <div className="flex flex-col items-center">
                        <p>Regular Price</p>
                        <span className='text-xs'>($ / Month)</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <input type="number" className="p-3 border rounded-lg borde-gray-300"id='discountPrice' min='1' max='10' required />
                        <div className="flex flex-col items-center">
                        <p>Discounted Price</p>
                        <span className='text-xs'>($ / Month)</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className='flex flex-col flex-1 gap-4'>
                <p className='font-semibold'>Images
                <span className='ml-2 font-normal text-gray-600'>The first image will be the cover (max6)</span></p>
                 <div className='flex gap-4'>
                    <input onChange={(e)=>setFiles(e.target.files)} className ="w-full p-3 border border-gray-300 rounded "type="file" id='images' accept='image/* ' multiple />
                    <button type='button' onClick={handleImageSubmit} className='p-3 text-green-700 uppercase border border-green-700 rounded hover:shadow-lg disabled:opacity-80'>Upload</button>
                 </div>
                 <p className='text-sm text-red-700'>{imageUploadError && imageUploadError }</p>
                 {   formData.imageUrls.length >0 &&
                     formData.imageUrls.map((url) =>{
                        return (
                        <div className="flex items-center justify-between p-3 border">
                            <img src={url} alt="listing image" className='object-contain w-20 h-20 rounded-lg'/>
                            <button   onClick={() => handleRemoveImage(index)} className="p-3 text-red-700 uppercase rounded-lg hover:opacity-95">Delete</button>
                        </div>
                        )
                    })
                 }
            <button className='p-3 text-white uppercase rounded-lg bg-slate-700 hover:opacity-95 disabled:opacity-80 '>Create Listing</button>
            </div>
            
            </form>
        </main>
      )
    }
  
 