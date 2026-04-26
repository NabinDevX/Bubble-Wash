import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import Landing from "./pages/Landing.jsx";
import AdminLayout from "./pages/Admin/Dashboard.jsx";
import DashboardHome from "./pages/Admin/DashboardHome.jsx";
import Customers from "./pages/Admin/Customers.jsx";

import Workshops from "./pages/Admin/Workshops.jsx";
import Staff from "./pages/Admin/Staff.jsx";
import ServicesRateCard from "./pages/Admin/ServicesRateCard.jsx";
import DeliverySlots from "./pages/Admin/DeliverySlots.jsx";
import Tickets from "./pages/Admin/Tickets.jsx";
import Riders from "./pages/Admin/Riders.jsx";
import ServiceAreas from "./pages/Admin/ServiceAreas.jsx";

import Reports from "./pages/Admin/Reports.jsx";
import RiderLayout from "./pages/Rider/Layout.jsx";
import RiderDashboard from "./pages/Rider/Dashboard.jsx";
import RiderPickupList from "./pages/Rider/PickupList.jsx";
import RiderDeliveryList from "./pages/Rider/DeliveryList.jsx";
import RiderRateCard from "./pages/Rider/RateCard.jsx";
import RiderSubscriptionsCoupons from "./pages/Rider/SubscriptionsCoupons.jsx";
import SignIn from "./pages/SignIn.jsx";
import SignUp from "./pages/SignUp.jsx";

// Customer pages
import CustomerLayout from "./pages/Customer/Layout.jsx";
import CustomerDashboard from "./pages/Customer/Dashboard.jsx";
import SchedulePickup from "./pages/Customer/SchedulePickup.jsx";
import CheckoutPayment from "./pages/Customer/CheckoutPayment.jsx";
import TrackOrder from "./pages/Customer/TrackOrder.jsx";
import InvoiceDetails from "./pages/Customer/InvoiceDetails.jsx";
import LoyaltyWallet from "./pages/Customer/LoyaltyWallet.jsx";
import FeedbackRating from "./pages/Customer/FeedbackRating.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<DashboardHome />} />
          <Route path="customers" element={<Customers />} />

          <Route path="workshops" element={<Workshops />} />
          <Route path="staff" element={<Staff />} />
          <Route path="services-rate-card" element={<ServicesRateCard />} />
          <Route path="delivery-slots" element={<DeliverySlots />} />
          <Route path="tickets" element={<Tickets />} />
          <Route path="riders" element={<Riders />} />
          <Route path="service-areas" element={<ServiceAreas />} />

          <Route path="reports" element={<Reports />} />
        </Route>
        <Route path="/rider" element={<RiderLayout />}>
          <Route index element={<RiderDashboard />} />
          <Route path="pickup-list" element={<RiderPickupList />} />
          <Route path="delivery-list" element={<RiderDeliveryList />} />
          <Route path="rate-card" element={<RiderRateCard />} />
          <Route
            path="subscriptions-coupons"
            element={<RiderSubscriptionsCoupons />}
          />
        </Route>
        <Route path="/customer" element={<CustomerLayout />}>
          <Route index element={<CustomerDashboard />} />
          <Route path="schedule" element={<SchedulePickup />} />
          <Route path="checkout" element={<CheckoutPayment />} />
          <Route path="track" element={<TrackOrder />} />
          <Route path="invoice" element={<InvoiceDetails />} />
          <Route path="wallet" element={<LoyaltyWallet />} />
          <Route path="feedback" element={<FeedbackRating />} />
        </Route>
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
