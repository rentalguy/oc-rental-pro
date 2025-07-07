import RequireRole from "../../components/RequireRole";

export default function SettingsPage() {
  return (
    <RequireRole role="admin">
      <div>
        <h1 className="text-2xl font-bold mb-6">Settings</h1>
        <p className="mb-4">This page is only visible to admins. Add business settings, integrations, or admin tools here.</p>
        {/* Add settings form/components here */}
      </div>
    </RequireRole>
  );
}
