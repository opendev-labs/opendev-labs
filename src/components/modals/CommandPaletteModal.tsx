import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Users, Bell, ReceiptText, LayoutDashboard, Settings, Globe, Plus, X } from 'lucide-react';
import { useClients } from '../../context/ClientContext';
import { Dialog, DialogContent } from '../ui/dialog';

interface CommandPaletteModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onOpenAddClient: () => void;
}

export const CommandPaletteModal: React.FC<CommandPaletteModalProps> = ({
  open,
  onOpenChange,
  onOpenAddClient,
}) => {
  const navigate = useNavigate();
  const { clients, invoices } = useClients();
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        onOpenChange(!open);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onOpenChange]);

  const filteredClients = clients.filter(c =>
    c.name.toLowerCase().includes(query.toLowerCase()) ||
    c.company.toLowerCase().includes(query.toLowerCase()) ||
    c.email.toLowerCase().includes(query.toLowerCase())
  );

  const filteredInvoices = invoices.filter(i =>
    i.invoiceNumber.toLowerCase().includes(query.toLowerCase()) ||
    i.clientName.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (path: string) => {
    navigate(path);
    onOpenChange(false);
    setQuery('');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl p-0 gap-0 overflow-hidden bg-popover text-popover-foreground border-border shadow-2xl">
        <div className="flex items-center px-4 border-b border-border bg-muted/20">
          <Search className="size-4 text-muted-foreground mr-2 shrink-0" />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Type a command, client name, or invoice..."
            className="w-full h-12 bg-transparent text-sm focus:outline-none text-foreground placeholder:text-muted-foreground"
            autoFocus
          />
          <kbd className="px-1.5 py-0.5 rounded bg-muted border border-border text-[10px] text-muted-foreground font-mono">
            ESC
          </kbd>
        </div>

        <div className="max-h-80 overflow-y-auto p-2 divide-y divide-border/50 text-xs">
          {/* Quick Actions */}
          <div className="py-1">
            <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Quick Actions
            </div>
            <button
              onClick={() => {
                onOpenChange(false);
                onOpenAddClient();
              }}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-accent text-foreground text-left transition-colors"
            >
              <Plus className="size-4 text-primary" />
              <span className="font-semibold">Add New Client</span>
            </button>
          </div>

          {/* Navigation */}
          <div className="py-1">
            <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Pages
            </div>
            <button
              onClick={() => handleSelect('/dashboard')}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-accent text-foreground text-left transition-colors"
            >
              <LayoutDashboard className="size-4 text-muted-foreground" />
              <span>Developer Dashboard Overview</span>
            </button>
            <button
              onClick={() => handleSelect('/dashboard/clients')}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-accent text-foreground text-left transition-colors"
            >
              <Users className="size-4 text-muted-foreground" />
              <span>Clients Management & CRM</span>
            </button>
            <button
              onClick={() => handleSelect('/dashboard/reminders')}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-accent text-foreground text-left transition-colors"
            >
              <Bell className="size-4 text-muted-foreground" />
              <span>Payment Reminders & Monthly Ledger</span>
            </button>
            <button
              onClick={() => handleSelect('/dashboard/invoices')}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-md hover:bg-accent text-foreground text-left transition-colors"
            >
              <ReceiptText className="size-4 text-muted-foreground" />
              <span>Invoices & Receipts</span>
            </button>
          </div>

          {/* Clients Match */}
          {filteredClients.length > 0 && (
            <div className="py-1">
              <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Clients ({filteredClients.length})
              </div>
              {filteredClients.map(client => (
                <button
                  key={client.id}
                  onClick={() => handleSelect('/dashboard/clients')}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-md hover:bg-accent text-foreground text-left transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Globe className="size-3.5 text-cyan-400" />
                    <span className="font-semibold">{client.name}</span>
                    <span className="text-muted-foreground text-[11px]">({client.company})</span>
                  </div>
                  <span className="text-[10px] font-mono text-muted-foreground">
                    {client.currency === 'INR' ? '₹' : '$'}{client.monthlyFee.toLocaleString()}/mo
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
