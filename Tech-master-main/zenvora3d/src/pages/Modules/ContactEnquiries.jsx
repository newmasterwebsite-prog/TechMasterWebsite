import React, { useState } from 'react';
import { useDatabase } from '../../context/DatabaseContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { ConfirmDialog, Dialog } from '../../components/ui/Dialog';
import { Input } from '../../components/ui/Input';
import { 
  MessageSquare, Search, Eye, Trash2, Mail, MailOpen, 
  Send, Reply, X, Calendar, User, ArrowRight
} from 'lucide-react';

export const ContactEnquiries = () => {
  const { db, deleteItem, toggleStatus, updateItem } = useDatabase();
  const list = db.enquiries || [];

  // Search & Filter
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all'); // all, Booking, Sponsorship, Question
  
  // Selected Message
  const [selectedId, setSelectedId] = useState(list[0]?.id || null);
  const activeMessage = list.find(m => m.id === selectedId);

  // Reply state
  const [isReplyOpen, setIsReplyOpen] = useState(false);
  const [replyBody, setReplyBody] = useState('');
  const [replySuccess, setReplySuccess] = useState(false);

  // Delete state
  const [deleteId, setDeleteId] = useState(null);

  // Filtering
  const filteredList = list.filter(item => {
    const matchesSearch = 
      item.senderName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.message.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  const handleSelectMessage = (id) => {
    setSelectedId(id);
    // Auto mark as Read when clicking if it is Unread
    const msg = list.find(m => m.id === id);
    if (msg && msg.status === 'Unread') {
      updateItem('enquiries', id, { status: 'Read' });
    }
  };

  const handleSendReplySubmit = (e) => {
    e.preventDefault();
    if (!replyBody.trim()) return;

    setReplySuccess(true);
    setTimeout(() => {
      // Update status to Replied
      updateItem('enquiries', selectedId, { status: 'Replied' });
      setIsReplyOpen(false);
      setReplyBody('');
      setReplySuccess(false);
    }, 1200);
  };

  const handleDeleteEnquiry = () => {
    if (deleteId) {
      deleteItem('enquiries', deleteId);
      setDeleteId(null);
      if (selectedId === deleteId) {
        setSelectedId(list.find(m => m.id !== deleteId)?.id || null);
      }
    }
  };

  return (
    <div className="flex flex-col gap-6 text-left h-[calc(100vh-140px)] min-h-[500px]">
      {/* Header */}
      <div className="border-b border-zinc-800/80 pb-4">
        <h1 className="font-serif text-2xl font-medium tracking-wide text-zinc-100 flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-luxury-gold" />
          Enquiries & Bookings Inbox
        </h1>
        <p className="text-xs text-zinc-500 mt-1">
          Review business leads, collaboration pitches, speaking invites, and general visitor feedback.
        </p>
      </div>

      {/* Split Layout */}
      <div className="flex-1 flex gap-5 overflow-hidden">
        {/* LEFT: Sidebar Message list */}
        <div className="w-full md:w-80 flex flex-col gap-4 flex-shrink-0 h-full border-r border-zinc-800/50 pr-5">
          {/* Search Box */}
          <div className="relative">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search inbox logs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-zinc-950/40 border border-zinc-800/80 rounded-md pl-9 pr-4 py-2.5 text-xs text-zinc-100 focus:outline-none focus:border-luxury-gold/50"
            />
          </div>

          {/* Filter badges */}
          <div className="flex gap-1.5 flex-wrap select-none">
            {['all', 'Booking', 'Sponsorship', 'Question'].map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider transition-all cursor-pointer border ${
                  categoryFilter === cat
                    ? 'bg-luxury-gold text-black border-luxury-gold'
                    : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Messages Scroll container */}
          <div className="flex-1 overflow-y-auto flex flex-col gap-2 pr-1">
            {filteredList.length === 0 ? (
              <p className="text-xs text-zinc-500 italic text-center py-10">No messages matches criteria.</p>
            ) : (
              filteredList.map((msg) => {
                const isActive = msg.id === selectedId;
                return (
                  <div
                    key={msg.id}
                    onClick={() => handleSelectMessage(msg.id)}
                    className={`p-3.5 rounded-md border text-left cursor-pointer transition-all duration-300 relative flex flex-col gap-1.5 ${
                      isActive 
                        ? 'bg-luxury-gold/10 border-luxury-gold/30 shadow-[0_0_10px_rgba(212,175,55,0.05)]' 
                        : msg.status === 'Unread'
                        ? 'bg-zinc-900/60 border-zinc-800/60 hover:bg-zinc-900/80'
                        : 'bg-zinc-950/30 border-zinc-900 hover:bg-zinc-900/20'
                    }`}
                  >
                    <div className="flex justify-between items-start gap-2">
                      <span className="text-xs font-semibold text-zinc-200 truncate max-w-[130px]">{msg.senderName}</span>
                      <span className="text-[9px] text-zinc-500 font-mono">
                        {new Date(msg.date).toLocaleDateString([], {month: 'short', day: 'numeric'})}
                      </span>
                    </div>
                    <p className="text-[11px] font-medium text-zinc-300 truncate">{msg.subject}</p>
                    
                    <div className="flex justify-between items-center mt-1">
                      <Badge variant={msg.category === 'Booking' ? 'gold' : msg.category === 'Sponsorship' ? 'info' : 'default'} className="text-[8px]">
                        {msg.category}
                      </Badge>
                      <Badge variant={
                        msg.status === 'Unread' ? 'warning' : msg.status === 'Replied' ? 'success' : 'default'
                      } className="text-[8px]">
                        {msg.status}
                      </Badge>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* RIGHT: Reading Pane */}
        <div className="hidden md:flex flex-1 flex-col h-full overflow-hidden bg-zinc-950/20 border border-zinc-800/60 rounded-lg shadow-card-glow">
          {activeMessage ? (
            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Reading Header */}
              <div className="p-6 border-b border-zinc-800/80 flex justify-between items-start flex-wrap gap-4 bg-zinc-950/60">
                <div>
                  <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                    <Badge variant="gold">{activeMessage.category}</Badge>
                    <Badge variant={
                      activeMessage.status === 'Unread' ? 'warning' : activeMessage.status === 'Replied' ? 'success' : 'default'
                    }>
                      {activeMessage.status}
                    </Badge>
                  </div>
                  <h2 className="font-serif text-lg font-semibold text-zinc-200">{activeMessage.subject}</h2>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      const nextStatus = activeMessage.status === 'Read' ? 'Unread' : 'Read';
                      updateItem('enquiries', activeMessage.id, { status: nextStatus });
                    }}
                    className="p-2 rounded bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-white cursor-pointer"
                    title={activeMessage.status === 'Unread' ? 'Mark as Read' : 'Mark as Unread'}
                  >
                    {activeMessage.status === 'Unread' ? <MailOpen className="w-4 h-4" /> : <Mail className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => setDeleteId(activeMessage.id)}
                    className="p-2 rounded bg-zinc-900 border border-zinc-800 hover:border-rose-500/30 text-zinc-500 hover:text-rose-400 cursor-pointer"
                    title="Delete Enquiry"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Sender Details */}
              <div className="px-6 py-4 border-b border-zinc-900 flex items-center justify-between text-xs text-zinc-400 bg-zinc-950/20">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-zinc-900 flex items-center justify-center border border-zinc-800">
                    <User className="w-4 h-4 text-luxury-gold" />
                  </div>
                  <div>
                    <span className="font-semibold text-zinc-300 block">{activeMessage.senderName}</span>
                    <span className="text-zinc-500 font-mono text-[10px]">{activeMessage.email}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-zinc-500">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{new Date(activeMessage.date).toLocaleString()}</span>
                </div>
              </div>

              {/* Message Body */}
              <div className="flex-1 overflow-y-auto p-6 text-sm text-zinc-300 leading-relaxed max-w-3xl whitespace-pre-line">
                {activeMessage.message}
              </div>

              {/* Action Bar */}
              <div className="p-4 border-t border-zinc-800 bg-zinc-950/60 flex justify-end gap-3">
                {activeMessage.status !== 'Replied' && (
                  <Button onClick={() => setIsReplyOpen(true)} variant="primary" className="gap-2">
                    <Reply className="w-4 h-4 text-black" />
                    <span className="text-black">Compose Reply</span>
                  </Button>
                )}
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-zinc-600 p-8">
              <MessageSquare className="w-12 h-12 text-zinc-800 mb-3 animate-pulse" />
              <p className="font-serif text-lg font-medium">Select an Enquiry</p>
              <p className="text-xs text-zinc-600 mt-1">Pick a booking or message thread from the list to review details.</p>
            </div>
          )}
        </div>
      </div>

      {/* Compose Reply Modal */}
      <Dialog
        isOpen={isReplyOpen}
        onClose={() => setIsReplyOpen(false)}
        title="Compose Email Reply"
        size="md"
      >
        {activeMessage && (
          <form onSubmit={handleSendReplySubmit} className="flex flex-col gap-4 text-left">
            <div className="flex items-center justify-between text-xs text-zinc-400 border-b border-zinc-900 pb-3">
              <div>
                <span className="text-zinc-500 uppercase font-semibold">Recipient:</span>
                <span className="text-zinc-300 font-mono ml-1.5">{activeMessage.email}</span>
              </div>
              <Badge variant="gold">MOCK SMTP ACTIVE</Badge>
            </div>
            
            <Input 
              label="Subject Header"
              value={`Re: ${activeMessage.subject}`}
              disabled
            />

            <Input 
              label="Email Body Content"
              textarea
              rows={6}
              placeholder="Write your email response details..."
              value={replyBody}
              onChange={(e) => setReplyBody(e.target.value)}
              required
            />

            {replySuccess && (
              <div className="p-3 bg-emerald-950/20 border border-emerald-500/25 rounded flex items-center gap-2 text-xs text-emerald-300">
                <Send className="w-4 h-4 text-emerald-400 animate-bounce" />
                <span>SMTP Handshake successful. Message dispatched.</span>
              </div>
            )}

            <div className="flex items-center justify-end gap-3 border-t border-zinc-900 pt-4 mt-2">
              <Button variant="secondary" onClick={() => setIsReplyOpen(false)}>Cancel</Button>
              <Button type="submit" variant="primary" className="gap-2" disabled={replySuccess}>
                <Send className="w-4 h-4 text-black" />
                <span className="text-black">Send Response</span>
              </Button>
            </div>
          </form>
        )}
      </Dialog>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDeleteEnquiry}
      />
    </div>
  );
};
