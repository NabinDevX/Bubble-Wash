import StitchEmbed from "./StitchEmbed.jsx";

import html from "../../../stitch_exports/admin/riders-management.html?raw";

export default function Riders() {
  return <StitchEmbed html={html} variant="admin" />;
}
