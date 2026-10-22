# Phase 4B baseline — 22 ottobre 2026

Audit prima delle modifiche: ramo main senza commit, nessun remote configurato, intero progetto non tracciato. Nessun reset/stash o checkpoint Git parziale. Copia recuperabile in .local/phase4b-authoring, manifest SHA-256 PHASE4B_ROLLBACK.json.

Astro 7.4.2, adapter Node 11.1.9. Due build: pubblico statico e Instructor SSR. API sessioni/intake/revisione/metadati, asset serviti dal filesystem, middleware di negazione produzione. Sessioni e intake persistiti in .local. Ricerca client su metadati; route unità/risorse dinamiche. Configurazioni e lockfile esaminati; .env ignorati. Presenze già fuori dal runtime, archivio privato conservato.

69 risorse: tutte publication_status PRIVATE; 57 UNKNOWN rights, 8 THIRD_PARTY, 4 OFFICIAL_PUBLICATION. Nessuna autorizzazione pubblica nel catalogo. I sette materiali Aula Unità 06 sono approvati solo per uso privato. Il gate deve escluderli senza promuoverli implicitamente.

Test precedente: 40 modello + 42 browser; build SSR non adatta a Pages. 32 MB di asset privati e 36 MB di documentazione/screenshot da tenere fuori dal repository pubblico. Nessuna copia dell'archivio sorgente nella pubblicazione.

GitHub CLI non installata. Verifica repository tramite connector prima di qualunque creazione o push. Nessun segreto o credenziale letto o stampato.
