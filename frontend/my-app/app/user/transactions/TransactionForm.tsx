'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';
import { Plus, Minus, Loader2 } from 'lucide-react';

interface TransactionFormProps {
  buyStockAction: (formData: FormData) => Promise<{ success: boolean; error?: string }>;
  sellStockAction: (formData: FormData) => Promise<{ success: boolean; error?: string }>;
}

export function TransactionForm({ buyStockAction, sellStockAction }: TransactionFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [type, setType] = useState<'BUY' | 'SELL'>('BUY');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData(e.currentTarget);
    const action = type === 'BUY' ? buyStockAction : sellStockAction;
    
    const result = await action(formData);
    
    if (result.success) {
      toast.success(`${type} order placed successfully`);
      setIsOpen(false);
    } else {
      toast.error(result.error || `Failed to place ${type} order`);
    }
    setLoading(false);
  };

  return (
    <div className="relative">
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger>
          <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
            <Plus className="h-4 w-4" />
            New Transaction
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-80 p-4">
          <div className="flex gap-2 mb-4 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
            <button
              onClick={(e) => { e.preventDefault(); setType('BUY'); }}
              className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all ${
                type === 'BUY' ? 'bg-white shadow-sm text-emerald-600 dark:bg-slate-700 dark:text-emerald-400' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'
              }`}
            >
              Buy
            </button>
            <button
              onClick={(e) => { e.preventDefault(); setType('SELL'); }}
              className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all ${
                type === 'SELL' ? 'bg-white shadow-sm text-rose-600 dark:bg-slate-700 dark:text-rose-400' : 'text-slate-500 hover:text-slate-700 dark:text-slate-400'
              }`}
            >
              Sell
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="stock_symbol">Stock Symbol</Label>
              <Input id="stock_symbol" name="stock_symbol" placeholder="e.g. TCS" required className="uppercase" />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity</Label>
                <Input id="quantity" name="quantity" type="number" min="1" step="1" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Price (₹)</Label>
                <Input id="price" name="price" type="number" min="0.01" step="0.01" required />
              </div>
            </div>
            
            <input type="hidden" name="exchange" value="NSE" />

            <Button type="submit" disabled={loading} className={`w-full text-white ${type === 'BUY' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-rose-600 hover:bg-rose-700'}`}>
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              {type === 'BUY' ? 'Confirm Buy' : 'Confirm Sell'}
            </Button>
          </form>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
