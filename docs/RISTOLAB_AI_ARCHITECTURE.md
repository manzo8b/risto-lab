# RISTO-LAB AI — Architettura

**Oggi:** UI Instructor statica → Context Builder → copia richiesta → ChatGPT / eventuale RISTO-LAB nel servizio esterno.

La pagina /instructor/ai/ offre sette compiti e una preview. Il contesto proviene da profilo, programma, unità, risorsa, ricerca e piano salvato. Si includono soltanto campi espliciti: titoli, tipo umano, descrizione, estratto didattico limitato, durata e titoli dei blocchi. Note docente, percorsi, record di provenienza e campi arbitrari non sono serializzati.

`RistoLabAIProvider` definisce nome, disponibilità, URL di lancio opzionale, fallback e istruzioni. `ChatGPTRistoLabPluginProvider` ha launchUrl null: non è stato individuato un link diretto al plugin validato. Offre Copia richiesta e il collegamento https://chatgpt.com/ . Non inventa deep link o disponibilità nel singolo account. Non vi è un modello AI nel sito, nessun messaggio viene inviato automaticamente e nessuna risposta è simulata.

I collegamenti contestuali sono nelle unità, nel menu compatto dei materiali, nel compositore e nella ricerca. I piani non salvati forniscono il contesto dell'unità; per un piano già salvato viene usata quella versione, dichiarata nell'etichetta se vi sono modifiche non salvate. Nessun output viene inserito automaticamente nel piano. La copia negli appunti ha una selezione manuale di fallback.

Per argomenti normativi si rimanda alle fonti e si chiede verifica: niente punteggi di fiducia o dichiarazioni di conformità. Il normale motore di ricerca del catalogo resta separato e deterministico.

**Futuro, non implementato:** UI → backend AI autenticato → OpenAI → conoscenza e strumenti RISTO-LAB. Chiavi, autorizzazione, controllo del contesto e logging dovranno risiedere nel sistema appropriato, non in JavaScript pubblico. Il contratto del provider consente il cambio del ponte senza rifare la UI.
