/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useEffect, useContext, useCallback, useRef } from 'react';
import toast from 'react-hot-toast';
import leadService from '../services/leadService';
import { useAuth } from './AuthContext';

/**
 * @typedef {Object} Lead
 * @property {string} id - Client side identifier (mapped to _id from DB).
 * @property {string} _id - MongoDB identifier.
 * @property {string} name - Contact name.
 * @property {string} company - Company name.
 * @property {string} email - Email address.
 * @property {string} phone - Phone number.
 * @property {'New'|'Contacted'|'Meeting Scheduled'|'Proposal Sent'|'Won'|'Lost'} status - Pipeline stage.
 * @property {'Website'|'Referral'|'LinkedIn'|'Cold Call'|'Email Campaign'|'Other'} source - Lead origin channel.
 * @property {string} createdAt - ISO date string.
 */

/**
 * @typedef {Object} LeadContextValue
 * @property {Lead[]} leads - Array of lead records.
 * @property {boolean} isLoading - Loading state indicator.
 * @property {Object|null} pagination - Pagination metadata from server.
 * @property {function(Object): Promise<void>} fetchLeads - Retrieve leads from API.
 * @property {function(Object): Promise<Lead>} addLead - Call API to create a lead and prepend it.
 * @property {function(string, Object): Promise<Lead>} updateLead - Call API to edit lead details.
 * @property {function(string): Promise<void>} deleteLead - Call API to remove lead record.
 * @property {function(string): Lead|undefined} getLeadById - Get lead details by client id.
 */

export const LeadContext = createContext(undefined);

// Helper function to map MongoDB _id to standard client-side id
const formatLead = (lead) => {
  if (!lead) return lead;
  return {
    ...lead,
    id: lead.id || lead._id,
  };
};

/**
 * LeadProvider Component
 * Scopes lead state and actions using the leadService API.
 */
export function LeadProvider({ children }) {
  const [leads, setLeads] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pagination, setPagination] = useState(null);
  const { token } = useAuth();

  /**
   * Retrieves leads with optional filter/search/pagination params
   */
  const fetchLeads = useCallback(async (params = {}) => {
    setIsLoading(true);
    try {
      const response = await leadService.getLeads(params);
      const fetchedLeads = (response.data || []).map(formatLead);
      setLeads(fetchedLeads);
      setPagination(response.pagination || null);
    } catch (error) {
      const errMsg = error.response?.data?.message || error.message || 'Failed to fetch leads';
      toast.error(errMsg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Add a new lead
   */
  const addLead = useCallback(async (leadData) => {
    setIsLoading(true);
    try {
      const response = await leadService.createLead(leadData);
      const newLead = formatLead(response.data);
      setLeads((prev) => [newLead, ...prev]);
      toast.success(`Lead for "${newLead.name}" created successfully!`);
      return newLead;
    } catch (error) {
      const errMsg = error.response?.data?.message || error.message || 'Failed to create lead';
      toast.error(errMsg);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Update lead details
   */
  const updateLead = useCallback(async (id, leadData) => {
    setIsLoading(true);
    try {
      const response = await leadService.updateLead(id, leadData);
      const updatedLead = formatLead(response.data);
      setLeads((prev) =>
        prev.map((lead) => (lead.id === id || lead._id === id ? updatedLead : lead))
      );
      toast.success(`Lead for "${updatedLead.name}" updated successfully!`);
      return updatedLead;
    } catch (error) {
      const errMsg = error.response?.data?.message || error.message || 'Failed to update lead';
      toast.error(errMsg);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Delete lead
   */
  const deleteLead = useCallback(async (id) => {
    setIsLoading(true);
    try {
      await leadService.deleteLead(id);
      setLeads((prev) => prev.filter((lead) => lead.id !== id && lead._id !== id));
      toast.success('Lead has been deleted successfully.');
    } catch (error) {
      const errMsg = error.response?.data?.message || error.message || 'Failed to delete lead';
      toast.error(errMsg);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Retrieves single lead by client-side id
   */
  const getLeadById = useCallback(
    (id) => leads.find((lead) => lead.id === id || lead._id === id),
    [leads]
  );

  // Store fetchLeads in a ref so the effect below can call it without
  // needing it as a dependency (avoids infinite re-fetch loops).
  const fetchLeadsRef = useRef(fetchLeads);
  useEffect(() => { fetchLeadsRef.current = fetchLeads; });

  // Automatically fetch leads once user logs in. Depends only on `token` string.
  useEffect(() => {
    if (token) {
      fetchLeadsRef.current();
    } else {
      setTimeout(() => {
        setLeads([]);
        setPagination(null);
      }, 0);
    }
  }, [token]);

  const value = {
    leads,
    isLoading,
    pagination,
    fetchLeads,
    addLead,
    updateLead,
    deleteLead,
    getLeadById,
  };

  return (
    <LeadContext.Provider value={value}>
      {children}
    </LeadContext.Provider>
  );
}

/**
 * Custom hook to consume the LeadContext.
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
