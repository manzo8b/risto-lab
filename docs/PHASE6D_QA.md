# Phase 6D — QA

Data: 24 ottobre 2026. Perimetro: unità 23–26 e integrazione nel curriculum. Stato locale PASS; verifica della pubblicazione live in corso.

| Controllo | Esito | Evidenza |
|---|---|---|
| npm run check | PASS | 84 file; 0 errori, 0 warning, 0 hint |
| npm test | PASS | 55 test, 0 fallimenti |
| npm run build | PASS | 228 pagine; 335 file, 35.102.699 byte; link e asset interni risolti |
| npm run test:e2e | PASS | 52 test browser, 0 fallimenti nella riesecuzione completa |
| Publication gate | GO | Nessun blocco in file candidati, percorsi Mac, pattern di segreti o posizioni private |
| Fedeltà fonti | PASS | 40 passaggi e 30 domande controllati contro le fonti; risposta corretta preservata |
| Risorse e runtime precedenti | PASS | Hash di tutte le 163 risorse, unità 01–22, ordine preesistente, runtime Console e asset precedenti invariati |
| Originali | PASS | 34.893 file confrontati per hash, dimensione e mtime; 0 modifiche |
| Stampabili | PASS tecnico/visivo | 9 PDF, 13 pagine A4, testo equivalente web; rubrica orizzontale, foglio30 in una pagina |
| Privacy | PASS | Nessun CV reale, archivio voti, account allievo, backend o generatore di attestati |
| Prova umana | READY | Cinque test non eseguiti, nessun voto assegnato |

Totale locale: **107 PASS / 0 FAIL** (55 modelli +52 browser). Il primo giro browser ha rilevato quattro errori nei test nuovi: conteggio previsto di un input inesistente e selettore “Crea lezione” non circoscritto fra più collegamenti validi. Corretti i selettori; riesecuzione completa superata. Nessun fallimento viene nascosto con skip o allentamento dei controlli sulle risorse precedenti.

## Copertura 6D

Unità 23: caricamento diretto/ricarica, CV sincero, frasi e colloquio, nessun campo personale; 24: dieci schede espandibili da tastiera, ruoli/eventi/vincoli e riferimenti; 25: undici laboratori, obiettivo/materiali/setup/procedura/osservazione/debrief e alternativa ridotta. 26: 30 domande uniche, prova integrata, sette ambiti/quattro livelli, feedback, foglio risposte docente e dichiarazione di non certificazione.

Tutte e quattro propongono una lezione da60 minuti con ordine esplicito: 5/3/3/5 blocchi. 24/25 riusano risorse canoniche di altre unità senza cambiarle. Cinque JSON importabili mantengono durata60/90/90/120/120. La verifica completa usa120;60 è diagnostica. Tempi da estendere per osservazione individuale o gruppi numerosi.

Console: quiz26 rimane un blocco con 30 domande; rivelazione controllata e risposta nascosta alla pagina successiva. Vista Aula senza controlli, note, risposte iniziali o identità canoniche nel payload proiettore. L'isolamento è didattico: gli asset del sito restano pubblici. Nessuna valutazione compilata è salvata. Il piano della lezione rimane il precedente dato locale del docente.

AI: unità 24/25 conservate anche selezionando una risorsa originaria12/13; estratto corretto, adattamento e sicurezza. Unità 23 vieta esperienza inventata;26 esclude idoneità lavorativa/qualifiche e soglie obbligatorie. Nessun servizio cloud nuovo o invio automatico.

Programma:26 unità, ordine invariato, sequenze effettive nelle righe espanse;06/18 PARTIAL, altre24 CLASSROOM_READY. Ricerca su tutte le14 parole richieste, biblioteca, 390px senza overflow, tastiera e titoli senza punti finali. Regressione Home,06/10/17, ricerca, biblioteca, compositore, AI e Aula inclusa nella suite esistente. Presenze e dati locali reali non modificati; il sito ospitato non attiva un nuovo registro.

## Tracce locali

Inventario con percorsi completi, manifesto di derivazione, verifica di fedeltà, confronto originali, render PDF e screenshot restano esclusi dal repository. I documenti pubblici descrivono il risultato senza percorsi Mac o informazioni personali. Nessuna fotografia AI nuova generata.

## Pubblicazione e controllo live

PENDING — compilare soltanto dopo il workflow GitHub Pages e la verifica della versione distribuita.
