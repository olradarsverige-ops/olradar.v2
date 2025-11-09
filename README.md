
# Ölradar v10.2

- Ljust tema (mindre mörkt) + tydlig vit input
- Synliga öl-bilder (placeholder i /public/beer)
- **+ Logga öl**-knapp med modal (venue, öl, stil, pris, betyg, verifierad, foto)
- `/api/log` – sparar till `beers` + `prices` och laddar upp bild till **Storage bucket `photos`** (public)
- `/api/nearby` och `/api/venues` som i v10.1

## Förbered Supabase
- Skapa bucket **photos** (Public).
- Se till att tabellerna `venues`, `beers`, `prices` finns enligt tidigare schema och att `prices.photo_url`, `prices.verified` finns.

## Miljövariabler
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

