# RISTO-LAB — Controllo integrale di qualità

Data: 25 ottobre 2026. Base: curriculum 01–26 pubblicato, commit `5b5eb50`. Obiettivo: migliorare chiarezza, accessibilità e continuità del lavoro docente, conservando identità visiva, contenuti e flussi già validati. Nessuna nuova fase di prodotto o funzione di registrazione allievi.

## Esito

Controllo locale superato: **113 test unici PASS** (57 modelli +56 browser). Analisi automatica su 47 percorsi a 1440 e 390px: **94 viste**, prima 27 occorrenze di violazione, dopo 0; nessun overflow di pagina alle dimensioni standard. Copertura: sito professionale, Home, Programma, tutte le 26 unità, Biblioteca, ricerca, lezioni, AI, normativa, raccolte, sicurezza alimentare, media, due pagine risorsa rappresentative, Console e Vista Aula.

Questo risultato riguarda i controlli eseguiti e gli stati visitati: non è una certificazione di conformità né un voto umano all'efficacia formativa. La disponibilità del programma non promuove automaticamente le unità a COMPLETE.

**Pubblicazione live: PASS**. Commit applicativo `72662073304a8f9d97934bcf80559230a441a04d`; [workflow 40165575554](https://github.com/manzo8b/risto-lab/actions/runs/40165575554), build e deploy SUCCESS. Il successivo commit documentale registra le prove e adegua soltanto il budget complessivo di un test remoto; non modifica il sito degli utenti.

Nove casi live verificati: accessibilità automatica su 16 viste, filtri e ritorno dall'AI, metadati pubblici, schede e tastiera, testo al 200%, ricerca, importazione/esportazione e salvataggio locale della lezione, Console, timer, risposte del quiz e Vista Aula, route riservate assenti, stile e mobile. Il controllo completo degli indirizzi ha verificato HTTP200 per tutte le 26 unità e 178 risorse, poi navigazione/ricarica di 8 pagine principali. Nessun dato reale del browser del docente modificato: i test usano contesti isolati.

Il primo giro live ha superato 8 casi e raggiunto il limite complessivo di 30 secondi nel controllo che enumera oltre 200 indirizzi. Il caso è stato rieseguito con 120 secondi complessivi solo in modalità remota: PASS in 31,9 secondi. Restano identiche tutte le asserzioni e il budget locale; nessuna pagina o risorsa è stata esclusa. Esito finale: tutti i 9 casi live PASS. Le esecuzioni ripetute non aumentano il conteggio dei test unici.

## Correzioni applicate

| Area | Problema osservato | Risultato |
|---|---|---|
| Affidabilità dei messaggi | Le schede dichiaravano sempre “Pubblicazione pubblica: non autorizzata” | Etichetta derivata dallo stato reale del catalogo |
| Home | Il testo citava ancora soltanto 06/10/17 | Accesso esplicito al programma di 26 unità |
| Orientamento | Nelle unità mancava la voce attiva del menu | Programma attivo nelle unità; Biblioteca nelle risorse |
| Ricerca | Scelte di filtro perse su ricarica e ritorno | Sei filtri conservati nell'URL e nel percorso ricerca → materiale → AI → materiale → risultati |
| Materiali trasversali | Filtro Unità 24/25 escludeva casi canonici di altre unità | Ricerca e contesto visibile includono gli usi trasversali dichiarati dal curriculum, senza modificare le risorse |
| Lettura assistita | Salti nella gerarchia dei titoli, regioni omonime e gruppo filtri senza ruolo | Titoli coerenti, regioni distinguibili, ruolo corretto dei filtri |
| Tabelle | Tabella larga non raggiungibile da tastiera su mobile | Gruppo tabella focalizzabile e scorrevole |
| Simulazioni e laboratori | Schede espandibili prive di un segnale evidente | Indicatore +/−, interazione nativa e tastiera conservate |
| Testo ingrandito | Compositore e intestazione unità allargavano la pagina al 200% | Campi flessibili, parole gestite correttamente e intestazione mobile su una colonna; nessun testo nascosto per mascherare il problema |
| Sito professionale | Copie obsolete su riservatezza e versione locale | Descrizione coerente con il sito pubblico; nessun recapito inventato |
| Identità del sito | Pagine professionali senza icona/canonical e footer con segnaposto futuro | Icona e canonical coerenti; segnaposto eliminato |

Il menu quotidiano rimane dedicato all'insegnamento. Non sono state aggiunte sezioni di amministrazione, account, backend, servizi cloud o registri. Catalogo, numerazione, risorse, PDF, quiz e criteri didattici rimangono invariati. Console e Vista Aula non subiscono modifiche al runtime. Le unità 06 e18 restano PARTIAL.

## Colori, tipografia e leggibilità

Palette conservata: intestazione bianca, avorio, navy, teal e rame. Nessuna modalità scura o colore sostitutivo. I rapporti sono calcolati dai token, non stimati da uno screenshot.

| Coppia | Rapporto |
|---|---|
| Navy su avorio | 14,45:1 |
| Testo secondario su avorio | 5,19:1 |
| Bianco su azione teal | 6,29:1 |
| Rame testuale su avorio | 5,59:1 |
| Focus ambra su bianco | 3,61:1 |

Gerarchia e spazi del sistema esistente conservati; stato sempre accompagnato da testo. Verificati focus, tastiera, schede espandibili e ingrandimento del testo via dimensione radice al 200% su mobile. Quest'ultimo controllo non simula ogni modalità di zoom di tutti i browser.

## Evidenza tecnica

- `npm run check`:87 file, 0 errori/warning/hint.
- `npm test`:57 PASS, 0 FAIL; include limiti e selezione sicura dei parametri di ricerca.
- `npm run build`:228 pagine; controllo statico di link interni, asset e isolamento pubblico/privato superato.
- `npm run test:e2e`:56 PASS, 0 FAIL; regressione dei flussi precedenti e quattro nuovi casi di qualità.
- axe-core 4.14.0: 94 viste. Prima: 14 occorrenze heading-order, 6 aria-prohibited-attr, 6 landmark-unique, 1 scrollable-region-focusable. Dopo: 0 violazioni rilevate.
- Ulteriore riesecuzione mirata dopo gli ultimi affinamenti: 9/9 PASS (qualità e regressione statica), ripetizioni non sommate ai 113 test unici.
- Archivio sorgente: 34.893 file confrontati per hash, dimensione e mtime; 0 modifiche.
- Installazione dipendenze: audit npm su 276 pacchetti, 0 vulnerabilità segnalate dal registro al momento del controllo. Non equivale a un penetration test.

Nel primo test di ingrandimento sono emersi i difetti reali di reflow ora corretti; non sono stati ignorati o coperti con `overflow:hidden`. Non sono stati introdotti skip nei test precedenti. Axe è una dipendenza di sviluppo: non viene caricata nel sito degli utenti. Rapporti grezzi, screenshot e inventari con percorsi locali rimangono esclusi da Git.

## Prestazioni e limiti della misura

Il sito mantiene font di sistema, asset locali, pagine statiche e nessun nuovo servizio esterno. Il modulo condiviso più grande contiene il catalogo: circa 762 KB non compressi e 99 KB con gzip stimato localmente. Questo è un dato di build, non la misura del trasferimento effettivo, del tempo su rete mobile o dei Core Web Vitals. Ottimizzare caricamento dei dati soltanto dopo una misura su dispositivo/rete reali; nessuna promessa di velocità universale viene dedotta dai test locali.

## Piano di azione verso la qualità didattica

| Priorità | Azione | Evidenza di chiusura |
|---|---|---|
| P1 | Eseguire i cinque test finali 6D con docente e gruppo reale | Media ≥4,5, nessun voto sotto 4, problemi annotati; nessun voto precompilato |
| P1 | Confermare un recapito professionale pubblico per Contatti | Canale fornito dal proprietario e verificato sul sito; non ricavato da dati privati |
| P1 | Validare i limiti editoriali delle unità 06/18 e i tempi reali dei laboratori | Osservazioni del docente, prova con attrezzatura idonea e aggiornamento motivato degli stati |
| P2 | Provare lingua A2–B1, proiezione dal fondo dell'aula e stampa fisica | Comprensione, leggibilità e utilizzo effettivo documentati |
| P2 | Misurare carico iniziale e reattività su rete mobile reale | Dati di navigazione, poi eventuale budget e intervento mirato sul catalogo |

La prova umana è già descritta in PHASE6D_HUMAN_TEST. Il sito è uno strumento per condurre e osservare l'apprendimento: non diventa una formazione eccellente soltanto superando test del software. I miglioramenti applicati rimuovono ostacoli verificati; la qualità in aula resta da dimostrare con persone e strumenti reali.
