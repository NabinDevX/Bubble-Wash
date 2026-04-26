import StitchEmbed from "./StitchEmbed.jsx";

import html from "../../../stitch_exports/admin/delivery-slots.html?raw";

export default function DeliverySlots() {
  return <StitchEmbed html={html} variant="admin" />;
}
