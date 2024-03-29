import { BrowserRouter ,Routes ,Route } from "react-router-dom"
import SignIn from "./pages/SignIn"
import Signup from "./pages/Signup"
import About from "./pages/About"
import Profile from "./pages/Profile"
import Home from "./pages/Home"
import Header from "./components/Header"
import axios from "axios"
import PrivateRoute from "./components/PrivateRoute"
import CreateListing from "./pages/CreateListing"
import UpdateListing from "./pages/UpdateListing"
import Listing from "./pages/Listing"
import Search from "./pages/Search"
function App() {
  axios.defaults.withCredentials = true;
  return (
    <>
     <BrowserRouter>
     <Header/>
     <Routes>
      <Route path = "/" element = {<Home/>} />
      <Route path = "/sign-in" element = {<SignIn/>} />
      <Route path = "/sign-up" element = {<Signup/>} />
      <Route path = "/about" element = {<About/>} />
      <Route path = "/search" element = {<Search/>} />
      <Route path='/listing/:listingId' element={<Listing />} />
      <Route element ={<PrivateRoute/>}/>
       <Route path = "/profile" element = {<Profile/>} />
       <Route path = "/create-listing" element = {<CreateListing/>} />
       <Route path = "/update-listing/:listingId" element = {<UpdateListing/>} />
     </Routes>
     </BrowserRouter>
    </>
  )
}



export default App
