import type { CrewMember } from '../data/crewMock';

const STORAGE_KEY = 'LOGISTIC_TRIPULANTES';

export function loadCrewFromStorage(): CrewMember[] | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as CrewMember[];
  } catch {
    return null;
  }
}

export function saveCrewToStorage(crew: CrewMember[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(crew));
}
