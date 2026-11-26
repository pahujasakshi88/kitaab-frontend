"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Trash2, Search } from "lucide-react";
import { api } from "@/lib/api";

interface AppUser {
  _id: string;
  name: string;
  email: string;
  role: string;
  status: "active" | "inactive";
  createdAt?: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AppUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [q, setQ] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const load = async () => {
    try {
      const d = await api("/api/admin/users");
      setUsers(d.users || []);
      setError("");
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    const s = q.toLowerCase();
    return users.filter((u) => {
      const matches =
        u.name.toLowerCase().includes(s) || u.email.toLowerCase().includes(s);
      const statusOk = statusFilter === "all" || u.status === statusFilter;
      return matches && statusOk;
    });
  }, [users, q, statusFilter]);

  const changeStatus = async (u: AppUser, status: string) => {
    try {
      await api(`/api/admin/users/${u._id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
      await load();
    } catch (e: any) {
      alert(e.message);
    }
  };

  const remove = async (u: AppUser) => {
    if (!confirm(`Delete user "${u.name}"? This cannot be undone.`)) return;
    try {
      await api(`/api/admin/users/${u._id}`, { method: "DELETE" });
      await load();
    } catch (e: any) {
      alert(e.message);
    }
  };

  return (
    <div>
      <h1 className="mb-6 text-2xl font-semibold">All Users</h1>

      <div className="mb-4 flex flex-wrap gap-3">
        <div className="relative w-full max-w-sm">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[color:var(--c-20201d)]/50"
          />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by name or email"
            className="w-full rounded-lg border border-[color:var(--c-20201d)]/10 bg-[color:var(--c-white)] py-2 pl-9 pr-3 text-sm outline-none focus:border-[color:var(--c-a8552a)]"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-lg border border-[color:var(--c-20201d)]/10 bg-[color:var(--c-white)] px-3 py-2 text-sm outline-none"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-600">{error}</p>}
      {!loading && !error && filtered.length === 0 && (
        <p className="text-[color:var(--c-20201d)]/60">No users found.</p>
      )}

      {filtered.length > 0 && (
        <div className="overflow-x-auto rounded-xl bg-[color:var(--c-white)] shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-[color:var(--c-20201d)]/10 text-[color:var(--c-20201d)]/60">
              <tr>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Joined On</th>
                <th className="px-4 py-3 text-right font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
                <tr
                  key={u._id}
                  className="border-b border-[color:var(--c-20201d)]/5 last:border-0"
                >
                  <td className="px-4 py-3 font-medium">
                    <Link
                      href={`/admin/users/${u._id}`}
                      className="hover:text-[color:var(--c-a8552a)] hover:underline"
                    >
                      {u.name}
                    </Link>
                  </td>
                  <td className="px-4 py-3">{u.email}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                        u.status === "active"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {u.status === "active" ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[color:var(--c-20201d)]/70">
                    {u.createdAt
                      ? new Date(u.createdAt).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })
                      : "-"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-3">
                      <select
                        value={u.status}
                        onChange={(e) => changeStatus(u, e.target.value)}
                        className="rounded-lg border border-[color:var(--c-20201d)]/15 bg-[color:var(--c-white)] px-2 py-1 text-xs outline-none"
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                      <button
                        onClick={() => remove(u)}
                        className="text-red-500 hover:text-red-700"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
