import type { Device } from "@/components/DeviceCard";

export const devices: Device[] = [
  { id: "spot-1", name: "SPOT-1", status: "Connected", battery: 90, mode: "Locked" },
  { id: "spot-2", name: "SPOT-2", status: "Disconnected", battery: 60, mode: "Unlocked" },
  { id: "spot-3", name: "SPOT-3", status: "Disconnected", battery: 78, mode: "Locked" },
];

export const deviceLogs: Record<string, { time: string; event: string; alert?: boolean }[]> = {
  "spot-1": [
    { time: "10 April 2026, 14:05:30", event: "Perangkat berhasil terhubung" },
    { time: "10 April 2026, 14:05:40", event: "Lokasi terakhir Perangkat tersimpan" },
    { time: "10 April 2026, 14:06:45", event: "Mode 'Locked' diaktifkan" },
    { time: "10 April 2026, 15:05:40", event: "Lokasi terakhir Perangkat tersimpan" },
    { time: "10 April 2026, 15:30:03", event: "Terdeteksi pergerakan mencurigakan", alert: true },
    { time: "10 April 2026, 15:33:22", event: "Alarm Perangkat berhasil dibunyikan" },
    { time: "10 April 2026, 15:34:10", event: "Alarm Perangkat berhasil dibunyikan" },
    { time: "10 April 2026, 16:05:40", event: "Lokasi terakhir Perangkat tersimpan" },
    { time: "10 April 2026, 16:10:50", event: "Mode 'Locked' dinonaktifkan" },
    { time: "10 April 2026, 16:20:13", event: "Baterai perangkat di bawah 5%", alert: true },
    { time: "10 April 2026, 17:01:40", event: "Koneksi perangkat terputus" },
  ],
  "spot-2": [
    { time: "9 April 2026, 09:00:00", event: "Perangkat berhasil terhubung" },
    { time: "9 April 2026, 18:30:00", event: "Koneksi perangkat terputus" },
  ],
  "spot-3": [
    { time: "8 April 2026, 11:20:00", event: "Perangkat berhasil terhubung" },
    { time: "8 April 2026, 22:10:00", event: "Koneksi perangkat terputus" },
  ],
};

export const detectionData = [
  { date: "4 April", count: 5 },
  { date: "5 April", count: 3 },
  { date: "6 April", count: 7 },
  { date: "7 April", count: 7 },
  { date: "8 April", count: 1 },
  { date: "9 April", count: 8 },
  { date: "10 April", count: 3 },
];
