
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'edge';

export async function POST(req: Request) {
  const form = await req.formData();
  const venueId = String(form.get('venueId') || '');
  const beer = String(form.get('beer') || '');
  const style = String(form.get('style') || '');
  const price = Number(form.get('price') || 0);
  const rating = Number(form.get('rating') || 0);
  const verified = String(form.get('verified') || '0') === '1';
  const photo = form.get('photo') as File | null;

  if (!venueId || !beer || !style || price <= 0) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }

  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

  // ensure beer exists
  let beerId: string | null = null;
  const br = await supabase.from('beers').select('id').eq('name', beer).maybeSingle();
  if (br.error && br.error.code !== 'PGRST116') return NextResponse.json({ error: br.error.message }, { status: 500 });
  beerId = br.data?.id || null;
  if (!beerId) {
    const ins = await supabase.from('beers').insert({ name: beer, style }).select('id').single();
    if (ins.error) return NextResponse.json({ error: ins.error.message }, { status: 500 });
    beerId = ins.data.id;
  }

  let photoUrl: string | null = null;
  if (photo) {
    const arrayBuffer = await photo.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);
    const path = `uploads/${crypto.randomUUID()}.jpg`;
    const up = await supabase.storage.from('photos').upload(path, bytes, { contentType: photo.type || 'image/jpeg', upsert: false });
    if (!up.error) {
      const pub = supabase.storage.from('photos').getPublicUrl(path);
      photoUrl = pub.data.publicUrl;
    }
  }

  const pr = await supabase.from('prices').insert({
    venue_id: venueId, beer_id: beerId, price_sek: price, rating, verified, photo_url: photoUrl
  });
  if (pr.error) return NextResponse.json({ error: pr.error.message }, { status: 500 });

  return NextResponse.json({ ok: true });
}
