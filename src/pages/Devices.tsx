import { useEffect, useState } from "react";
import { DeviceCard, Device } from "@/components/DeviceCard";
import { supabase } from "@/lib/supabase";
import { useMqtt } from "@/hooks/useMQTT"; // Import hook MQTT

export default function Devices() {
  const [dbDevices, setDbDevices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Panggil hook MQTT
  const { liveDeviceStatuses } = useMqtt();

  useEffect(() => {
    const fetchDevices = async () => {
      const { data, error } = await supabase
        .from("devices")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Gagal mengambil perangkat:", error.message);
      } else if (data) {
        setDbDevices(data);
      }
      setLoading(false);
    };

    fetchDevices();
  }, []);

  // PROSES MAPPING: Gabungkan data Database dengan data LIVE MQTT
  const devicesToRender: Device[] = dbDevices.map((d) => {
    // Cari data live berdasarkan ID dari MQTT
    const liveData = liveDeviceStatuses[d.id] || {};
    
    // Tentukan apakah online via data spesifik, atau gunakan status LWT global
    const isOnline = liveData.online === true || liveDeviceStatuses.global_status === true;

    return {
      id: d.id,
      name: d.name,
      // Jika terdeteksi di MQTT maka Connected, jika tidak gunakan fallback is_active dari Supabase
      status: isOnline ? "Connected" : (d.is_active ? "Connected" : "Disconnected"),
      // Gunakan baterai dari MQTT (jika ada), jika tidak gunakan dari DB
      battery: liveData.battery !== undefined ? liveData.battery : (d.battery_percentage || 0),
      // Mode dari DB (atau fallback Unlocked)
      mode: d.mode || "Unlocked",
    };
  });

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold heading-underline inline-block">Daftar Perangkat</h1>
      
      {loading ? (
        <p className="text-muted-foreground animate-pulse">Memuat daftar perangkat...</p>
      ) : devicesToRender.length === 0 ? (
        <p className="text-muted-foreground">Belum ada perangkat yang terdaftar.</p>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {devicesToRender.map((mappedDevice) => (
            <DeviceCard key={mappedDevice.id} device={mappedDevice} />
          ))}
        </div>
      )}
    </div>
  );
}