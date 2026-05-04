import ReactDOM from 'react-dom/client'
import Dashboard from "./Dashboard"
import PassChange from "./PassChange"
import "./index.css"
import App from './App.tsx'
import { Toaster } from 'react-hot-toast'

import { BrowserRouter, Routes, Route } from "react-router-dom";

ReactDOM.createRoot(document.getElementById('root')!).render(
  <>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/password_change" element={<PassChange />} />
      </Routes>
    </BrowserRouter>
    <Toaster position="top-right" />
  </>
);
