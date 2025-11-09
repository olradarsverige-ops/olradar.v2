
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

type Deal = { beer:string; style:string; price:number; rating:number; updatedAt:string|null };
type VenueRow = { id:string; name:string; city:string; address:string|null; open_now:boolean|null };

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const city = searchParams.get('city') || undefined;
  const sort = searchParams.get('sort'); // 'cheapest' | 'standard'

  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);

  let vq = supabase.from('venues').select('id,name,city,address,open_now');
  if (city) vq = vq.eq('city', city);
  const vres = await vq.order('name', { ascending: true });
  if (vres.error) return NextResponse.json({ error: vres.error.message }, { status: 500 });
  const venues = (vres.data || []) as VenueRow[];

  const pres = await supabase.from('prices').select('venue_id, price_sek, rating, created_at, beer_id');
  if (pres.error) return NextResponse.json({ error: pres.error.message }, { status: 500 });
  const bres = await supabase.from('beers').select('id,name,style');
  if (bres.error) return NextResponse.json({ error: bres.error.message }, { status: 500 });

  const beersById = new Map((bres.data||[]).map((b:any)=>[b.id,b]));
  const prices = pres.data || [];

  const rows = venues.map(v => {
    const deals: Deal[] = prices.filter((p:any)=>p.venue_id===v.id).map((p:any)=>{
      const b = beersById.get(p.beer_id) || { name:'', style:'' };
      return { beer:b.name, style:b.style, price:p.price_sek, rating:p.rating||0, updatedAt:p.created_at };
    }).sort((a,b)=>a.price-b.price);
    return { ...v, deals };
  });

  if (sort === 'cheapest') {
    rows.sort((a:any,b:any)=>{
      const ap = a.deals?.length ? Math.min(...a.deals.map((d:any)=>d.price)) : Number.POSITIVE_INFINITY;
      const bp = b.deals?.length ? Math.min(...b.deals.map((d:any)=>d.price)) : Number.POSITIVE_INFINITY;
      return ap - bp;
    });
  }

  return NextResponse.json(rows);
}
