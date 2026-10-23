# Phase 4B — Verifica live

23 ottobre 2026. Sito: https://manzo8b.github.io/risto-lab/ . Home Docente: https://manzo8b.github.io/risto-lab/instructor/ .

## Esito

Verifica tecnica dell'agente sul sito realmente pubblicato, distinta dall'accettazione umana di Marcelo.

| Controllo | Risultato |
|---|---|
| Home, CSS, SVG, font di sistema | PASS |
| Programma 26 unità e route dirette | PASS |
| Unità 06 e ricarica diretta | PASS |
| Biblioteca e Cerca | PASS |
| Sessione proposta da 60 minuti / 7 blocchi | PASS |
| Salvataggio e ricarica nel browser | PASS |
| Export JSON scaricato dal sito live | PASS |
| Import dello stesso file con nuovo ID | PASS |
| Console e timer avvia/pausa | PASS |
| Popup Vista Aula con base corretto | PASS |
| Quiz, rivelazione, domanda successiva e reset risposta | PASS |
| Schermo neutro | PASS |
| Normativa e collegamenti PDF statici | PASS |
| Importazione contenuti online | Informativa locale, nessun upload al repository |

Ricerca live: mise en place 14 risorse, HACCP 12, brigata 3. I due piani sintetici della prova sono stati rimossi tramite la UI; nessun piano dell'utente è stato eliminato. Nessun account studente o registro presenze.

Schermate live conservate localmente, escluse da Git: qa4b-live-home, program, unit06, library, builder, console, vista-aula. L'aspetto mantiene intestazioni chiare e la palette Phase 4A. La prova fisica su secondo display/proiettore resta umana.

## Deploy e correzioni osservate

Repository pubblico creato vuoto e poi popolato con il gate GO. La credenziale Git esistente non aveva scope workflow: il workflow è stato inserito dalla sessione web autorizzata, senza creare token o allargare permessi. Pages usa GitHub Actions.

Il primo job build è riuscito; deploy inizialmente 404 perché Pages non era ancora abilitato. Dopo la configurazione della sorgente Actions, la riesecuzione è riuscita. Il run [39907543412](https://github.com/manzo8b/risto-lab/actions/runs/39907543412) ha inoltre verificato con successo la correzione dei riferimenti normativi verso i PDF statici.

Audit locale: tutti i link interni generati risolvono a file esistenti; route unità e risorse provate direttamente sotto /risto-lab/. Controllo HTTP live di tutti gli artefatti eseguito dopo la pubblicazione della versione finale; evidenza dettagliata locale PHASE4B_LIVE_HTTP.json. Una verifica durante il cambio versione aveva segnalato il nuovo hash JavaScript non ancora distribuito; il controllo conclusivo usa la versione distribuita.

Nessun giudizio umano o certificazione completa di accessibilità attribuito automaticamente.
