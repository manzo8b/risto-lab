# Portabilità delle lezioni

Salvataggio: localStorage `risto-lab-sessions-v1`, massimo 100 piani; bozza `risto-lab-draft-v1`; identificativo dell'ultima lezione separato. Nessun dato viene inviato a un backend. I dati appartengono a origine, browser e dispositivo correnti: localhost e GitHub Pages sono archivi separati.

Esporta JSON produce `{ "schema": "risto-lab-session", "version": 1, "plan": { ... } }`. Il piano contiene titolo, data/orari, programma/unità, blocchi con risorsa e minuti, note e stato. Non include file binari o copie della biblioteca.

Importa JSON accetta al massimo 256 KB, verifica schema/versione, unità e risorse approvate, date/orari, tipi di blocco, limiti di lunghezza e minuti. Seleziona solo campi conosciuti, non esegue codice e assegna un nuovo ID: nessuna sovrascrittura di una lezione esistente. Errori di formato o archivio corrotto sono segnalati senza sostituire i dati.

Procedura: esportare sul dispositivo A, trasferire personalmente il file, importarlo sul dispositivo B. Non c'è sincronizzazione automatica. Cancellare i dati del browser può rimuovere i piani; conservare gli export necessari. Non inserire dati personali sensibili nelle note: l'export include le note.
