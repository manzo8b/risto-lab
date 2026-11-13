# RISTO-LAB · White Ecosystem redesign
Data: 13 novembre 2026. Branch di lavoro: `feat/white-ecosystem-redesign-20261113`.

## Obiettivo
Riprogettazione visiva coerente di Risto-Lab pubblico e Instructor. Sfondo dominante su ogni pagina: **#FFFFFF**, senza avorio o grigi usati come canvas del sito. I colori di marca sono destinati ad azioni, indicatori e contenuti circoscritti.

## Sistema
- Verde petrolio `#0D4943`: azione primaria, navigazione e collegamenti.
- Terracotta `#C15E38`: accento editoriale e focus hospitality.
- Blu `#245F98`: secondo livello informativo e focus (con contrasto).
- Bianco `#FFFFFF`: page background e superfici.
- Tipografia: font UI di sistema; Georgia per titoli editoriali; nessun font remoto.

Approccio: contenuti e respirazione visiva ispirati alla chiarezza dei siti di prodotto premium, con organizzazione modulare da piattaforma professionale. Non sono stati utilizzati marchi, componenti o codice di Apple o HP.

## Ambiti e pagine
- Shared shell pubblico: navigazione desktop e menu mobile `details`, percorso Instructor evidente, CTA leggibili.
- Home: hero, contenuti in evidenza, categorie, metodologia, scelta destinazione, accesso docente.
- Formazione: architettura dei percorsi, ciclo pedagogico, riferimenti ad attività realmente presenti.
- Programmi: 26 **unità curricolari** reali, non 26 corsi commerciali accreditati.
- Gratuita: risorse e lezioni effettivamente accessibili.
- Premium/Aziende: pagine orientative **non commercializzate**. Nessun prezzo, recensione, rating o attestazione inventata.
- Instructor: shell unificato, dashboard, programma, biblioteca, editor lezioni e unità ereditano lo sfondo bianco; nessuna logica di dati modificata.
- Console/Vista Aula e P.R.I.S.M.A.: importato lo stesso canvas bianco preservando i controlli esistenti.
- Masterclass mise en place: canvas bianco e contenuti formativi invariati.

## Vincoli conservati
Nessuna modifica al catalogo canonico, 26 unità, stati CLASSROOM_READY/PARTIAL, 178 risorse, quiz, sequenza Aula, flussi di sicurezza o privacy. Risto-Lab resta statico: no account, backend, pagamento o sincronizzazione di dati in questa versione. Le bozze docente restano locali.

## Gate di pubblicazione
1. `npm ci && npm run check`
2. `npm test && npm run build`
3. `npm run publication:gate`
4. `npx playwright test tests/white-ecosystem.e2e.ts tests/quality-audit.e2e.ts`
5. Test umano: menu mobile, tastiera, zoom 200%, viewport 390/768/1440, leggibilità proiettore e corso gratuito.

I risultati automatici sono condizioni tecniche, non una valutazione pedagogica conclusiva. Nessuna funzione premium o B2B verrà presentata come disponibile prima dello sviluppo e della validazione.
