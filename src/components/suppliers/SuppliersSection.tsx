import React, { useState } from 'react';
import { useSupplier } from '../../contexts/SupplierContext';
import AddSupplierModal from './AddSupplierModal';
import EditSupplierModal from './EditSupplierModal';
import SupplierDetailModal from './SupplierDetailModal';
import { Plus, Search, Edit, Trash2, Eye, Phone, Mail, Building2 } from 'lucide-react';

export default function SuppliersSection() {
  const { suppliers, deleteSupplier, getSupplierStats } = useSupplier();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState<string | null>(null);
  const [viewingSupplier, setViewingSupplier] = useState<string | null>(null);

  const filteredSuppliers = suppliers.filter(supplier => {
    const matchesSearch = supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         supplier.ice.includes(searchTerm) ||
                         supplier.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         supplier.contactPerson.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || supplier.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleDeleteSupplier = (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce fournisseur ?')) {
      deleteSupplier(id);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            Actif
          </span>
        );
      case 'inactive':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            Inactif
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
          <Building2 className="w-8 h-8 text-orange-600" />
          <span>Fournisseurs</span>
        </h1>
        <button 
          onClick={() => setIsAddModalOpen(true)}
          className="inline-flex items-center space-x-2 bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white px-4 py-2 rounded-lg transition-all duration-200"
        >
          <Plus className="w-4 h-4" />
          <span>Nouveau Fournisseur</span>
        </button>
      </div>

      {/* Filtres */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
          <div className="flex-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                placeholder="Rechercher par nom, ICE, email ou contact..."
              />
            </div>
          </div>
          
          <div className="flex space-x-4">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="all">Tous les statuts</option>
              <option value="active">Actif</option>
              <option value="inactive">Inactif</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grille des fournisseurs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSuppliers.map((supplier) => {
          const stats = getSupplierStats(supplier.id);
          
          return (
            <div key={supplier.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 truncate">{supplier.name}</h3>
                <div className="flex space-x-2">
                  <button 
                    onClick={() => setViewingSupplier(supplier.id)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Voir détails"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => setEditingSupplier(supplier.id)}
                    className="p-2 text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                    title="Modifier"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => handleDeleteSupplier(supplier.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Supprimer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <span className="font-medium">ICE:</span>
                  <span>{supplier.ice}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Phone className="w-4 h-4" />
                  <span>{supplier.phone}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Mail className="w-4 h-4" />
                  <span className="truncate">{supplier.email}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <span className="font-medium">Contact:</span>
                  <span className="truncate">{supplier.contactPerson}</span>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-4">
                <div className="grid grid-cols-2 gap-4 text-center mb-3">
                  <div>
                    <p className="text-2xl font-bold text-orange-600">{stats.ordersCount}</p>
                    <p className="text-xs text-gray-500">Commandes</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-blue-600">{stats.totalPurchases.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">MAD Achats</p>
                  </div>
                </div>
                
                <div className="text-center">
                  <p className={`text-lg font-bold ${
                    stats.balance > 0 ? 'text-red-600' : 
                    stats.balance < 0 ? 'text-green-600' : 'text-gray-600'
                  }`}>
                    {stats.balance.toLocaleString()} MAD
                  </p>
                  <p className="text-xs text-gray-500">
                    {stats.balance > 0 ? 'À payer' : stats.balance < 0 ? 'Crédit' : 'Soldé'}
                  </p>
                </div>
                
                <div className="mt-3 flex justify-center">
                  {getStatusBadge(supplier.status)}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredSuppliers.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">Aucun fournisseur trouvé</p>
        </div>
      )}

      {/* Modals */}
      <AddSupplierModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
      />

      {editingSupplier && (
        <EditSupplierModal
          isOpen={!!editingSupplier}
          onClose={() => setEditingSupplier(null)}
          supplier={suppliers.find(s => s.id === editingSupplier)!}
        />
      )}

      {viewingSupplier && (
        <SupplierDetailModal
          isOpen={!!viewingSupplier}
          onClose={() => setViewingSupplier(null)}
          supplier={suppliers.find(s => s.id === viewingSupplier)!}
        />
      )}
    </div>
  );
}