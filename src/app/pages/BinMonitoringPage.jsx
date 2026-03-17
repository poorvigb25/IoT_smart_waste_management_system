import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Search, MapPin, ChevronUp, ChevronDown } from "lucide-react";
import { Navbar } from "../components/Navbar";
import { statusColor, statusLabel } from "../data/bins";
import { useBins } from "../hooks/useBins";

const statusBg = {
  empty: "bg-green-100 text-green-700",
  medium: "bg-yellow-100 text-yellow-700",
  full: "bg-red-100 text-red-600",
};

export default function BinMonitoringPage() {
  const navigate = useNavigate();

  const { bins, loading } = useBins();
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortKey, setSortKey] = useState("fillLevel");
  const [sortAsc, setSortAsc] = useState(false);

  const handleSort = (key) => {
    if (sortKey === key) setSortAsc(!sortAsc);
    else {
      setSortKey(key);
      setSortAsc(false);
    }
  };

  const filtered = bins
    .filter((b) => {
      const matchSearch =
        b.id.toLowerCase().includes(search.toLowerCase()) ||
        b.location.toLowerCase().includes(search.toLowerCase());
      const matchStatus = filterStatus === "all" || b.status === filterStatus;
      return matchSearch && matchStatus;
    })
    .sort((a, b) => {
      let cmp = 0;
      if (sortKey === "fillLevel") cmp = a.fillLevel - b.fillLevel;
      else if (sortKey === "id") cmp = a.id.localeCompare(b.id);
      else if (sortKey === "status") cmp = a.status.localeCompare(b.status);
      else if (sortKey === "lastUpdated")
        cmp = a.lastUpdated.localeCompare(b.lastUpdated);
      return sortAsc ? cmp : -cmp;
    });

  const SortIcon = ({ k }) => (
    <span className="inline-flex flex-col ml-1">
      {sortKey === k ? (
        sortAsc ? (
          <ChevronUp size={12} className="text-blue-500" />
        ) : (
          <ChevronDown size={12} className="text-blue-500" />
        )
      ) : (
        <ChevronDown size={12} className="text-gray-300" />
      )}
    </span>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-6">
          <h1 className="text-xl font-bold text-gray-800">Bin Monitoring</h1>
          <p className="text-gray-500 text-sm mt-0.5">
            Real-time status of all smart waste bins
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 mb-5 flex flex-wrap gap-3 items-center">
          <div className="relative flex-1 min-w-[200px]">
            <Search
              size={15}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              placeholder="Search by bin ID or location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div className="flex gap-2">
            {["all", "empty", "medium", "full"].map((s) => (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${filterStatus === s
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
              >
                {s === "all" ? "All" : statusLabel[s]}
              </button>
            ))}
          </div>

          <span className="text-xs text-gray-400 ml-auto">
            {filtered.length} bins
          </span>
        </div>

        {/* Table */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  {[
                    { key: "id", label: "Bin ID" },
                    { key: "fillLevel", label: "Fill Level" },
                    { key: "status", label: "Status" },
                    { key: "lastUpdated", label: "Last Updated" },
                  ].map(({ key, label }) => (
                    <th
                      key={key}
                      className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:text-blue-600 select-none"
                      onClick={() => handleSort(key)}
                    >
                      {label} <SortIcon k={key} />
                    </th>
                  ))}
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {filtered.map((bin, i) => (
                  <tr
                    key={bin.id}
                    className={`border-b border-gray-50 hover:bg-blue-50/30 transition-colors ${i % 2 === 0 ? "" : "bg-gray-50/50"
                      }`}
                  >
                    <td className="px-5 py-3.5 font-semibold text-gray-700">
                      {bin.id}
                    </td>

                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-28 h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full transition-all"
                            style={{
                              width: `${bin.fillLevel}%`,
                              background: statusColor[bin.status],
                            }}
                          />
                        </div>
                        <span className="font-medium text-gray-700">
                          {bin.fillLevel}%
                        </span>
                      </div>
                    </td>

                    <td className="px-5 py-3.5">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${statusBg[bin.status]
                          }`}
                      >
                        <span
                          className="w-1.5 h-1.5 rounded-full"
                          style={{ background: statusColor[bin.status] }}
                        />
                        {statusLabel[bin.status]}
                      </span>
                    </td>

                    <td className="px-5 py-3.5 text-gray-500 text-xs">
                      {bin.lastUpdated}
                    </td>

                    <td className="px-5 py-3.5 text-gray-500 text-xs">
                      {bin.location}
                    </td>

                    <td className="px-5 py-3.5">
                      <button
                        onClick={() => navigate(`/map?bin=${bin.id}`)}
                        className="flex items-center gap-1.5 text-blue-600 hover:text-blue-800 text-xs font-medium transition-colors"
                      >
                        <MapPin size={13} />
                        View Location
                      </button>
                    </td>
                  </tr>
                ))}

                {filtered.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="text-center text-gray-400 py-10 text-sm"
                    >
                      No bins match your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}