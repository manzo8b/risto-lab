# Design system — Phase 4A

Questa versione sostituisce la direzione Phase 3B. Fonte dei token: `src/styles/tokens.css`; base condivisa: `global.css`; applicazione Instructor: `instructor.css`.

| Ruolo | Colore |
|---|---|
| Testo navy | #10242D |
| Azioni teal | #176B68 |
| Fondo avorio | #F6F3ED |
| Superficie / intestazione | #FFFFFF |
| Testo grafite | #242B2E |
| Rame decorativo | #B86D45 |
| Rame testo | #91502D |
| Stone | #E7E2DA |

Il navy è inchiostro, non uno sfondo per le intestazioni. Nessun token ciano aggiunto. Stato e disponibilità hanno sempre una dicitura, non solo un colore.

Font UI: stack di sistema Apple/Windows/Linux, senza richieste esterne. Titoli Instructor sans, peso 600 e tracking contenuto; Georgia resta per numerazione e accenti editoriali. Corpo 16px, metadati 12–14px. Proiezione: titolo 38–60px e lettura 28–40px.

Scala spazi: 4, 8, 12, 16, 24, 32, 48, 64, 96px. Raggi 5, 8, 12px. Ombre a bassa opacità; bordi di separazione sottili. Z-index distinto per intestazione, toolbar e dialogo. Transizioni brevi, disattivate con prefers-reduced-motion.

Comandi principali almeno 46px di altezza; focus visibile. Contrasto del bottone primario bianco/teal verificato a 6,29:1. Questo campionamento non costituisce una certificazione completa WCAG.

Icone SVG originali da un unico registro, tratto 1,8, decorative e aria-hidden; l'etichetta testuale porta il significato. Nessun font di icone o dipendenza remota.
