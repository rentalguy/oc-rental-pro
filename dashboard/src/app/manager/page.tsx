import RequireRole from "../../components/RequireRole";

export default function ManagerDashboard() {
  return (
    <RequireRole role="manager">
      <div>
        <h1 className="text-2xl font-bold mb-6">Manager Dashboard</h1>
        <p className="mb-4">This page is only visible to users with the <b>manager</b> role.</p>
        {/* Add manager-specific tools or analytics here */}
      </div>
    </RequireRole>
  );
}
