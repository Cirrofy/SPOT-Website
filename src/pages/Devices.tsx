import { useEffect, useState } from "react";
import { DeviceCard } from "@/components/DeviceCard";
import { supabase } from "@/lib/supabase";

export default function Devices() {
  const [devices, setDevices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDevices = async () => {
      const { data, error } = await supabase
        .from("devices")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Gagal mengambil perangkat:", error.message);
      } else if (data) {
        setDevices(data);
      }
      setLoading(false);
    };

    fetchDevices();
  }, []);

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold heading-underline inline-block">Daftar Perangkat</h1>
      
      {loading ? (
        <p className="text-muted-foreground animate-pulse">Memuat daftar perangkat...</p>
      ) : devices.length === 0 ? (
        <p className="text-muted-foreground">Belum ada perangkat yang terdaftar.</p>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {devices.map((d) => (
            <DeviceCard key={d.id} device={d} />
          ))}
        </div>
      )}
    </div>
  );
}