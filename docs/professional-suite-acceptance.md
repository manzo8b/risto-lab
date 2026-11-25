# Professional Suite 1.0 — verbale di accettazione
Data di preparazione: 25 novembre 2026. Sessione utente prevista: 26 novembre 2026.
Stato: RC1, non pubblicata. Nessuna certificazione professionale implicita.

## Evidenze del primo ciclo CI
PR #22; commit fc6a006c99e86ca2ace0a7da28c4bd14b0b15dd4.
8 workflow superati; 2 workflow di navigazione/release falliti.
Il gate release ha superato npm check, npm test, motori standalone, build, manifest, portabilità, publication gate. Browser: 16 pass, 2 fail, 1 skip (fixture privata opzionale).
Errori: overflow Menu Design a 360 px; asserzione sul formato numerico italiano del simulatore (il risultato economico 6375 EUR era corretto).
Fix: 23fcb031b13e82fd866cda3b7fcc82fb9fec7cff. Nuovo gate: https://github.com/manzo8b/risto-lab/actions/runs/45701330191. Non attribuire PASS prima del risultato effettivo.

## Collaudo con operatore
Usare solo dati sintetici o file privati in locale. Mai caricare ricette riservate nel repository.
| ID | Modulo | Prova | Criterio di accettazione |
|---|---|---|---|
| A01 | Recipe Manager | Importare archivio o CSV, correggere ricetta, esportare JSON/CSV | Quantità, unità, ingredienti proposti e dichiarati conservati |
| A02 | Supplier Manager | Collegare prodotti, prezzi e documenti, esportare collegamenti | Riferimenti corretti; mancanze evidenziate |
| A03 | Matrice Allergeni | Importare CSV ricette, controllare pepe/peperoni/pepperoni, esportare Excel | Codici 1–14, ambiguità e ingredienti proposti non diventano allergeni confermati |
| A04 | Food Cost | Importare ricette e fornitori, calcolare, esportare cost-run | Ricalcolo coerente; nessun dato mancante trasformato in zero |
| A05 | Menu Engineering | Importare cost-run, inserire vendite e periodo, analizzare | Quattro classi, soglie, margini e vendita ignota preservati |
| A06 | Menu Design | Importare JSON compatibile; provare Modern, Classic, Bistro; IT/EN/ES | Tre identità reali; nessun costo interno nel JSON pubblico; bozza non esportabile; PDF leggibile |
| A07 | Restaurant Simulator | Scenario base e alternativo; variare prezzo e domanda separatamente; esportare e reimportare | Ricavi netti, risultato operativo, pareggio, stessi risultati dopo roundtrip |
| A08 | UX trasversale | Tutti i sette percorsi, 360/390/768/1440 px; tastiera | Navigazione coerente, niente overflow orizzontale, focus visibile |
| A09 | Documentazione | Confrontare allergeni con schede originali e preparazioni effettive | Validazione operatore, contaminazione crociata e riferimenti documentati |
| A10 | Pubblicazione | Verificare PR, tutti i gate obbligatori, test utente e rollback | Nessun merge prima della decisione GO |

## Contratti e limiti
- Collegamenti file: ricette/fornitori -> Food Cost -> Menu Engineering; nessun POS o sincronizzazione automatica.
- Menu Design richiede il proprio JSON con items, prezzi lordi e approvazioni esplicite; non è ancora dimostrato un passaggio automatico dall'archivio ricette o dal rapporto Menu Engineering.
- Simulator usa ipotesi mensili inserite dall'operatore. Non si può dedurre il numero di clienti dalle porzioni vendute o il comportamento della domanda da un prezzo.
- Il menu esportabile richiede allergeni e traduzioni con riferimenti di validazione; leggibilità, legenda, correttezza documentale e normativa sono responsabilità dell'operatore.
- Legende integrate IT/EN/ES; le altre lingue richiedono legenda validata importata. PDF tramite stampa browser.
- Il CSV privato opzionale non viene eseguito in CI pubblico.
- Risultato operativo simulato: prima di imposte, interessi, ammortamenti e oneri non inclusi.

## Decisione
GO/NO-GO: da registrare dopo i gate e la prova utente.
Non effettuare merge forzati. Preservare la branch main e la RC1 fino al collaudo.
