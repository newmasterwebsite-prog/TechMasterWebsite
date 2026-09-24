import React, { useState } from 'react';
import { useDatabase } from '../../context/DatabaseContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Switch } from '../../components/ui/Switch';
import { Input } from '../../components/ui/Input';
import { 
  Shield, Scale, FileText, Settings, Globe, Award, 
  Plus, Edit3, Trash2, ArrowUp, ArrowDown, ShieldAlert,
  ChevronDown, ChevronRight, AlertCircle, RefreshCw
} from 'lucide-react';

export const LegalCMS = () => {
  const { db, updateSection } = useDatabase();
  const [activeTab, setActiveTab] = useState('terms');

  // Local Form States
  const [termsForm, setTermsForm] = useState(db?.termsPolicy || {});
  const [privacyForm, setPrivacyForm] = useState(db?.privacyPolicy || {});
  const [cookiesForm, setCookiesForm] = useState(db?.cookiePolicy || {});
  const [settingsForm, setSettingsForm] = useState(db?.legalSettings || {});

  // Sync state when db updates
  React.useEffect(() => {
    if (db?.termsPolicy) setTermsForm(db.termsPolicy);
    if (db?.privacyPolicy) setPrivacyForm(db.privacyPolicy);
    if (db?.cookiePolicy) setCookiesForm(db.cookiePolicy);
    if (db?.legalSettings) setSettingsForm(db.legalSettings);
  }, [db]);

  // Toast notifications
  const [toast, setToast] = useState(null);
  const showToast = (message) => {
    setToast({ message });
    setTimeout(() => setToast(null), 3000);
  };

  // Section List editing states
  const [activeListSection, setActiveListSection] = useState(null);
  const [editingItemId, setEditingItemId] = useState(null);
  const [draftItem, setDraftItem] = useState({});

  const handleSaveDoc = (key, data) => {
    updateSection(key, data);
    showToast(`${key.replace(/([A-Z])/g, ' $1').toUpperCase()} updated successfully.`);
  };

  const handleSaveListItem = (sectionKey) => {
    let nextList = [];
    const parentObj = sectionKey === 'terms' ? termsForm : sectionKey === 'privacy' ? privacyForm : cookiesForm;
    const listKey = sectionKey === 'terms' ? 'sections' : sectionKey === 'privacy' ? 'sections' : 'categories';
    const listData = parentObj[listKey] || [];

    if (editingItemId) {
      nextList = listData.map((item) => item.id === editingItemId ? { ...item, ...draftItem } : item);
    } else {
      const newItem = { ...draftItem, id: `item-${Date.now()}`, status: draftItem.status || 'Active', order: listData.length + 1 };
      nextList = [...listData, newItem];
    }

    const updatedParent = { ...parentObj, [listKey]: nextList };
    if (sectionKey === 'terms') setTermsForm(updatedParent);
    if (sectionKey === 'privacy') setPrivacyForm(updatedParent);
    if (sectionKey === 'cookies') setCookiesForm(updatedParent);

    updateSection(sectionKey === 'terms' ? 'termsPolicy' : sectionKey === 'privacy' ? 'privacyPolicy' : 'cookiePolicy', updatedParent);
    
    setActiveListSection(null);
    setEditingItemId(null);
    setDraftItem({});
    showToast("Sub-section row saved successfully.");
  };

  const handleDeleteListItem = (sectionKey, itemId) => {
    if (window.confirm("Are you sure you want to delete this sub-section?")) {
      const parentObj = sectionKey === 'terms' ? termsForm : sectionKey === 'privacy' ? privacyForm : cookiesForm;
      const listKey = sectionKey === 'terms' ? 'sections' : sectionKey === 'privacy' ? 'sections' : 'categories';
      const listData = parentObj[listKey] || [];
      const nextList = listData.filter((item) => item.id !== itemId);
      
      const updatedParent = { ...parentObj, [listKey]: nextList };
      if (sectionKey === 'terms') setTermsForm(updatedParent);
      if (sectionKey === 'privacy') setPrivacyForm(updatedParent);
      if (sectionKey === 'cookies') setCookiesForm(updatedParent);

      updateSection(sectionKey === 'terms' ? 'termsPolicy' : sectionKey === 'privacy' ? 'privacyPolicy' : 'cookiePolicy', updatedParent);
      showToast("Sub-section deleted.");
    }
  };

  const handleToggleStatus = (sectionKey, itemId, currentStatus) => {
    const parentObj = sectionKey === 'terms' ? termsForm : sectionKey === 'privacy' ? privacyForm : cookiesForm;
    const listKey = sectionKey === 'terms' ? 'sections' : sectionKey === 'privacy' ? 'sections' : 'categories';
    const listData = parentObj[listKey] || [];
    const nextList = listData.map((item) => item.id === itemId ? { ...item, status: currentStatus === 'Active' ? 'Inactive' : 'Active' } : item);

    const updatedParent = { ...parentObj, [listKey]: nextList };
    updateSection(sectionKey === 'terms' ? 'termsPolicy' : sectionKey === 'privacy' ? 'privacyPolicy' : 'cookiePolicy', updatedParent);
  };

  const handleMoveItem = (sectionKey, index, direction) => {
    const parentObj = sectionKey === 'terms' ? termsForm : sectionKey === 'privacy' ? privacyForm : cookiesForm;
    const listKey = sectionKey === 'terms' ? 'sections' : sectionKey === 'privacy' ? 'sections' : 'categories';
    const nextList = [...(parentObj[listKey] || [])];
    const target = index + direction;
    if (target >= 0 && target < nextList.length) {
      const temp = nextList[index];
      nextList[index] = nextList[target];
      nextList[target] = temp;
      
      const updatedParent = { ...parentObj, [listKey]: nextList };
      updateSection(sectionKey === 'terms' ? 'termsPolicy' : sectionKey === 'privacy' ? 'privacyPolicy' : 'cookiePolicy', updatedParent);
    }
  };

  return (
    <div className="flex flex-col gap-6 text-left relative">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-5 right-5 z-[100] px-4 py-3 rounded-md shadow-lg border flex items-center gap-2 bg-zinc-950 border-luxury-gold/30 text-white text-xs font-semibold">
          <AlertCircle className="w-4 h-4 text-luxury-gold" />
          <span>{toast.message}</span>
        </div>
      )}

      {/* Header */}
      <div className="border-b border-zinc-800/80 pb-5">
        <h1 className="font-serif text-2xl font-medium tracking-wide text-zinc-100 flex items-center gap-2">
          <Scale className="w-5 h-5 text-luxury-gold" />
          Legal CMS Portal
        </h1>
        <p className="text-xs text-zinc-500 mt-1">
          Maintain Terms of Service, Privacy Protocols, Cookie policies, popup switches, and SEO configurations.
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-zinc-900 gap-1.5 flex-wrap">
        {[
          { id: 'terms', label: 'Terms of Service', icon: Scale },
          { id: 'privacy', label: 'Privacy Policy', icon: Shield },
          { id: 'cookies', label: 'Cookie Policy', icon: FileText },
          { id: 'settings', label: 'Legal Settings', icon: Settings },
          { id: 'seo', label: 'SEO Config', icon: Globe }
        ].map(t => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              onClick={() => { setActiveTab(t.id); setActiveListSection(null); }}
              className={`px-4 py-2 text-xs font-mono uppercase tracking-wider flex items-center gap-2 border-b-2 transition-all ${activeTab === t.id ? 'border-luxury-gold text-luxury-gold bg-zinc-900/10' : 'border-transparent text-zinc-555 hover:text-white'}`}
            >
              <Icon className="w-3.5 h-3.5" />
              {t.label}
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      <div className="max-w-5xl flex flex-col gap-6">
        
        {/* TERMS OF SERVICE PANEL */}
        {activeTab === 'terms' && (
          <Card className="border border-zinc-800/85 p-6 flex flex-col gap-5">
            <h2 className="text-sm font-serif font-semibold tracking-wider text-luxury-gold uppercase border-b border-zinc-900 pb-2">Terms of Service parameters</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Popup Title" value={termsForm.popupTitle || ''} onChange={e => setTermsForm({ ...termsForm, popupTitle: e.target.value })} />
              <Input label="Effective Date" value={termsForm.effectiveDate || ''} onChange={e => setTermsForm({ ...termsForm, effectiveDate: e.target.value })} />
              <Input label="Small Badge tag" value={termsForm.smallBadge || ''} onChange={e => setTermsForm({ ...termsForm, smallBadge: e.target.value })} />
              <Input label="Subtitle description" value={termsForm.subtitle || ''} onChange={e => setTermsForm({ ...termsForm, subtitle: e.target.value })} />
              <div className="md:col-span-2">
                <Input label="Introductory Paragraph Text" textarea rows={3} value={termsForm.introParagraph || ''} onChange={e => setTermsForm({ ...termsForm, introParagraph: e.target.value })} />
              </div>
            </div>

            <div className="flex justify-end border-b border-zinc-900 pb-4">
              <Button type="button" onClick={() => handleSaveDoc('termsPolicy', termsForm)} variant="primary" size="sm" className="gap-2 bg-luxury-gold text-black font-bold">
                <Settings className="w-3.5 h-3.5 text-black" /> Save Core Details
              </Button>
            </div>

            {/* Subsections CRUD */}
            <div>
              <h3 className="text-xs font-mono text-zinc-400 mb-3 block">Terms policy subsections list</h3>
              
              {activeListSection !== 'terms' ? (
                <div className="flex flex-col gap-3">
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-zinc-900 text-zinc-500 font-mono uppercase text-[9px] tracking-wider text-left">
                          <th className="py-2 px-3">Order</th>
                          <th className="py-2 px-3">Heading</th>
                          <th className="py-2 px-3">Body Excerpt</th>
                          <th className="py-2 px-3 text-center">Status</th>
                          <th className="py-2 px-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(termsForm.sections || []).map((sec, idx) => (
                          <tr key={sec.id || idx} className="border-b border-zinc-900/60 hover:bg-zinc-900/10 text-zinc-300">
                            <td className="py-2.5 px-3 font-mono">{idx + 1}</td>
                            <td className="py-2.5 px-3 font-bold">{sec.title}</td>
                            <td className="py-2.5 px-3 truncate max-w-xs">{sec.body}</td>
                            <td className="py-2.5 px-3 text-center">
                              <Switch checked={sec.status === 'Active'} onChange={() => handleToggleStatus('terms', sec.id, sec.status)} />
                            </td>
                            <td className="py-2.5 px-3 text-right flex items-center justify-end gap-1 mt-0.5">
                              <button type="button" onClick={() => handleMoveItem('terms', idx, -1)} disabled={idx === 0} className="p-1 hover:bg-zinc-900 rounded disabled:opacity-30"><ArrowUp className="w-3.5 h-3.5" /></button>
                              <button type="button" onClick={() => handleMoveItem('terms', idx, 1)} disabled={idx === (termsForm.sections || []).length - 1} className="p-1 hover:bg-zinc-900 rounded disabled:opacity-30"><ArrowDown className="w-3.5 h-3.5" /></button>
                              <button type="button" onClick={() => { setActiveListSection('terms'); setEditingItemId(sec.id); setDraftItem(sec); }} className="p-1 hover:bg-zinc-900 rounded text-amber-500"><Edit3 className="w-3.5 h-3.5" /></button>
                              <button type="button" onClick={() => handleDeleteListItem('terms', sec.id)} className="p-1 hover:bg-zinc-900 rounded text-rose-500"><Trash2 className="w-3.5 h-3.5" /></button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div>
                    <Button type="button" onClick={() => { setActiveListSection('terms'); setEditingItemId(null); setDraftItem({ title: '', body: '' }); }} variant="secondary" size="sm" className="text-xs text-luxury-gold">
                      <Plus className="w-3.5 h-3.5" /> Add subsection
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="border border-zinc-900 p-4 rounded bg-zinc-900/10 flex flex-col gap-3">
                  <Input label="Section Heading" value={draftItem.title || ''} onChange={e => setDraftItem({ ...draftItem, title: e.target.value })} />
                  <Input label="Section Body Text (Rich Text HTML Supported: <p>, <b>, <ul>, <li>, <a>, <br/>)" textarea rows={6} value={draftItem.body || ''} onChange={e => setDraftItem({ ...draftItem, body: e.target.value })} />
                  <div className="flex justify-end gap-2 border-t border-zinc-900/60 pt-2.5">
                    <button type="button" onClick={() => { setActiveListSection(null); setEditingItemId(null); setDraftItem({}); }} className="px-3 py-1.5 text-xs text-zinc-550 hover:text-white">Cancel</button>
                    <button type="button" onClick={() => handleSaveListItem('terms')} className="px-4 py-1.5 bg-luxury-gold text-black font-bold text-xs rounded">Save subsection</button>
                  </div>
                </div>
              )}
            </div>
          </Card>
        )}

        {/* PRIVACY POLICY PANEL */}
        {activeTab === 'privacy' && (
          <Card className="border border-zinc-800/85 p-6 flex flex-col gap-5">
            <h2 className="text-sm font-serif font-semibold tracking-wider text-luxury-gold uppercase border-b border-zinc-900 pb-2">Privacy Policy parameters</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Popup Title" value={privacyForm.popupTitle || ''} onChange={e => setPrivacyForm({ ...privacyForm, popupTitle: e.target.value })} />
              <Input label="Effective Date" value={privacyForm.effectiveDate || ''} onChange={e => setPrivacyForm({ ...privacyForm, effectiveDate: e.target.value })} />
              <Input label="Small Badge tag" value={privacyForm.smallBadge || ''} onChange={e => setPrivacyForm({ ...privacyForm, smallBadge: e.target.value })} />
              <div className="md:col-span-2">
                <Input label="Introductory Paragraph Text" textarea rows={3} value={privacyForm.introParagraph || ''} onChange={e => setPrivacyForm({ ...privacyForm, introParagraph: e.target.value })} />
              </div>
            </div>

            <div className="flex justify-end border-b border-zinc-900 pb-4">
              <Button type="button" onClick={() => handleSaveDoc('privacyPolicy', privacyForm)} variant="primary" size="sm" className="gap-2 bg-luxury-gold text-black font-bold">
                <Settings className="w-3.5 h-3.5 text-black" /> Save Core Details
              </Button>
            </div>

            {/* Privacy Subsections CRUD */}
            <div>
              <h3 className="text-xs font-mono text-zinc-400 mb-3 block">Privacy policy subsections list</h3>

              {activeListSection !== 'privacy' ? (
                <div className="flex flex-col gap-3">
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-zinc-900 text-zinc-500 font-mono uppercase text-[9px] tracking-wider text-left">
                          <th className="py-2 px-3">Order</th>
                          <th className="py-2 px-3">Heading</th>
                          <th className="py-2 px-3">Description Excerpt</th>
                          <th className="py-2 px-3 text-center">Status</th>
                          <th className="py-2 px-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(privacyForm.sections || []).map((sec, idx) => (
                          <tr key={sec.id || idx} className="border-b border-zinc-900/60 hover:bg-zinc-900/10 text-zinc-300">
                            <td className="py-2.5 px-3 font-mono">{idx + 1}</td>
                            <td className="py-2.5 px-3 font-bold">{sec.heading}</td>
                            <td className="py-2.5 px-3 truncate max-w-xs">{sec.description}</td>
                            <td className="py-2.5 px-3 text-center">
                              <Switch checked={sec.status === 'Active'} onChange={() => handleToggleStatus('privacy', sec.id, sec.status)} />
                            </td>
                            <td className="py-2.5 px-3 text-right flex items-center justify-end gap-1 mt-0.5">
                              <button type="button" onClick={() => handleMoveItem('privacy', idx, -1)} disabled={idx === 0} className="p-1 hover:bg-zinc-900 rounded disabled:opacity-30"><ArrowUp className="w-3.5 h-3.5" /></button>
                              <button type="button" onClick={() => handleMoveItem('privacy', idx, 1)} disabled={idx === (privacyForm.sections || []).length - 1} className="p-1 hover:bg-zinc-900 rounded disabled:opacity-30"><ArrowDown className="w-3.5 h-3.5" /></button>
                              <button type="button" onClick={() => { setActiveListSection('privacy'); setEditingItemId(sec.id); setDraftItem(sec); }} className="p-1 hover:bg-zinc-900 rounded text-amber-500"><Edit3 className="w-3.5 h-3.5" /></button>
                              <button type="button" onClick={() => handleDeleteListItem('privacy', sec.id)} className="p-1 hover:bg-zinc-900 rounded text-rose-500"><Trash2 className="w-3.5 h-3.5" /></button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div>
                    <Button type="button" onClick={() => { setActiveListSection('privacy'); setEditingItemId(null); setDraftItem({ heading: '', description: '' }); }} variant="secondary" size="sm" className="text-xs text-luxury-gold">
                      <Plus className="w-3.5 h-3.5" /> Add subsection
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="border border-zinc-900 p-4 rounded bg-zinc-900/10 flex flex-col gap-3">
                  <Input label="Section Heading" value={draftItem.heading || ''} onChange={e => setDraftItem({ ...draftItem, heading: e.target.value })} />
                  <Input label="Section Description (Rich Text HTML Supported: <p>, <b>, <ul>, <li>, <a>, <br/>)" textarea rows={6} value={draftItem.description || ''} onChange={e => setDraftItem({ ...draftItem, description: e.target.value })} />
                  <div className="flex justify-end gap-2 border-t border-zinc-900/60 pt-2.5">
                    <button type="button" onClick={() => { setActiveListSection(null); setEditingItemId(null); setDraftItem({}); }} className="px-3 py-1.5 text-xs text-zinc-550 hover:text-white">Cancel</button>
                    <button type="button" onClick={() => handleSaveListItem('privacy')} className="px-4 py-1.5 bg-luxury-gold text-black font-bold text-xs rounded">Save subsection</button>
                  </div>
                </div>
              )}
            </div>
          </Card>
        )}

        {/* COOKIE POLICY PANEL */}
        {activeTab === 'cookies' && (
          <Card className="border border-zinc-800/85 p-6 flex flex-col gap-5">
            <h2 className="text-sm font-serif font-semibold tracking-wider text-luxury-gold uppercase border-b border-zinc-900 pb-2">Cookie Policy parameters</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Title Headline" value={cookiesForm.title || ''} onChange={e => setCookiesForm({ ...cookiesForm, title: e.target.value })} />
              <Input label="Effective Date" value={cookiesForm.effectiveDate || ''} onChange={e => setCookiesForm({ ...cookiesForm, effectiveDate: e.target.value })} />
              <div className="md:col-span-2">
                <Input label="Short Description Overview" textarea rows={2} value={cookiesForm.description || ''} onChange={e => setCookiesForm({ ...cookiesForm, description: e.target.value })} />
              </div>
            </div>

            <div className="flex justify-end border-b border-zinc-900 pb-4">
              <Button type="button" onClick={() => handleSaveDoc('cookiePolicy', cookiesForm)} variant="primary" size="sm" className="gap-2 bg-luxury-gold text-black font-bold">
                <Settings className="w-3.5 h-3.5 text-black" /> Save Core Details
              </Button>
            </div>

            {/* Cookies Categories CRUD */}
            <div>
              <h3 className="text-xs font-mono text-zinc-400 mb-3 block">Cookie classifications</h3>

              {activeListSection !== 'cookies' ? (
                <div className="flex flex-col gap-3">
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-zinc-900 text-zinc-500 font-mono uppercase text-[9px] tracking-wider text-left">
                          <th className="py-2 px-3">Order</th>
                          <th className="py-2 px-3">Class Name</th>
                          <th className="py-2 px-3">Purpose description</th>
                          <th className="py-2 px-3 text-center">Status</th>
                          <th className="py-2 px-3 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(cookiesForm.categories || []).map((sec, idx) => (
                          <tr key={sec.id || idx} className="border-b border-zinc-900/60 hover:bg-zinc-900/10 text-zinc-300">
                            <td className="py-2.5 px-3 font-mono">{idx + 1}</td>
                            <td className="py-2.5 px-3 font-bold">{sec.name}</td>
                            <td className="py-2.5 px-3 truncate max-w-xs">{sec.description}</td>
                            <td className="py-2.5 px-3 text-center">
                              <Switch checked={sec.status === 'Active'} onChange={() => handleToggleStatus('cookies', sec.id, sec.status)} />
                            </td>
                            <td className="py-2.5 px-3 text-right flex items-center justify-end gap-1 mt-0.5">
                              <button type="button" onClick={() => handleMoveItem('cookies', idx, -1)} disabled={idx === 0} className="p-1 hover:bg-zinc-900 rounded disabled:opacity-30"><ArrowUp className="w-3.5 h-3.5" /></button>
                              <button type="button" onClick={() => handleMoveItem('cookies', idx, 1)} disabled={idx === (cookiesForm.categories || []).length - 1} className="p-1 hover:bg-zinc-900 rounded disabled:opacity-30"><ArrowDown className="w-3.5 h-3.5" /></button>
                              <button type="button" onClick={() => { setActiveListSection('cookies'); setEditingItemId(sec.id); setDraftItem(sec); }} className="p-1 hover:bg-zinc-900 rounded text-amber-500"><Edit3 className="w-3.5 h-3.5" /></button>
                              <button type="button" onClick={() => handleDeleteListItem('cookies', sec.id)} className="p-1 hover:bg-zinc-900 rounded text-rose-500"><Trash2 className="w-3.5 h-3.5" /></button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div>
                    <Button type="button" onClick={() => { setActiveListSection('cookies'); setEditingItemId(null); setDraftItem({ name: '', description: '' }); }} variant="secondary" size="sm" className="text-xs text-luxury-gold">
                      <Plus className="w-3.5 h-3.5" /> Add category
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="border border-zinc-900 p-4 rounded bg-zinc-900/10 flex flex-col gap-3">
                  <Input label="Category Classification Name" value={draftItem.name || ''} onChange={e => setDraftItem({ ...draftItem, name: e.target.value })} />
                  <Input label="Category description narrative text" textarea rows={4} value={draftItem.description || ''} onChange={e => setDraftItem({ ...draftItem, description: e.target.value })} />
                  <div className="flex justify-end gap-2 border-t border-zinc-900/60 pt-2.5">
                    <button type="button" onClick={() => { setActiveListSection(null); setEditingItemId(null); setDraftItem({}); }} className="px-3 py-1.5 text-xs text-zinc-550 hover:text-white">Cancel</button>
                    <button type="button" onClick={() => handleSaveListItem('cookies')} className="px-4 py-1.5 bg-luxury-gold text-black font-bold text-xs rounded">Save category</button>
                  </div>
                </div>
              )}
            </div>
          </Card>
        )}

        {/* LEGAL SETTINGS PANEL */}
        {activeTab === 'settings' && (
          <Card className="border border-zinc-800/85 p-6 flex flex-col gap-5">
            <h2 className="text-sm font-serif font-semibold tracking-wider text-luxury-gold uppercase border-b border-zinc-900 pb-2">Global switches</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-3 bg-zinc-900/30 border border-zinc-900 rounded flex items-center justify-between">
                <span className="text-xs font-semibold text-zinc-400">Show Terms of Service popup link</span>
                <Switch checked={settingsForm.showTerms !== false} onChange={val => setSettingsForm({ ...settingsForm, showTerms: val })} />
              </div>
              <div className="p-3 bg-zinc-900/30 border border-zinc-900 rounded flex items-center justify-between">
                <span className="text-xs font-semibold text-zinc-400">Show Privacy Policy popup link</span>
                <Switch checked={settingsForm.showPrivacy !== false} onChange={val => setSettingsForm({ ...settingsForm, showPrivacy: val })} />
              </div>
              <div className="p-3 bg-zinc-900/30 border border-zinc-900 rounded flex items-center justify-between">
                <span className="text-xs font-semibold text-zinc-400">Show Cookie Policy popup link</span>
                <Switch checked={settingsForm.showCookiePolicy !== false} onChange={val => setSettingsForm({ ...settingsForm, showCookiePolicy: val })} />
              </div>
              <div className="p-3 bg-zinc-900/30 border border-zinc-900 rounded flex items-center justify-between">
                <span className="text-xs font-semibold text-zinc-400">Enable popup overlays globally</span>
                <Switch checked={settingsForm.enablePopup !== false} onChange={val => setSettingsForm({ ...settingsForm, enablePopup: val })} />
              </div>
              <div className="p-3 bg-zinc-900/30 border border-zinc-900 rounded flex items-center justify-between">
                <span className="text-xs font-semibold text-zinc-400">Apply backdrop blur effect</span>
                <Switch checked={settingsForm.blurBackground !== false} onChange={val => setSettingsForm({ ...settingsForm, blurBackground: val })} />
              </div>
              <div className="p-3 bg-zinc-900/30 border border-zinc-900 rounded flex items-center justify-between">
                <span className="text-xs font-semibold text-zinc-400">Close popup on outside background click</span>
                <Switch checked={settingsForm.closeOnOutsideClick !== false} onChange={val => setSettingsForm({ ...settingsForm, closeOnOutsideClick: val })} />
              </div>
              <div className="p-3 bg-zinc-900/30 border border-zinc-900 rounded flex items-center justify-between">
                <span className="text-xs font-semibold text-zinc-400">Display Last Updated timestamp</span>
                <Switch checked={settingsForm.showLastUpdated !== false} onChange={val => setSettingsForm({ ...settingsForm, showLastUpdated: val })} />
              </div>
              <Input label="Popup Width Constraint (e.g. max-w-2xl)" value={settingsForm.popupWidth || 'max-w-2xl'} onChange={e => setSettingsForm({ ...settingsForm, popupWidth: e.target.value })} />
              <Input label="Overlay Opacity % (0 - 100)" type="number" value={settingsForm.overlayOpacity || 80} onChange={e => setSettingsForm({ ...settingsForm, overlayOpacity: parseInt(e.target.value) || 80 })} />
              <Input label="Theme mode (dark / light)" value={settingsForm.theme || 'dark'} onChange={e => setSettingsForm({ ...settingsForm, theme: e.target.value })} />
            </div>

            <div className="flex justify-end border-t border-zinc-900 pt-3">
              <Button type="button" onClick={() => handleSaveDoc('legalSettings', settingsForm)} variant="primary" size="sm" className="bg-luxury-gold text-black font-bold">Save Settings</Button>
            </div>
          </Card>
        )}

        {/* SEO CONFIG PANEL */}
        {activeTab === 'seo' && (
          <Card className="border border-zinc-800/85 p-6 flex flex-col gap-5">
            <h2 className="text-sm font-serif font-semibold tracking-wider text-luxury-gold uppercase border-b border-zinc-900 pb-2">SEO parameters</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="SEO Meta Title" value={termsForm.seo?.metaTitle || ''} onChange={e => setTermsForm({ ...termsForm, seo: { ...(termsForm.seo || {}), metaTitle: e.target.value } })} />
              <Input label="SEO Meta Keywords" value={termsForm.seo?.metaKeywords || ''} onChange={e => setTermsForm({ ...termsForm, seo: { ...(termsForm.seo || {}), metaKeywords: e.target.value } })} />
              <Input label="Canonical URL Path" value={termsForm.seo?.canonicalUrl || ''} onChange={e => setTermsForm({ ...termsForm, seo: { ...(termsForm.seo || {}), canonicalUrl: e.target.value } })} />
              <Input label="Search Robots Directives" value={termsForm.seo?.robots || 'index, follow'} onChange={e => setTermsForm({ ...termsForm, seo: { ...(termsForm.seo || {}), robots: e.target.value } })} />
              <div className="md:col-span-2">
                <Input label="SEO Meta Description Content" textarea rows={3} value={termsForm.seo?.metaDescription || ''} onChange={e => setTermsForm({ ...termsForm, seo: { ...(termsForm.seo || {}), metaDescription: e.target.value } })} />
              </div>
            </div>

            <div className="flex justify-end border-t border-zinc-900 pt-3">
              <Button type="button" onClick={() => handleSaveDoc('termsPolicy', termsForm)} variant="primary" size="sm" className="bg-luxury-gold text-black font-bold">Save SEO Settings</Button>
            </div>
          </Card>
        )}

      </div>
    </div>
  );
};
