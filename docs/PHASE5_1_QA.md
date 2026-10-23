# Phase 5.1 — QA

Verifica tecnica del 23 ottobre 2026, distinta dal retest umano. Risultati finali e pubblicazione sono registrati nel report di completamento.

Copertura nuova: intestazione e footer su Home, programma, unità 10/17, biblioteca, ricerca, AI, compositore, normativa e media; ordine della navigazione; profilo unico; breadcrumb; assenza di footer in Vista Aula; contesti automatici; azioni rapide e tastiera; copia riuscita e negata; richiesta con istruzione RISTO-LAB esatta; bozza corrente senza note nel contesto; ripristino del piano senza creazione automatica; ricerca e ritorno ai risultati; desktop e mobile.

Le suite precedenti restano attive: Gold Unit 06, unità 10/17, durate, export/import, ricerca statica, Console, quiz, timer, popup e schermo neutro. L’audit della build verifica i collegamenti e gli asset sotto /risto-lab/, escludendo payload privati/server. Il gate di pubblicazione verifica file candidati, segreti e percorsi personali.

Nessuna migrazione, nessun nuovo contenuto didattico, nessuna immagine generata. Nessuna nuova verifica di vigenza normativa. Le risorse, gli stati e le sequenze approvate sono invariati rispetto alla Phase 5.

Risultati finali locali: `npm run check` 75 file, zero errori/warning/hint; `npm test` 19 PASS; `npm run test:e2e` 18 PASS, zero FAIL. Build statica: 126 pagine, 199 file, tutti i collegamenti/asset interni risolti. Gate pubblicazione GO. Controllo visivo desktop 1440px e mobile 390px su Home, AI e unità 17: intestazione chiara, navigazione e footer leggibili, nessun overflow orizzontale. Copia negata provata in browser con testo selezionabile, copia riuscita con lettura effettiva degli appunti. La bozza di un piano già salvato torna allo stesso ID senza duplicarlo.

Catalogo pubblico, logica di proposta dei blocchi, Console, Vista Aula e sequenze: nessuna modifica. Gli unici adattamenti del compositore riguardano l’apertura AI e il recupero della bozza. Le modifiche dell’utente nella scheda umana Phase 5 sono preservate e integrate con gli esiti numerici espliciti del prompt.

Live QA sul deploy [39950643433](https://github.com/manzo8b/risto-lab/actions/runs/39950643433): Home, AI, programmi, lezioni, biblioteca, ricerca, Aula e unità 06/10/17 verificati nel browser. Contesto Unit 17 automatico anche dalla scorciatoia header; copia reale riuscita; collegamento HTTPS ChatGPT corretto. Footer e header assenti in Console/Vista Aula, presenti nelle pagine normali; nessun overflow. Corretto il link «Note sul progetto» alla pagina dedicata sotto il percorso del repository. Il sito non invia la richiesta a ChatGPT e nessuna conversazione esterna è stata simulata.

Archivio originale: 34.893 file verificati per dimensione, mtime e SHA-256, zero modifiche. Stato retest 5.1: READY, non eseguito.
