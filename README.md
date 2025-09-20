# Zombie Run MiniApp

Game sederhana ala dino-chrome, tapi karakter Zombie 🧟.
- Lompat pagar dan hindari burung
- Leaderboard global via Supabase
- Bisa dipasang di Farcaster MiniApp

## Cara jalanin
1. Deploy ke Vercel (import repo dari GitHub)
2. Buat table `scores` di Supabase:
   - id: int8 (PK, auto increment)
   - username: text
   - score: int8
3. Isi `supabase.js` dengan URL dan anon key dari project kamu.

Enjoy!