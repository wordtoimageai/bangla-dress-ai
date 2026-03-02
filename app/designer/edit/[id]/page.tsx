'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Loader2, ArrowLeft, Save } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

export default function EditDesignPage() {
  const router = useRouter();
  const { id } = useParams();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [design, setDesign] = useState({
    title: '',
    description: '',
    price: '',
    measurements: {
      chest: '',
      waist: '',
      length: '',
      sleeve: '',
      shoulder: ''
    }
  });

  useEffect(() => {
    async function fetchDesign() {
      const { data, error } = await supabase
        .from('designs')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        toast({ title: 'Error', description: 'Design not found', variant: 'destructive' });
        router.push('/designer/dashboard');
        return;
      }

      setDesign(data);
      setLoading(false);
    }
    fetchDesign();
  }, [id, router, toast]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const { error } = await supabase
      .from('designs')
      .update({
        title: design.title,
        description: design.description,
        price: design.price,
        measurements: design.measurements,
        updated_at: new Date().toISOString()
      })
      .eq('id', id);

    if (error) {
      toast({ title: 'Error', description: 'Failed to update design', variant: 'destructive' });
    } else {
      toast({ title: 'Success', description: 'Design updated successfully' });
      router.push('/designer/dashboard');
    }
    setSaving(false);
  };

  if (loading) return <div className="flex justify-center items-center h-screen"><Loader2 className="animate-spin" /></div>;

  return (
    <div className="container mx-auto p-4 max-w-2xl">
      <Button variant="ghost" onClick={() => router.back()} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" /> ফিরে যান
      </Button>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">ডিজাইন এডিট করুন</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">টাইটেল (বাংলা/English)</Label>
              <Input
                id="title"
                value={design.title}
                onChange={(e) => setDesign({ ...design, title: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">বিবরণ</Label>
              <Textarea
                id="description"
                value={design.description}
                onChange={(e) => setDesign({ ...design, description: e.target.value })}
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">মূল্য (BDT)</Label>
              <Input
                id="price"
                type="number"
                value={design.price}
                onChange={(e) => setDesign({ ...design, price: e.target.value })}
                required
              />
            </div>

            <div className="bg-gray-50 p-4 rounded-lg space-y-4">
              <h3 className="font-semibold text-lg">পরিমাপ (Measurements JSON)</h3>
              <div className="grid grid-cols-2 gap-4">
                {Object.keys(design.measurements).map((key) => (
                  <div key={key} className="space-y-1">
                    <Label className="capitalize">{key}</Label>
                    <Input
                      type="text"
                      value={design.measurements[key as keyof typeof design.measurements]}
                      onChange={(e) => setDesign({
                        ...design,
                        measurements: { ...design.measurements, [key]: e.target.value }
                      })}
                    />
                  </div>
                ))}
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={saving}>
              {saving ? <Loader2 className="animate-spin mr-2" /> : <Save className="mr-2 h-4 w-4" />}
              পরিবর্তন সংরক্ষণ করুন
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
