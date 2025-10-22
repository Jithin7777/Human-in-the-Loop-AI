import React, { useEffect, useState } from "react";
import type { KnowledgeItem } from "../../types";
import { getKnowledge, addOrUpdate } from "./knowledgeBase.service";
import { Plus, Edit, Search, BookOpen, Save, X, Loader } from "lucide-react";
import { getSafeDate } from "../../utils/dateUtils";


const KnowledgeBase: React.FC = () => {
  const [items, setItems] = useState<KnowledgeItem[]>([]);
  const [q, setQ] = useState("");
  const [a, setA] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const fetchKnowledge = async () => {
    try {
      setIsLoading(true);
      const kb = await getKnowledge();
      setItems(kb);
    } catch (err) {
      console.error(err);
      alert("Failed to load knowledge base items");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchKnowledge();
  }, []);

  const submit = async () => {
    if (!q.trim() || !a.trim()) {
      alert("Please enter both question and answer");
      return;
    }

    try {
      setIsSubmitting(true);
      await addOrUpdate(q.trim(), a.trim());
      setQ("");
      setA("");
      setEditingId(null);
      setShowForm(false);
      await fetchKnowledge();
    } catch (err) {
      console.error(err);
      alert("Failed to save knowledge item");
    } finally {
      setIsSubmitting(false);
    }
  };

  const startEdit = (item: KnowledgeItem) => {
    setQ(item.question);
    setA(item.answer);
    setEditingId(item._id);
    setShowForm(true);
  };

  const cancelEdit = () => {
    setQ("");
    setA("");
    setEditingId(null);
    setShowForm(false);
  };

  const filteredItems = items.filter(item =>
    item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
  <div className="flex items-center gap-3">
    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
      <BookOpen className="text-white w-5 h-5 sm:w-6 sm:h-6" />
    </div>
    <div className="flex-1 min-w-0">
      <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 break-words">Knowledge Base</h1>
      <p className="text-gray-600 text-sm sm:text-base mt-1 break-words">Manage your AI assistant's knowledge and responses</p>
    </div>
  </div>
  
  {!showForm && (
    <div className="flex sm:block">
      <button
        onClick={() => setShowForm(true)}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 sm:py-2 rounded-lg flex items-center gap-2 transition-colors w-full sm:w-auto justify-center"
      >
        <Plus size={18} />
        Add New
      </button>
    </div>
  )}
</div>
      {/* Add/Edit Form */}
      {showForm && (
        <div className="bg-white rounded-xl shadow-sm border p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-800">
              {editingId ? "Edit Knowledge Item" : "Add New Knowledge"}
            </h2>
            <button
              onClick={cancelEdit}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Question <span className="text-red-500">*</span>
              </label>
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="What would you like the AI to answer?"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Answer <span className="text-red-500">*</span>
              </label>
              <textarea
                value={a}
                onChange={(e) => setA(e.target.value)}
                rows={4}
                placeholder="Provide the answer for this question..."
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
              />
            </div>

            <div className="flex gap-3 justify-end">
              <button
                onClick={cancelEdit}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={submit}
                disabled={!q.trim() || !a.trim() || isSubmitting}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
              >
                {isSubmitting ? (
                  <Loader size={18} className="animate-spin" />
                ) : (
                  <Save size={18} />
                )}
                {editingId ? "Update" : "Save"} Item
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Search Bar */}
      <div className="bg-white rounded-xl shadow-sm border p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search knowledge base..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Knowledge Items */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="text-center py-12">
            <Loader className="animate-spin mx-auto text-blue-600" size={32} />
            <p className="text-gray-600 mt-3">Loading knowledge base...</p>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border">
            <BookOpen className="mx-auto text-gray-400" size={48} />
            <p className="text-gray-600 mt-3">
              {searchTerm ? "No matching items found" : "No knowledge items yet"}
            </p>
            {!searchTerm && (
              <button
                onClick={() => setShowForm(true)}
                className="mt-3 text-blue-600 hover:text-blue-700 font-medium"
              >
                Add your first item
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <p className="text-gray-600">
                {filteredItems.length} item{filteredItems.length !== 1 ? 's' : ''} found
                {searchTerm && ` for "${searchTerm}"`}
              </p>
            </div>

            <div className="grid gap-4">
              {filteredItems.map((item) => (
                <div key={item._id} className="bg-white rounded-xl shadow-sm border p-5 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        <h3 className="font-semibold text-gray-800 text-lg">Q: {item.question}</h3>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4 border">
                        <p className="text-gray-700 whitespace-pre-wrap">A: {item.answer}</p>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => startEdit(item)}
                      className="ml-4 p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit item"
                    >
                      <Edit size={16} />
                    </button>
                  </div>
                  
                  <div className="text-xs text-gray-500 mt-2">
                    Last updated: {getSafeDate(item.updatedAt || item.createdAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

     
    </div>
  );
};

export default KnowledgeBase;