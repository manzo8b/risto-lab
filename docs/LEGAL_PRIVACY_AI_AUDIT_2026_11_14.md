# Risto-Lab — verifica per informativa legale, privacy, cookie e AI
Data: 14 novembre 2026

## Identità e scopo dichiarati dal curatore
- Creatore e curatore: Marcelo Javier Fernandez Caballero
- Progetto indipendente e divulgativo, per mostrare lavoro e competenze e creare opportunità professionali
- Nessuna pubblicità, newsletter, vendita o abbonamento operativo nella versione verificata
- Alcuni contenuti possono essere prodotti con AI e passano sotto responsabilità editoriale umana

## Riscontri tecnici
- Hosting statico su GitHub Pages: le visite possono generare IP log di sicurezza secondo la documentazione GitHub.
- Nessun database visitatori, registrazione studenti o form di contatto server-side nei layout controllati.
- Instructor salva localmente lezioni, bozze e recenti (localStorage; talvolta sessionStorage).
- Risto-Lab AI aiuta a comporre prompt e collega un servizio esterno, senza trasmissione automatica al curatore.
- Contatti via email possono comportare il trattamento del messaggio e dell'indirizzo del mittente.
- Il sito non integra un banner fittizio per profilazione inesistente; va rivisto se si aggiungono strumenti non tecnici.

## Materiali di riferimento
- GDPR Reg. (UE) 2016/679, art. 13: https://eur-lex.europa.eu/eli/reg/2016/679/oj/ita
- Reg. (UE) 2024/1689, art. 50 (applicazione dal 2 agosto 2026): https://eur-lex.europa.eu/eli/reg/2024/1689/oj/ita
- Commissione europea, obblighi di trasparenza AI: https://digital-strategy.ec.europa.eu/it/policies/guidelines-ai-transparency-obligations
- Garante Privacy, Linee guida cookie 2021: https://www.garanteprivacy.it/web/guest/home/docweb/-/docweb-display/docweb/9677876
- GitHub Pages, IP per sicurezza: https://docs.github.com/en/pages/getting-started-with-github-pages/what-is-github-pages
- GitHub Privacy: https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement

## Pubblicazione
Pagine: /legal/, /privacy/, /cookie/, /ai-act/.
Link permanenti nei footer Public, Instructor, PRISMA. Informativa esterna aggiunta alla pagina Risto-Lab AI, collegamento sintetico nella console Aula.

## Limiti dell'audit
Questo controllo riguarda lo stato del codice pubblicato in data odierna, non sostituisce una consulenza legale, una scansione di tutte le richieste di rete da browser reali o un audit continuativo dei servizi terzi. La dichiarazione generica AI deve essere integrata, nei casi previsti, da etichette sui singoli contenuti.

## Gate
1. npm run check
2. npm test
3. npm run build
4. npm run publication:gate
5. playwright: legal-privacy.e2e.ts + quality-audit.e2e.ts
6. Solo dopo l'esito positivo, revisione e merge su main / deploy GitHub Pages
