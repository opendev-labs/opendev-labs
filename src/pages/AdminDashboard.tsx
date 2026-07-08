import React, { useState } from 'react';
import { Navbar } from '../components/Navbar';
import { Button } from '../components/ui/button';
import { useAuth } from '../context/AuthContext';
import { useServices } from '../context/ServicesContext';
import { useNavigate } from 'react-router-dom';
import { Calendar, Users, Clock, Plus, Edit2, Trash2, X } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const { services, appointments, addService, deleteAppointment, updateService, deleteService } = useServices();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'appointments' | 'services'>('overview');
  const [showServiceForm, setShowServiceForm] = useState(false);
  const [editingService, setEditingService] = useState<typeof services[0] | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    duration: 30,
    price: 0,
    icon: '🌐',
    color: 'from-blue-500 to-blue-600',
  });

  const handleAddService = () => {
    if (!formData.name || !formData.description) {
      alert('Please fill in all fields');
      return;
    }

    if (editingService) {
      updateService({
        ...editingService,
        ...formData,
      });
      setEditingService(null);
    } else {
      addService({
        id: Date.now().toString(),
        ...formData,
      });
    }

    setFormData({
      name: '',
      description: '',
      duration: 30,
      price: 0,
      icon: '🌐',
      color: 'from-blue-500 to-blue-600',
    });
    setShowServiceForm(false);
  };

  const handleEditService = (service: typeof services[0]) => {
    setEditingService(service);
    setFormData({
      name: service.name,
      description: service.description,
      duration: service.duration,
      price: service.price,
      icon: service.icon,
      color: service.color,
    });
    setShowServiceForm(true);
  };

  const upcomingAppointments = appointments
    .filter((a) => new Date(a.startTime) > new Date())
    .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());

  const completedAppointments = appointments.filter((a) => a.status === 'completed').length;
  const totalAppointments = appointments.length;

  return (
    <div className="dark min-h-screen bg-background text-foreground">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage your services and appointments</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-border">
          {(['overview', 'appointments', 'services'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-3 font-medium transition-colors capitalize border-b-2 ${
                activeTab === tab
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="p-6 rounded-lg border border-border bg-card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Total Appointments</p>
                  <p className="text-3xl font-bold">{totalAppointments}</p>
                </div>
                <Calendar className="w-10 h-10 text-primary opacity-20" />
              </div>
            </div>
            <div className="p-6 rounded-lg border border-border bg-card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Upcoming</p>
                  <p className="text-3xl font-bold">{upcomingAppointments.length}</p>
                </div>
                <Clock className="w-10 h-10 text-secondary opacity-20" />
              </div>
            </div>
            <div className="p-6 rounded-lg border border-border bg-card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Completed</p>
                  <p className="text-3xl font-bold">{completedAppointments}</p>
                </div>
                <Users className="w-10 h-10 text-accent opacity-20" />
              </div>
            </div>
          </div>
        )}

        {/* Appointments Tab */}
        {activeTab === 'appointments' && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold mb-6">Upcoming Appointments</h2>
            {upcomingAppointments.length === 0 ? (
              <div className="text-center py-12 border border-dashed border-border rounded-lg">
                <p className="text-muted-foreground">No upcoming appointments</p>
              </div>
            ) : (
              <div className="space-y-4">
                {upcomingAppointments.map((apt) => {
                  const service = services.find((s) => s.id === apt.serviceId);
                  return (
                    <div
                      key={apt.id}
                      className="p-6 rounded-lg border border-border bg-card hover:border-primary/50 transition-all"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="text-2xl">{service?.icon}</span>
                            <div>
                              <h3 className="font-bold">{service?.name}</h3>
                              <p className="text-sm text-muted-foreground">{apt.clientName}</p>
                            </div>
                          </div>
                          <div className="flex gap-6 ml-11 mt-2">
                            <span className="text-sm">
                              📅 {new Date(apt.startTime).toLocaleDateString()}
                            </span>
                            <span className="text-sm">
                              🕐 {new Date(apt.startTime).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                            <span className="text-sm">📧 {apt.clientEmail}</span>
                          </div>
                        </div>
                        <button
                          onClick={() => deleteAppointment(apt.id)}
                          className="p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                      {apt.notes && (
                        <div className="mt-3 p-3 bg-background rounded border border-border">
                          <p className="text-xs text-muted-foreground font-medium mb-1">Notes:</p>
                          <p className="text-sm">{apt.notes}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Services Tab */}
        {activeTab === 'services' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Your Services</h2>
              {!showServiceForm && (
                <Button onClick={() => setShowServiceForm(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Service
                </Button>
              )}
            </div>

            {showServiceForm && (
              <div className="p-6 rounded-lg border border-border bg-card space-y-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-lg">
                    {editingService ? 'Edit Service' : 'Add New Service'}
                  </h3>
                  <button
                    onClick={() => {
                      setShowServiceForm(false);
                      setEditingService(null);
                      setFormData({
                        name: '',
                        description: '',
                        duration: 30,
                        price: 0,
                        icon: '🌐',
                        color: 'from-blue-500 to-blue-600',
                      });
                    }}
                  >
                    <X className="w-5 h-5 text-muted-foreground hover:text-foreground" />
                  </button>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Service Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Web Development Consultation"
                    className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe your service..."
                    className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Duration (minutes)</label>
                    <input
                      type="number"
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                      className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Price ($)</label>
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) })}
                      className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Icon</label>
                  <input
                    type="text"
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    placeholder="e.g., 🌐"
                    maxLength={2}
                    className="w-full px-3 py-2 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div className="flex gap-3">
                  <Button onClick={handleAddService} className="flex-1">
                    {editingService ? 'Update Service' : 'Add Service'}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowServiceForm(false);
                      setEditingService(null);
                    }}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}

            {!showServiceForm && (
              <div className="grid md:grid-cols-2 gap-4">
                {services.map((service) => (
                  <div key={service.id} className="p-6 rounded-lg border border-border bg-card hover:border-primary/50 transition-all">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{service.icon}</span>
                        <div>
                          <h3 className="font-bold">{service.name}</h3>
                          <p className="text-xs text-muted-foreground">{service.duration} mins</p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditService(service)}
                          className="p-2 rounded hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteService(service.id)}
                          className="p-2 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">{service.description}</p>
                    {service.price > 0 && (
                      <p className="mt-2 text-sm font-bold text-primary">${service.price}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
