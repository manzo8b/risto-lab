# Sistema componenti — Phase 4A

| Componente | Responsabilità |
|---|---|
| Instructor layout | Intestazione bianca, navigazione quotidiana e strumenti secondari |
| Icon / icons.ts | SVG coerenti, etichette accessibili nel comando |
| Home work-surface | Lezione corrente/preparata e azioni rapide |
| TeachingSessionCard | Avvio e modifica di un incontro salvato |
| Curriculum unit row | Numero, titolo, stato, materiali Aula; dettaglio espandibile |
| Unit page | Capitolo, azioni didattiche, risorse effettivamente presenti |
| ResourceCard | Riga di catalogo con tipo, titolo, apertura e metadati secondari |
| TeachingSessionBuilder | Creazione guidata, proposta approvata e timeline modificabile |
| Aula / classroom-client | Comandi docente e proiezione separata, logica esistente |
| Regulation row | Distinzione fonte normativa/didattica e vigenza non verificata |

La navigazione primaria è Home, Programma, Lezioni, Biblioteca, Cerca, Aula. Gestione contenuti/Revisione rimane negli strumenti secondari; interventi necessari possono comparire come conteggio contestuale. La revisione non è un passo obbligato per insegnare.

Unità 06 propone sette blocchi approvati per 60 minuti. Titolo, durata e posizione restano visibili; ordine, minuti e materiali sono modificabili. Nessun contenuto didattico nuovo generato.

Nessuna modifica sostanziale a quiz, timer, navigazione Console, popup proiezione o separazione dati docente/studenti. Presenze è stata ritirata dal prodotto. La versione statica usa solo stato del browser.
