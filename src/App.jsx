import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "./assets/vite.svg";
import heroImg from "./assets/hero.png";
import "./index.css";
import {Routes, Route} from "react-router-dom";
import Products from "./Products.jsx";
import Cashier from "./Cashier.jsx";
import Invoices from "./Invoices.jsx";
import Dashboard from "./Dashboard.jsx";
import Login from "./Login.jsx";
import PrivateRoute from "./PrivateRoute.jsx";

function App() {
  return (<>
    <Routes>
      <Route path="/products" element={<PrivateRoute><Products /></PrivateRoute>} />
      <Route path="/cashier" element={<PrivateRoute><Cashier /></PrivateRoute>} />
      <Route path="/invoices" element={<PrivateRoute><Invoices /></PrivateRoute>} />
      <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      <Route path="/" element={<Login />} />
    </Routes>
  </>);
}

export default App;
