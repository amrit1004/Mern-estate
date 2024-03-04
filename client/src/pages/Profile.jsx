import {useSelector} from 'react-redux'
import { useRef ,useState ,useEffect} from 'react'
import {getDownloadURL, getStorage ,  ref, uploadBytesResumable} from 'firebase/storage'
import { app } from '../firebase'
export default function Profile() {
  const fileRef = useRef(null)
  const {currentUser} = useSelector((state) => state.user)
  const [file, setFile] = useState(undefined)
  const [fileperc, setFileperc] = useState(0);
  const [fileUploadError, setFileUploadError] = useState(false)
  const [formData , setFormData]= useState([])
  useEffect(() => {
    if(file) {
      handleFileUpload();
    }
  } ,[file])
  const handleFileUpload = () => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);
  
    uploadTask.on('state_changed', (snapshot) => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
     setFileperc(Math.round(progress))
    } ,
   (error) =>{
      setFileUploadError(true);
   } ,
   ()=>{
    getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) =>{
      setFormData({...formData , avatar: downloadUrl})
    })
   }
    );
  };
  return ( 
    <div className='max-w-lg p-3 mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
      <form className='flex flex-col gap-4'>
       <input onChange={(e) =>setFile(e.target.files[0])} type = "file" ref ={fileRef} hidden accept='image/.*' />
        <img onClick={()=> fileRef.current.click()} src={formData.avatar || currentUser.avatar} alt="profile" className='self-center object-cover w-24 h-24 mt-2 rounded-full cursor-pointer' />
        <p className='self-center text-sm'>
          {fileUploadError ? (
            <span className='text-red-700'>
              Error Image upload (image must be less than 2 mb)
            </span>
          ) : fileperc > 0 && fileperc < 100 ? (
            <span className='text-slate-700'>{`Uploading ${fileperc}%`}</span>
          ) : fileperc === 100 ? (
            <span className='text-green-700'>Image successfully uploaded!</span>
          ) : (
            ''
          )}
        </p>
        <input type="text" placeholder='username' id='username' className='p-3 border rounded-lg'defaultValue={currentUser.username}/>
        <input type="email" placeholder='email' id='email' className='p-3 border rounded-lg' defaultValue={currentUser.email}/>
        <input type="text" placeholder='password' id='password' className='p-3 border rounded-lg'  />
        <button className='p-3 text-white uppercase rounded-lg bg-slate-700 hover:opacity-95 disabled:opacity-80'>update</button>

      </form>
      <div className="flex justify-between mt-5">
        <span className='text-red-700 cursor-pointer'>Delete account</span>
        <span className='text-red-700 cursor-pointer'>Sign out</span>
      </div>
    </div>
  )
}