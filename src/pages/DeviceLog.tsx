import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { devices, deviceLogs } from "@/lib/mockData";
import { DeviceCard } from "@/components/DeviceCard";
import NotFound from "./NotFound";

export default function DeviceLog() {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const device = devices.find((d) => d.id === id);
  if (!device) return <NotFound />;
  const logs = deviceLogs[id] ?? [];

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="text-primary" aria-label="Back">
          <ArrowLeft className="h-7 w-7" />
        </button>
        <h1 className="text-4xl font-bold heading-underline inline-block">
          Log Aktivitas Perangkat: {device.name}
        </h1>
      </div>

      <div className="rounded-2xl border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-primary text-primary-foreground">
              <th className="py-3 px-4 text-center font-bold w-1/3">Timestamp</th>
              <th className="py-3 px-4 text-center font-bold">Aktivitas / Event</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log, i) => (
              <tr key={i} className="border-t border-border">
                <td className={`py-3 px-4 ${log.alert ? "text-primary font-bold" : ""}`}>[{log.time}]</td>
                <td className={`py-3 px-4 ${log.alert ? "text-primary font-bold" : ""}`}>{log.event}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <DeviceCard
        device={device}
        variant="footer"
        rightAction={{ label: "Lacak Perangkat", href: `/track/${device.id}`, icon: "track" }}
      />
    </div>
  );
}
