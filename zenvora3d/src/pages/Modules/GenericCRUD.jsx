import React, { useState } from 'react';
import { useDatabase } from '../../context/DatabaseContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Switch } from '../../components/ui/Switch';
import { Badge } from '../../components/ui/Badge';
import { ConfirmDialog, Dialog } from '../../components/ui/Dialog';
import { 
  Search, Plus, Edit2, Trash2, Eye, SlidersHorizontal, 
  ChevronLeft, ChevronRight, X, Sparkles, AlertCircle
} from 'lucide-react';

export const GenericCRUD = ({ collection, title, schema }) => {
  const { db, addItem, updateItem, deleteItem, toggleStatus } = useDatabase();
  const list = db[collection] || [];

  // Search & Filter State
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // all, active, inactive
  const [categoryFilter, setCategoryFilter] = useState('all');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Modals state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  
  // Form State
  const [formData, setFormData] = useState({});
  const [formErrors, setFormErrors] = useState({});

  // Dynamic tags tracker (for blogs or services that need tag lists)
  const [tagInput, setTagInput] = useState('');

  // Setup options for categories filter if applicable
  const categoryField = schema.fields.find(f => f.filterKey);
  const filterCategories = categoryField ? categoryField.options : [];

  // Filtering Logic
  const filteredList = list.filter(item => {  
    // Search match
    const searchString = schema.searchFields
      .map(f => (item[f] || '').toString().toLowerCase())
      .join(' ');
    const matchesSearch = searchString.includes(searchTerm.toLowerCase());

    // Status match
    const matchesStatus = 
      statusFilter === 'all' || 
      (statusFilter === 'active' && (item.isActive || item.status === 'published' || item.status === 'Active')) || 
      (statusFilter === 'inactive' && (!item.isActive && item.status !== 'published' && item.status !== 'Active'));

    // Category match
    const matchesCategory = 
      categoryFilter === 'all' || 
      (categoryField && item[categoryField.name] === categoryFilter);

    return matchesSearch && matchesStatus && matchesCategory;
  });

  // Pagination Logic
  const totalPages = Math.max(1, Math.ceil(filteredList.length / itemsPerPage));
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredList.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Open Add/Edit Modal
  const openForm = (item = null) => {
    setFormErrors({});
    if (item) {
      setEditingItem(item);
      setFormData(item);
    } else {
      setEditingItem(null);
      // Initialize default values
      const initialFields = {};
      schema.fields.forEach(f => {
        initialFields[f.name] = f.defaultValue !== undefined ? f.defaultValue : '';
      });
      setFormData(initialFields);
    }
    setIsFormOpen(true);
  };

  // Handle Form Input Change
  const handleInputChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Handle tag addition
  const handleAddTag = (name) => {
    if (!tagInput.trim()) return;
    const currentTags = formData[name] || [];
    if (!currentTags.includes(tagInput.trim())) {
      handleInputChange(name, [...currentTags, tagInput.trim()]);
    }
    setTagInput('');
  };

  const handleRemoveTag = (name, tagIndex) => {
    const currentTags = formData[name] || [];
    handleInputChange(name, currentTags.filter((_, idx) => idx !== tagIndex));
  };

  // Form Submit
  const handleFormSubmit = (e) => {
    e.preventDefault();
    
    // Simple Validation
    const errors = {};
    schema.fields.forEach(f => {
      if (f.required && !formData[f.name]) {
        errors[f.name] = `${f.label} is required.`;
      }
    });

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    if (editingItem) {
      updateItem(collection, editingItem.id, formData);
    } else {
      addItem(collection, formData);
    }
    setIsFormOpen(false);
    setFormData({});
  };

  const handleDeleteConfirm = () => {
    if (deleteId) {
      deleteItem(collection, deleteId);
      setDeleteId(null);
      // Adjust page index if last item deleted on page
      if (currentItems.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    }
  };

  return (
    <div className="flex flex-col gap-6 text-left">
      {/* Header Panel */}
      <div className="flex items-center justify-between flex-wrap gap-4 border-b border-zinc-800/80 pb-5">
        <div>
          <h1 className="font-serif text-2xl font-medium tracking-wide text-zinc-100 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-luxury-gold" />
            {title}
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            Displaying {filteredList.length} total entries | Page {currentPage} of {totalPages}
          </p>
        </div>
        <Button variant="primary" size="sm" onClick={() => openForm(null)} className="gap-2">
          <Plus className="w-4 h-4 text-black" />
          <span className="text-black">Add New Entry</span>
        </Button>
      </div>

      {/* Search & Filters */}
      <div className="glass-panel rounded-lg p-4 border border-zinc-800/60 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-3.5" />
          <input
            type="text"
            placeholder={`Search by ${schema.searchFields.join(', ')}...`}
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            className="w-full bg-zinc-950/40 border border-zinc-800/80 rounded-md pl-10 pr-4 py-2.5 text-sm text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-luxury-gold/50 focus:ring-1 focus:ring-luxury-gold/20"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3 flex-wrap">
          {categoryField && (
            <div className="w-40">
              <Select
                options={[{ value: 'all', label: `All ${categoryField.label}s` }, ...filterCategories]}
                value={categoryFilter}
                onChange={(e) => { setCategoryFilter(e.target.value); setCurrentPage(1); }}
              />
            </div>
          )}

          <div className="w-36">
            <Select
              options={[
                { value: 'all', label: 'All Status' },
                { value: 'active', label: 'Active / Published' },
                { value: 'inactive', label: 'Inactive / Draft' }
              ]}
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
            />
          </div>

          {(searchTerm || statusFilter !== 'all' || categoryFilter !== 'all') && (
            <button
              onClick={() => { setSearchTerm(''); setStatusFilter('all'); setCategoryFilter('all'); }}
              className="text-xs text-zinc-500 hover:text-white flex items-center gap-1 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Main List Table */}
      <Card className="border border-zinc-800/60 overflow-hidden p-0">
        {currentItems.length === 0 ? (
          <div className="p-12 text-center text-zinc-500 flex flex-col items-center justify-center">
            <AlertCircle className="w-8 h-8 text-zinc-700 mb-2 animate-bounce" />
            <p className="text-sm font-semibold">No records found matching current query</p>
            <p className="text-xs text-zinc-600 mt-1">Try resetting search string or category filters</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left border-collapse">
              <thead>
                <tr className="bg-zinc-950/80 border-b border-zinc-800 text-[10px] uppercase font-bold tracking-widest text-zinc-400 select-none">
                  {schema.listColumns.map((col, i) => (
                    <th key={i} className="px-6 py-4">{col.label}</th>
                  ))}
                  <th className="px-6 py-4 text-center">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-900/60">
                {currentItems.map((item) => (
                  <tr key={item.id} className="hover:bg-zinc-900/10 transition-colors duration-200">
                    {schema.listColumns.map((col, idx) => {
                      let cellVal = item[col.name];
                      
                      // Custom Cell Renderers based on schema types
                      if (col.type === 'tags') {
                        return (
                          <td key={idx} className="px-6 py-4 max-w-xs">
                            <div className="flex flex-wrap gap-1">
                              {(cellVal || []).map((t, idx2) => (
                                <Badge key={idx2} variant="default" className="text-[9px]">{t}</Badge>
                              ))}
                            </div>
                          </td>
                        );
                      }
                      
                      if (col.type === 'image') {
                        return (
                          <td key={idx} className="px-6 py-4">
                            {cellVal ? (
                              <img src={cellVal} alt="" className="w-10 h-10 rounded border border-zinc-800 object-cover" />
                            ) : (
                              <span className="text-zinc-600 font-mono text-[10px]">No Image</span>
                            )}
                          </td>
                        );
                      }

                      if (col.type === 'link') {
                        return (
                          <td key={idx} className="px-6 py-4 truncate max-w-xs font-mono text-[11px] text-zinc-400">
                            {cellVal ? (
                              <a href={cellVal} target="_blank" rel="noopener noreferrer" className="hover:text-luxury-gold underline flex items-center gap-1">
                                {cellVal.length > 28 ? `${cellVal.substring(0, 25)}...` : cellVal}
                              </a>
                            ) : '-'}
                          </td>
                        );
                      }

                      return (
                        <td key={idx} className="px-6 py-4 max-w-xs truncate font-medium text-zinc-300">
                          {cellVal !== undefined ? cellVal : '-'}
                        </td>
                      );
                    })}

                    {/* Status Toggles */}
                    <td className="px-6 py-4 text-center">
                      <div className="flex justify-center">
                        <Switch
                          checked={item.isActive || item.status === 'published' || item.status === 'Active'}
                          onChange={() => toggleStatus(collection, item.id)}
                          label={item.isActive || item.status === 'published' || item.status === 'Active' ? "ACTIVE" : "INACTIVE"}
                        />
                      </div>
                    </td>

                    {/* Action Controls */}
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end items-center gap-2">
                        <button
                          onClick={() => openForm(item)}
                          className="p-2 rounded hover:bg-zinc-800/80 text-zinc-400 hover:text-luxury-gold transition-colors cursor-pointer"
                          title="Edit Row"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteId(item.id)}
                          className="p-2 rounded hover:bg-zinc-800/80 text-zinc-500 hover:text-rose-400 transition-colors cursor-pointer"
                          title="Delete Row"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 bg-zinc-950/40 border-t border-zinc-800">
            <span className="text-xs text-zinc-500">
              Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredList.length)} of {filteredList.length} items
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="py-1.5 px-2.5"
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => handlePageChange(i + 1)}
                  className={`w-7 h-7 rounded text-xs font-semibold ${
                    currentPage === i + 1
                      ? 'bg-luxury-gold text-black'
                      : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <Button
                variant="secondary"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="py-1.5 px-2.5"
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Add/Edit Modal (Slide-Over Panel) */}
      <Dialog
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        title={editingItem ? `Edit ${title.slice(0, -5)}` : `New ${title.slice(0, -5)}`}
        size="md"
      >
        <form onSubmit={handleFormSubmit} className="flex flex-col gap-5 text-left">
          {schema.fields.map((field) => {
            const isError = formErrors[field.name];

            if (field.type === 'select') {
              return (
                <Select
                  key={field.name}
                  label={field.label}
                  options={field.options}
                  value={formData[field.name] || ''}
                  onChange={(e) => handleInputChange(field.name, e.target.value)}
                  error={isError}
                  required={field.required}
                />
              );
            }

            if (field.type === 'textarea') {
              return (
                <Input
                  key={field.name}
                  label={field.label}
                  textarea
                  rows={field.rows || 3}
                  placeholder={field.placeholder}
                  value={formData[field.name] || ''}
                  onChange={(e) => handleInputChange(field.name, e.target.value)}
                  error={isError}
                  required={field.required}
                />
              );
            }

            if (field.type === 'tags') {
              const tagsList = formData[field.name] || [];
              return (
                <div key={field.name} className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wide">
                    {field.label}
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Add tag and press enter"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddTag(field.name);
                        }
                      }}
                      className="flex-1 bg-zinc-950/60 border border-zinc-800 rounded-md px-3.5 py-2.5 text-sm text-zinc-100 focus:outline-none focus:border-luxury-gold/50"
                    />
                    <Button variant="secondary" onClick={() => handleAddTag(field.name)}>Add</Button>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {tagsList.map((tag, idx) => (
                      <span key={idx} className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-zinc-900 border border-zinc-800 text-xs font-medium">
                        {tag}
                        <button type="button" onClick={() => handleRemoveTag(field.name, idx)} className="text-zinc-500 hover:text-rose-400">
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              );
            }

            if (field.type === 'boolean') {
              return (
                <div key={field.name} className="flex items-center justify-between p-3 rounded bg-zinc-900/30 border border-zinc-900 mt-2">
                  <span className="text-xs font-semibold text-zinc-400 uppercase tracking-wide">{field.label}</span>
                  <Switch
                    checked={!!formData[field.name]}
                    onChange={(val) => handleInputChange(field.name, val)}
                  />
                </div>
              );
            }

            return (
              <Input
                key={field.name}
                label={field.label}
                type={field.type || 'text'}
                placeholder={field.placeholder}
                value={formData[field.name] || ''}
                onChange={(e) => handleInputChange(field.name, e.target.value)}
                error={isError}
                required={field.required}
              />
            );
          })}

          <div className="flex items-center justify-end gap-3 mt-6 border-t border-zinc-900 pt-4">
            <Button variant="secondary" onClick={() => setIsFormOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              {editingItem ? 'Save Updates' : 'Publish Entry'}
            </Button>
          </div>
        </form>
      </Dialog>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={deleteId !== null}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
};
