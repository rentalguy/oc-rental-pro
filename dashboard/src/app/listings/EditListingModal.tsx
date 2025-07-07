"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { useUserRole } from "../../lib/useUserRole";

import RequireRole from "../../components/RequireRole";

export default function EditListingModal({ open, onClose, listing, onSaved }: {
  open: boolean;
  onClose: () => void;
  listing?: any;
  onSaved: () => void;
}) {
  const [name, setName] = useState(listing?.name || "");
  const [city, setCity] = useState(listing?.city || "");
  const [description, setDescription] = useState(listing?.description || "");
  const [image, setImage] = useState(listing?.image || "");
  const [saving, setSaving] = useState(false);
  const { role } = useUserRole();

  if (!open) return null;
  if (role !== "admin" && role !== "manager") return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white dark:bg-zinc-900 p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">{listing ? "Edit" : "Add"} Listing</h2>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            setSaving(true);
            if (listing) {
              await supabase
                .from("listings")
                .update({ name, city, description, image })
                .eq("id", listing.id);
            } else {
              await supabase
                .from("listings")
                .insert([{ name, city, description, image }]);
            }
            setSaving(false);
            onSaved();
            onClose();
          }}
        >
          <input
            className="w-full mb-2 p-2 border rounded"
            placeholder="Property Name"
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />
          <input
            className="w-full mb-2 p-2 border rounded"
            placeholder="City"
            value={city}
            onChange={e => setCity(e.target.value)}
            required
          />
          <input
            className="w-full mb-2 p-2 border rounded"
            placeholder="Image URL"
            value={image}
            onChange={e => setImage(e.target.value)}
          />
          <textarea
            className="w-full mb-2 p-2 border rounded"
            placeholder="Description"
            value={description}
            onChange={e => setDescription(e.target.value)}
          />
          <div className="flex gap-2 justify-end mt-4">
            <button type="button" className="px-4 py-2 rounded bg-gray-200 dark:bg-zinc-700" onClick={onClose} disabled={saving}>Cancel</button>
            <button type="submit" className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700" disabled={saving}>{saving ? "Saving..." : "Save"}</button>
          </div>
        </form>
        {/* Cleaner-only section demo */}
        <RequireRole role="cleaner">
          <div className="mt-8 p-3 border-t border-gray-200 dark:border-zinc-700">
            <h3 className="text-lg font-bold mb-2 text-green-700">Cleaner Tools</h3>
            <ul className="list-disc ml-5 text-sm text-green-900 dark:text-green-300">
              <li>Mark property as cleaned</li>
              <li>Report maintenance issue</li>
              <li>View cleaning checklist</li>
            </ul>
          </div>
        </RequireRole>
      </div>
    </div>
  );
}
