import { createContext, useState, useEffect, useContext, useCallback } from 'react';

/**
 * @typedef {Object} Lead
 * @property {string} id - Unique identifier (crypto.randomUUID() or Date.now() fallback).
 * @property {string} name - Contact name.
 * @property {string} company - Company name.
 * @property {string} email - Email address.
 * @property {string} phone - Phone number.
 * @property {'New'|'Contacted'|'Meeting Scheduled'|'Proposal Sent'|'Won'|'Lost'} status - Pipeline stage.
 * @property {'Website'|'Referral'|'LinkedIn'|'Cold Call'|'Email Campaign'|'Other'} source - Lead origin channel.
 * @property {string} createdAt - ISO 8601 date string when the lead was created.
 */

/**
 * @typedef {Object} LeadContextValue
 * @property {Lead[]} leads - The full array of lead records.
 * @property {function(Omit<Lead, 'id'|'createdAt'>): Lead} addLead - Creates a new lead with auto-generated id and createdAt.
 * @property {function(string, Partial<Lead>): void} updateLead - Merges updates into an existing lead by id.
 * @property {function(string): void} deleteLead - Removes a lead by id.
 * @property {function(string): Lead|undefined} getLeadById - Looks up a lead by its id.
 */

/** localStorage key used for persisting the leads array. */
const STORAGE_KEY = 'startup_crm_leads';

/** Default seed data used when localStorage is empty (first-time visitors). */
const SEED_LEADS = [
  { id: '1', name: 'Sarah Jenkins', company: 'Apex Global', email: 'sjenkins@apex.io', phone: '+1 (555) 234-5678', status: 'Meeting Scheduled', source: 'LinkedIn', createdAt: '2026-06-12T00:00:00.000Z' },
  { id: '2', name: 'Michael Chen', company: 'NextGen Solutions', email: 'm.chen@nextgen.com', phone: '+1 (555) 876-5432', status: 'Contacted', source: 'Website', createdAt: '2026-06-14T00:00:00.000Z' },
  { id: '3', name: 'Elena Rostova', company: 'Siberia Tech', email: 'elena@siberia.tech', phone: '+7 (909) 123-4567', status: 'New', source: 'Referral', createdAt: '2026-06-15T00:00:00.000Z' },
  { id: '4', name: 'Marcus Brody', company: 'Adventure Corp', email: 'brody@adventure.com', phone: '+1 (555) 345-6789', status: 'Lost', source: 'Cold Call', createdAt: '2026-06-08T00:00:00.000Z' },
  { id: '5', name: 'David Miller', company: 'Miller Brewing', email: 'david@miller.co', phone: '+1 (555) 456-7890', status: 'Meeting Scheduled', source: 'Email Campaign', createdAt: '2026-06-11T00:00:00.000Z' },
  { id: '6', name: 'Aisha Rahman', company: 'Indus Ventures', email: 'aisha@indus.vc', phone: '+91 98765 43210', status: 'New', source: 'Website', createdAt: '2026-06-15T00:00:00.000Z' },
  { id: '7', name: 'Oliver Hansen', company: 'Nordic Designs', email: 'oliver@nordic.dk', phone: '+45 33 44 55 66', status: 'Contacted', source: 'LinkedIn', createdAt: '2026-06-13T00:00:00.000Z' },
  { id: '8', name: 'Yuki Tanaka', company: 'Kyoto Robotics', email: 'tanaka@kyoto.jp', phone: '+81 75 123 4567', status: 'Won', source: 'Referral', createdAt: '2026-06-10T00:00:00.000Z' },
];

/**
 * Generates a unique ID for a new lead.
 * Prefers crypto.randomUUID() when available, falls back to Date.now().
 *
 * @returns {string} A unique identifier string.
 */
const generateId = () => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return String(Date.now());
};

/**
 * React Context object for lead data.
 * Consumer components access this via the useLeads() hook.
 */
export const LeadContext = createContext(/** @type {LeadContextValue|undefined} */ (undefined));

/**
 * LeadProvider Component
 * Wraps the application (or a subtree) to provide centralized lead state management.
 * Initializes from localStorage, persists on every mutation, and exposes CRUD helpers.
 *
 * @param {{ children: React.ReactNode }} props
 * @returns {React.JSX.Element}
 */
export function LeadProvider({ children }) {
  const [leads, setLeads] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // Corrupted storage — fall through to seed data
    }
    return SEED_LEADS;
  });

  // Persist leads to localStorage whenever the array changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(leads));
  }, [leads]);

  /**
   * Creates a new lead record with an auto-generated `id` and `createdAt` timestamp.
   * The new lead is prepended to the array so it appears first in lists.
   *
   * @param {Omit<Lead, 'id'|'createdAt'>} leadData - Lead fields without id/createdAt.
   * @returns {Lead} The fully-formed lead object that was added.
   */
  const addLead = useCallback((leadData) => {
    const newLead = {
      ...leadData,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };
    setLeads((prev) => [newLead, ...prev]);
    return newLead;
  }, []);

  /**
   * Updates an existing lead by merging partial data into the record with the matching id.
   *
   * @param {string} id - The id of the lead to update.
   * @param {Partial<Lead>} updates - The fields to merge into the lead.
   */
  const updateLead = useCallback((id, updates) => {
    setLeads((prev) =>
      prev.map((lead) => (lead.id === id ? { ...lead, ...updates } : lead))
    );
  }, []);

  /**
   * Removes a lead from the array by its id.
   *
   * @param {string} id - The id of the lead to delete.
   */
  const deleteLead = useCallback((id) => {
    setLeads((prev) => prev.filter((lead) => lead.id !== id));
  }, []);

  /**
   * Retrieves a single lead by its id.
   *
   * @param {string} id - The id to look up.
   * @returns {Lead|undefined} The matching lead, or undefined if not found.
   */
  const getLeadById = useCallback(
    (id) => leads.find((lead) => lead.id === id),
    [leads]
  );

  /** @type {LeadContextValue} */
  const value = { leads, addLead, updateLead, deleteLead, getLeadById };

  return (
    <LeadContext.Provider value={value}>
      {children}
    </LeadContext.Provider>
  );
}

/**
 * Custom hook to consume the LeadContext.
 * Throws a descriptive error if called outside a LeadProvider.
 *
 * @returns {LeadContextValue} The lead context value.
 */
export function useLeads() {
  const context = useContext(LeadContext);
  if (context === undefined) {
    throw new Error(
      'useLeads() must be used within a <LeadProvider>. ' +
      'Wrap your component tree with <LeadProvider> in main.jsx or App.jsx.'
    );
  }
  return context;
}
