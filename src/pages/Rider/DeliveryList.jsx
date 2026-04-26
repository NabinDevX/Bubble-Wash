import StitchEmbed from "../Admin/StitchEmbed.jsx";
import html from "../../../stitch_exports/rider/delivery-list-a.html?raw";

export default function RiderDeliveryList() {
  return <StitchEmbed html={html} variant="rider" />;
}
