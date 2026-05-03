import { devices } from "@/lib/mockData";
import { DeviceCard } from "@/components/DeviceCard";

export default function Devices() {
  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold heading-underline inline-block">Daftar Perangkat</h1>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {devices.map((d) => (
          <DeviceCard key={d.id} device={d} />
        ))}
      </div>
    </div>
  );
}
