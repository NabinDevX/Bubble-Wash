import StitchEmbed from "./StitchEmbed.jsx";

import dashboardHtml from "../../../stitch_exports/bubble-wash-admin-dashboard.html?raw";

export default function DashboardHome() {
  return <StitchEmbed html={dashboardHtml} variant="admin" />;
}
