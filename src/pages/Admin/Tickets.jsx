import StitchEmbed from "./StitchEmbed.jsx";

import html from "../../../stitch_exports/admin/ticket-management.html?raw";

export default function Tickets() {
  return <StitchEmbed html={html} variant="admin" />;
}
