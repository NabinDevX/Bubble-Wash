import StitchEmbed from "./StitchEmbed.jsx";

import html from "../../../stitch_exports/admin/reports-analytics.html?raw";

export default function Reports() {
  return <StitchEmbed html={html} variant="admin" />;
}
