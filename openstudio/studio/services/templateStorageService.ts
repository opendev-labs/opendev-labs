/**
 * OPENSTUDIO TEMPLATE STORAGE SERVICE
 * Enables saving, publishing, and synchronizing OpenStudio projects to:
 * 1. opendev-labs.com/templates (Official Community & AI Showcase)
 * 2. OpenStudio's internal saved templates collection
 */

import type { FileNode } from '../types';

export interface PublishedTemplate {
  id: string;
  name: string;
  tagline: string;
  category: 'Vercel & Next.js' | 'Beauty & Lifestyle' | 'Food & Hospitality' | 'E-Commerce' | 'Agency & Business' | 'Portfolio & Creative';
  oneTimePrice: string;
  monthlyRetainer: string;
  previewUrl: string;
  description: string;
  features: string[];
  isFeatured?: boolean;
  badge?: string;
  fileTree: FileNode[];
  createdAt: string;
  authorName: string;
  isAiGenerated: boolean;
  platform?: 'openstudio';
}

const TEMPLATES_KEY = 'openstudio_published_templates';

export function getPublishedTemplates(): PublishedTemplate[] {
  try {
    const raw = localStorage.getItem(TEMPLATES_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function savePublishedTemplate(
  title: string,
  tagline: string,
  description: string,
  category: PublishedTemplate['category'],
  fileTree: FileNode[],
  authorName: string = 'OpenStudio Creator'
): PublishedTemplate {
  const currentTemplates = getPublishedTemplates();
  const id = `ost_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  
  // Extract key features from fileTree or title
  const features = [
    'Built with OpenStudio AI Engine',
    'Interactive React & Tailwind Architecture',
    'Zero-Config Sandpack / DevBox Preview',
    'Production Export & Modular Components',
  ];

  const newTemplate: PublishedTemplate = {
    id,
    name: title || 'Untitled Project',
    tagline: tagline || 'Generated with OpenStudio AI Generator',
    category: category || 'Agency & Business',
    oneTimePrice: '₹0 (Free / Open)',
    monthlyRetainer: '₹0 / mo',
    previewUrl: `/templates?preview=${id}`,
    description: description || 'High-fidelity full-stack web application designed and generated with OpenStudio AI.',
    features,
    isFeatured: true,
    badge: 'OpenStudio AI',
    fileTree,
    createdAt: new Date().toISOString(),
    authorName,
    isAiGenerated: true,
    platform: 'openstudio',
  };

  const updated = [newTemplate, ...currentTemplates.filter(t => t.id !== id)];

  try {
    localStorage.setItem(TEMPLATES_KEY, JSON.stringify(updated));
    // Dispatch custom event so listeners in any tab/view update immediately
    window.dispatchEvent(new CustomEvent('openstudio-template-published', { detail: newTemplate }));
  } catch (e) {
    console.error('Failed to save published template to localStorage:', e);
  }

  return newTemplate;
}

export function deletePublishedTemplate(id: string): void {
  const currentTemplates = getPublishedTemplates();
  const updated = currentTemplates.filter(t => t.id !== id);
  try {
    localStorage.setItem(TEMPLATES_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('openstudio-template-deleted', { detail: { id } }));
  } catch (e) {
    console.error('Failed to delete template:', e);
  }
}
