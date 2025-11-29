import React from "react";
import { Routes, Route } from "react-router-dom";
import LayoutShell from "./layout/LayoutShell";

import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartProvider";


import HomePage from "./HomePage";
import Medicines from "./pages/Medicines";
import ProductDetails from "./pages/ProductDetails";
import DoctorConsult from "./pages/DoctorConsult";
import LabTests from "./pages/LabTests";
import PlusMembership from "./pages/PlusMembership";
import Insights from "./pages/Insights";
import Offers from "./pages/Offers";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import CartPage from "./pages/CartPage";
import Checkout from "./pages/Checkout";
import PaymentSuccess from "./pages/PaymentSuccess";
import PaymentFailure from "./pages/PaymentFailure";


const App = () => {
  return (
    <AuthProvider>
      <CartProvider>
        <Routes>
          <Route element={<LayoutShell />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/medicine" element={<Medicines />} />
            <Route path="/medicine/:id" element={<ProductDetails />} />
            <Route path="/doctor" element={<DoctorConsult />} />
            <Route path="/lab" element={<LabTests />} />
            <Route path="/plus" element={<PlusMembership />} />
            <Route path="/insights" element={<Insights />} />
            <Route path="/offers" element={<Offers />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/payment-success" element={<PaymentSuccess />} />
            <Route path="/payment-failure" element={<PaymentFailure />} />
         

          </Route>
        </Routes>
      </CartProvider>
    </AuthProvider>
  );
};

export default App;
