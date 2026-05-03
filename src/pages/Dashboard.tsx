import { Battery, MonitorSmartphone } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from "recharts";
import { devices, detectionData } from "@/lib/mockData";

export default function Dashboard() {
  const activeCount = devices.filter((d) => d.status === "Connected").length;
  const totalDetections = detectionData.reduce((s, d) => s + d.count, 0);

  return (
    <div className="space-y-8 max-w-6xl">
      <h1 className="text-4xl font-bold heading-underline inline-block">Dashboard Analitik</h1>

      <div className="grid gap-5 md:grid-cols-3">
        <div className="spot-card text-center">
          <h3 className="font-bold leading-tight">
            Jumlah Perangkat <span className="text-primary">SPOT</span> Aktif / Terhubung
          </h3>
          <div className="text-6xl font-bold text-primary mt-4">{activeCount}</div>
        </div>

        <div className="spot-card text-center">
          <h3 className="font-bold leading-tight">Jumlah Deteksi Pergerakan Minggu ini</h3>
          <div className="text-6xl font-bold text-primary mt-4">{totalDetections}</div>
        </div>

        <div className="spot-card">
          <h3 className="font-bold text-center mb-3">Status Baterai Perangkat</h3>
          <div className="space-y-2">
            {devices.slice(0, 2).map((d) => (
              <div key={d.id} className="flex items-center justify-between rounded-full border-2 border-primary/70 px-4 py-2">
                <span className="flex items-center gap-2 font-semibold">
                  <MonitorSmartphone className="h-5 w-5 text-primary" /> {d.name}
                </span>
                <span className="flex items-center gap-1.5 font-semibold">
                  <Battery className="h-5 w-5 text-primary" /> {d.battery}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-3xl font-bold heading-underline inline-block">Visualisasi Data</h2>
        <div className="mt-6">
          <h3 className="font-bold mb-4">Line Chart Frekuensi Deteksi Pergerakan Perangkat SPOT</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer>
              <LineChart data={detectionData} margin={{ top: 20, right: 30, left: 0, bottom: 30 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="date" stroke="hsl(var(--primary))" tick={{ fill: "hsl(var(--primary))" }} angle={-20} dy={10} />
                <YAxis stroke="hsl(var(--primary))" tick={{ fill: "hsl(var(--primary))" }} />
                <Tooltip />
                <Line
                  type="linear"
                  dataKey="count"
                  stroke="hsl(var(--foreground))"
                  strokeDasharray="6 6"
                  strokeWidth={2}
                  dot={{ fill: "hsl(var(--primary))", r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
