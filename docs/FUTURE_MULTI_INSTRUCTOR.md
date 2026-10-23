# Seam per futuri docenti

`InstructorProfile` contiene id, firstName, displayName, initials, roleLabel e avatarUrl opzionale. `InstructorProvider.getCurrentInstructor()` fornisce il profilo; oggi `LocalInstructorProvider` restituisce il default di Marcelo. Il saluto dipende da `instructorGreeting`, con fallback «Buongiorno».

Il componente laterale e la Home consumano il profilo, senza stringhe Marcelo nel markup. Un fixture Giulia verifica lo stesso contratto. Non ci sono schermate di accesso, account, logout, database o permessi. «Docente» è una presentazione, non una garanzia di autenticazione.

In futuro un AuthenticatedInstructorProvider potrà ricevere un'identità già risolta da un servizio reale e fornire il medesimo contratto. Organizzazione, membership, autorizzazione e controllo dei dati richiederanno una progettazione dedicata e un backend adeguato: sostituire il nome non crea sicurezza. L'eventuale risoluzione asincrona va gestita dall'applicazione prima del rendering del profilo.

GitHub Pages resta pubblico. Il profilo corrente non introduce isolamento tra utenti né sincronizzazione dei piani locali.

## Phase 5.1 — Struttura condivisa

Il profilo è reso una sola volta nell’header tramite InstructorProfile, alimentato da currentInstructor. Il saluto usa instructorGreeting e resta testato con Marcelo, Giulia e profilo assente. Nessun campo di autenticazione, ruolo applicativo o account database è introdotto.
