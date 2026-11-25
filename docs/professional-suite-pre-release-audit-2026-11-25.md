# Audit pre-release — 25 novembre 2026
Scope: Professional Suite RC1, not a legal certification. Baseline commit 0b34ae307dc52c35a71f4ba350a003b203b1350f; PR #22.
Evidence: https://github.com/manzo8b/risto-lab/actions/runs/45701398098 (10/10 workflows across baseline; release job 112 project tests, 44 standalone tests, 18 browser passes and one optional private CSV skip).
## Findings
- P0 customer safety: Matrix v2.5 is internal/educational only, including reviewed exports; five states distinguish unknown, automated signal, uncertainty, human-confirmed presence and documentary non-presence. No automated proof of absence. Code summary and cross-contact traces are separate. User attestation is not an audit of actual ingredients.
- P0 Menu Design: imported claims of validation are not independently verified. RC patch 0c263eb8ddcb966db1848abc18f63d4e88d7aa86 preserves watermark even when exportable, avoids assurance of absence, labels JSON as internal review. Regression test 24ca58c3ab6b250e6e2bd43f25503e0a04591aa3. Re-run CI before accepting changes.
- P0 Italy customer publication (not enabled in RC): information for each dish, before service, visible and legible in Italian; digital information also backed by easily accessible written documentation; decongelato indication where required. OSA responsible for accuracy. Validate against original specifications, recipe version, substitutions and cross-contact controls. No public document based solely on imported status fields.
- P1 document trail: current Matrix uses one free-text source reference per dish. Improve per-allergen evidence, reviewer role/date and version, record supplier substitutions and separate structured cross-contact outcomes. Restored sessions require renewed review. This is a recommended control, not a statutory software format.
- P1 cross-module: actual Food Cost to Menu Engineering transfer tested; menu design still needs manually prepared compatible JSON. No automatic link to verified Matrix or POS. Simulator uses user assumptions, not a demand forecast.
- P1 privacy/supply chain: Matrix processes locally by design but external CDN scripts run with page privileges. Vendor or integrity-pin dependencies, test network behavior, clarify external requests and retention. Never import customer health data or confidential recipe data into public repository. GDPR assessment needed if personal data are processed.
- P1 actual operator acceptance: optional private CSV, real menus, mobile/PDF, accessibility, multilingual food terminology, scenario assumptions.
## Legal sources
- Reg. (UE) 1169/2011 arts. 8, 9(1)(c), 21, 44, Annex II: https://eur-lex.europa.eu/eli/reg/2011/1169/oj?locale=it
- D.Lgs. 231/2017 arts. 19 (8–10), 23: https://www.normattiva.it/atto/caricaDettaglioAtto?atto.codiceRedazionale=18G00023&atto.dataPubblicazioneGazzetta=2018-02-08&tipoDettaglio=multivigenza
- Reg. (UE) 2021/382 amending 852/2004: https://eur-lex.europa.eu/eli/reg/2021/382/oj?locale=it
- Commission guidance 2022/C 355/01: https://eur-lex.europa.eu/legal-content/IT/TXT/?uri=CELEX%3A52022XC0916%2801%29
- Ministry of Health: https://www.salute.gov.it/new/it/tema/nutrizione/allergie-alimentari/
## Decision
GO for internal testing, NO-GO for customer-facing allergen claims or final release pending operator acceptance and fresh CI. Keep main unchanged.
