import StitchEmbed from "./StitchEmbed.jsx";

import html from "../../../stitch_exports/admin/workshop-management.html?raw";

export default function Workshops() {
  return <StitchEmbed html={html} variant="admin" />;
}
