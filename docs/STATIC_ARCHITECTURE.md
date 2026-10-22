# Architettura statica

Un solo build Astro `output: static`, senza adapter Node, middleware, API o persistenza server. `src/instructor/pages` contiene anche le pagine di presentazione. `getStaticPaths` genera le 26 unità e tutte le risorse del catalogo pubblico. `dist` contiene solo HTML, CSS, JavaScript e asset.

Il catalogo pubblico è separato dalla provenienza originale. La dichiarazione del proprietario del 22 ottobre 2026 autorizza i materiali realizzati internamente; le otto risorse con esplicita attribuzione a terzi restano escluse. L'autorizzazione pubblica non promuove automaticamente una risorsa alla sequenza Aula: la revisione didattica conserva il suo stato.

`withBase` usa `import.meta.env.BASE_URL`; site è `https://manzo8b.github.io`, base `/risto-lab`, trailing slash sempre. Il server usato dai test serve soltanto i file di dist, senza fallback SPA.

La Console calcola i passaggi nel browser dai materiali approvati. Vista Aula riceve solo il contenuto di proiezione; risposte e note non sono mostrate prima del comando docente. Il sito è pubblico: questa separazione di interfaccia non è autenticazione o protezione dalla lettura del codice sorgente.

La copia storica locale e i dati precedenti restano esclusi da repository e dist. Nessun originale dell'archivio è stato modificato.
