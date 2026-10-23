# RISTO-LAB — Phase 4B completion report

23 ottobre 2026. Applicazione statica e prima pubblicazione GitHub Pages.

## Risultato

Un'unica build Astro statica, senza adapter Node, middleware, API, database o persistenza server. Generati 110 HTML, comprese 26 unità e 61 route di risorse. GitHub Pages riceve solo dist. Tutti i link, gli asset, la ricerca e i popup usano il base /risto-lab/.

Session Builder conserva il flusso guidato Phase 3F.1: Unità 06 propone sette blocchi approvati in 60 minuti. Piani, bozza e ultima lezione sono locali al browser. Export/import JSON versionato verifica formato, dimensioni, risorse, unità, blocchi e orari; l'import crea un nuovo piano. Console, quiz, timer e Vista Aula mantengono i flussi collaudati. Titoli delle sezioni e delle pagine senza punto finale.

Importazione e revisione sono authoring locale; online non ci sono controlli che fingono di modificare il repository. La copia locale precedente resta recuperabile e separata, con dipendenze e dati locali esclusi dalla pubblicazione.

Presenze assente dal prodotto e dai payload attivi. Archivio storico e dati locali conservati, esclusi da Git e build.

## Contenuti e sicurezza

La conferma del proprietario «sono tutti fatti da me e pubblici», ricevuta durante questa fase, è registrata nel catalogo ripulito. Pubblicate 61 risorse: autorizzazione pubblica e privacy CLEAR, senza promozione automatica dell'approvazione didattica. Otto risorse con attribuzione esplicita a terzi restano escluse: slide/laboratori/quiz Sala e HACCP, dispensa Bertozzi. Gli originali non sono stati modificati.

Nessuna copia dell'archivio completo, video originale, backup, runtime locale, log, screenshot temporaneo o credenziale nel repository. Provenienza tecnica con percorsi Mac esclusa. Gate di pubblicazione GO; scansione testuale e binaria dei percorsi Mac nei materiali pubblicati senza riscontri. I test tecnici non sono una certificazione assoluta di sicurezza o titolarità.

## Verifica

npm ci completato con lockfile, zero vulnerabilità segnalate dall'installazione. npm run check: 0 errori, 0 avvisi, 0 hint. npm test: 7 PASS. npm run test:e2e: 5 PASS. Totale attivo 12 PASS / 0 FAIL. I test delle vecchie API non sono conteggiati come test della nuova architettura: restano nella copia locale.

Build statica e audit link/asset completati. Due build consecutive confrontate per SHA-256: stessi byte per tutti i 177 file. Output circa 31,5 MB, bundle condiviso maggiore circa 164 KB non compresso. Nessun caricamento di librerie remote o font scaricati.

Il test browser attraversa direttamente tutte le 26 unità e tutte le 61 risorse, verifica ricerca, portabilità, proiezione senza risposta anticipata, assenza di backend, intestazioni chiare, focus e adattamento mobile. La verifica live comprende salvataggio/refresh, download/import, popup reale, quiz sincronizzato e timer. Dettagli e limiti in PHASE4B_LIVE_QA.md.

Integrità dell'archivio sorgente: 34.893 file confrontati con baseline SHA-256, dimensione e mtime; nessuna modifica. Evidenza locale esclusa da Git.

## GitHub e uso

Repository: https://github.com/manzo8b/risto-lab . Visibilità PUBLIC. Sito: https://manzo8b.github.io/risto-lab/ . Home Docente: https://manzo8b.github.io/risto-lab/instructor/ . Workflow ufficiale su main e dispatch, permessi contents read / pages write / id-token write, Pages source Actions. Primo deploy e successivo aggiornamento riusciti; controllo finale di tutti gli artefatti live.

Il sito è pubblico: Instructor Hub indica un'area funzionale, non autenticazione. I piani non si sincronizzano tra dispositivi o tra localhost e sito live; usare export/import. Le note non devono contenere dati sensibili. Le fonti normative restano con vigenza non verificata.

Accettazione finale umana READY, non ancora eseguita: cinque verifiche nel documento dedicato. Nessuna nuova migrazione del curriculum. Prossima fase raccomandata: CONTROLLED CONTENT MIGRATION. STOP.
