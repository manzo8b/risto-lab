# RISTO-LAB · Audit cromatico e UX didattica

**Data:** 29 ottobre 2026. **Ambito:** sito professionale pubblico + RISTO-LAB Instructor + laboratorio sicurezza e cinque lezioni. **Stato:** revisione cromatica tecnica predisposta, da confermare con test automatici e valutazione umana in browser.

## Diagnosi

- La maggior parte dei componenti precedenti presenta fondo avorio/bianco e accenti verde/grigio quasi uniformi; i pulsanti secondari sono molto neutri.
- La progressione didattica non ha una gerarchia cromatica leggibile: lettura, pratica, casi, quiz e verifica sembrano superfici dello stesso tipo.
- Le cinque lezioni sono informative, ma le card dell'indice erano indistinguibili a colpo d'occhio.
- La sidebar Instructor rende deboli gli stati attivo/hover.
- Cambiare indiscriminatamente il colore di ogni area ridurrebbe leggibilità e coerenza. La revisione agisce solo dove colore e contrasto veicolano la gerarchia.

## Sistema semantico introdotto

| Funzione | Colore testo/CTA | Fondo tenue | Contrasto del colore su bianco |
| --- | --- | --- | --- |
| Metodo, comportamento, azione | Petrolio `#0C615D` | `#E6F4EE` | >7:1 |
| Conoscenza e moduli | Blu `#244F9B` | `#E9F1FF` | >7:1 |
| Pratica, scenari | Terracotta `#B13F28` | `#FFF0E9` | >5.8:1 |
| Riflessione e vocabolario | Viola `#67439A` | `#F2ECFF` | >7:1 |
| Verifica, feedback | Ambra scura `#7B4B10` | `#FFF2D9` | >7:1 |

Tutti i colori per il testo normale su fondo bianco/avorio superano la soglia WCAG AA 4,5:1; ulteriori combinazioni sui fondi tenui hanno testo scuro. I colori non sono l'unico indicatore di contenuto/stato: etichette, titoli, numeri e istruzioni restano visibili. Focus tastiera rafforzato.

## Interventi

1. Sito pubblico: testata accentata, hero caldo/freddo, storytelling evidenziato, cards con fasce cromatiche, sette tappe della formazione con fondo differenziato, CTA e footer più riconoscibili.
2. Instructor: barra laterale, selezione corrente, home docente e accessi rapidi differenziati; mantenuto il colore del testo sulle superfici di studio.
3. Laboratorio sicurezza: hero petrolio/blu, attività distinte, quiz, glossario e telefonata leggibili.
4. Cinque lezioni: cinque codici colore coerenti nell'indice e nelle intestazioni; fonti normative evidenziate senza trasformarle in falsi avvisi o attestazioni.
5. Scheda docente e microcasi: piccole fasce di colore orientano la lettura, ma la stampa conserva testo su fondo bianco.

## Esclusioni deliberate

- Nessun cambiamento ai contenuti legislativi o ai link delle fonti.
- Nessuna modifica a RISTO-LAB Business Academy in stand-by.
- Nessun rinnovamento indiscriminato dell'aula/proiettore, che rimane ad alta leggibilità.
- Nessuna animazione invasiva; preferenze per movimento ridotto mantenute.
- Nessun plugin, tracking, account o backend.

## Criteri di accettazione

- `npm run check`, `npm test`, `npm run build`, `npm run publication:gate`.
- Playwright su home, formazione, Instructor, laboratorio, lezioni, docente, microcasi, viewport mobile.
- Contrasto automatico ≥4,5 per palette di testo e CTA su chiaro, più verifica manuale dei casi particolari.
- Nessun overflow orizzontale a 390 px; navigazione con focus visibile.
- Successivo riscontro umano su un monitor reale e su smartphone. I test automatici non bastano a misurare preferenze estetiche.

## Governance

La modifica si limita a `src/styles/learning-colors.css`, ai due layout per l'import, all'attributo stabile per i cinque moduli, ai test e alla presente documentazione. Sito pubblicato solo se il QA ha esito positivo.
