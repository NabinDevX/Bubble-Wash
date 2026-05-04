import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import Landing from "./pages/Landing.jsx";
import AdminLayout from "./pages/Admin/Layout.jsx";
import Dashboard from "./pages/Admin/Dashboard.jsx";
import Customers from "./pages/Admin/Customers.jsx";

import Workshops from "./pages/Admin/Workshops.jsx";
import Staff from "./pages/Admin/Staff.jsx";
import ServicesRateCard from "./pages/Admin/ServicesRateCard.jsx";
import DeliverySlots from "./pages/Admin/DeliverySlots.jsx";
import Tickets from "./pages/Admin/Tickets.jsx";
import Riders from "./pages/Admin/Riders.jsx";
import ServiceAreas from "./pages/Admin/ServiceAreas.jsx";

import Reports from "./pages/Admin/Reports.jsx";
import PromotionsBilling from "./pages/Admin/PromotionsBilling.jsx";
import RiderLayout from "./pages/Rider/Layout.jsx";
import RiderDashboard from "./pages/Rider/Dashboard.jsx";
import RiderPickupList from "./pages/Rider/PickupList.jsx";
import RiderDeliveryList from "./pages/Rider/DeliveryList.jsx";
import SignIn from "./pages/SignIn.jsx";
import SignUp from "./pages/SignUp.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import RequireRole from "./components/RequireRole.jsx";

import CustomerLayout from "./pages/Customer/Layout.jsx";
import Profile from "./pages/Customer/Profile.jsx";
import Notifications from "./pages/Customer/Notifications.jsx";
import ReviewOrder from "./pages/Customer/ReviewOrder.jsx";
import CustomerDashboard from "./pages/Customer/Dashboard.jsx";
import AllOrders from "./pages/Customer/AllOrders.jsx";
import SchedulePickup from "./pages/Customer/SchedulePickup.jsx";
import CheckoutPayment from "./pages/Customer/CheckoutPayment.jsx";
import TrackOrder from "./pages/Customer/TrackOrder.jsx";
import InvoiceDetails from "./pages/Customer/InvoiceDetails.jsx";
import LoyaltyWallet from "./pages/Customer/LoyaltyWallet.jsx";
import SupportPage from "./pages/Customer/Support.jsx";
import FeedbackRating from "./pages/Customer/FeedbackRating.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route
          path="/admin"
          element={
            <RequireRole allow={["admin", "staff", "store_manager"]}>
              <AdminLayout />
            </RequireRole>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="customers" element={<Customers />} />

          <Route path="workshops" element={<Workshops />} />
          <Route path="staff" element={<Staff />} />
          <Route path="services-rate-card" element={<ServicesRateCard />} />
          <Route path="delivery-slots" element={<DeliverySlots />} />
          <Route path="tickets" element={<Tickets />} />
          <Route path="riders" element={<Riders />} />
          <Route path="service-areas" element={<ServiceAreas />} />

          <Route path="reports" element={<Reports />} />
          <Route path="promotions-billing" element={<PromotionsBilling />} />
        </Route>
        <Route
          path="/rider"
          element={
            <RequireRole allow={["rider"]}>
              <RiderLayout />
            </RequireRole>
          }
        >
          <Route index element={<RiderDashboard />} />
          <Route path="pickup-list" element={<RiderPickupList />} />
          <Route path="delivery-list" element={<RiderDeliveryList />} />
        </Route>
        <Route
          path="/customer"
          element={
            <RequireRole allow={["customer"]}>
              <CustomerLayout />
            </RequireRole>
          }
        >
          <Route index element={<CustomerDashboard />} />
          <Route path="profile" element={<Profile />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="schedule" element={<SchedulePickup />} />
          <Route path="/customer/review" element={<ReviewOrder />} />
          <Route path="orders" element={<AllOrders />} />
          <Route path="checkout" element={<CheckoutPayment />} />
          <Route path="track" element={<TrackOrder />} />
          <Route path="invoice" element={<InvoiceDetails />} />
          <Route path="wallet" element={<LoyaltyWallet />} />
          <Route path="feedback" element={<FeedbackRating />} />
          <Route path="support" element={<SupportPage />} />
        </Route>
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
