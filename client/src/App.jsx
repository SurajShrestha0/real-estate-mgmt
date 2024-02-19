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

export default function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />

        <Route element={<PrivateRoute />}>
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/tenant-home" element={<TenantHome />} />
        <Route path="/broker-home" element={<BrokerHome />} />
        <Route path="/profile" element={<Profile />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
