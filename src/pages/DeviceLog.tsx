import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { DeviceCard } from "@/components/DeviceCard";
import NotFound from "./NotFound";
import { supabase } from "@/lib/supabase";
import { useMqtt } from "@/hooks/useMQTT";

export default function DeviceLog() {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  
  const [device, setDevice] = useState<any>(null);
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const { liveDeviceStatuses } = useMqtt();

  useEffect(() => {
    const fetchDeviceAndLogs = async () => {
      // 1. Ambil detail perangkat
      const { data: deviceData } = await supabase
        .from("devices")
        .select("*")
        .eq("id", id)
        .single();

      // 2. Ambil riwayat dari tabel notifications (menggantikan motion_logs)
      const { data: logsData } = await supabase
        .from("notifications")
        .select("*")
        .eq("device_id", id)
        .order("created_at", { ascending: false }) // Gunakan created_at
        .limit(50);

      if (deviceData) setDevice(deviceData);
      
      if (logsData) {
        const formattedLogs = logsData.map((log) => {
          const dateObj = new Date(log.created_at);
          
          // Ekstrak tipe event dari kolom JSONB 'data'
          const eventType = log.data?.type || "unknown";
          
          // Tentukan apakah ini log yang perlu di-highlight (Activity / Alarm)
          const isAlert = eventType === "activity" || eventType === "alarm";
          
          return {
            time: dateObj.toLocaleString("id-ID", { timeZone: "UTC" }),
            // Gabungkan title dan body agar lebih informatif
            event: `${log.title} - ${log.body}`,
            alert: isAlert
          };
        });
        setLogs(formattedLogs);
      }
      
      setLoading(false);
    };

    if (id) fetchDeviceAndLogs();
  }, [id]);

  if (loading) return <p className="p-6">Memuat log aktivitas...</p>;
  if (!device) return <NotFound />;

  // 3. PEMETAAN DATA SUPABASE + MQTT LIVE STATUS
  const liveData = liveDeviceStatuses?.[device.id] || {};
  const isOnline = liveData.online === true || liveDeviceStatuses?.global_status === true;

  const mappedDevice = {
    id: device.id,
    name: device.name,
    status: isOnline ? "Connected" : (device.is_active ? "Connected" : "Disconnected"),
    battery: liveData.battery !== undefined ? liveData.battery : (device.battery_percentage || 0),
    mode: device.mode || "Unlocked",
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="text-primary" aria-label="Back">
          <ArrowLeft className="h-7 w-7" />
        </button>
        <h1 className="text-4xl font-bold heading-underline inline-block">
          Log Aktivitas: {device.name}
        </h1>
      </div>

      <div className="rounded-2xl border border-border overflow-hidden max-h-[480px] overflow-y-auto relative">
        <table className="w-full text-sm">
          <thead className="sticky top-0 z-10 shadow-sm">
            <tr className="bg-primary text-primary-foreground">
              <th className="py-3 px-4 text-center font-bold w-1/3">Timestamp</th>
              <th className="py-3 px-4 text-left font-bold">Aktivitas / Event</th>
            </tr>
          </thead>
          <tbody>
            {logs.length === 0 ? (
              <tr>
                <td colSpan={2} className="py-4 text-center text-muted-foreground">Belum ada riwayat aktivitas.</td>
              </tr>
            ) : (
              logs.map((log, i) => (
                <tr key={i} className="border-t border-border">
                  <td className={`py-3 px-4 text-center ${log.alert ? "text-primary font-bold" : ""}`}>{log.time}</td>
                  {/* Diubah menjadi text-left agar pesan yang panjang lebih mudah dibaca */}
                  <td className={`py-3 px-4 text-left ${log.alert ? "text-primary font-bold" : ""}`}>{log.event}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <DeviceCard
        device={mappedDevice}
        variant="footer"
        rightAction={{ label: "Lacak Perangkat", href: `/track/${device.id}`, icon: "track" }}
      />
    </div>
  );
}