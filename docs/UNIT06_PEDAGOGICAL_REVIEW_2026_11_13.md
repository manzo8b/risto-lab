# RISTO-LAB — Revisione pedagogica mirata · Unità 06
Data: 13 novembre 2026. Ambito: preparazione della tavola e attività pratica. Stato: proposta pronta per revisione umana, **non COMPLETE**.

## Criticità affrontata
Prima dell'intervento l'unità 06 dichiarava un solo obiettivo generico («capire»). La pagina didattica espone cinque risultati osservabili: selezione degli elementi, preparazione, controllo, individuazione degli errori, ripetizione dopo feedback. Il catalogo canonico conserva volutamente il precedente obiettivo generico perché è protetto da diversi test di regressione storici: questa fase non modifica gli snapshot congelati. Il contenuto resta PARTIAL fino a prova pratica ed editoriale.

## Materiale aggiunto
- 12 slide web statiche in `public/materiali/mise-en-place-masterclass.html`, accessibili dalla pagina dell'unità
- navigazione esplicita con pulsanti e tasti, senza scorrimento automatico; indicazione della slide corrente; supporto stampa e movimento ridotto
- rappresentazione grafica **dimostrativa**, non prescrittiva; adattare a menu, contesto, standard e accessibilità del locale
- esercitazione da 12 minuti e rubrica formativa a quattro criteri
- distinzione fra preparazione del tavolo e competenza effettivamente osservata

## Protocollo di prova umana
1. **Docente:** verificare che la sequenza illustrata rispetti standard e procedure di un servizio reale e correggere eventuali inesattezze.
2. **Partecipanti:** sottoporre il lessico e le indicazioni ad almeno due persone, idealmente con livelli iniziali differenti; annotare i punti non compresi.
3. **Aula:** usare stoviglie idonee e una postazione sicura; verificare se il gruppo riesce a preparare, controllare e correggere il tavolo.
4. **Proiezione e smartphone:** verificare la leggibilità delle slide, l'avanzamento da tastiera, la stampa e la comprensione sullo schermo piccolo.
5. **Rubrica:** annotare per ciascun criterio «da rivedere», «con supporto», «autonomo» oppure «non osservato». Non calcolare idoneità o certificazioni automatiche.

## Condizioni per considerare risolta la criticità
- tutti i cinque obiettivi risultano comprensibili, osservabili e rilevanti per il contesto;
- non sono presenti errori di sicurezza, terminologia o disposizione dell'attrezzatura;
- docente e partecipanti completano la prova e registrano modifiche necessarie;
- test locali e browser su configurazione finale superati;
- aggiornamento dello stato dell'unità solo dopo documentazione dell'accettazione, non in questa modifica.

## Distinzione dei test
Il test automatico `tests/mise-en-place-masterclass.test.ts` verifica presenza dei contenuti e controlli di navigazione; **non** attesta accessibilità WCAG completa, apprendimento reale o efficacia della didattica.

Riferimenti per la progettazione: [CAST UDL 3.0](https://udlguidelines.cast.org/) e [W3C WAI Carousels](https://www.w3.org/WAI/tutorials/carousels/).
