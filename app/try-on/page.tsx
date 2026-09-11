'use client';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Loader2, Upload, Sparkles } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useRouter } from 'next/navigation';

export default function TryOnPage() {
  const [userImage, setUserImage] = useState<string | null>(null);
  const [selectedDress, setSelectedDress] = useState<any>(null);
  const [dresses, setDresses] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => { fetchDresses(); }, []);

  async function fetchDresses() {
    const { data } = await supabase.from('designs').select('*').eq('status', 'approved');
    if (data) setDresses(data);
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);
    const { data, error } = await supabase.storage.from('user-photos').upload(`${Math.random()}.${file.name.split('.').pop()}`, file);
    if (!error) setUserImage(supabase.storage.from('user-photos').getPublicUrl(data.path).data.publicUrl);
    else toast({ title: 'Error', description: 'Upload failed', variant: 'destructive' });
    setLoading(false);
  };

  const handleTryOn = async () => {
    if (!userImage || !selectedDress) { toast({ title: 'Error', description: 'Select photo and dress' }); return; }
    setGenerating(true);
    try {
      const res = await fetch('/api/try-on', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({ human_image: userImage, garment_image: selectedDress.image_url }) });
      const data = await res.json();
      if (data.output) { setResult(data.output); toast({ title: 'Success!' }); }
      else throw new Error(data.error || 'Failed');
    } catch (e: any) { toast({ title: 'Error', description: e.message, variant: 'destructive' }); }
    finally { setGenerating(false); }
  };

  return (
    <div className="container mx-auto p-4 max-w-5xl">
      <h1 className="text-3xl font-bold mb-8 text-center">ভার্চুয়াল ট্রাই-অন</h1>
      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <Card><CardHeader><CardTitle>১. ছবি আপলোড</CardTitle></CardHeader>
            <CardContent><div className="border-2 border-dashed p-6 text-center rounded-lg">
              {userImage ? <img src={userImage} className="max-h-48 mx-auto rounded" alt="user" /> : <><Upload className="mx-auto h-10 w-10 text-gray-400" /><Label htmlFor="photo" className="cursor-pointer text-blue-500">ছবি বেছুন</Label><input id="photo" type="file" className="hidden" onChange={handleFileUpload}/></>}
              {loading && <Loader2 className="animate-spin mx-auto mt-2" />}
            </div></CardContent></Card>
          <Card><CardHeader><CardTitle>২. ড্রেস বেছুন</CardTitle></CardHeader>
            <CardContent><div className="grid grid-cols-3 gap-2 max-h-72 overflow-y-auto">
              {dresses.map(d => <div key={d.id} className={`cursor-pointer rounded border-2 overflow-hidden ${selectedDress?.id===d.id?'border-pink-500':'border-transparent'}`} onClick={()=>setSelectedDress(d)}><img src={d.image_url} alt={d.title} className="w-full aspect-square object-cover"/></div>)}
            </div></CardContent></Card>
          <Button className="w-full bg-gradient-to-r from-pink-500 to-orange-500" disabled={generating||!userImage||!selectedDress} onClick={handleTryOn}>
            {generating?<Loader2 className="animate-spin mr-2"/>:<Sparkles className="mr-2"/>}ম্যাজিক শুরু
          </Button>
        </div>
        <Card className="min-h-[400px] flex items-center justify-center">
          {result?<img src={result} className="w-full object-contain" alt="result"/>:<div className="text-center text-gray-400"><Sparkles className="h-16 w-16 mx-auto mb-4 opacity-20"/><p>রেজাল্ট এখানে দেখায়বে</p></div>}
        </Card>
      </div>
    </div>
  );
}
