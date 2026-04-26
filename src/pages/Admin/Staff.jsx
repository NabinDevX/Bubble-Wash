import StitchEmbed from "./StitchEmbed.jsx";

import html from "../../../stitch_exports/admin/staff-management.html?raw";

export default function Staff() {
  return <StitchEmbed html={html} variant="admin" />;
}
