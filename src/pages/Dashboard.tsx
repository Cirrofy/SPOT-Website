import { useEffect, useState } from "react";
import { Battery, MonitorSmartphone } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip } from "recharts";
import { supabase } from "@/lib/supabase";

export default function Dashboard() {
  const [devices, setDevices] = useState<any[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);
  const [totalDetections, setTotalDetections] = useState(0);

  useEffect(() => {
    const fetchDashboardData = async () => {
      // 1. Ambil semua perangkat user
      const { data: devicesData } = await supabase.from("devices").select("*");
      if (devicesData) setDevices(devicesData);

      // 2. Kalkulasi tanggal 7 hari yang lalu
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      // 3. Ambil motion_logs 7 hari terakhir
      const { data: logsData } = await supabase
        .from("motion_logs")
        .select("recorded_at")
        .gte("recorded_at", sevenDaysAgo.toISOString());

      if (logsData) {
        setTotalDetections(logsData.length);

        // 4. Kelompokkan data per tanggal untuk Line Chart (Format: "DD/MM")
        const groupedData: Record<string, number> = {};
        
        // Buat template 7 hari terakhir dengan nilai 0
        for (let i = 6; i >= 0; i--) {
          const d = new Date();
          d.setDate(d.getDate() - i);
          const dateStr = `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}`;
          groupedData[dateStr] = 0;
        }

        // Isi jumlah deteksi ke tanggal yang sesuai
        logsData.forEach((log) => {
          const d = new Date(log.recorded_at);
          const dateStr = `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}`;
          if (groupedData[dateStr] !== undefined) {
            groupedData[dateStr] += 1;
          }
        });

        // Ubah objek menjadi array yang diterima oleh Recharts
        const formattedChartData = Object.keys(groupedData).map((date) => ({
          date,
          count: groupedData[date],
        }));

        setChartData(formattedChartData);
      }
    };

    fetchDashboardData();
  }, []);

  // Hitung perangkat yang is_active bernilai true
  const activeCount = devices.filter((d) => d.is_active).length;

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
          <h3 className="font-bold leading-tight">Jumlah Deteksi Pergerakan (7 Hari)</h3>
          <div className="text-6xl font-bold text-primary mt-4">{totalDetections}</div>
        </div>

        <div className="spot-card">
          <h3 className="font-bold text-center mb-3">Status Baterai Perangkat</h3>
          <div className="space-y-2">
            {devices.length === 0 ? (
              <p className="text-center text-sm text-muted-foreground mt-6">Belum ada perangkat</p>
            ) : (
              devices.slice(0, 3).map((d) => (
                <div key={d.id} className="flex items-center justify-between rounded-full border-2 border-primary/70 px-4 py-2">
                  <span className="flex items-center gap-2 font-semibold truncate max-w-[120px]">
                    <MonitorSmartphone className="h-5 w-5 text-primary shrink-0" /> {d.name}
                  </span>
                  <span className="flex items-center gap-1.5 font-semibold">
                    <Battery className="h-5 w-5 text-primary" /> {d.battery_percentage ?? 100}%
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-3xl font-bold heading-underline inline-block">Visualisasi Data</h2>
        <div className="mt-6">
          <h3 className="font-bold mb-4">Line Chart Frekuensi Deteksi Pergerakan Perangkat SPOT</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer>
              <LineChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 30 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="date" stroke="hsl(var(--primary))" tick={{ fill: "hsl(var(--primary))" }} angle={-20} dy={10} />
                <YAxis stroke="hsl(var(--primary))" tick={{ fill: "hsl(var(--primary))" }} allowDecimals={false} />
                <Tooltip />
                <Line
                  type="linear"
                  dataKey="count"
                  name="Jumlah Deteksi"
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