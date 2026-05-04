import { useState, useEffect } from 'react';
import mqtt from 'mqtt';

export function useMqtt() {
  const [client, setClient] = useState<mqtt.MqttClient | null>(null);
  const [sensorData, setSensorData] = useState<any>(null); // Menyimpan data dari ESP32
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // 1. Inisialisasi Koneksi menggunakan data dari .env
    const mqttClient = mqtt.connect(import.meta.env.VITE_MQTT_SERVER, {
      username: import.meta.env.VITE_MQTT_USER,
      password: import.meta.env.VITE_MQTT_PASSWORD,
      protocol: 'wss', // Wajib WSS untuk Web
    });

    mqttClient.on('connect', () => {
      console.log('Berhasil terhubung ke HiveMQ!');
      setIsConnected(true);
      
      // 2. Subscribe ke topik sensor saat terhubung
      mqttClient.subscribe('esp32/sensor/data', (err) => {
        if (!err) console.log('Subscribed to esp32/sensor/data');
      });
    });

    // 3. Menangkap pesan yang masuk
    mqttClient.on('message', (topic, message) => {
      if (topic === 'esp32/sensor/data') {
        try {
          // Asumsi ESP32 mengirim data dalam format JSON
          const parsedData = JSON.parse(message.toString());
          setSensorData(parsedData);
        } catch (error) {
          console.error("Gagal parse JSON MQTT:", error);
        }
      }
    });

    setClient(mqttClient);

    // 4. Cleanup connection saat komponen dilepas (unmount)
    return () => {
      mqttClient.end();
    };
  }, []);

  // Fungsi untuk mengirim perintah ke Buzzer
  const triggerBuzzer = (status: "ON" | "OFF") => {
    if (client && isConnected) {
      client.publish('esp32/buzzer/control', JSON.stringify({ action: status }));
    }
  };

  return { isConnected, sensorData, triggerBuzzer };
}