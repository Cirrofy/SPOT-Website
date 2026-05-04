import { useMemo, useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { GoogleMap, useJsApiLoader, Marker, Polyline } from "@react-google-maps/api";
import { devices } from "@/lib/mockData";
import { DeviceCard } from "@/components/DeviceCard";
import NotFound from "./NotFound";
// 1. IMPORT HOOK MQTT
import { useMqtt } from "@/hooks/useMQTT";

const mapContainerStyle = {
  width: "100%",
  height: "100%",
};

const defaultDevicePosition = { lat: -6.8900, lng: 107.6120 };

export default function TrackDevice() {
  const { id = "" } = useParams();
  const navigate = useNavigate();
  const device = devices.find((d) => d.id === id);

  // 2. PANGGIL HOOK MQTT
  const { sensorData, isConnected } = useMqtt();

  const [userPos, setUserPos] = useState<{ lat: number; lng: number } | null>(null);
  const [locationError, setLocationError] = useState<string>("");

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY, 
  });

  // 3. UBAH LOGIKA devicePos
  const devicePos = useMemo(() => {
    // Cek apakah ada data dari MQTT. 
    // Catatan: Jika lat & lng bernilai 0, berarti GPS Neo-6M belum mendapat "Fix" satelit.
    if (sensorData && sensorData.lat !== 0 && sensorData.lng !== 0) {
      return { 
        lat: sensorData.lat, 
        lng: sensorData.lng 
      };
    }
    
    // Fallback: Jika MQTT belum mengirim data atau GPS masih 0.000, 
    // gunakan data dari mock (atau nantinya dari database Supabase)
    return {
      lat: device?.lat || defaultDevicePosition.lat,
      lng: device?.lng || defaultDevicePosition.lng,
    };
  }, [device, sensorData]); // Pastikan sensorData masuk ke dalam array dependency!

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserPos({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Gagal mendapatkan lokasi:", error);
          setLocationError("Izin lokasi ditolak atau tidak tersedia.");
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    } else {
      setLocationError("Browser Anda tidak mendukung Geolocation.");
    }
  }, []);

  if (!device) return <NotFound />;

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="text-primary" aria-label="Back">
          <ArrowLeft className="h-7 w-7" />
        </button>
        <h1 className="text-4xl font-bold heading-underline inline-block">Lacak Perangkat: {device.name}</h1>
      </div>
      
      <div className="flex justify-between items-end">
        {/* 4. UPDATE INDIKATOR STATUS */}
        <p className="text-sm text-muted-foreground flex items-center gap-2">
          Status: 
          {isConnected ? (
            <span className="text-green-500 font-medium animate-pulse">● Live Tracking Aktif</span>
          ) : (
            <span className="text-orange-500 font-medium">Menghubungkan ke perangkat...</span>
          )}
          {sensorData?.sats === 0 && isConnected && (
             <span className="text-red-500 ml-2">(Mencari sinyal satelit GPS...)</span>
          )}
        </p>
        {locationError && <p className="text-sm text-red-500 font-medium">{locationError}</p>}
      </div>

      <div className="relative rounded-2xl border-2 border-primary overflow-hidden h-[420px] bg-muted flex items-center justify-center">
        {!isLoaded ? (
          <p className="text-muted-foreground animate-pulse font-medium">Memuat Peta...</p>
        ) : (
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={devicePos}
            zoom={15}
            options={{
              disableDefaultUI: false,
              zoomControl: true,
              streetViewControl: false,
              mapTypeControl: false,
            }}
          >
            {/* Sisa kode marker dan polyline tidak perlu diubah, karena devicePos sudah otomatis reaktif! */}
            <Marker 
              position={devicePos}
              label={{ 
                text: device.name, 
                className: "font-bold bg-background px-2 py-1 rounded shadow-md mt-10",
                color: "#000"
              }}
            />

            {userPos && (
              <>
                <Marker 
                  position={userPos} 
                  icon="http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
                  label={{ 
                    text: "Posisi Anda", 
                    className: "font-bold bg-background px-2 py-1 rounded shadow-md mt-10",
                    color: "#000"
                  }}
                />
                
                <Polyline
                  path={[userPos, devicePos]}
                  options={{
                    strokeColor: "hsl(var(--foreground))",
                    strokeOpacity: 0,
                    icons: [{
                      icon: {
                        path: "M 0,-1 0,1",
                        strokeOpacity: 0.8,
                        scale: 3
                      },
                      offset: "0",
                      repeat: "15px"
                    }]
                  }}
                />
              </>
            )}
          </GoogleMap>
        )}
      </div>

      <DeviceCard
        device={device}
        variant="footer"
        rightAction={{ label: "Lihat Log Aktivitas", href: `/log/${device.id}`, icon: "log" }}
      />
    </div>
  );
}