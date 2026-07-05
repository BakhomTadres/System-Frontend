import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "./assets/vite.svg";
import heroImg from "./assets/hero.png";
import "./index.css";
import {Routes, Route} from "react-router-dom";
import Products from "./products";
import Cashier from "./Cashier";
import Invoices from "./Invoices";
import Dashboard from "./Dashboard";
import Login from "./Login";
import PrivateRoute from "./PrivateRoute";

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
