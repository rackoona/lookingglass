import { useState, useEffect } from "react";
import { network, NetworkInfoResponse } from "@/lib/api";
import { useLocation } from "@/components/location-provider";

export function useNetworkInfo() {
  const { currentLocation } = useLocation();
  const [info, setInfo] = useState<NetworkInfoResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!currentLocation) return;

    const fetchInfo = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await network.getNetworkInfo(currentLocation.url);
        setInfo(data);
      } catch (err) {
        console.error("Failed to fetch network info:", err);
        setError("Failed to load network information");
      } finally {
        setLoading(false);
      }
    };

    fetchInfo();
  }, [currentLocation]);

  return { info, loading, error };
}

