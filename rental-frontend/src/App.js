import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import LandingPage from './components/LandingPage';
import RegisterForm from './components/RegisterForm';
import LoginForm from './components/LoginForm';
import DHeader from './components/DHeader';
import Logout from './components/Logout';
import HomePage from './components/HomePage';
import AddCarPage from './components/AddCarPage';
import CarListingPage from './components/CarListingPage';
import HomePage1 from './components/HomePage1';
import CarListingPage1 from './components/CarListingPage1';
import Header from './components/Header';
import Header1 from './components/Header1';
import ContactPage from './components/ContactPage';
import AboutPage from './components/AboutPage';
import AboutPage1 from './components/AboutPage1';
import ContactPage1 from './components/ContactPage1';
import MyCartPage from './components/MyCartPage';

function RoleBasedHome() {
  const roleRaw = (typeof window !== 'undefined' && localStorage.getItem('role')) || '';
  const role = roleRaw.toLowerCase();
  console.log('Detected role:', role);
  // If on /home1, always show Header1 + HomePage1
  if (window.location.pathname === '/home1') {
    return <><Header1 /><HomePage1 /></>;
  }
  // If on /home, always show Header + HomePage
  if (window.location.pathname === '/home') {
    return <><Header /><HomePage /></>;
  }
  // Fallback: show Header1 + HomePage1
  return <><Header1 /><HomePage1 /></>;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<><DHeader /><LandingPage /></>} />
          <Route path="/register" element={<><DHeader /><RegisterForm /></>} />
          <Route path="/login" element={<><DHeader /><LoginForm /></>} />
          <Route path="/logout" element={<Logout />} />
          
          {/* Protected Admin Routes */}
          <Route 
            path="/home" 
            element={
              <ProtectedRoute requireAdmin={true}>
                <RoleBasedHome />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/add-car" 
            element={
              <ProtectedRoute requireAdmin={true}>
                <AddCarPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/car-listing" 
            element={
              <ProtectedRoute requireAdmin={true}>
                <CarListingPage />
              </ProtectedRoute>
            } 
          />
          
          {/* User Routes (accessible after any login) */}
          <Route 
            path="/home1" 
            element={
              <ProtectedRoute>
                <RoleBasedHome />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/car-listing1" 
            element={
              <ProtectedRoute>
                <CarListingPage1 />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/my-cart" 
            element={
              <ProtectedRoute>
                <MyCartPage />
              </ProtectedRoute>
            } 
          />
          
          {/* Public Routes */}
          <Route path="/about" element={<AboutPage />} />
          <Route path="/about1" element={<AboutPage1 />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/contact1" element={<ContactPage1 />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
