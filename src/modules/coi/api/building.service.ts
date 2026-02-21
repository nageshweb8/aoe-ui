import type { Building, BuildingFormValues } from '../buildings/building.types';

const API_BASE = process.env['NEXT_PUBLIC_API_BASE_URL']
  ? `${process.env['NEXT_PUBLIC_API_BASE_URL']}/api/coi/buildings`
  : '/api/coi/buildings';

/** Fetch all buildings */
export async function getBuildings(): Promise<Building[]> {
  const res = await fetch(API_BASE);
  if (!res.ok) {
    throw new Error(`Failed to fetch buildings (${res.status})`);
  }
  return res.json();
}

/** Fetch a single building by ID */
export async function getBuilding(id: string): Promise<Building> {
  const res = await fetch(`${API_BASE}/${id}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch building (${res.status})`);
  }
  return res.json();
}

/** Create a new building */
export async function createBuilding(data: BuildingFormValues): Promise<Building> {
  const res = await fetch(API_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    throw new Error(`Failed to create building (${res.status})`);
  }
  return res.json();
}

/** Update an existing building */
export async function updateBuilding(
  id: string,
  data: Partial<BuildingFormValues>,
): Promise<Building> {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    throw new Error(`Failed to update building (${res.status})`);
  }
  return res.json();
}
