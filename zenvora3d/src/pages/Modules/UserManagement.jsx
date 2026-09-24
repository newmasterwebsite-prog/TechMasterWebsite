import React, { useState, useEffect } from 'react';
import { useDatabase } from '../../context/DatabaseContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Badge } from '../../components/ui/Badge';
import { Switch } from '../../components/ui/Switch';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, UserPlus, Shield, Mail, Trash2, Edit2, 
  CheckCircle, ShieldAlert, Key, Clock, ExternalLink, X
} from 'lucide-react';

export const UserManagement = () => {
  const { db, addItem, updateItem, deleteItem } = useDatabase();
  const usersList = db.users || [];

  // Dialog / Modal States
  const [isOpen, setIsOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [deleteUserId, setDeleteUserId] = useState(null);

  // Form fields state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'Editor',
    status: 'Active',
    imageUrl: ''
  });

  // Automatically clear other co-admins on component load to maintain a clean single-user YouTuber layout
  useEffect(() => {
    const extraUsers = usersList.filter(u => u.id !== 'usr-1');
    if (extraUsers.length > 0) {
      extraUsers.forEach(u => {
        deleteItem('users', u.id);
      });
    }
  }, []);

  const openAddModal = () => {
    setEditingUser(null);
    setFormData({
      name: '',
      email: '',
      role: 'Editor',
      status: 'Active',
      imageUrl: ''
    });
    setIsOpen(true);
  };

  const openEditModal = (user) => {
    setEditingUser(user);
    setFormData({
      name: user.name || '',
      email: user.email || '',
      role: user.role || 'Editor',
      status: user.status || 'Active',
      imageUrl: user.imageUrl || ''
    });
    setIsOpen(true);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim()) return;

    // Use a high-quality avatar fallback if empty
    const fallbackImage = `https://images.unsplash.com/photo-${formData.role === 'Super Admin' ? '1534528741775-53994a69daeb' : '1507003211169-0a1dd7228f2d'}?auto=format&fit=crop&q=80&w=150`;
    
    const payload = {
      ...formData,
      imageUrl: formData.imageUrl.trim() || fallbackImage,
      lastActive: new Date().toISOString()
    };

    if (editingUser) {
      updateItem('users', editingUser.id, payload);
    } else {
      payload.id = `usr-${Date.now()}`;
      addItem('users', payload);
    }
    
    setIsOpen(false);
  };

  const toggleUserStatus = (user) => {
    const nextStatus = user.status === 'Active' ? 'Suspended' : 'Active';
    updateItem('users', user.id, { status: nextStatus });
  };

  const confirmDeleteUser = () => {
    if (deleteUserId) {
      deleteItem('users', deleteUserId);
      setDeleteUserId(null);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* HEADER BAR */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-900 pb-5 text-left">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <Users className="w-5 h-5 text-luxury-gold" />
            <h1 className="font-serif text-xl font-bold tracking-wide text-zinc-150 uppercase">
              User & Access Control
            </h1>
          </div>
          <p className="text-xs text-zinc-400 max-w-xl">
            Configure administrative permissions, assign co-admin credentials, and monitor team status maps.
          </p>
        </div>

        <Button 
          onClick={openAddModal} 
          variant="primary" 
          className="text-white font-semibold text-xs py-2 px-4 flex items-center gap-1.5"
        >
          <UserPlus className="w-4 h-4" /> <span>Add Team Member</span>
        </Button>
      </div>

      {/* ADMIN TEAM CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {usersList.map((user) => {
          const isActive = user.status === 'Active';
          return (
            <div 
              key={user.id}
              className="glass-panel border border-zinc-800/60 bg-zinc-950/20 rounded-lg p-5 flex flex-col justify-between hover:border-luxury-gold/30 hover:bg-zinc-900/30 transition-all duration-300 relative group"
            >
              {/* Badge & Toggle Section */}
              <div className="flex items-center justify-between">
                <Badge variant={user.role === 'Super Admin' ? 'gold' : user.role === 'Editor' ? 'success' : 'default'} className="text-[10px] uppercase font-mono py-0.5">
                  {user.role}
                </Badge>
                
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-zinc-550 uppercase">Status:</span>
                  <Switch 
                    checked={isActive} 
                    onChange={() => toggleUserStatus(user)}
                    disabled={user.role === 'Super Admin' && user.email === 'admin@techmaster.com'} 
                  />
                </div>
              </div>

              {/* User Bio Information */}
              <div className="flex items-center gap-4 my-5 text-left">
                <div className="w-12 h-12 rounded-full overflow-hidden border border-zinc-800/80 bg-zinc-900 flex-shrink-0">
                  <img src={user.imageUrl} alt={user.name} className="w-full h-full object-cover" />
                </div>
                <div className="min-w-0">
                  <h4 className="font-serif text-sm font-semibold text-zinc-200 truncate">{user.name}</h4>
                  <span className="text-xs text-zinc-500 font-mono flex items-center gap-1 mt-0.5 truncate">
                    <Mail className="w-3.5 h-3.5" /> {user.email}
                  </span>
                </div>
              </div>

              {/* Footer Meta / CRUD Actions */}
              <div className="flex items-center justify-between border-t border-zinc-900/60 pt-3.5 mt-1">
                <span className="text-[10px] text-zinc-555 font-mono flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-zinc-650" />
                  Last Active: {user.lastActive ? new Date(user.lastActive).toLocaleDateString() : 'Never'}
                </span>
                
                <div className="flex items-center gap-1.5">
                  <button 
                    onClick={() => openEditModal(user)}
                    className="p-1 rounded hover:bg-zinc-850 text-zinc-500 hover:text-luxury-gold transition-colors"
                    title="Edit Admin"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button 
                    onClick={() => setDeleteUserId(user.id)}
                    className="p-1 rounded hover:bg-zinc-850 text-zinc-550 hover:text-rose-450 transition-colors"
                    disabled={user.role === 'Super Admin' && user.email === 'admin@techmaster.com'}
                    title="Delete Admin"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ACCESS CONTROL MATRIX (PERMISSIONS MAP) */}
      <div className="glass-panel border border-zinc-800/80 rounded-lg p-5 bg-zinc-950/20 text-left">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-900 pb-3 mb-4">
          <h3 className="font-serif text-xs font-bold uppercase tracking-widest text-luxury-gold flex items-center gap-1.5">
            <Shield className="w-4 h-4 text-luxury-gold" />
            Access Control Permissions Matrix
          </h3>
          <span className="text-[10px] text-zinc-500 font-mono">Role accessibility configuration panel</span>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-950/30 text-zinc-500 font-mono uppercase tracking-wider text-[9px] border-b border-zinc-900">
              <tr>
                <th className="p-3 pl-5">Module / Feature Area</th>
                <th className="p-3">Super Admin</th>
                <th className="p-3">Editor</th>
                <th className="p-3">Analyst</th>
                <th className="p-3">Writer</th>
                <th className="p-3 pr-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-900/60 text-zinc-350">
              {[
                { module: 'Homepage CRUD Settings', super: 'Full Access', editor: 'Read & Write', analyst: 'Read Only', writer: 'None' },
                { module: 'Blogs & Articles', super: 'Full Access', editor: 'Read & Write', analyst: 'None', writer: 'Read & Write' },
                { module: 'Brand Collaborations & Campaigns', super: 'Full Access', editor: 'Read & Write', analyst: 'Read Only', writer: 'None' },
                { module: 'Global SEO / Sitemaps Config', super: 'Full Access', editor: 'None', analyst: 'None', writer: 'None' },
                { module: 'System Logs & Security', super: 'Full Access', editor: 'None', analyst: 'None', writer: 'None' },
                { module: 'Contact Inquiries & Bookings', super: 'Full Access', editor: 'Read Only', analyst: 'None', writer: 'None' }
              ].map((row, idx) => (
                <tr key={idx} className="hover:bg-zinc-950/10">
                  <td className="p-3.5 pl-5 font-semibold text-zinc-200">{row.module}</td>
                  <td className="p-3.5"><span className="text-luxury-gold font-bold">{row.super}</span></td>
                  <td className="p-3.5"><span className="text-zinc-300 font-medium">{row.editor}</span></td>
                  <td className="p-3.5"><span className="text-zinc-500">{row.analyst}</span></td>
                  <td className="p-3.5"><span className="text-zinc-650">{row.writer}</span></td>
                  <td className="p-3.5 pr-5 text-right">
                    <button 
                      onClick={() => alert(`Configuring custom access matrix rules for [${row.module}]...`)}
                      className="px-2.5 py-1 bg-zinc-900 border border-zinc-800 hover:border-luxury-gold/50 rounded text-[10px] font-mono uppercase tracking-wider text-zinc-400 hover:text-luxury-gold transition-all"
                    >
                      Configure
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* --- ADD / EDIT USER DIALOG MODAL --- */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md border border-zinc-800 bg-zinc-950 rounded-lg shadow-xl overflow-hidden text-left"
            >
              <div className="flex items-center justify-between p-4 border-b border-zinc-900 bg-zinc-900/30">
                <h3 className="font-serif text-sm font-bold uppercase tracking-wider text-luxury-gold">
                  {editingUser ? 'Edit Team Member Details' : 'Add Team Member'}
                </h3>
                <button onClick={() => setIsOpen(false)} className="text-zinc-550 hover:text-zinc-300 p-1">
                  <X className="w-4.5 h-4.5" />
                </button>
              </div>

              <form onSubmit={handleFormSubmit} className="p-5 flex flex-col gap-4">
                <Input 
                  label="Full Name"
                  placeholder="e.g. Rahul Sharma"
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  required
                />
                
                <Input 
                  label="Email Address"
                  type="email"
                  placeholder="e.g. rahul@collab.com"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  required
                />

                <div className="grid grid-cols-2 gap-4">
                  <Select 
                    label="Access Role"
                    options={[
                      { value: 'Super Admin', label: 'Super Admin' },
                      { value: 'Editor', label: 'Editor' },
                      { value: 'Analyst', label: 'Analyst' },
                      { value: 'Writer', label: 'Writer' }
                    ]}
                    value={formData.role}
                    onChange={e => setFormData({ ...formData, role: e.target.value })}
                  />
                  <Select 
                    label="Initial Status"
                    options={[
                      { value: 'Active', label: 'Active' },
                      { value: 'Suspended', label: 'Suspended' }
                    ]}
                    value={formData.status}
                    onChange={e => setFormData({ ...formData, status: e.target.value })}
                  />
                </div>

                <Input 
                  label="Profile Image URL"
                  placeholder="e.g. https://unsplash.com/photo-..."
                  value={formData.imageUrl}
                  onChange={e => setFormData({ ...formData, imageUrl: e.target.value })}
                />

                <div className="flex justify-end gap-2 border-t border-zinc-900 pt-4 mt-2">
                  <button 
                    type="button" 
                    onClick={() => setIsOpen(false)} 
                    className="px-4 py-2 text-xs font-semibold text-zinc-400 hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <Button 
                    type="submit" 
                    variant="primary" 
                    className="text-white font-semibold text-xs py-2 px-6"
                  >
                    {editingUser ? 'Save Updates' : 'Add Member'}
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* --- CONFIRM DELETE DIALOG --- */}
      <AnimatePresence>
        {deleteUserId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-sm border border-zinc-800 bg-zinc-950 rounded-lg p-5 text-left"
            >
              <div className="flex items-center gap-3 text-rose-455 border-b border-zinc-900 pb-3 mb-4">
                <ShieldAlert className="w-5 h-5 flex-shrink-0" />
                <h4 className="font-serif text-sm font-bold uppercase tracking-wider">Confirm Delete Rule</h4>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed mb-5">
                Are you absolutely sure you want to remove this team member? This action will revoke all administrative access immediately.
              </p>
              <div className="flex justify-end gap-3.5">
                <button 
                  onClick={() => setDeleteUserId(null)}
                  className="text-xs font-semibold text-zinc-550 hover:text-zinc-350 transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmDeleteUser}
                  className="px-4 py-2 rounded bg-rose-500/10 border border-rose-500/30 text-rose-455 hover:bg-rose-500/25 transition-all text-xs font-semibold"
                >
                  Delete Access
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
