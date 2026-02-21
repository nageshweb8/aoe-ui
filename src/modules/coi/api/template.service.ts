import type { COITemplate, TemplateFormValues } from '../buildings/template.types';

const API_BASE = process.env['NEXT_PUBLIC_API_BASE_URL']
  ? `${process.env['NEXT_PUBLIC_API_BASE_URL']}/api/coi/templates`
  : '/api/coi/templates';

/** Fetch all templates */
export async function getTemplates(): Promise<COITemplate[]> {
  const res = await fetch(API_BASE);
  if (!res.ok) {
    throw new Error(`Failed to fetch templates (${res.status})`);
  }
  return res.json();
}

/** Fetch a single template by ID */
export async function getTemplate(id: string): Promise<COITemplate> {
  const res = await fetch(`${API_BASE}/${id}`);
  if (!res.ok) {
    throw new Error(`Failed to fetch template (${res.status})`);
  }
  return res.json();
}

/** Create a new template */
export async function createTemplate(data: TemplateFormValues): Promise<COITemplate> {
  const res = await fetch(API_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    throw new Error(`Failed to create template (${res.status})`);
  }
  return res.json();
}

/** Update an existing template */
export async function updateTemplate(
  id: string,
  data: Partial<TemplateFormValues>,
): Promise<COITemplate> {
  const res = await fetch(`${API_BASE}/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    throw new Error(`Failed to update template (${res.status})`);
  }
  return res.json();
}

/** Delete a template */
export async function deleteTemplate(id: string): Promise<void> {
  const res = await fetch(`${API_BASE}/${id}`, { method: 'DELETE' });
  if (!res.ok) {
    throw new Error(`Failed to delete template (${res.status})`);
  }
}
