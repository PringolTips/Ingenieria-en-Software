import ReactDOM from 'react-dom/client'
import "./index.css"
import { UserProvider } from './context/UserContext';
import { Toaster } from 'react-hot-toast'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ForgotPassword from './pages/ForgotPassword';
import PassChange from './pages/PassChange';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <>
    <UserProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/forgot_password" element={<ForgotPassword />}/>
          <Route path="/password_change" element={<PassChange />} />
        </Routes>
      </BrowserRouter>
    </UserProvider>
    <Toaster position="top-right" />
  </>
);
