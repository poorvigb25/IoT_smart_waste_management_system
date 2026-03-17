import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router";
import { Navbar } from "../components/Navbar";
import { statusColor, statusLabel } from "../data/bins";
import { useBins } from "../hooks/useBins";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

export default function MapPage() {
  const [searchParams] = useSearchParams();
  const focusBinId = searchParams.get("bin");
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersGroupRef = useRef(null);
  const [selectedBin, setSelectedBin] = useState(null);
  const { bins, loading } = useBins();

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const map = L.map(mapRef.current, {
      center: [20.5937, 78.9629], // defaulted center to India / broad view
      zoom: 4,
      zoomControl: true,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '© <a href="https://openstreetmap.org">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);

    markersGroupRef.current = L.layerGroup().addTo(map);
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapInstanceRef.current;
    const group = markersGroupRef.current;
    if (!map || !group || loading) return;

    group.clearLayers();

    bins.forEach((bin) => {
      const color = statusColor[bin.status] || statusColor.empty;
      
      const lat = typeof bin.lat === "number" ? bin.lat : parseFloat(bin.lat);
      const lng = typeof bin.lng === "number" ? bin.lng : parseFloat(bin.lng);
      
      if (isNaN(lat) || isNaN(lng)) return;

      const marker = L.circleMarker([lat, lng], {
        radius: 12,
        fillColor: color,
        color: "#ffffff",
        weight: 2.5,
        opacity: 1,
        fillOpacity: 0.9,
      }).addTo(group);

      marker.bindTooltip(bin.id, {
        permanent: false,
        direction: "top",
        className: "leaflet-tooltip-custom",
      });

      marker.on("click", () => {
        setSelectedBin(bin);
        map.panTo([lat, lng]);
      });
    });

    if (focusBinId && bins.length > 0) {
      const target = bins.find((b) => b.id === focusBinId);
      if (target) {
        setTimeout(() => {
          const tlat = typeof target.lat === "number" ? target.lat : parseFloat(target.lat);
          const tlng = typeof target.lng === "number" ? target.lng : parseFloat(target.lng);
          map.setView([tlat, tlng], 15);
          setSelectedBin(target);
        }, 200);
      }
    } else if (bins.length > 0 && !focusBinId && map.getZoom() === 4) {
       const flat = typeof bins[0].lat === "number" ? bins[0].lat : parseFloat(bins[0].lat);
       const flng = typeof bins[0].lng === "number" ? bins[0].lng : parseFloat(bins[0].lng);
       map.setView([flat, flng], 13);
    }
  }, [bins, focusBinId, loading]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <div className="flex-1 flex flex-col max-w-7xl w-full mx-auto px-6 py-6 gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-800">Map View</h1>
            <p className="text-gray-500 text-sm mt-0.5">
              Live bin locations across the city
            </p>
          </div>
          {/* Legend */}
          <div className="flex gap-4 bg-white rounded-xl border border-gray-100 shadow-sm px-4 py-2.5">
            {["empty", "medium", "full"].map((s) => (
              <div
                key={s}
                className="flex items-center gap-2 text-xs text-gray-600"
              >
                <span
                  className="w-3 h-3 rounded-full inline-block"
                  style={{ background: statusColor[s] }}
                />
                {statusLabel[s]}
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-4 flex-1 min-h-0">
          {/* Map */}
          <div
            className="flex-1 bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden"
            style={{ minHeight: 500 }}
          >
            <div
              ref={mapRef}
              className="w-full h-full"
              style={{ minHeight: 500 }}
            />
          </div>

          {/* Sidebar info */}
          <div className="w-72 flex flex-col gap-4">
            {/* Selected bin info */}
            {selectedBin ? (
              <div className="bg-white rounded-xl border border-blue-100 shadow-sm p-5">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-bold text-gray-800 text-base">
                    {selectedBin.id}
                  </span>
                  <span
                    className="text-xs font-medium px-2.5 py-1 rounded-full"
                    style={{
                      background: statusColor[selectedBin.status] + "22",
                      color: statusColor[selectedBin.status],
                    }}
                  >
                    {statusLabel[selectedBin.status]}
                  </span>
                </div>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Fill Level</span>
                    <span className="font-semibold">
                      {selectedBin.fillLevel}%
                    </span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${selectedBin.fillLevel}%`,
                        background: statusColor[selectedBin.status],
                      }}
                    />
                  </div>
                  <div className="flex justify-between pt-1">
                    <span className="text-gray-400">Location</span>
                    <span className="font-medium text-right text-xs">
                      {selectedBin.location}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Last Updated</span>
                    <span className="font-medium text-xs">
                      {selectedBin.lastUpdated}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Coordinates</span>
                    <span className="font-medium text-xs">
                      {parseFloat(selectedBin.lat).toFixed(4)}, {parseFloat(selectedBin.lng).toFixed(4)}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 text-center text-gray-400 text-sm">
                <div className="text-3xl mb-2">📍</div>
                Click a bin marker to view details
              </div>
            )}

            {/* Bin list */}
            <div
              className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex-1 overflow-y-auto"
              style={{ maxHeight: 360 }}
            >
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
                All Bins
              </h3>
              <div className="space-y-1.5">
                {bins.map((bin) => (
                  <button
                    key={bin.id}
                    onClick={() => {
                      setSelectedBin(bin);
                      mapInstanceRef.current?.setView([bin.lat, bin.lng], 15);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                      selectedBin?.id === bin.id
                        ? "bg-blue-50 border border-blue-200"
                        : "hover:bg-gray-50 border border-transparent"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                        style={{ background: statusColor[bin.status] }}
                      />

                      <span className="font-medium text-gray-700">
                        {bin.id}
                      </span>
                    </div>
                    <span className="text-xs text-gray-400">
                      {bin.fillLevel}%
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
