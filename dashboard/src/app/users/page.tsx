"use client";

import { useEffect, useState } from "react";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { supabase } from "../../lib/supabaseClient";
import RoleDropdown, { ROLES } from "./RoleDropdown";

interface UserRow {
  id: string;
  email: string;
  role: string;
}

import RequireRole from "../../components/RequireRole";

export default function UsersPage() {
  return (
    <RequireRole role="admin">
      <UsersPageContent />
    </RequireRole>
  );
}

function UsersPageContent() {
  const { session } = useSessionContext();
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUsers() {
      setLoading(true);
      setError(null);
      // Only fetch if signed in
      if (!session) return;
      const { data, error } = await supabase.rpc('get_users_with_roles');
      if (error) {
        setError(error.message);
      } else {
        setUsers(data || []);
      }
      setLoading(false);
    }
    fetchUsers();
  }, [session]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">User Management</h1>
      {loading && <div>Loading users...</div>}
      {error && <div className="text-red-600 mb-2">{error}</div>}
      <table className="min-w-full border">
        <thead>
          <tr className="bg-gray-100 dark:bg-zinc-800">
            <th className="border p-2 text-left">Email</th>
            <th className="border p-2 text-left">Role</th>
            <th className="border p-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td className="border p-2">{user.email}</td>
              <td className="border p-2">
                <RoleDropdown
                  value={user.role}
                  onChange={async (newRole) => {
                    setLoading(true);
                    setError(null);
                    const { error } = await supabase
                      .from("user_roles")
                      .upsert([{ user_id: user.id, role: newRole }], { onConflict: 'user_id' });
                    if (error) setError(error.message);
                    else setUsers((prev) => prev.map((u) => u.id === user.id ? { ...u, role: newRole } : u));
                    setLoading(false);
                  }}
                />
              </td>
              <td className="border p-2">
                <button
                  className="text-xs px-2 py-1 rounded bg-red-200 dark:bg-red-800 text-red-900 dark:text-red-100 hover:bg-red-400 dark:hover:bg-red-700"
                  disabled={user.role === "user"}
                  onClick={async () => {
                    setLoading(true);
                    setError(null);
                    const { error } = await supabase
                      .from("user_roles")
                      .delete()
                      .eq("user_id", user.id);
                    if (error) setError(error.message);
                    else setUsers((prev) => prev.map((u) => u.id === user.id ? { ...u, role: "user" } : u));
                    setLoading(false);
                  }}
                >
                  Remove Role
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="mt-4 text-sm text-zinc-500">To change a user's role, use the Supabase dashboard for now. (Role editing UI coming soon!)</div>
    </div>
  );
}
