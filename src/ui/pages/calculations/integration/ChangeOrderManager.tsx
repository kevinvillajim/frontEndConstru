// src/ui/pages/calculations/integration/ChangeOrderManager.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  DocumentTextIcon,
  PlusIcon,
  CurrencyDollarIcon,
  CalendarDaysIcon,
  UserIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  ArrowLeftIcon,
  ChartBarIcon,
  InformationCircleIcon,
  BellIcon,
  DocumentDuplicateIcon,
} from '@heroicons/react/24/outline';
import { useChangeOrders } from '../shared/hooks/useChangeOrders';
import { LoadingSpinner, Badge, Alert, ProgressBar } from '../shared/components/SharedComponents';

interface ChangeOrder {
  id: string;
  title: string;
  description: string;
  type: 'addition' | 'modification' | 'deletion' | 'acceleration' | 'deceleration';
  category: 'scope' | 'design' | 'conditions' | 'regulatory' | 'client_request';
  budgetImpact: number;
  scheduleImpact: number;
  status: 'draft' | 'pending_approval' | 'approved' | 'rejected' | 'implemented' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  requestedBy: string;
  requestedAt: Date;
  approvedBy?: string;
  approvedAt?: Date;
  implementedAt?: Date;
  reason: string;
  justification: string;
  attachments: string[];
  workflowHistory: WorkflowStep[];
  affectedActivities: string[];
  affectedBudgetItems: string[];
  riskAssessment?: RiskAssessment;
}

interface WorkflowStep {
  id: string;
  action: 'created' | 'submitted' | 'reviewed' | 'approved' | 'rejected' | 'implemented' | 'cancelled';
  actor: string;
  timestamp: Date;
  comments?: string;
  attachments?: string[];
}

interface RiskAssessment {
  overall: 'low' | 'medium' | 'high' | 'critical';
  factors: {
    technical: 'low' | 'medium' | 'high';
    financial: 'low' | 'medium' | 'high';
    schedule: 'low' | 'medium' | 'high';
    quality: 'low' | 'medium' | 'high';
  };
  mitigation: string[];
}

interface ChangeOrderFormData {
  title: string;
  description: string;
  type: string;
  category: string;
  reason: string;
  justification: string;
  budgetImpact: number;
  scheduleImpact: number;
  priority: string;
  affectedActivities: string[];
  affectedBudgetItems: string[];
}

const ChangeOrderCard: React.FC<{
  changeOrder: ChangeOrder;
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
  onImplement?: (id: string) => void;
  canApprove?: boolean;
}> = ({ 
  changeOrder, 
  onView, 
  onEdit, 
  onDelete, 
  onApprove, 
  onReject, 
  onImplement,
  canApprove = false 
}) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800 border-green-200';
      case 'implemented': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'pending_approval': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'rejected': return 'bg-red-100 text-red-800 border-red-200';
      case 'cancelled': return 'bg-gray-100 text-gray-800 border-gray-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-600';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      default: return 'bg-gray-400';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'addition': return <PlusIcon className="h-4 w-4" />;
      case 'modification': return <PencilIcon className="h-4 w-4" />;
      case 'deletion': return <TrashIcon className="h-4 w-4" />;
      case 'acceleration': return <ChartBarIcon className="h-4 w-4" />;
      case 'deceleration': return <ClockIcon className="h-4 w-4" />;
      default: return <DocumentTextIcon className="h-4 w-4" />;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-EC', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-lg transition-all duration-300">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-3 flex-1">
          <div className={`w-1 h-16 rounded-full ${getPriorityColor(changeOrder.priority)}`} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <div className="text-gray-600">
                {getTypeIcon(changeOrder.type)}
              </div>
              <h3 className="font-semibold text-gray-900 truncate">{changeOrder.title}</h3>
            </div>
            <p className="text-sm text-gray-600 line-clamp-2 mb-3">{changeOrder.description}</p>
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <UserIcon className="h-3 w-3" />
                {changeOrder.requestedBy}
              </span>
              <span className="flex items-center gap-1">
                <ClockIcon className="h-3 w-3" />
                {changeOrder.requestedAt.toLocaleDateString('es-EC')}
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col items-end gap-2">
          <Badge 
            variant={
              changeOrder.status === 'approved' || changeOrder.status === 'implemented' ? 'success' :
              changeOrder.status === 'rejected' || changeOrder.status === 'cancelled' ? 'error' :
              changeOrder.status === 'pending_approval' ? 'warning' : 'default'
            }
          >
            {changeOrder.status.replace('_', ' ').toUpperCase()}
          </Badge>
          <div className="text-xs text-gray-500 text-right">
            ID: {changeOrder.id.slice(-6)}
          </div>
        </div>
      </div>

      {/* Impact Summary */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <CurrencyDollarIcon className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-600">Impacto Presupuesto</span>
          </div>
          <div className={`font-semibold ${
            changeOrder.budgetImpact > 0 ? 'text-red-600' : 
            changeOrder.budgetImpact < 0 ? 'text-green-600' : 'text-gray-900'
          }`}>
            {changeOrder.budgetImpact > 0 ? '+' : ''}{formatCurrency(changeOrder.budgetImpact)}
          </div>
        </div>
        
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <CalendarDaysIcon className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-600">Impacto Cronograma</span>
          </div>
          <div className={`font-semibold ${
            changeOrder.scheduleImpact > 0 ? 'text-red-600' : 
            changeOrder.scheduleImpact < 0 ? 'text-green-600' : 'text-gray-900'
          }`}>
            {changeOrder.scheduleImpact > 0 ? '+' : ''}{changeOrder.scheduleImpact} días
          </div>
        </div>
      </div>

      {/* Risk Assessment */}
      {changeOrder.riskAssessment && (
        <div className="mb-4">
          <div className="flex items-center gap-2 mb-2">
            <ExclamationTriangleIcon className="h-4 w-4 text-yellow-600" />
            <span className="text-sm font-medium text-gray-700">Evaluación de Riesgo</span>
          </div>
          <div className="flex items-center gap-2">
            <div className={`px-2 py-1 rounded text-xs font-medium ${
              changeOrder.riskAssessment.overall === 'critical' ? 'bg-red-100 text-red-800' :
              changeOrder.riskAssessment.overall === 'high' ? 'bg-orange-100 text-orange-800' :
              changeOrder.riskAssessment.overall === 'medium' ? 'bg-yellow-100 text-yellow-800' :
              'bg-green-100 text-green-800'
            }`}>
              {changeOrder.riskAssessment.overall.toUpperCase()}
            </div>
            <span className="text-xs text-gray-500">
              T:{changeOrder.riskAssessment.factors.technical}/
              F:{changeOrder.riskAssessment.factors.financial}/
              S:{changeOrder.riskAssessment.factors.schedule}/
              Q:{changeOrder.riskAssessment.factors.quality}
            </span>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => onView(changeOrder.id)}
          className="flex items-center gap-1 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm"
        >
          <EyeIcon className="h-4 w-4" />
          Ver
        </button>
        
        {changeOrder.status === 'draft' && (
          <button
            onClick={() => onEdit(changeOrder.id)}
            className="flex items-center gap-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
          >
            <PencilIcon className="h-4 w-4" />
            Editar
          </button>
        )}

        {canApprove && changeOrder.status === 'pending_approval' && (
          <>
            <button
              onClick={() => onApprove?.(changeOrder.id)}
              className="flex items-center gap-1 px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-sm"
            >
              <CheckCircleIcon className="h-4 w-4" />
              Aprobar
            </button>
            <button
              onClick={() => onReject?.(changeOrder.id)}
              className="flex items-center gap-1 px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm"
            >
              <XCircleIcon className="h-4 w-4" />
              Rechazar
            </button>
          </>
        )}

        {changeOrder.status === 'approved' && onImplement && (
          <button
            onClick={() => onImplement(changeOrder.id)}
            className="flex items-center gap-1 px-3 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors text-sm"
          >
            <CheckCircleIcon className="h-4 w-4" />
            Implementar
          </button>
        )}

        {changeOrder.status === 'draft' && (
          <button
            onClick={() => onDelete(changeOrder.id)}
            className="flex items-center gap-1 px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm ml-auto"
          >
            <TrashIcon className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
};

const ChangeOrderForm: React.FC<{
  initialData?: Partial<ChangeOrderFormData>;
  onSubmit: (data: ChangeOrderFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
}> = ({ initialData, onSubmit, onCancel, isLoading = false }) => {
  const [formData, setFormData] = useState<ChangeOrderFormData>({
    title: '',
    description: '',
    type: 'modification',
    category: 'scope',
    reason: '',
    justification: '',
    budgetImpact: 0,
    scheduleImpact: 0,
    priority: 'medium',
    affectedActivities: [],
    affectedBudgetItems: [],
    ...initialData
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'El título es requerido';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'La descripción es requerida';
    }

    if (!formData.reason.trim()) {
      newErrors.reason = 'La razón es requerida';
    }

    if (!formData.justification.trim()) {
      newErrors.justification = 'La justificación es requerida';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  const handleInputChange = (field: keyof ChangeOrderFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-6">
        {initialData ? 'Editar Orden de Cambio' : 'Nueva Orden de Cambio'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Título *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.title ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Título descriptivo de la orden de cambio"
            />
            {errors.title && <p className="text-red-600 text-sm mt-1">{errors.title}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Prioridad
            </label>
            <select
              value={formData.priority}
              onChange={(e) => handleInputChange('priority', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="low">Baja</option>
              <option value="medium">Media</option>
              <option value="high">Alta</option>
              <option value="urgent">Urgente</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Descripción *
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            rows={3}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.description ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="Descripción detallada de la orden de cambio"
          />
          {errors.description && <p className="text-red-600 text-sm mt-1">{errors.description}</p>}
        </div>

        {/* Type and Category */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo
            </label>
            <select
              value={formData.type}
              onChange={(e) => handleInputChange('type', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="addition">Adición</option>
              <option value="modification">Modificación</option>
              <option value="deletion">Eliminación</option>
              <option value="acceleration">Aceleración</option>
              <option value="deceleration">Desaceleración</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Categoría
            </label>
            <select
              value={formData.category}
              onChange={(e) => handleInputChange('category', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="scope">Alcance</option>
              <option value="design">Diseño</option>
              <option value="conditions">Condiciones</option>
              <option value="regulatory">Regulatorio</option>
              <option value="client_request">Solicitud del Cliente</option>
            </select>
          </div>
        </div>

        {/* Impact */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Impacto en Presupuesto (USD)
            </label>
            <input
              type="number"
              step="0.01"
              value={formData.budgetImpact}
              onChange={(e) => handleInputChange('budgetImpact', parseFloat(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="0.00"
            />
            <p className="text-xs text-gray-500 mt-1">
              Usar números negativos para reducciones de costo
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Impacto en Cronograma (días)
            </label>
            <input
              type="number"
              value={formData.scheduleImpact}
              onChange={(e) => handleInputChange('scheduleImpact', parseInt(e.target.value) || 0)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="0"
            />
            <p className="text-xs text-gray-500 mt-1">
              Usar números negativos para reducción de tiempo
            </p>
          </div>
        </div>

        {/* Reason and Justification */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Razón *
          </label>
          <textarea
            value={formData.reason}
            onChange={(e) => handleInputChange('reason', e.target.value)}
            rows={2}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.reason ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="¿Por qué es necesaria esta orden de cambio?"
          />
          {errors.reason && <p className="text-red-600 text-sm mt-1">{errors.reason}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Justificación *
          </label>
          <textarea
            value={formData.justification}
            onChange={(e) => handleInputChange('justification', e.target.value)}
            rows={3}
            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
              errors.justification ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="Justificación técnica y/o comercial detallada"
          />
          {errors.justification && <p className="text-red-600 text-sm mt-1">{errors.justification}</p>}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Guardando...' : initialData ? 'Actualizar' : 'Crear Orden'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

const ChangeOrderManager: React.FC = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();
  const {
    changeOrders,
    loadChangeOrders,
    createChangeOrder,
    updateChangeOrder,
    deleteChangeOrder,
    approveChangeOrder,
    rejectChangeOrder,
    implementChangeOrder,
    isLoading
  } = useChangeOrders();

  const [showForm, setShowForm] = useState(false);
  const [editingOrder, setEditingOrder] = useState<ChangeOrder | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (projectId) {
      loadChangeOrders(projectId);
    }
  }, [projectId, loadChangeOrders]);

  const filteredChangeOrders = changeOrders.filter(order => {
    if (selectedStatus !== 'all' && order.status !== selectedStatus) return false;
    if (selectedPriority !== 'all' && order.priority !== selectedPriority) return false;
    if (searchTerm && !order.title.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  const handleCreateOrder = async (data: ChangeOrderFormData) => {
    if (!projectId) return;
    
    try {
      await createChangeOrder(projectId, data);
      setShowForm(false);
    } catch (error) {
      console.error('Error creating change order:', error);
    }
  };

  const handleUpdateOrder = async (data: ChangeOrderFormData) => {
    if (!editingOrder) return;
    
    try {
      await updateChangeOrder(editingOrder.id, data);
      setEditingOrder(null);
      setShowForm(false);
    } catch (error) {
      console.error('Error updating change order:', error);
    }
  };

  const handleEdit = (id: string) => {
    const order = changeOrders.find(o => o.id === id);
    if (order) {
      setEditingOrder(order);
      setShowForm(true);
    }
  };

  const handleView = (id: string) => {
    navigate(`/calculations/integration/change-orders/${id}`);
  };

  const pendingApprovals = changeOrders.filter(co => co.status === 'pending_approval').length;
  const totalBudgetImpact = changeOrders
    .filter(co => co.status === 'approved' || co.status === 'implemented')
    .reduce((sum, co) => sum + co.budgetImpact, 0);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" className="mx-auto mb-4" />
          <p className="text-gray-600">Cargando órdenes de cambio...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeftIcon className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Gestión de Órdenes de Cambio</h1>
              <p className="text-gray-600">Administra cambios al proyecto con impacto automático</p>
            </div>
          </div>
          <button
            onClick={() => {
              setEditingOrder(null);
              setShowForm(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <PlusIcon className="h-4 w-4" />
            Nueva Orden
          </button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="text-blue-600 text-sm font-medium">Total Órdenes</div>
            <div className="text-2xl font-bold text-blue-900">{changeOrders.length}</div>
          </div>
          <div className="bg-yellow-50 rounded-lg p-4">
            <div className="text-yellow-600 text-sm font-medium">Pendientes</div>
            <div className="text-2xl font-bold text-yellow-900">{pendingApprovals}</div>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <div className="text-green-600 text-sm font-medium">Implementadas</div>
            <div className="text-2xl font-bold text-green-900">
              {changeOrders.filter(co => co.status === 'implemented').length}
            </div>
          </div>
          <div className="bg-purple-50 rounded-lg p-4">
            <div className="text-purple-600 text-sm font-medium">Impacto Total</div>
            <div className={`text-2xl font-bold ${totalBudgetImpact >= 0 ? 'text-red-900' : 'text-green-900'}`}>
              {totalBudgetImpact >= 0 ? '+' : ''}${totalBudgetImpact.toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Form */}
        {showForm && (
          <div className="mb-6">
            <ChangeOrderForm
              initialData={editingOrder ? {
                title: editingOrder.title,
                description: editingOrder.description,
                type: editingOrder.type,
                category: editingOrder.category,
                reason: editingOrder.reason,
                justification: editingOrder.justification,
                budgetImpact: editingOrder.budgetImpact,
                scheduleImpact: editingOrder.scheduleImpact,
                priority: editingOrder.priority,
                affectedActivities: editingOrder.affectedActivities,
                affectedBudgetItems: editingOrder.affectedBudgetItems
              } : undefined}
              onSubmit={editingOrder ? handleUpdateOrder : handleCreateOrder}
              onCancel={() => {
                setShowForm(false);
                setEditingOrder(null);
              }}
              isLoading={isLoading}
            />
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <input
                type="text"
                placeholder="Buscar órdenes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">Todos los estados</option>
                <option value="draft">Borrador</option>
                <option value="pending_approval">Pendiente</option>
                <option value="approved">Aprobado</option>
                <option value="implemented">Implementado</option>
                <option value="rejected">Rechazado</option>
              </select>
            </div>
            <div>
              <select
                value={selectedPriority}
                onChange={(e) => setSelectedPriority(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">Todas las prioridades</option>
                <option value="urgent">Urgente</option>
                <option value="high">Alta</option>
                <option value="medium">Media</option>
                <option value="low">Baja</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">
                {filteredChangeOrders.length} de {changeOrders.length}
              </span>
            </div>
          </div>
        </div>

        {/* Change Orders List */}
        {filteredChangeOrders.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <DocumentTextIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No hay órdenes de cambio
            </h3>
            <p className="text-gray-600 mb-6">
              Crea la primera orden de cambio para gestionar modificaciones al proyecto
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Crear Primera Orden
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredChangeOrders.map((changeOrder) => (
              <ChangeOrderCard
                key={changeOrder.id}
                changeOrder={changeOrder}
                onView={handleView}
                onEdit={handleEdit}
                onDelete={(id) => deleteChangeOrder(id)}
                onApprove={(id) => approveChangeOrder(id, 'Aprobado desde gestor')}
                onReject={(id) => rejectChangeOrder(id, 'Rechazado desde gestor')}
                onImplement={(id) => implementChangeOrder(id)}
                canApprove={true} // This should come from user permissions
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChangeOrderManager;