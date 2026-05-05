import { useState, useEffect } from 'react';
import mqtt from 'mqtt';

export function useMqtt() {
  const [client, setClient] = useState<mqtt.MqttClient | null>(null);
  const [sensorData, setSensorData] = useState<any>(null);
  const [isConnected, setIsConnected] = useState(false);
  
  // NEW: Dictionary untuk menyimpan status live dari MQTT
  const [liveDeviceStatuses, setLiveDeviceStatuses] = useState<Record<string, any>>({});

  useEffect(() => {
    const mqttClient = mqtt.connect(import.meta.env.VITE_MQTT_SERVER, {
      username: import.meta.env.VITE_MQTT_USER,
      password: import.meta.env.VITE_MQTT_PASSWORD,
      protocol: 'wss', 
    });

    mqttClient.on('connect', () => {
      console.log('Berhasil terhubung ke HiveMQ!');
      setIsConnected(true);
      mqttClient.subscribe('esp32/sensor/data');
      mqttClient.subscribe('esp32/status'); // Subscribe topik LWT / Status
    });

    mqttClient.on('message', (topic, message) => {
      const msgStr = message.toString();

      // 1. Tangkap status LWT (Sama seperti logika teman Anda)
      if (topic === 'esp32/status') {
        // Karena payload ini bukan JSON, kita simpan sebagai status global sementara
        // atau terapkan ke device "default" jika alat Anda baru satu.
        setLiveDeviceStatuses((prev) => ({
          ...prev,
          global_status: msgStr === 'ONLINE', 
        }));
        return;
      }

      // 2. Tangkap data sensor / JSON
      if (topic === 'esp32/sensor/data') {
        try {
          const parsedData = JSON.parse(msgStr);
          setSensorData(parsedData);
          
          // Asumsi ID perangkat Anda dikirim dalam payload dengan key 'device_id' atau 'identifier'
          const deviceId = parsedData.device_id || parsedData.identifier;
          
          if (deviceId) {
            setLiveDeviceStatuses((prev) => ({
              ...prev,
              [deviceId]: {
                online: true, // Pasti online karena mengirim data
                battery: parsedData.battery || parsedData.battery_percentage
              }
            }));
          }
        } catch (error) {
          console.error("Gagal parse JSON MQTT:", error);
        }
      }
    });

    setClient(mqttClient);

    return () => {
      mqttClient.end();
    };
  }, []);

  const triggerBuzzer = (status: "ON" | "OFF") => {
    if (client && isConnected) {
      client.publish('esp32/buzzer/control', JSON.stringify({ action: status }));
    }
  };

  return { isConnected, sensorData, liveDeviceStatuses, triggerBuzzer };
}