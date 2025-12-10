// src/services/crewDeviceService.ts
import {
  crewDevicesMock,
  type CrewDevice,
  type DeviceStatus,
} from '../data/crewDevicesMock';

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function getDevicesByCrewId(
  crewId: number
): Promise<CrewDevice[]> {
  await delay(300);
  return crewDevicesMock.filter((d) => d.crewId === crewId);
}

export async function updateDeviceStatus(
  deviceId: number,
  newStatus: DeviceStatus
): Promise<void> {
  await delay(200);

  const idx = crewDevicesMock.findIndex((d) => d.id === deviceId);
  if (idx !== -1) {
    crewDevicesMock[idx] = { ...crewDevicesMock[idx], estado: newStatus };
  }
}
