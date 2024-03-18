import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import TenantHome from "./pages/TenantHome";
import AdminDashboard from "./pages/AdminDashboard";
import BrokerHome from "./pages/BrokerHome";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Profile from "./pages/Profile";
import About from "./pages/About";
import Header from "./components/Header";
import PrivateRoute from "./components/PrivateRoute";
import CreateListing from "./pages/CreateListing";
import UpdateListing from "./pages/UpdateListing";
import Listing from "./pages/Listing";
import Search from "./pages/Search";
import ContactUs from "./components/ContactUs";
import Users from "./pages/Users";
import AdminListings from "./pages/AdminListings";
import MessagesFromContact from "./pages/MessagesFromContact";
import BrokerMessage from "./pages/BrokerMessage";
import TwakDash from "./pages/TwakDash";

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path='/search' element={<Search /> } />
        <Route path='/contact-us' element={<ContactUs /> } />
        <Route path='/messages-from-tenant' element={<BrokerMessage /> } />
        <Route path='/admin-dashboard/users' element={<Users /> } />
        <Route path='/admin-dashboard/listings' element={<AdminListings /> } />
        <Route path='/admin-dashboard/messages-from-contact' element={<MessagesFromContact /> } />
        <Route path='/admin-dashboard/twak-dash' element={<TwakDash /> } />
        <Route path="/listing/:listingId" element={<Listing />} />

        <Route element={<PrivateRoute />}>
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/tenant-home" element={<TenantHome />} />
        <Route path="/broker-home" element={<BrokerHome />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/create-listing" element={<CreateListing />} />
        <Route path="/update-listing/:listingId" element={<UpdateListing />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
