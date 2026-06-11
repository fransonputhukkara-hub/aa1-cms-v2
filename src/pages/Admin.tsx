import { useState, useEffect } from 'react';
import { useSiteContent } from '../lib/SiteContentContext';
import { defaultSiteContent, type SiteContent } from '../data/siteContent';
import { supabase } from '../lib/supabase';
import {
  Save,
  Download,
  RefreshCw,
  Plus,
  Trash2,
  Check,
  AlertCircle,
  ExternalLink,
  BookOpen,
  Image as ImageIcon,
  Phone,
  FileText,
  Megaphone,
  Grid,
  Settings,
  ArrowUp,
  ArrowDown,
  Globe,
  Share2,
  FolderOpen,
  Upload,
  Clock,
  Unlock,
  CornerUpLeft
} from 'lucide-react';

export default function Admin() {
  const { 
    content, 
    draftContent, 
    updateDraft, 
    saveDraft, 
    publishLive, 
    revertLastChange, 
    resetToDefault, 
    loading 
  } = useSiteContent();

  const [activeTab, setActiveTab] = useState<'inventory' | 'content'>('content');
  const [activeSubSection, setActiveSubSection] = useState<
    'logos' | 'announcements' | 'hero' | 'layout' | 'about' | 'contact' | 'socials' | 'seo' | 'media'
  >('logos');
  
  const [editedContent, setEditedContent] = useState<SiteContent>(draftContent);
  const [saveStatus, setSaveStatus] = useState<{ type: 'idle' | 'success' | 'error'; message: string }>({ type: 'idle', message: '' });
  const [syncing, setSyncing] = useState(false);
  const [publishing, setPublishing] = useState(false);
  
  // Media library state
  const [mediaFiles, setMediaFiles] = useState<{ name: string; url: string }[]>([]);
  const [uploading, setUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSqlHelp, setShowSqlHelp] = useState(false);

  // Sync state with content if it loads later
  useEffect(() => {
    setEditedContent(draftContent);
  }, [draftContent]);

  // Fetch Media library on load
  useEffect(() => {
    if (activeSubSection === 'media') {
      fetchMediaFiles();
    }
  }, [activeSubSection]);

  const fetchMediaFiles = async () => {
    try {
      const { data, error } = await supabase.storage.from('media').list('uploads', {
        limit: 100,
        sortBy: { column: 'name', order: 'desc' }
      });
      if (error) throw error;
      if (data) {
        const files = data.map((f) => {
          const { data: { publicUrl } } = supabase.storage.from('media').getPublicUrl(`uploads/${f.name}`);
          return { name: f.name, url: publicUrl };
        });
        setMediaFiles(files);
      }
    } catch (e: any) {
      console.warn("Storage list failed (media bucket probably doesn't exist yet):", e.message);
    }
  };

  const handleUploadFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    setUploading(true);
    try {
      const ext = file.name.split('.').pop();
      const cleanName = file.name.replace(/[^a-zA-Z0-9]/g, '_');
      const fileName = `${Date.now()}_${cleanName}.${ext}`;
      const filePath = `uploads/${fileName}`;

      const { error } = await supabase.storage.from('media').upload(filePath, file);
      if (error) throw error;

      await fetchMediaFiles();
      setSaveStatus({ type: 'success', message: 'File successfully uploaded to Media Library!' });
    } catch (err: any) {
      console.error(err);
      setSaveStatus({ 
        type: 'error', 
        message: `Upload failed: ${err.message || 'Make sure the "media" bucket exists and policies allow uploads.'}` 
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteFile = async (name: string) => {
    if (!window.confirm(`Are you sure you want to delete "${name}" from storage?`)) return;
    try {
      const { error } = await supabase.storage.from('media').remove([`uploads/${name}`]);
      if (error) throw error;
      await fetchMediaFiles();
      setSaveStatus({ type: 'success', message: 'Item deleted successfully.' });
    } catch (err: any) {
      setSaveStatus({ type: 'error', message: `Delete failed: ${err.message}` });
    }
  };

  const handleFieldChange = (section: string | undefined, field: string, value: any) => {
    const updated = { ...editedContent } as any;
    if (section) {
      updated[section] = {
        ...updated[section],
        [field]: value
      };
    } else {
      updated[field] = value;
    }
    setEditedContent(updated);
    updateDraft(updated); // Sync locally to localStorage instantly
  };

  const handleHeroSectionFieldChange = (sectionKey: string, field: string, value: any) => {
    const updated = { ...editedContent };
    updated.hero = {
      ...updated.hero,
      [sectionKey]: {
        ...(updated.hero as any)[sectionKey],
        [field]: value
      }
    };
    setEditedContent(updated);
    updateDraft(updated);
  };

  const handleNestedListChange = (section: string, listField: string, index: number, field: string, value: any) => {
    const updated = { ...editedContent } as any;
    const list = [...updated[section][listField]];
    list[index] = {
      ...list[index],
      [field]: value
    };
    updated[section][listField] = list;
    setEditedContent(updated);
    updateDraft(updated);
  };

  const handleAddListItem = (section: string, listField: string, defaultObj: any) => {
    const updated = { ...editedContent } as any;
    updated[section][listField] = [...updated[section][listField], defaultObj];
    setEditedContent(updated);
    updateDraft(updated);
  };

  const handleRemoveListItem = (section: string, listField: string, index: number) => {
    const updated = { ...editedContent } as any;
    updated[section][listField] = updated[section][listField].filter((_: any, idx: number) => idx !== index);
    setEditedContent(updated);
    updateDraft(updated);
  };



  // Section reordering
  const moveSection = (index: number, direction: 'up' | 'down') => {
    const layout = editedContent.layout || {
      hero: true,
      collections: true,
      story: true,
      testimonials: true,
      instagram: true,
      newsletter: true,
      order: ["hero", "collections", "story", "testimonials", "instagram", "newsletter"]
    };
    const order = [...(layout.order || ["hero", "collections", "story", "testimonials", "instagram", "newsletter"])];
    const nextIndex = direction === 'up' ? index - 1 : index + 1;
    if (nextIndex < 0 || nextIndex >= order.length) return;
    
    // Swap
    const temp = order[index];
    order[index] = order[nextIndex];
    order[nextIndex] = temp;

    handleFieldChange('layout', 'order', order);
  };

  // Draft operations
  const handleSaveDraft = async () => {
    setSyncing(true);
    setSaveStatus({ type: 'idle', message: '' });
    const res = await saveDraft();
    setSyncing(false);
    if (res.success) {
      setSaveStatus({ type: 'success', message: 'Draft saved successfully to Supabase! You can preview it on the site. Click Publish to make it live.' });
    } else {
      setSaveStatus({ type: 'error', message: `Database error: ${res.error || 'Verify permissions'}` });
    }
  };

  const handlePublishLive = async () => {
    if (!window.confirm("Publish Draft? This will instantly display all changes to visitors on your live website.")) return;
    setPublishing(true);
    setSaveStatus({ type: 'idle', message: '' });
    const res = await publishLive();
    setPublishing(false);
    if (res.success) {
      setSaveStatus({ type: 'success', message: 'Congratulations! Your draft changes are now live!' });
    } else {
      setSaveStatus({ type: 'error', message: `Publishing failed: ${res.error}` });
    }
  };

  const handleRevertChanges = () => {
    if (window.confirm("Discard draft edits? This rolls back the editor back to the last published live version.")) {
      revertLastChange();
      setSaveStatus({ type: 'success', message: 'Reverted draft to live site contents.' });
    }
  };

  const handleDownloadConfig = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(editedContent, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "siteContent.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleResetDefaults = () => {
    if (window.confirm("Are you sure you want to discard all changes and reset back to original website defaults?")) {
      resetToDefault();
      setEditedContent(defaultSiteContent);
      setSaveStatus({ type: 'success', message: 'Reset local settings back to system defaults.' });
    }
  };

  const filteredMedia = mediaFiles.filter(f => f.name.toLowerCase().includes(searchQuery.toLowerCase()));

  // Active styles for layout order mapping
  const sectionLabels: Record<string, string> = {
    hero: 'Homepage Hero Lookbook',
    collections: 'Bestsellers / Collections Grid',
    story: 'Story Lineage Section',
    testimonials: 'Customer Reviews & Testimonials',
    instagram: 'Instagram Carousel Feed',
    newsletter: 'Email Newsletter Subscription'
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <RefreshCw size={24} className="animate-spin text-wine-deep mb-4" />
        <span className="text-sm text-ink-soft tracking-wider uppercase font-medium">Loading content manager...</span>
      </div>
    );
  }

  // Fallbacks
  const logos = editedContent.logos || {
    header: "/logo.png",
    footer: "/logo.png",
    mobile: "/logo.png",
    desktopWidth: 160,
    desktopHeight: 50,
    mobileWidth: 120,
    mobileHeight: 40,
    headerSpacing: 15,
    footerSpacing: 20,
    fit: "contain" as const
  };

  const layout = editedContent.layout || {
    hero: true,
    collections: true,
    story: true,
    testimonials: true,
    instagram: true,
    newsletter: true,
    whatsapp: true,
    spotlight: true,
    order: ["hero", "collections", "story", "testimonials", "instagram", "newsletter"]
  };

  const announcementManager = editedContent.announcementManager || {
    enabled: true,
    text: "Complimentary Shipping Across India · Cash on Delivery Available",
    bgColor: "#280911",
    textColor: "#f1e5d1",
    btnText: "Shop New Arrivals",
    btnLink: "/shop",
    startDate: "",
    endDate: ""
  };

  const socials = editedContent.socials || {
    instagram: { enabled: true, url: "https://www.instagram.com/a1sanskritisilks" },
    facebook: { enabled: false, url: "https://facebook.com" },
    youtube: { enabled: false, url: "https://youtube.com" },
    pinterest: { enabled: false, url: "https://pinterest.com" },
    threads: { enabled: false, url: "https://threads.net" }
  };

  const seo = editedContent.seo || {
    metaTitle: "A1 Sanskriti Silks — Handwoven Kalyani Cotton & Soft Silk",
    metaDescription: "We've got you covered, from head to toe. Premium handwoven Kalyani cotton and soft silk sarees. Explore our digital lookbook.",
    keywords: "a1 sanskriti silks, handloom history, kalyani cotton, soft silk sarees",
    ogImage: "/logo.png"
  };

  return (
    <div className="max-w-[1280px] mx-auto px-5 py-20 font-sans">
      <div className="border-b border-wine/10 pb-6 mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="eyebrow">A1 Sanskriti Suite</span>
          <h1 className="text-4xl font-serif font-medium text-wine-deep mt-1">Website Manager</h1>
        </div>
        
        {/* Navigation Tabs */}
        <div className="flex bg-wine/5 p-1 rounded-sm border border-wine/10">
          <button
            onClick={() => setActiveTab('content')}
            className={`px-5 py-2 text-xs tracking-wider uppercase font-medium transition-all ${
              activeTab === 'content'
                ? 'bg-wine-deep text-white shadow-sm'
                : 'text-ink-soft hover:text-wine'
            }`}
          >
            Website Content
          </button>
          <button
            onClick={() => setActiveTab('inventory')}
            className={`px-5 py-2 text-xs tracking-wider uppercase font-medium transition-all ${
              activeTab === 'inventory'
                ? 'bg-wine-deep text-white shadow-sm'
                : 'text-ink-soft hover:text-wine'
            }`}
          >
            Inventory &amp; Stock
          </button>
        </div>
      </div>

      {activeTab === 'inventory' ? (
        <div className="bg-white border border-wine/10 rounded-sm p-10 text-center max-w-[640px] mx-auto my-12 shadow-[0_4px_30px_rgba(106,27,45,0.02)]">
          <h2 className="font-serif text-3xl text-wine-deep mb-4">Catalog Management</h2>
          <p className="text-ink-soft text-[14px] leading-[1.8] mb-8 font-light">
            Products, live stock levels, and store pricing are managed in the external 
            <strong> A1 Sanskriti POS Business Suite</strong>. Any inventory change made there appears on this online showroom instantly.
          </p>
          <a
            href="https://a1a-saas.vercel.app/inventory"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 bg-wine-deep text-white text-[11px] tracking-[0.2em] uppercase font-semibold py-3.5 px-8 rounded-sm hover:bg-wine transition-all shadow-md hover:-translate-y-0.5"
          >
            Open POS Suite <ExternalLink size={14} />
          </a>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-8 items-start">
          {/* Sub-navigation categories */}
          <div className="bg-wine/5 border border-wine/10 p-4 rounded-sm space-y-1">
            <span className="text-[10px] tracking-[0.2em] uppercase font-semibold text-wine-deep/60 px-3 py-2 block">
              Website Manager
            </span>
            
            {[
              { id: 'logos', label: 'Logo settings', icon: Settings },
              { id: 'announcements', label: 'Announcements', icon: Megaphone },
              { id: 'hero', label: 'Homepage Hero', icon: ImageIcon },
              { id: 'layout', label: 'Page Layouts', icon: Grid },
              { id: 'about', label: 'About Page', icon: BookOpen },
              { id: 'contact', label: 'Contacts', icon: Phone },
              { id: 'socials', label: 'Socials', icon: Share2 },
              { id: 'seo', label: 'SEO tags', icon: Globe },
              { id: 'media', label: 'Media Library', icon: FolderOpen },
            ].map((sub) => {
              const Icon = sub.icon;
              return (
                <button
                  key={sub.id}
                  onClick={() => setActiveSubSection(sub.id as any)}
                  className={`w-full text-left px-3 py-2.5 rounded-sm text-xs tracking-wider uppercase font-medium flex items-center gap-2.5 transition-colors ${
                    activeSubSection === sub.id ? 'bg-wine-deep text-white' : 'text-ink-soft hover:bg-wine/10 hover:text-wine'
                  }`}
                >
                  <Icon size={14} />
                  {sub.label}
                </button>
              );
            })}

            <div className="pt-6 mt-6 border-t border-wine/10 space-y-2.5 px-1.5">
              <div className="text-[9px] tracking-wider text-ink-soft/60 uppercase block mb-1">
                Draft Actions
              </div>
              <button
                onClick={handleSaveDraft}
                disabled={syncing}
                className="w-full bg-wine/10 hover:bg-wine/20 text-wine text-[10px] font-semibold tracking-[0.18em] uppercase py-3 rounded-sm flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50 border border-wine/15"
              >
                {syncing ? <RefreshCw size={12} className="animate-spin" /> : <Save size={12} />}
                Save Draft
              </button>
              <button
                onClick={handlePublishLive}
                disabled={publishing}
                className="w-full bg-wine-deep hover:bg-wine text-white text-[10px] font-semibold tracking-[0.18em] uppercase py-3 rounded-sm flex items-center justify-center gap-1.5 transition-colors shadow-md disabled:opacity-50"
              >
                {publishing ? <RefreshCw size={12} className="animate-spin" /> : <Globe size={12} />}
                Publish Live
              </button>
              <button
                onClick={handleRevertChanges}
                className="w-full border border-wine/20 hover:border-wine/40 text-wine hover:bg-wine/5 text-[10px] font-semibold tracking-[0.18em] uppercase py-3 rounded-sm flex items-center justify-center gap-1.5 transition-colors"
              >
                <CornerUpLeft size={12} />
                Revert Changes
              </button>
              <button
                onClick={handleDownloadConfig}
                className="w-full border border-dashed border-wine/20 hover:border-wine/40 text-wine/75 hover:bg-wine/5 text-[9px] font-semibold tracking-[0.18em] uppercase py-2 rounded-sm flex items-center justify-center gap-1.5 transition-colors"
              >
                <Download size={11} />
                Download JSON
              </button>
              <button
                onClick={handleResetDefaults}
                className="w-full text-center text-[9px] tracking-widest uppercase text-wine-deep/50 hover:text-wine transition-colors py-1.5 block"
              >
                Reset Defaults
              </button>

              {content.lastUpdated && (
                <div className="text-[8.5px] tracking-wider text-ink-soft/40 uppercase mt-3 text-center flex items-center justify-center gap-1">
                  <Clock size={10} />
                  <span>Published: {new Date(content.lastUpdated).toLocaleDateString()}</span>
                </div>
              )}
            </div>
          </div>

          {/* Form Content Panel */}
          <div className="bg-white border border-wine/10 rounded-sm p-6 sm:p-8 shadow-sm space-y-8 min-h-[550px]">
            
            {/* Save status notification bar */}
            {saveStatus.type !== 'idle' && (
              <div className={`p-4 border rounded-sm flex items-start gap-3 text-sm ${
                saveStatus.type === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-rose-50 border-rose-200 text-rose-800'
              }`}>
                {saveStatus.type === 'success' ? <Check size={18} className="shrink-0 mt-0.5 text-emerald-600" /> : <AlertCircle size={18} className="shrink-0 mt-0.5 text-rose-600" />}
                <div className="flex-1">{saveStatus.message}</div>
                <button onClick={() => setSaveStatus({ type: 'idle', message: '' })} className="text-xs opacity-60 hover:opacity-100 uppercase tracking-widest font-semibold ml-2">Dismiss</button>
              </div>
            )}

            {/* TAB 1: LOGO MANAGER */}
            {activeSubSection === 'logos' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-serif font-medium text-wine mb-1.5">Logo settings</h3>
                  <p className="text-ink-soft text-xs font-light">
                    Manage your site brand logos, spacing, dimensions, and display format.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Header Logo */}
                  <div className="border border-wine/10 p-4 rounded-sm bg-cream/5 space-y-3">
                    <label className="text-[10px] tracking-wider uppercase font-semibold text-wine block">Header Logo</label>
                    <div className="h-24 bg-cream/20 border border-dashed border-wine/15 rounded flex items-center justify-center p-2 relative overflow-hidden group">
                      <img src={logos.header || '/logo.png'} alt="Header preview" className="max-h-full max-w-full object-contain" />
                    </div>
                    <input
                      type="text"
                      value={logos.header}
                      onChange={(e) => handleFieldChange('logos', 'header', e.target.value)}
                      placeholder="/logo.png"
                      className="w-full border border-wine/15 rounded p-2 text-xs font-light bg-white"
                    />
                  </div>

                  {/* Footer Logo */}
                  <div className="border border-wine/10 p-4 rounded-sm bg-cream/5 space-y-3">
                    <label className="text-[10px] tracking-wider uppercase font-semibold text-wine block">Footer Logo</label>
                    <div className="h-24 bg-[#170407] border border-dashed border-white/10 rounded flex items-center justify-center p-2 relative overflow-hidden group">
                      <img 
                        src={logos.footer || '/logo.png'} 
                        alt="Footer preview" 
                        className="max-h-full max-w-full object-contain" 
                        style={{ filter: 'brightness(0) invert(1) contrast(0.8)' }}
                      />
                    </div>
                    <input
                      type="text"
                      value={logos.footer}
                      onChange={(e) => handleFieldChange('logos', 'footer', e.target.value)}
                      placeholder="/logo.png"
                      className="w-full border border-wine/15 rounded p-2 text-xs font-light bg-white"
                    />
                  </div>

                  {/* Mobile Logo */}
                  <div className="border border-wine/10 p-4 rounded-sm bg-cream/5 space-y-3">
                    <label className="text-[10px] tracking-wider uppercase font-semibold text-wine block">Mobile Logo</label>
                    <div className="h-24 bg-cream/20 border border-dashed border-wine/15 rounded flex items-center justify-center p-2 relative overflow-hidden group">
                      <img src={logos.mobile || logos.header || '/logo.png'} alt="Mobile preview" className="max-h-full max-w-full object-contain" />
                    </div>
                    <input
                      type="text"
                      value={logos.mobile}
                      onChange={(e) => handleFieldChange('logos', 'mobile', e.target.value)}
                      placeholder="/logo.png"
                      className="w-full border border-wine/15 rounded p-2 text-xs font-light bg-white"
                    />
                  </div>
                </div>

                <div className="border-t border-wine/10 pt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="text-[10px] tracking-wider uppercase font-semibold text-wine-deep block mb-1">Header Spacing (Padding)</label>
                    <input
                      type="number"
                      value={logos.headerSpacing}
                      onChange={(e) => handleFieldChange('logos', 'headerSpacing', parseInt(e.target.value) || 0)}
                      className="w-full border border-wine/15 rounded p-2 text-sm text-ink focus:outline-none bg-white"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] tracking-wider uppercase font-semibold text-wine-deep block mb-1">Footer Spacing (Padding)</label>
                    <input
                      type="number"
                      value={logos.footerSpacing}
                      onChange={(e) => handleFieldChange('logos', 'footerSpacing', parseInt(e.target.value) || 0)}
                      className="w-full border border-wine/15 rounded p-2 text-sm text-ink focus:outline-none bg-white"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] tracking-wider uppercase font-semibold text-wine-deep block mb-1">Logo fit style</label>
                    <select
                      value={logos.fit}
                      onChange={(e) => handleFieldChange('logos', 'fit', e.target.value)}
                      className="w-full border border-wine/15 rounded p-2 text-sm text-ink focus:outline-none bg-white"
                    >
                      <option value="contain">Contain (Fit boundary)</option>
                      <option value="cover">Cover (Fill boundary)</option>
                      <option value="original">Original Size</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2">
                  <div>
                    <label className="text-[9px] tracking-wider uppercase font-semibold text-wine-deep block mb-1">Desktop Width (px)</label>
                    <input
                      type="number"
                      value={logos.desktopWidth}
                      onChange={(e) => handleFieldChange('logos', 'desktopWidth', parseInt(e.target.value) || 0)}
                      className="w-full border border-wine/15 rounded p-2 text-xs text-ink bg-white"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] tracking-wider uppercase font-semibold text-wine-deep block mb-1">Desktop Height (px)</label>
                    <input
                      type="number"
                      value={logos.desktopHeight}
                      onChange={(e) => handleFieldChange('logos', 'desktopHeight', parseInt(e.target.value) || 0)}
                      className="w-full border border-wine/15 rounded p-2 text-xs text-ink bg-white"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] tracking-wider uppercase font-semibold text-wine-deep block mb-1">Mobile Width (px)</label>
                    <input
                      type="number"
                      value={logos.mobileWidth}
                      onChange={(e) => handleFieldChange('logos', 'mobileWidth', parseInt(e.target.value) || 0)}
                      className="w-full border border-wine/15 rounded p-2 text-xs text-ink bg-white"
                    />
                  </div>
                  <div>
                    <label className="text-[9px] tracking-wider uppercase font-semibold text-wine-deep block mb-1">Mobile Height (px)</label>
                    <input
                      type="number"
                      value={logos.mobileHeight}
                      onChange={(e) => handleFieldChange('logos', 'mobileHeight', parseInt(e.target.value) || 0)}
                      className="w-full border border-wine/15 rounded p-2 text-xs text-ink bg-white"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: ANNOUNCEMENT MANAGER */}
            {activeSubSection === 'announcements' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-serif font-medium text-wine mb-1.5">Scheduled Announcements</h3>
                  <p className="text-ink-soft text-xs font-light">
                    Manage announcement banner content, design colors, start/end dates, and links.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-[1.5fr_1fr] gap-6">
                  <div className="space-y-5">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="am-enabled"
                        checked={announcementManager.enabled}
                        onChange={(e) => handleFieldChange('announcementManager', 'enabled', e.target.checked)}
                        className="rounded border-wine/20 text-wine-deep focus:ring-wine"
                      />
                      <label htmlFor="am-enabled" className="text-xs uppercase tracking-wider font-semibold text-wine">
                        Enable Announcement Banner
                      </label>
                    </div>

                    <div>
                      <label className="text-[10px] tracking-wider uppercase font-semibold text-wine-deep block mb-1">Banner Text message</label>
                      <input
                        type="text"
                        value={announcementManager.text}
                        onChange={(e) => handleFieldChange('announcementManager', 'text', e.target.value)}
                        className="w-full border border-wine/15 rounded p-2.5 text-sm text-ink focus:outline-none bg-white font-light"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] tracking-wider uppercase font-semibold text-wine-deep block mb-1">Call-To-Action (CTA) Button Text</label>
                        <input
                          type="text"
                          value={announcementManager.btnText}
                          onChange={(e) => handleFieldChange('announcementManager', 'btnText', e.target.value)}
                          placeholder="e.g. Shop Now"
                          className="w-full border border-wine/15 rounded p-2 text-xs text-ink bg-white"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] tracking-wider uppercase font-semibold text-wine-deep block mb-1">Button Redirect Link</label>
                        <input
                          type="text"
                          value={announcementManager.btnLink}
                          onChange={(e) => handleFieldChange('announcementManager', 'btnLink', e.target.value)}
                          placeholder="e.g. /shop"
                          className="w-full border border-wine/15 rounded p-2 text-xs text-ink bg-white"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-wine/10 pt-4">
                      <div>
                        <label className="text-[10px] tracking-wider uppercase font-semibold text-wine-deep block mb-1">Start Date &amp; Time (Optional)</label>
                        <input
                          type="datetime-local"
                          value={announcementManager.startDate}
                          onChange={(e) => handleFieldChange('announcementManager', 'startDate', e.target.value)}
                          className="w-full border border-wine/15 rounded p-2 text-xs text-ink bg-white"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] tracking-wider uppercase font-semibold text-wine-deep block mb-1">End Date &amp; Time (Optional)</label>
                        <input
                          type="datetime-local"
                          value={announcementManager.endDate}
                          onChange={(e) => handleFieldChange('announcementManager', 'endDate', e.target.value)}
                          className="w-full border border-wine/15 rounded p-2 text-xs text-ink bg-white"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Colors & Visual Preview */}
                  <div className="border border-wine/10 p-5 rounded bg-cream/10 space-y-4">
                    <h4 className="text-xs uppercase tracking-wider font-semibold text-wine-deep">Banner Visuals</h4>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[9px] tracking-wider uppercase font-semibold text-wine-deep block mb-1">Background Color</label>
                        <div className="flex gap-2 items-center">
                          <input
                            type="color"
                            value={announcementManager.bgColor || '#280911'}
                            onChange={(e) => handleFieldChange('announcementManager', 'bgColor', e.target.value)}
                            className="w-8 h-8 rounded-full border border-wine/10 cursor-pointer overflow-hidden"
                          />
                          <input
                            type="text"
                            value={announcementManager.bgColor}
                            onChange={(e) => handleFieldChange('announcementManager', 'bgColor', e.target.value)}
                            className="flex-1 border border-wine/15 rounded p-1 text-xs text-center"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-[9px] tracking-wider uppercase font-semibold text-wine-deep block mb-1">Text Color</label>
                        <div className="flex gap-2 items-center">
                          <input
                            type="color"
                            value={announcementManager.textColor || '#f1e5d1'}
                            onChange={(e) => handleFieldChange('announcementManager', 'textColor', e.target.value)}
                            className="w-8 h-8 rounded-full border border-wine/10 cursor-pointer overflow-hidden"
                          />
                          <input
                            type="text"
                            value={announcementManager.textColor}
                            onChange={(e) => handleFieldChange('announcementManager', 'textColor', e.target.value)}
                            className="flex-1 border border-wine/15 rounded p-1 text-xs text-center"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-wine/5 space-y-2">
                      <span className="text-[9px] tracking-wider uppercase font-semibold text-wine-deep/60 block">Instant Live Preview</span>
                      <div 
                        className="py-2.5 px-4 text-[9px] tracking-[0.25em] uppercase text-center font-sans font-medium rounded border border-gold/15 flex items-center justify-center flex-wrap gap-1.5"
                        style={{
                          backgroundColor: announcementManager.bgColor || '#280911',
                          color: announcementManager.textColor || '#f1e5d1'
                        }}
                      >
                        <span>{announcementManager.text || 'Announcement Text'}</span>
                        {announcementManager.btnText && (
                          <span 
                            className="ml-2 px-2 py-0.5 rounded-[2px] text-[7.5px] font-semibold tracking-wider font-sans block"
                            style={{
                              color: announcementManager.bgColor || '#280911',
                              backgroundColor: announcementManager.textColor || '#f1e5d1'
                            }}
                          >
                            {announcementManager.btnText}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: HOMEPAGE HERO */}
            {activeSubSection === 'hero' && (
              <div className="space-y-10">
                <div>
                  <h3 className="text-xl font-serif font-medium text-wine mb-1.5">Hero lookbook sections</h3>
                  <p className="text-ink-soft text-xs font-light">
                    Configure titles, descriptive paragraphs, and banner images for the landing page lookbook slides.
                  </p>
                </div>

                {Object.keys(editedContent.hero).map((sectionKey, index) => {
                  const slide = (editedContent.hero as any)[sectionKey];
                  return (
                    <div key={sectionKey} className="border-t border-wine/10 pt-8 first:border-0 first:pt-0 space-y-5">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-wine/5 flex items-center justify-center font-serif font-bold text-xs text-wine">
                          {index + 1}
                        </span>
                        <h4 className="text-md font-serif font-semibold text-wine capitalize font-medium">
                          Slide {index + 1}: {sectionKey}
                        </h4>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-[10px] tracking-wider uppercase font-semibold text-wine-deep block mb-1">
                            Eyebrow Tag
                          </label>
                          <input
                            type="text"
                            value={slide.eyebrow}
                            onChange={(e) => handleHeroSectionFieldChange(sectionKey, 'eyebrow', e.target.value)}
                            className="w-full border border-wine/15 rounded p-2 text-sm text-ink focus:outline-none bg-white font-light"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] tracking-wider uppercase font-semibold text-wine-deep block mb-1">
                            Header Text
                          </label>
                          <input
                            type="text"
                            value={slide.title}
                            onChange={(e) => handleHeroSectionFieldChange(sectionKey, 'title', e.target.value)}
                            className="w-full border border-wine/15 rounded p-2 text-sm text-ink focus:outline-none bg-white font-light"
                          />
                        </div>
                        {slide.italicTitle !== undefined && (
                          <div>
                            <label className="text-[10px] tracking-wider uppercase font-semibold text-wine-deep block mb-1">
                              Italic Heading
                            </label>
                            <input
                              type="text"
                              value={slide.italicTitle}
                              onChange={(e) => handleHeroSectionFieldChange(sectionKey, 'italicTitle', e.target.value)}
                              className="w-full border border-wine/15 rounded p-2 text-sm text-ink focus:outline-none bg-white font-light"
                            />
                          </div>
                        )}
                        <div className="col-span-1 md:col-span-2">
                          <label className="text-[10px] tracking-wider uppercase font-semibold text-wine-deep block mb-1">
                            {slide.quote !== undefined ? 'Artisan Quote' : 'Description Paragraph'}
                          </label>
                          <textarea
                            rows={3}
                            value={slide.quote !== undefined ? slide.quote : slide.description}
                            onChange={(e) => handleHeroSectionFieldChange(sectionKey, slide.quote !== undefined ? 'quote' : 'description', e.target.value)}
                            className="w-full border border-wine/15 rounded p-2.5 text-sm text-ink focus:outline-none bg-white font-light"
                          />
                        </div>
                        <div className="col-span-1 md:col-span-2">
                          <label className="text-[10px] tracking-wider uppercase font-semibold text-wine-deep block mb-1">
                            Image Path (or paste link from Media Library)
                          </label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              value={slide.image}
                              onChange={(e) => handleHeroSectionFieldChange(sectionKey, 'image', e.target.value)}
                              className="flex-1 border border-wine/15 rounded p-2 text-xs text-ink bg-white font-light"
                            />
                            <button
                              onClick={() => {
                                setActiveSubSection('media');
                                setSearchQuery('');
                              }}
                              className="px-3 border border-wine/20 text-wine hover:bg-wine/5 rounded text-xs"
                              title="Go to Media Library"
                            >
                              Library
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* TAB 4: PAGE LAYOUTS */}
            {activeSubSection === 'layout' && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-serif font-medium text-wine mb-1.5">Homepage sections &amp; order</h3>
                  <p className="text-ink-soft text-xs font-light">
                    Toggle visibility of landing page components and reorder them with absolute flexibility.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Toggles */}
                  <div className="border border-wine/10 p-5 rounded bg-cream/5 space-y-4">
                    <h4 className="text-xs uppercase tracking-wider font-semibold text-wine-deep border-b border-wine/5 pb-2">Toggle Sections</h4>
                    
                    {[
                      { id: 'hero', label: 'Homepage Hero Lookbook' },
                      { id: 'collections', label: 'Bestsellers / Collections' },
                      { id: 'story', label: 'Story Lineage Section' },
                      { id: 'testimonials', label: 'Customer Testimonials' },
                      { id: 'instagram', label: 'Instagram Feed Carousel' },
                      { id: 'newsletter', label: 'Newsletter Subscription' },
                      { id: 'whatsapp', label: 'WhatsApp Floating Action' },
                      { id: 'spotlight', label: 'Footer Showcase Strip' }
                    ].map((sec) => (
                      <div key={sec.id} className="flex items-center justify-between border-b border-wine/5 pb-2.5 last:border-0">
                        <label htmlFor={`toggle-${sec.id}`} className="text-xs text-ink font-light select-none">
                          {sec.label}
                        </label>
                        <input
                          type="checkbox"
                          id={`toggle-${sec.id}`}
                          checked={(layout as any)[sec.id] !== false}
                          onChange={(e) => handleFieldChange('layout', sec.id, e.target.checked)}
                          className="rounded border-wine/20 text-wine-deep focus:ring-wine"
                        />
                      </div>
                    ))}
                  </div>

                  {/* Reordering */}
                  <div className="border border-wine/10 p-5 rounded bg-cream/5 space-y-4">
                    <h4 className="text-xs uppercase tracking-wider font-semibold text-wine-deep border-b border-wine/5 pb-2">Drag-and-Drop / Reorder List</h4>
                    
                    <div className="space-y-3">
                      {(layout.order || ["hero", "collections", "story", "testimonials", "instagram", "newsletter"]).map((sectionId, idx) => (
                        <div key={sectionId} className="flex items-center justify-between bg-white border border-wine/10 px-4 py-3 rounded shadow-sm">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-wine-deep/40 font-mono">0{idx + 1}</span>
                            <span className="text-xs font-medium text-wine">{sectionLabels[sectionId] || sectionId}</span>
                          </div>
                          
                          <div className="flex gap-1">
                            <button
                              onClick={() => moveSection(idx, 'up')}
                              disabled={idx === 0}
                              className="p-1 border border-wine/10 text-wine hover:bg-wine/5 rounded disabled:opacity-30 disabled:hover:bg-transparent"
                              title="Move Up"
                            >
                              <ArrowUp size={12} />
                            </button>
                            <button
                              onClick={() => moveSection(idx, 'down')}
                              disabled={idx === (layout.order || []).length - 1}
                              className="p-1 border border-wine/10 text-wine hover:bg-wine/5 rounded disabled:opacity-30 disabled:hover:bg-transparent"
                              title="Move Down"
                            >
                              <ArrowDown size={12} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 5: ABOUT STORY */}
            {activeSubSection === 'about' && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-serif font-medium text-wine mb-1.5">About Us Heritage</h3>
                  <p className="text-ink-soft text-xs font-light">
                    Refine titles, brand narratives, and legacy values.
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-5">
                  <div>
                    <label className="text-[10px] tracking-wider uppercase font-semibold text-wine-deep block mb-1">Hero Page Title</label>
                    <input
                      type="text"
                      value={editedContent.about.heroTitle}
                      onChange={(e) => handleFieldChange('about', 'heroTitle', e.target.value)}
                      className="w-full border border-wine/15 rounded p-2 text-sm text-ink focus:outline-none bg-white font-light"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] tracking-wider uppercase font-semibold text-wine-deep block mb-1">Hero Page Subtitle</label>
                    <textarea
                      rows={2}
                      value={editedContent.about.heroSubtitle}
                      onChange={(e) => handleFieldChange('about', 'heroSubtitle', e.target.value)}
                      className="w-full border border-wine/15 rounded p-2.5 text-sm text-ink focus:outline-none bg-white font-light"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] tracking-wider uppercase font-semibold text-wine-deep block mb-1">Legacy Eyebrow</label>
                      <input
                        type="text"
                        value={editedContent.about.legacyEyebrow}
                        onChange={(e) => handleFieldChange('about', 'legacyEyebrow', e.target.value)}
                        className="w-full border border-wine/15 rounded p-2 text-sm text-ink focus:outline-none bg-white font-light"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] tracking-wider uppercase font-semibold text-wine-deep block mb-1">Legacy Block Title</label>
                      <input
                        type="text"
                        value={editedContent.about.legacyTitle}
                        onChange={(e) => handleFieldChange('about', 'legacyTitle', e.target.value)}
                        className="w-full border border-wine/15 rounded p-2 text-sm text-ink focus:outline-none bg-white font-light"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] tracking-wider uppercase font-semibold text-wine-deep block mb-1">Legacy Paragraph 1</label>
                    <textarea
                      rows={4}
                      value={editedContent.about.legacyText1}
                      onChange={(e) => handleFieldChange('about', 'legacyText1', e.target.value)}
                      className="w-full border border-wine/15 rounded p-2.5 text-sm text-ink focus:outline-none bg-white font-light"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] tracking-wider uppercase font-semibold text-wine-deep block mb-1">Legacy Paragraph 2</label>
                    <textarea
                      rows={4}
                      value={editedContent.about.legacyText2}
                      onChange={(e) => handleFieldChange('about', 'legacyText2', e.target.value)}
                      className="w-full border border-wine/15 rounded p-2.5 text-sm text-ink focus:outline-none bg-white font-light"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB 6: CONTACTS */}
            {activeSubSection === 'contact' && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-serif font-medium text-wine mb-1.5">Contact Information</h3>
                  <p className="text-ink-soft text-xs font-light">
                    Modify boutique hours, address locator details, central email, WhatsApp, and Google Map links.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] tracking-wider uppercase font-semibold text-wine-deep block mb-1">Main Phone Number</label>
                    <input
                      type="text"
                      value={editedContent.contact.phone}
                      onChange={(e) => handleFieldChange('contact', 'phone', e.target.value)}
                      className="w-full border border-wine/15 rounded p-2 text-sm text-ink focus:outline-none bg-white font-light"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] tracking-wider uppercase font-semibold text-wine-deep block mb-1">WhatsApp Chat Line</label>
                    <input
                      type="text"
                      value={editedContent.contact.whatsapp}
                      onChange={(e) => handleFieldChange('contact', 'whatsapp', e.target.value)}
                      className="w-full border border-wine/15 rounded p-2 text-sm text-ink focus:outline-none bg-white font-light"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] tracking-wider uppercase font-semibold text-wine-deep block mb-1">Main Email Support</label>
                    <input
                      type="text"
                      value={editedContent.contact.email}
                      onChange={(e) => handleFieldChange('contact', 'email', e.target.value)}
                      className="w-full border border-wine/15 rounded p-2 text-sm text-ink focus:outline-none bg-white font-light"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] tracking-wider uppercase font-semibold text-wine-deep block mb-1">Google Maps Locator Link</label>
                    <input
                      type="text"
                      value={editedContent.contact.googleMapsLink}
                      onChange={(e) => handleFieldChange('contact', 'googleMapsLink', e.target.value)}
                      className="w-full border border-wine/15 rounded p-2 text-xs text-ink focus:outline-none bg-white font-light"
                    />
                  </div>
                  <div className="col-span-1 md:col-span-2">
                    <label className="text-[10px] tracking-wider uppercase font-semibold text-wine-deep block mb-1">Contact page introductory text</label>
                    <input
                      type="text"
                      value={editedContent.contact.heroSubtitle}
                      onChange={(e) => handleFieldChange('contact', 'heroSubtitle', e.target.value)}
                      className="w-full border border-wine/15 rounded p-2 text-sm text-ink focus:outline-none bg-white font-light"
                    />
                  </div>
                </div>

                <div className="border-t border-wine/10 pt-6 space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="text-md font-serif font-semibold text-wine">Physical Store Locations</h4>
                    <button
                      onClick={() => handleAddListItem('contact', 'locations', { city: 'New Store Boutique', address: '123, Street Name, City, State - Pin', phone: '+91 XXXXX XXXXX', hours: '10:00 AM - 8:00 PM' })}
                      className="flex items-center gap-1 border border-wine/20 text-wine hover:bg-wine/5 text-[9px] font-semibold tracking-wider uppercase py-1.5 px-3 rounded-sm"
                    >
                      <Plus size={10} /> Add Store
                    </button>
                  </div>

                  <div className="space-y-4">
                    {editedContent.contact.locations.map((loc, idx) => (
                      <div key={idx} className="border border-wine/15 p-4 rounded bg-cream/10 space-y-4">
                        <div className="flex justify-between items-center border-b border-wine/5 pb-2">
                          <span className="text-xs font-serif font-semibold text-wine-deep uppercase">Store 0{idx + 1}</span>
                          <button
                            onClick={() => handleRemoveListItem('contact', 'locations', idx)}
                            className="text-wine/60 hover:text-wine p-1"
                            title="Delete store"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="text-[9px] tracking-wider uppercase font-semibold text-wine-deep block mb-1">Store Name</label>
                            <input
                              type="text"
                              value={loc.city}
                              onChange={(e) => handleNestedListChange('contact', 'locations', idx, 'city', e.target.value)}
                              className="w-full border border-wine/15 bg-white rounded p-2 text-xs text-ink"
                            />
                          </div>
                          <div>
                            <label className="text-[9px] tracking-wider uppercase font-semibold text-wine-deep block mb-1">Store Telephone</label>
                            <input
                              type="text"
                              value={loc.phone}
                              onChange={(e) => handleNestedListChange('contact', 'locations', idx, 'phone', e.target.value)}
                              className="w-full border border-wine/15 bg-white rounded p-2 text-xs text-ink"
                            />
                          </div>
                          <div className="col-span-1 md:col-span-2">
                            <label className="text-[9px] tracking-wider uppercase font-semibold text-wine-deep block mb-1">Full Store Address</label>
                            <input
                              type="text"
                              value={loc.address}
                              onChange={(e) => handleNestedListChange('contact', 'locations', idx, 'address', e.target.value)}
                              className="w-full border border-wine/15 bg-white rounded p-2 text-xs text-ink"
                            />
                          </div>
                          <div className="col-span-1 md:col-span-2">
                            <label className="text-[9px] tracking-wider uppercase font-semibold text-wine-deep block mb-1">Opening Hours</label>
                            <input
                              type="text"
                              value={loc.hours}
                              onChange={(e) => handleNestedListChange('contact', 'locations', idx, 'hours', e.target.value)}
                              className="w-full border border-wine/15 bg-white rounded p-2 text-xs text-ink"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 7: SOCIALS */}
            {activeSubSection === 'socials' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-serif font-medium text-wine mb-1.5">Social Channels</h3>
                  <p className="text-ink-soft text-xs font-light">
                    Add direct links to your social pages and toggle visibility in the footer bar.
                  </p>
                </div>

                <div className="space-y-4">
                  {['instagram', 'facebook', 'youtube', 'pinterest', 'threads'].map((platform) => {
                    const soc = (socials as any)[platform] || { enabled: false, url: '' };
                    return (
                      <div key={platform} className="bg-cream/10 border border-wine/10 p-4 rounded flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
                        <div className="flex items-center gap-3 w-40">
                          <input
                            type="checkbox"
                            id={`social-chk-${platform}`}
                            checked={soc.enabled}
                            onChange={(e) => {
                              const updated = {
                                ...socials,
                                [platform]: {
                                  ...soc,
                                  enabled: e.target.checked
                                }
                              };
                              handleFieldChange(undefined, 'socials', updated);
                            }}
                            className="rounded border-wine/20 text-wine-deep focus:ring-wine"
                          />
                          <label htmlFor={`social-chk-${platform}`} className="text-xs uppercase tracking-wider font-semibold text-wine capitalize select-none">
                            {platform}
                          </label>
                        </div>
                        <input
                          type="text"
                          value={soc.url}
                          placeholder={`https://${platform}.com/a1sanskritisilks`}
                          onChange={(e) => {
                            const updated = {
                              ...socials,
                              [platform]: {
                                ...soc,
                                url: e.target.value
                              }
                            };
                            handleFieldChange(undefined, 'socials', updated);
                          }}
                          className="flex-1 border border-wine/15 bg-white rounded p-2 text-xs font-light focus:outline-none"
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* TAB 8: SEO MANAGER */}
            {activeSubSection === 'seo' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-serif font-medium text-wine mb-1.5">SEO Manager</h3>
                  <p className="text-ink-soft text-xs font-light">
                    Optimize website search engine titles, metadata descriptions, and social share banners.
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-[10px] tracking-wider uppercase font-semibold text-wine-deep block mb-1">Global Meta Title Template</label>
                    <input
                      type="text"
                      value={seo.metaTitle}
                      onChange={(e) => handleFieldChange('seo', 'metaTitle', e.target.value)}
                      className="w-full border border-wine/15 rounded p-2 text-sm text-ink focus:outline-none bg-white font-light"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] tracking-wider uppercase font-semibold text-wine-deep block mb-1">Meta Description (Max 160 characters)</label>
                    <textarea
                      rows={3}
                      value={seo.metaDescription}
                      onChange={(e) => handleFieldChange('seo', 'metaDescription', e.target.value)}
                      className="w-full border border-wine/15 rounded p-2.5 text-sm text-ink focus:outline-none bg-white font-light"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] tracking-wider uppercase font-semibold text-wine-deep block mb-1">Keywords (Comma-separated)</label>
                    <input
                      type="text"
                      value={seo.keywords}
                      onChange={(e) => handleFieldChange('seo', 'keywords', e.target.value)}
                      className="w-full border border-wine/15 rounded p-2 text-sm text-ink focus:outline-none bg-white font-light"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] tracking-wider uppercase font-semibold text-wine-deep block mb-1">Open Graph / Social Share Image URL</label>
                    <input
                      type="text"
                      value={seo.ogImage}
                      onChange={(e) => handleFieldChange('seo', 'ogImage', e.target.value)}
                      className="w-full border border-wine/15 rounded p-2 text-xs text-ink focus:outline-none bg-white font-light"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* TAB 9: MEDIA LIBRARY */}
            {activeSubSection === 'media' && (
              <div className="space-y-6">
                <div className="flex justify-between items-start flex-wrap gap-4">
                  <div>
                    <h3 className="text-xl font-serif font-medium text-wine mb-1.5">Reusable Media Library</h3>
                    <p className="text-ink-soft text-xs font-light">
                      Upload images once and copy their public links to use across any slide banner or logo block.
                    </p>
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => setShowSqlHelp(!showSqlHelp)}
                      className="px-3 py-1.5 border border-wine/20 text-wine hover:bg-wine/5 rounded text-[10px] uppercase font-semibold tracking-wider"
                    >
                      Setup Storage Instructions
                    </button>
                    <label className="bg-wine-deep hover:bg-wine text-white text-[10px] font-semibold tracking-wider uppercase py-2 px-4 rounded-sm flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm">
                      {uploading ? <RefreshCw size={12} className="animate-spin" /> : <Upload size={12} />}
                      {uploading ? 'Uploading...' : 'Upload Image'}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleUploadFile}
                        disabled={uploading}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                {/* SQL instruction alert toggle */}
                {showSqlHelp && (
                  <div className="p-5 bg-wine/5 border border-wine/10 rounded text-xs space-y-3">
                    <h4 className="font-semibold text-wine flex items-center gap-1.5">
                      <Unlock size={14} className="text-gold" />
                      Configure Supabase Storage Bucket Policies
                    </h4>
                    <p className="text-ink-soft leading-relaxed font-light">
                      To utilize image uploads, create a bucket named <code>media</code> in your Supabase Dashboard (Storage tab) and set it to <strong>Public</strong>. Then execute this SQL script in your Supabase SQL Editor to enable public insert/select permissions:
                    </p>
                    <pre className="bg-[#170407] text-gold-soft p-4 rounded text-[10.5px] overflow-x-auto select-all leading-[1.6]">
{`insert into storage.buckets (id, name, public) values ('media', 'media', true) on conflict (id) do nothing;

create policy "Public Access" on storage.objects for select using (bucket_id = 'media');
create policy "Insert Access" on storage.objects for insert with check (bucket_id = 'media');
create policy "Delete Access" on storage.objects for delete using (bucket_id = 'media');`}
                    </pre>
                  </div>
                )}

                <div className="flex gap-4 items-center border-b border-wine/5 pb-4">
                  <input
                    type="text"
                    placeholder="Search media files by name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 border border-wine/15 rounded p-2 text-xs text-ink font-light focus:outline-none bg-white"
                  />
                  <span className="text-[10px] text-ink-soft/60 uppercase tracking-widest font-semibold">{filteredMedia.length} Items</span>
                </div>

                {filteredMedia.length === 0 ? (
                  <div className="py-20 text-center border border-dashed border-wine/10 rounded flex flex-col items-center justify-center bg-cream/5 text-ink-soft">
                    <ImageIcon size={32} className="opacity-30 mb-2" />
                    <span className="text-xs uppercase tracking-wider font-semibold">No media items found</span>
                    <span className="text-[10.5px] font-light mt-1">Upload a photo to get started, or ensure your Supabase storage is connected.</span>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-4">
                    {filteredMedia.map((item) => (
                      <div key={item.name} className="border border-wine/10 rounded overflow-hidden bg-cream/5 group shadow-sm flex flex-col justify-between">
                        <div className="aspect-square bg-cream/10 border-b border-wine/5 flex items-center justify-center relative overflow-hidden p-1">
                          <img src={item.url} alt={item.name} className="max-h-full max-w-full object-contain" />
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 p-2">
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(item.url);
                                alert("Image URL copied to clipboard!");
                              }}
                              className="px-2 py-1 bg-white hover:bg-gold text-wine-deep text-[8px] uppercase font-semibold tracking-wider rounded"
                            >
                              Copy Link
                            </button>
                            <button
                              onClick={() => handleDeleteFile(item.name)}
                              className="p-1 bg-rose-600 hover:bg-rose-700 text-white rounded"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </div>
                        <div className="p-2 truncate text-center">
                          <span className="text-[9px] text-ink-soft font-mono font-light block select-all">{item.name}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Bottom Actions info */}
            <div className="border-t border-wine/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-1.5 text-xs text-ink-soft">
                <FileText size={14} className="text-gold" />
                <span>Edits are automatically saved to your local browser cache draft.</span>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={handleSaveDraft}
                  disabled={syncing}
                  className="border border-wine/20 text-wine hover:bg-wine/5 text-[10px] font-semibold tracking-wider uppercase py-2.5 px-5 rounded-sm flex items-center gap-1.5 transition-colors disabled:opacity-50"
                >
                  {syncing ? <RefreshCw size={12} className="animate-spin" /> : <Save size={12} />}
                  Save Draft
                </button>
                <button
                  onClick={handlePublishLive}
                  disabled={publishing}
                  className="bg-wine-deep hover:bg-wine text-white text-[10px] font-semibold tracking-wider uppercase py-2.5 px-5 rounded-sm flex items-center gap-1.5 transition-colors shadow-md disabled:opacity-50"
                >
                  {publishing ? <RefreshCw size={12} className="animate-spin" /> : <Globe size={12} />}
                  Publish Live
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
