import { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";

export function useBins() {
  const [bins, setBins] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBins() {
      const { data, error } = await supabase.from("bins").select("*");

      if (error) {
        console.error("Error fetching bins:", error);
      } else {
        const formatted = data.map((bin) => ({
          id: bin.bin_id,
          fillLevel: bin.fill_level,
          status: bin.status ? bin.status.toLowerCase() : "empty",
          lastUpdated: bin.last_updated
            ? new Date(bin.last_updated).toLocaleString()
            : "Unknown",
          location: `${bin.latitude}, ${bin.longitude}`,
          lat: bin.latitude,
          lng: bin.longitude,
        }));
        setBins(formatted);
      }
      setLoading(false);
    }

    fetchBins();

    const channel = supabase
      .channel("bins-channel")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "bins" },
        () => {
          fetchBins();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { bins, loading };
}
