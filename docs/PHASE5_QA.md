# Phase 5 — Verifica tecnica

Data: 23 ottobre 2026. Verifica automatica e visiva, distinta dall'accettazione umana.

- `npm run check`: 71 file, zero errori, warning o hint.
- `npm test`: 17 PASS, 0 FAIL.
- `npm run build`: 126 pagine, 198 file; collegamenti interni e asset risolti, nessun payload server o riservato.
- `npm run test:e2e`: 12 PASS, 0 FAIL.

Le regressioni coprono Gold Unit 06 congelata, creazione guidata, persistenza ed export/import del piano, ricerca, Console, quiz, timer e separazione Vista Aula. Le nuove prove coprono profilo Marcelo/Giulia/fallback, sequenze delle unità 10 e 17 con durate 45/60/90, quiz 8/10 domande, contesto AI da unità/materiale/piano/ricerca, esclusione note docente, copia e fallback ChatGPT, ritorno al piano senza modifiche e mobile.

Controllo visivo: Home, unità pilota, Console, proiezione 1024×768, compositore AI desktop/mobile e due schede PDF A4. Intestazioni chiare e palette conservata. Gli screenshot tecnici restano locali.

La verifica delle fonti ufficiali non costituisce validazione della vigenza: i materiali HACCP restano didattici e le fonti normative NOT_VERIFIED. Nessuna temperatura o procedura aziendale è stata inventata. I quattro file con diritti esplicitamente di terzi non entrano nella pubblicazione. Le informazioni personali e la provenienza tecnica locale restano escluse.

La pubblicazione usa il workflow Pages esistente. Il gate di pubblicazione deve risultare GO prima del commit. La verifica live è registrata nel report di completamento.
