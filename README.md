# RISTO-LAB

Hospitality Training & Restaurant Operations — spazio docente statico per materiali, lezioni e conduzione in aula.

Sito previsto: https://manzo8b.github.io/risto-lab/ (stato effettivo nel report Phase 4B).

## Tecnologia e avvio

Astro 7, TypeScript, CSS e SVG locali. Un’unica applicazione prerenderizzata, senza database, account studenti o backend. Il sito ospitato e i materiali pubblicati sono pubblici.

```sh
npm ci
npm run dev
```

Aprire il percorso `/risto-lab/instructor/` sull’indirizzo indicato dal server. Il base path viene mantenuto anche in sviluppo.

```sh
npm run check
npm test
npm run build
npm run test:e2e
npm run publication:gate
```

`dist/` è l’artefatto statico. I test browser usano un server di soli file sotto il percorso reale `/risto-lab/`.

## Insegnare

Il Servizio in Sala comprende 26 unità. Unità 06 contiene la sequenza Aula approvata: testi, immagini, esercizio, quiz e checklist. La Biblioteca distingue risorse consultabili e materiale approvato per la conduzione in aula.

Crea lezione propone l’ordine disponibile e distribuisce 60 minuti; ordine e tempi restano modificabili. Salvataggio e bozze sono nel browser/dispositivo corrente. Esporta JSON e Importa JSON permettono il trasferimento manuale, senza sincronizzazione cloud. Le note non devono contenere dati personali sensibili. Vedi [portabilità](docs/SESSION_PORTABILITY.md).

## Preparare i contenuti

Importazione e revisione appartengono all’ambiente locale di authoring. Online non modificano il repository. Solo contenuti autorizzati alla pubblicazione entrano nel catalogo pubblico; provenienza tecnica e percorsi locali restano esclusi. Vedi [authoring e sito](docs/AUTHORING_VS_HOSTED.md).

## Pubblicazione

GitHub Actions su main: checkout ufficiale, withastro/action, deploy-pages. La build verifica il catalogo e i file generati; il gate esclude segreti, dati locali e file non destinati alla pubblicazione. Vedi [deploy](docs/GITHUB_PAGES_DEPLOYMENT.md).

## Limiti

Nessuna autenticazione o riservatezza tecnica dei materiali online. I piani locali possono essere persi cancellando i dati del browser: esportarli quando occorre conservarli. Una copia normativa e il suo collegamento non attestano la vigenza. Nessuna migrazione automatica dell’archivio completo.

## Phase 5

Unità 10 e 17 dispongono di sequenze Aula e schede stampabili, con stato CLASSROOM_READY. La Home usa un profilo docente locale sostituibile. RISTO-LAB AI prepara richieste contestuali da copiare in ChatGPT, senza API o modifica automatica dei piani. Vedi `docs/PHASE5_COMPLETION_REPORT.md` e `docs/PHASE5_HUMAN_ACCEPTANCE.md` per verifiche e prova umana ancora da eseguire.
