// src/services/devicesService.ts
import { devicesMock, type Device, type DeviceStatus } from '../data/devicesMock';

let devicesState: Device[] = [...devicesMock];

export async function getDevices(): Promise<Device[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(devicesState);
    }, 300);
  });
}

// Simula un endpoint para cambiar estado
export async function updateDeviceStatus(
  deviceId: number,
  newStatus: DeviceStatus
): Promise<Device | null> {
  return new Promise((resolve) => {
    setTimeout(() => {
      devicesState = devicesState.map((d) =>
        d.id === deviceId ? { ...d, estado: newStatus } : d
      );

      const updated = devicesState.find((d) => d.id === deviceId) ?? null;
      resolve(updated);
    }, 200);
  });
}
