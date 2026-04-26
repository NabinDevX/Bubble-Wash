import StitchEmbed from "../Admin/StitchEmbed.jsx";
import html from "../../../stitch_exports/rider/pickup-list-a.html?raw";

export default function RiderPickupList() {
  return <StitchEmbed html={html} variant="rider" />;
}
