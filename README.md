
# Ölradar v10.1 (with Helsingborg venues)

- Mörkgrå tema, vit text i inputs
- Vy: **Standard** / **Billigast**
- API-routes: `/api/venues`, `/api/nearby?sort=cheapest&city=Helsingborg`
- **data/hbg_venues.csv** och **supabase/seed_hbg_venues.sql** med adresser + öppettider

## Miljövariabler
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Seeda Helsingborg
Kör SQL-filen i Supabase SQL Editor:
- `supabase/seed_hbg_venues.sql` (lägger till kolumner address/hours och gör UPSERT)

Eller importera CSV:
- `data/hbg_venues.csv` in i tabellen `venues` (matcha kolumnerna).

## Kör lokalt
```bash
npm i
npm run dev
```
