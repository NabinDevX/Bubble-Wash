import { useLocation, useNavigate } from "react-router-dom";

export default function ReviewOrder() {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state) return <div>No Data</div>;

  const {
    orderItems,
    pickupAddress,
    pickupSlot,
    pickupDate,
    deliveryType,
    subtotal,
  } = state;

  const deliveryCharge = deliveryType === "express" ? 49 : 0;
  const total = subtotal + deliveryCharge;

  return (
    <div className="max-w-xl mx-auto p-4 space-y-6">

      {/* TITLE */}
      <h1 className="text-3xl font-bold">Review Your Order</h1>

      {/* LOCATION */}
      <div className="bg-gray-100 p-4 rounded-xl">
        <p className="text-sm text-gray-500 mb-1">📍 LOCATION</p>
        <p>Pincode: {pickupAddress.pincode}</p>
      </div>

      {/* SERVICES */}
      <div className="bg-gray-100 p-4 rounded-xl space-y-2">
        <p className="text-sm text-gray-500 mb-2">🧺 SERVICES</p>

        {orderItems.map((item, i) => (
          <div key={i} className="flex justify-between">
            <span>
              {item.name} × {item.quantity}
            </span>
            <span>₹{(item.quantity * item.price).toFixed(2)}</span>
          </div>
        ))}
      </div>

      {/* SCHEDULE */}
      <div className="bg-gray-100 p-4 rounded-xl">
        <p className="text-sm text-gray-500 mb-1">📅 SCHEDULE</p>
        <p>{pickupDate ? `${pickupDate} • ${pickupSlot}` : pickupSlot}</p>
      </div>

      {/* DELIVERY */}
      <div className="bg-gray-100 p-4 rounded-xl">
        <p className="text-sm text-gray-500 mb-1">🚚 DELIVERY</p>
        <p>
          {deliveryType === "express"
            ? "Express (24hr) — ₹49"
            : "Standard (48hr) — Free"}
        </p>
      </div>

      {/* TOTAL */}
      <div className="border-2 border-blue-500 rounded-xl p-4 flex justify-between text-lg font-bold">
        <span>Total</span>
        <span>₹{total}</span>
      </div>

      {/* BUTTONS */}
      <div className="flex justify-between gap-4">
        <button
          onClick={() => navigate(-1)}
          className="flex-1 border rounded-xl py-3"
        >
          ← Back
        </button>

        <button
          onClick={() => navigate("/customer/checkout")}
          className="flex-1 bg-blue-600 text-white rounded-xl py-3"
        >
          Proceed to Pay →
        </button>
      </div>
    </div>
  );
}