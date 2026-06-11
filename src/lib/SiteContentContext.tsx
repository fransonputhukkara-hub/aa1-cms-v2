import React, { createContext, useContext, useEffect, useState } from 'react';
import { defaultSiteContent, type SiteContent } from '../data/siteContent';
import { supabase } from './supabase';

interface SiteContentContextType {
  content: SiteContent;
  draftContent: SiteContent;
  loading: boolean;
  error: string | null;
  updateDraft: (newDraft: SiteContent) => void;
  saveDraft: () => Promise<{ success: boolean; error: string | null }>;
  publishLive: () => Promise<{ success: boolean; error: string | null }>;
  revertLastChange: () => void;
  resetToDefault: () => void;
}

const SiteContentContext = createContext<SiteContentContextType | undefined>(undefined);

export function SiteContentProvider({ children }: { children: React.ReactNode }) {
  const [content, setContent] = useState<SiteContent>(defaultSiteContent);
  const [draftContent, setDraftContent] = useState<SiteContent>(defaultSiteContent);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load initial content
  useEffect(() => {
    // 1. Try to load from localStorage first for instant response
    const cachedLive = localStorage.getItem('sanskriti_site_content_live');
    const cachedDraft = localStorage.getItem('sanskriti_site_content_draft');
    
    if (cachedLive) {
      try {
        setContent(JSON.parse(cachedLive));
      } catch (e) {
        console.error('Failed to parse cached live content:', e);
      }
    }
    if (cachedDraft) {
      try {
        setDraftContent(JSON.parse(cachedDraft));
      } catch (e) {
        console.error('Failed to parse cached draft content:', e);
      }
    }

    // 2. Fetch from Supabase
    async function fetchFromSupabase() {
      try {
        const { data, error: dbError } = await supabase
          .from('site_content')
          .select('key, value');

        if (dbError) {
          if (dbError.code === 'PGRST116' || dbError.message.includes('does not exist')) {
            console.log('site_content table not found or empty. Using default content.');
          } else {
            setError(dbError.message);
          }
        } else if (data && data.length > 0) {
          const liveRow = data.find((r) => r.key === 'content');
          const draftRow = data.find((r) => r.key === 'content_draft');

          if (liveRow && liveRow.value) {
            const liveVal = liveRow.value as SiteContent;
            setContent(liveVal);
            localStorage.setItem('sanskriti_site_content_live', JSON.stringify(liveVal));
            
            // If there's no draft row in the DB yet, sync draft with live
            if (!draftRow) {
              setDraftContent(liveVal);
              localStorage.setItem('sanskriti_site_content_draft', JSON.stringify(liveVal));
            }
          }

          if (draftRow && draftRow.value) {
            const draftVal = draftRow.value as SiteContent;
            setDraftContent(draftVal);
            localStorage.setItem('sanskriti_site_content_draft', JSON.stringify(draftVal));
          }
        }
      } catch (e: any) {
        console.warn('Supabase not fully configured or site_content table missing:', e.message);
      } finally {
        setLoading(false);
      }
    }

    fetchFromSupabase();
  }, []);

  const updateDraft = (newDraft: SiteContent) => {
    setDraftContent(newDraft);
    localStorage.setItem('sanskriti_site_content_draft', JSON.stringify(newDraft));
  };

  const saveDraft = async (): Promise<{ success: boolean; error: string | null }> => {
    try {
      const { error: dbError } = await supabase
        .from('site_content')
        .upsert({ key: 'content_draft', value: draftContent }, { onConflict: 'key' });

      if (dbError) {
        console.error('Failed to save draft to Supabase:', dbError);
        return { success: false, error: dbError.message };
      }
      return { success: true, error: null };
    } catch (e: any) {
      console.error('Error saving draft:', e);
      return { success: false, error: e.message || 'Unknown error occurred' };
    }
  };

  const publishLive = async (): Promise<{ success: boolean; error: string | null }> => {
    try {
      const timestamp = new Date().toISOString();
      const updatedLiveContent = {
        ...draftContent,
        lastUpdated: timestamp
      };

      // 1. Upsert live row
      const { error: liveError } = await supabase
        .from('site_content')
        .upsert({ key: 'content', value: updatedLiveContent }, { onConflict: 'key' });

      if (liveError) {
        console.error('Failed to publish live to Supabase:', liveError);
        return { success: false, error: liveError.message };
      }

      // 2. Also keep draft row synced
      await supabase
        .from('site_content')
        .upsert({ key: 'content_draft', value: updatedLiveContent }, { onConflict: 'key' });

      // 3. Update local states
      setContent(updatedLiveContent);
      setDraftContent(updatedLiveContent);
      localStorage.setItem('sanskriti_site_content_live', JSON.stringify(updatedLiveContent));
      localStorage.setItem('sanskriti_site_content_draft', JSON.stringify(updatedLiveContent));

      return { success: true, error: null };
    } catch (e: any) {
      console.error('Error publishing live:', e);
      return { success: false, error: e.message || 'Unknown error occurred' };
    }
  };

  const revertLastChange = () => {
    // Overwrite local draft with current published live content
    setDraftContent(content);
    localStorage.setItem('sanskriti_site_content_draft', JSON.stringify(content));
  };

  const resetToDefault = () => {
    setContent(defaultSiteContent);
    setDraftContent(defaultSiteContent);
    localStorage.removeItem('sanskriti_site_content_live');
    localStorage.removeItem('sanskriti_site_content_draft');
  };

  return (
    <SiteContentContext.Provider
      value={{
        content,
        draftContent,
        loading,
        error,
        updateDraft,
        saveDraft,
        publishLive,
        revertLastChange,
        resetToDefault,
      }}
    >
      {children}
    </SiteContentContext.Provider>
  );
}

export function useSiteContent() {
  const context = useContext(SiteContentContext);
  if (context === undefined) {
    throw new Error('useSiteContent must be used within a SiteContentProvider');
  }
  return context;
}
