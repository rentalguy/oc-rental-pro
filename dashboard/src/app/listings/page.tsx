"use client";

"use client";

import { useSessionContext } from "@supabase/auth-helpers-react";
import { useUserRole } from "../../lib/useUserRole";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import EditListingModal from "./EditListingModal";

export default function ListingsPage() {
  const { session } = useSessionContext();
  const { role } = useUserRole();
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);

  useEffect(() => {
    async function fetchListings() {
      setLoading(true);
      const { data } = await supabase.from("listings").select("*");
      setProperties(data || []);
      setLoading(false);
    }
    fetchListings();
  }, [modalOpen]);

  const canEdit = role === "admin" || role === "manager";

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 flex items-center gap-4">
        Listings
        {canEdit && (
          <button
            className="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700 text-sm"
            onClick={() => {
              setEditing(null);
              setModalOpen(true);
            }}
          >
            + Add Listing
          </button>
        )}
      </h1>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
          {properties.map((property) => (
            <div
              key={property.id}
              className="bg-white dark:bg-zinc-900 rounded-lg shadow p-4 flex flex-col items-center"
            >
              <img
                src={property.image || "/mock-property.jpg"}
                alt={property.name}
                className="w-full h-40 object-cover rounded mb-4"
                style={{ background: "#eee" }}
              />
              <div className="font-semibold text-lg mb-1">{property.name}</div>
              <div className="text-sm text-zinc-500 mb-2">{property.city}</div>
              <div className="text-sm mb-2 text-center">{property.description}</div>
              <div className="flex gap-2 mt-auto">
                <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
                  View Details
                </button>
                {canEdit && (
                  <>
                    <button
                      className="px-2 py-1 rounded bg-yellow-200 text-yellow-900 hover:bg-yellow-300 text-xs"
                      onClick={() => {
                        setEditing(property);
                        setModalOpen(true);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="px-2 py-1 rounded bg-red-200 text-red-900 hover:bg-red-400 text-xs"
                      onClick={async () => {
                        await supabase.from("listings").delete().eq("id", property.id);
                        setProperties((prev) => prev.filter((p) => p.id !== property.id));
                      }}
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      <EditListingModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        listing={editing}
        onSaved={() => setModalOpen(false)}
      />
    </div>
  );
}

