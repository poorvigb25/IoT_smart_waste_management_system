import { useNavigate } from "react-router";
import {
  Trash2,
  AlertTriangle,
  CheckCircle,
  BarChart2,
  Map,
  ArrowRight,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { Navbar } from "../components/Navbar";
import { statusColor, statusLabel } from "../data/bins";
import { useBins } from "../hooks/useBins";

export default function DashboardPage() {
  const navigate = useNavigate();
  const { bins, loading } = useBins();

  const total = bins.length;
  const fullBins = bins.filter((b) => b.status === "full").length;
  const mediumBins = bins.filter((b) => b.status === "medium").length;
  const emptyBins = bins.filter((b) => b.status === "empty").length;

  const alerts = bins
    .filter((b) => b.fillLevel >= 80)
    .sort((a, b) => b.fillLevel - a.fillLevel);

  const chartData = bins.map((b) => ({
    name: b.id,
    fill: b.fillLevel,
    status: b.status,
  }));

  const statCards = [
    {
      label: "Total Bins",
      value: total,
      icon: Trash2,
      color: "bg-blue-50 text-blue-600",
      border: "border-blue-100",
    },
    {
      label: "Full Bins",
      value: fullBins,
      icon: AlertTriangle,
      color: "bg-red-50 text-red-500",
      border: "border-red-100",
    },
    {
      label: "Medium Level",
      value: mediumBins,
      icon: BarChart2,
      color: "bg-yellow-50 text-yellow-500",
      border: "border-yellow-100",
    },
    {
      label: "Empty Bins",
      value: emptyBins,
      icon: CheckCircle,
      color: "bg-green-50 text-green-500",
      border: "border-green-100",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-xl font-bold text-gray-800">
            Dashboard Overview
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">
            Real-time waste management status across the city
          </p>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((card) => (
            <div
              key={card.label}
              className={`bg-white rounded-xl border ${card.border} shadow-sm p-5 flex items-center gap-4`}
            >
              <div className={`${card.color} p-3 rounded-xl`}>
                <card.icon size={22} />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-800">
                  {card.value}
                </div>
                <div className="text-xs text-gray-500 mt-0.5">{card.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Chart + Alerts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Bar Chart */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm p-6">
            <h2 className="font-semibold text-gray-700 mb-4">
              Bin Fill Levels (%)
            </h2>
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={chartData} barSize={22}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#f0f0f0"
                  vertical={false}
                />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 11, fill: "#9ca3af" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  domain={[0, 100]}
                  tick={{ fontSize: 11, fill: "#9ca3af" }}
                  axisLine={false}
                  tickLine={false}
                  unit="%"
                />
                <Tooltip
                  formatter={(v) => [`${v}%`, "Fill Level"]}
                  contentStyle={{
                    borderRadius: 8,
                    border: "1px solid #e5e7eb",
                    fontSize: 12,
                  }}
                />

                <Bar dataKey="fill" radius={[4, 4, 0, 0]}>
                  {chartData.map((entry, i) => (
                    <Cell key={i} fill={statusColor[entry.status]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            {/* Legend */}
            <div className="flex gap-5 mt-3 justify-center">
              {["empty", "medium", "full"].map((s) => (
                <div
                  key={s}
                  className="flex items-center gap-1.5 text-xs text-gray-500"
                >
                  <span
                    className="w-3 h-3 rounded-sm inline-block"
                    style={{ background: statusColor[s] }}
                  />
                  {statusLabel[s]}
                </div>
              ))}
            </div>
          </div>

          {/* Recent Alerts */}
          <div className="bg-white rounded-xl border border-red-100 shadow-sm p-6">
            <h2 className="font-semibold text-gray-700 mb-4 flex items-center gap-2">
              <AlertTriangle size={16} className="text-red-400" /> Recent Alerts
            </h2>
            <div className="space-y-3">
              {alerts.length === 0 && (
                <p className="text-gray-400 text-sm">
                  No bins require attention.
                </p>
              )}
              {alerts.map((bin) => (
                <div
                  key={bin.id}
                  className="flex items-center justify-between bg-red-50 rounded-lg px-3 py-2.5 cursor-pointer hover:bg-red-100 transition"
                  onClick={() => navigate(`/map?bin=${bin.id}`)}
                >
                  <div>
                    <div className="text-sm font-semibold text-gray-700">
                      {bin.id}
                    </div>
                    <div className="text-xs text-gray-500">{bin.location}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-red-500">
                      {bin.fillLevel}%
                    </span>
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ background: statusColor[bin.status] }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Navigation */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <button
            onClick={() => navigate("/bins")}
            className="bg-white border border-gray-100 rounded-xl shadow-sm p-6 flex items-center gap-4 hover:shadow-md hover:border-blue-200 transition-all text-left group"
          >
            <div className="bg-blue-50 text-blue-600 p-4 rounded-xl group-hover:bg-blue-100 transition">
              <Trash2 size={28} />
            </div>
            <div className="flex-1">
              <div className="font-semibold text-gray-800">Bin Monitoring</div>
              <div className="text-sm text-gray-500 mt-0.5">
                View and monitor all bin statuses
              </div>
            </div>
            <ArrowRight
              size={18}
              className="text-gray-300 group-hover:text-blue-400 transition"
            />
          </button>

          <button
            onClick={() => navigate("/map")}
            className="bg-white border border-gray-100 rounded-xl shadow-sm p-6 flex items-center gap-4 hover:shadow-md hover:border-blue-200 transition-all text-left group"
          >
            <div className="bg-blue-50 text-blue-600 p-4 rounded-xl group-hover:bg-blue-100 transition">
              <Map size={28} />
            </div>
            <div className="flex-1">
              <div className="font-semibold text-gray-800">Map View</div>
              <div className="text-sm text-gray-500 mt-0.5">
                See bin locations across the city
              </div>
            </div>
            <ArrowRight
              size={18}
              className="text-gray-300 group-hover:text-blue-400 transition"
            />
          </button>
        </div>
      </main>
    </div>
  );
}
