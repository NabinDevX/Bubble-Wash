import StitchEmbed from "./StitchEmbed.jsx";

import html from "../../../stitch_exports/admin/service-areas.html?raw";

export default function ServiceAreas() {
  return <StitchEmbed html={html} variant="admin" />;
}
