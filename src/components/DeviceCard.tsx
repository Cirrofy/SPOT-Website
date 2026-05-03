import { Battery, MonitorSmartphone, MapPin, FileText } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export interface Device {
  id: string;
  name: string;
  status: "Connected" | "Disconnected";
  battery: number;
  mode: "Locked" | "Unlocked";
}

interface Props {
  device: Device;
  variant?: "card" | "footer";
  rightAction?: { label: string; href: string; icon: "track" | "log" };
}

export function DeviceCard({ device, variant = "card", rightAction }: Props) {
  const statusColor = device.status === "Connected" ? "text-success" : "text-destructive";
  const dot = device.status === "Connected" ? "bg-success" : "bg-destructive";

  const ActionIcon = rightAction?.icon === "track" ? MapPin : FileText;

  return (
    <div className={variant === "card" ? "spot-card" : "spot-card max-w-2xl"}>
      <div className="flex items-center gap-5">
        <MonitorSmartphone className="h-16 w-16 text-primary shrink-0" strokeWidth={1.5} />
        <div className="flex-1 min-w-0">
          <h3 className="text-2xl font-bold">{device.name}</h3>
          <div className="text-sm mt-1">
            <span className="font-semibold">Status:</span>
            <div className={`flex items-center gap-1.5 ${statusColor} font-semibold`}>
              <span className={`h-2 w-2 rounded-full ${dot}`} />
              {device.status}
            </div>
          </div>
        </div>
        <div className="flex flex-col items-start gap-1 shrink-0">
          <div className="flex items-center gap-1.5">
            <Battery className="h-5 w-5 text-primary" />
            <span className="font-semibold">{device.battery}%</span>
          </div>
          <div className="text-sm">
            <span className="font-semibold">Mode Perangkat:</span>
            <div>🔒 {device.mode}</div>
          </div>
        </div>
      </div>

      {variant === "card" && (
        <div className="flex gap-2 mt-4">
          <Button asChild variant="outline" size="sm" className="flex-1 rounded-full border-primary text-primary">
            <Link to={`/track/${device.id}`}>
              <MapPin className="h-4 w-4" /> Lacak Perangkat
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm" className="flex-1 rounded-full border-primary text-primary">
            <Link to={`/log/${device.id}`}>
              <FileText className="h-4 w-4" /> Lihat Log Aktivitas
            </Link>
          </Button>
        </div>
      )}

      {variant === "footer" && rightAction && (
        <div className="mt-3 flex justify-end">
          <Button asChild variant="outline" size="sm" className="rounded-full border-primary text-primary">
            <Link to={rightAction.href}>
              <ActionIcon className="h-4 w-4" /> {rightAction.label}
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}
