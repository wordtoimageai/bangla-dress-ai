'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Check, X, Loader2, ExternalLink } from 'lucide-center';
import { useToast } from '@/components/ui/use-toast';

export default function AdminPanel() {
  const [pending, setPending] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState<string | null>(null);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    fetchPending();
  }, []);

  async function fetchPending() {
    setLoading(true);
    const { data, error } = await supabase
      .from('designs')
      .select('*, designer:users(email)')
      .eq('status', 'pending')
      .order('created_at', { ascending: false });

    if (!error) setPending(data || []);
    setLoading(false);
  }

  async function handleStatus(id: string, status: 'approved' | 'rejected') {
    setActionId(id);
    const { error } = await supabase
      .from('designs')
      .update({ status })
      .eq('id', id);

    if (error) {
      toast({ title: 'Error', description: 'Action failed', variant: 'destructive' });
    } else {
      toast({ title: 'Success', description: `Design ${status}` });
      setPending(pending.filter(d => d.id !== id));
    }
    setActionId(null);
  }

  if (loading) return <div className="flex justify-center p-10"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">অ্যাডমিন প্যানেল - পেন্ডিং ডিজাইন</h1>
      
      {pending.length === 0 ? (
        <p className="text-gray-500 text-center py-10">কোন পেন্ডিং ডিজাইন নেই।</p>
      ) : (
        <div className="grid gap-4">
          {pending.map((item) => (
            <Card key={item.id} className="overflow-hidden">
              <CardContent className="p-4 flex flex-col md:flex-row gap-4 items-center">
                <img 
                  src={item.image_url} 
                  alt={item.title} 
                  className="w-32 h-32 object-cover rounded-lg border"
                />
                
                <div className="flex-1 space-y-1">
                  <h3 className="font-bold text-lg">{item.title}</h3>
                  <p className="text-sm text-gray-600 line-clamp-2">{item.description}</p>
                  <div className="flex gap-4 text-xs text-gray-500">
                    <span>প্রাইস: ৳{item.price}</span>
                    <span>ডিজাইনার: {item.designer?.email}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => window.open(`/product/${item.id}`, '_blank')}
                  >
                    <ExternalLink className="h-4 w-4 mr-1" /> দেখুন
                  </Button>
                  <Button 
                    variant="default" 
                    size="sm" 
                    className="bg-green-600 hover:bg-green-700"
                    disabled={actionId === item.id}
                    onClick={() => handleStatus(item.id, 'approved')}
                  >
                    {actionId === item.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4 mr-1" />}
                    অ্যাপ্রুভ
                  </Button>
                  <Button 
                    variant="destructive" 
                    size="sm"
                    disabled={actionId === item.id}
                    onClick={() => handleStatus(item.id, 'rejected')}
                  >
                    {actionId === item.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <X className="h-4 w-4 mr-1" />}
                    রিজেক্ট
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
