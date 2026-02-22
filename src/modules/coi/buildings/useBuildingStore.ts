import { useSyncExternalStore } from 'react';

import { MOCK_BUILDINGS } from './building.mock-data';
import type { Building, BuildingFormValues } from './building.types';
import { MOCK_TEMPLATES } from './template.mock-data';
import type { COITemplate, TemplateFormValues } from './template.types';

// ── Buildings store ─────────────────────────────────────────────────

let buildings: Building[] = [...MOCK_BUILDINGS];
let bVersion = 0;
const bListeners = new Set<() => void>();

function emitBuildingChange() {
  bVersion++;
  bListeners.forEach((l) => l());
}

function subscribeBldg(listener: () => void) {
  bListeners.add(listener);
  return () => bListeners.delete(listener);
}

function getBldgSnapshot(): Building[] {
  return buildings;
}

function getBldgServerSnapshot(): Building[] {
  return MOCK_BUILDINGS;
}

// ── Templates store ─────────────────────────────────────────────────

let templates: COITemplate[] = [...MOCK_TEMPLATES];
let tVersion = 0;
const tListeners = new Set<() => void>();

function emitTemplateChange() {
  tVersion++;
  tListeners.forEach((l) => l());
}

function subscribeTmpl(listener: () => void) {
  tListeners.add(listener);
  return () => tListeners.delete(listener);
}

function getTmplSnapshot(): COITemplate[] {
  return templates;
}

function getTmplServerSnapshot(): COITemplate[] {
  return MOCK_TEMPLATES;
}

// ── Building Public API ─────────────────────────────────────────────

/** Reactive hook — all buildings. */
export function useBuildings(): Building[] {
  return useSyncExternalStore(subscribeBldg, getBldgSnapshot, getBldgServerSnapshot);
}

/** Reactive hook — single building by ID. */
export function useBuilding(id: string): Building | undefined {
  const all = useBuildings();
  return all.find((b) => b.id === id);
}

/** Add a new building from form values. Returns the created building. */
export function addBuilding(values: BuildingFormValues): Building {
  const now = new Date().toISOString();
  const newBuilding: Building = {
    id: `b-${String(Date.now()).slice(-6)}`,
    name: values.name,
    address: {
      street: values.street,
      city: values.city,
      state: values.state,
      zip: values.zip,
    },
    certificateHolder: {
      name: values.certificateHolderName,
      address: values.certificateHolderAddress,
    },
    templateId: values.templateId || undefined,
    vendorCount: 0,
    compliancePercentage: 0,
    createdAt: now,
    updatedAt: now,
  };

  buildings = [newBuilding, ...buildings];
  emitBuildingChange();
  return newBuilding;
}

/** Update an existing building. */
export function updateBuilding(
  id: string,
  values: Partial<BuildingFormValues>,
): Building | undefined {
  const idx = buildings.findIndex((b) => b.id === id);
  if (idx === -1) {
    return undefined;
  }

  const existing = buildings[idx];
  if (!existing) {
    return undefined;
  }
  const updated: Building = {
    ...existing,
    name: values.name ?? existing.name,
    address: {
      street: values.street ?? existing.address.street,
      city: values.city ?? existing.address.city,
      state: values.state ?? existing.address.state,
      zip: values.zip ?? existing.address.zip,
    },
    certificateHolder: {
      name: values.certificateHolderName ?? existing.certificateHolder.name,
      address: values.certificateHolderAddress ?? existing.certificateHolder.address,
    },
    templateId: values.templateId ?? existing.templateId,
    updatedAt: new Date().toISOString(),
  };

  buildings = buildings.map((b, i) => (i === idx ? updated : b));
  emitBuildingChange();
  return updated;
}

/** Delete a building by ID. */
export function deleteBuilding(id: string): boolean {
  const before = buildings.length;
  buildings = buildings.filter((b) => b.id !== id);
  if (buildings.length < before) {
    emitBuildingChange();
    return true;
  }
  return false;
}

// ── Template Public API ─────────────────────────────────────────────

/** Reactive hook — all templates. */
export function useTemplates(): COITemplate[] {
  return useSyncExternalStore(subscribeTmpl, getTmplSnapshot, getTmplServerSnapshot);
}

/** Reactive hook — single template by ID. */
export function useTemplate(id: string): COITemplate | undefined {
  const all = useTemplates();
  return all.find((t) => t.id === id);
}

/** Add a new template from form values. Returns the created template. */
export function addTemplate(values: TemplateFormValues): COITemplate {
  const now = new Date().toISOString();
  const newTemplate: COITemplate = {
    id: `t-${String(Date.now()).slice(-6)}`,
    name: values.name,
    description: values.description || undefined,
    isDefault: values.isDefault,
    policyRequirements: values.policyRequirements,
    additionalInsuredRequired: values.additionalInsuredRequired,
    waiverOfSubrogationRequired: values.waiverOfSubrogationRequired,
    endorsementRequired: values.endorsementRequired,
    additionalVerbiage: values.additionalVerbiage || undefined,
    buildingIds: [],
    createdAt: now,
    updatedAt: now,
  };

  templates = [newTemplate, ...templates];
  emitTemplateChange();
  return newTemplate;
}

/** Delete a template by ID. */
export function deleteTemplate(id: string): boolean {
  const before = templates.length;
  templates = templates.filter((t) => t.id !== id);
  if (templates.length < before) {
    emitTemplateChange();
    return true;
  }
  return false;
}

/** Get building version for cache-busting. */
export function getBuildingVersion(): number {
  return bVersion;
}

/** Get template version for cache-busting. */
export function getTemplateVersion(): number {
  return tVersion;
}
