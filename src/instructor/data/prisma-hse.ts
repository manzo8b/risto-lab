
export const prismaRoot='/atelier/prisma-hse-q7m4v9n2/';
export const prismaName='P.R.I.S.M.A. HSE';
export const acronym=[
{letter:'P',title:'Problema',description:'Il gap prestazionale e la domanda formativa, distinta dalle criticità tecniche o organizzative.'},
{letter:'R',title:'Requisiti',description:'Destinatari, ruolo, fonti primarie, vincoli normativi, qualifiche e condizioni del contesto.'},
{letter:'I',title:'Instructional design',description:'Obiettivi osservabili, macroprogettazione, microprogettazione e prove allineate.'},
{letter:'S',title:'Simulazione',description:'Casi narrativi e prove operative sicure, con debrief e feedback.'},
{letter:'M',title:'Misurazione',description:'Diagnosi, apprendimento, osservazione del comportamento, criteri e indicatori.'},
{letter:'A',title:'Applicazione',description:'Follow-up, trasferimento sul lavoro, miglioramento e riesame.'}
] as const;

export const sources=[
{code:'N01',title:'D.Lgs. 9 aprile 2008, n. 81 — testo vigente',body:'Definizioni art. 2; misure generali art. 15; obblighi art. 17; preposto art. 19; lavoratore art. 20; valutazione artt. 28–29; informazione e formazione artt. 36–37.',type:'Norma',url:'https://www.normattiva.it/eli/id/2008/04/30/008G0104/CONSOLIDATED'},
{code:'N02',title:'Accordo 59/CSR del 17 aprile 2025 — Ministero del Lavoro',body:'Parte I: soggetti, docenti, organizzazione e attestazioni. Parte IV: analisi del fabbisogno, macro/microprogettazione, metodologia, verifica dell’apprendimento ed efficacia.',type:'Norma/Accordo',url:'https://www.lavoro.gov.it/temi-e-priorita-salute-e-sicurezza/focus/accordo-stato-regioni-17042025-allegato'},
{code:'N03',title:'FAQ Ministero del Lavoro, 27 marzo 2026',body:'Chiarimenti ufficiali: consultare i quesiti pertinenti e verificare la disciplina specifica prima di decidere modalità o requisiti del corso.',type:'Chiarimenti',url:'https://www.lavoro.gov.it/temi-e-priorita-salute-e-sicurezza/focus/faq-accordo-stato-regioni-27032026'},
{code:'M01',title:'INAIL — Indicazioni metodologiche per soggetti formatori (2025)',body:'Sintesi tecnica delle novità dell’Accordo 2025: progettazione, esperienza, controlli, qualità ed efficacia.',type:'Metodo HSE',url:'https://www.inail.it/content/dam/inail-hub-site/documenti/catalogo-generale/2025/12/DIMEILA_Accordo%20Stato%20Regioni%20in%20tema%20di%20formazione%20alla%20SSL.pdf'},
{code:'M02',title:'CDC — Quality Training Standards',body:'Analisi dei bisogni, obiettivi, contenuti, progettazione, engagement e valutazione della formazione.',type:'Metodo pedagogico',url:'https://www.cdc.gov/training-development/php/qts/'}
] as const;

export const agenda=[
{day:1,start:'09:00',end:'09:20',minutes:20,title:'Diagnosi e criteri di successo',method:'Interview canvas e pre-test',output:'Problema formulato e gap osservabile',activity:'A1'},
{day:1,start:'09:20',end:'10:05',minutes:45,title:'Architettura delle fonti HSE',method:'Fonte → requisito → controllo',output:'Matrice di tracciabilità delle norme',activity:'A2'},
{day:1,start:'10:05',end:'10:55',minutes:50,title:'Obiettivi e prova a ritroso',method:'Backward design',output:'Obiettivo e prova coerenti',activity:'A3'},
{day:1,start:'10:55',end:'11:05',minutes:10,title:'Pausa',method:'',output:'',activity:''},
{day:1,start:'11:05',end:'12:05',minutes:60,title:'Macro e microprogettazione',method:'Storyboard di una microlezione',output:'Sequenza di 25 minuti',activity:'A4'},
{day:1,start:'12:05',end:'13:00',minutes:55,title:'Case design e debrief',method:'Telefonata + near miss',output:'Caso con decisioni e feedback',activity:'A5'},
{day:2,start:'09:00',end:'09:30',minutes:30,title:'Richiamo e revisione tra pari',method:'Recupero attivo',output:'Criticità risolte',activity:'A6'},
{day:2,start:'09:30',end:'10:20',minutes:50,title:'Storyboard, linguaggio e accessibilità',method:'Lavoro per gruppi',output:'Script docente e storyboard',activity:'A7'},
{day:2,start:'10:20',end:'11:20',minutes:60,title:'Slide e AI Fact-Check',method:'Confronto AI e fonti ufficiali',output:'Deck con evidenze verificate',activity:'A8'},
{day:2,start:'11:20',end:'11:30',minutes:10,title:'Pausa',method:'',output:'',activity:''},
{day:2,start:'11:30',end:'12:20',minutes:50,title:'Microteaching e feedback',method:'Simulazioni da 8–10 minuti',output:'Rubrica e revisione del prototipo',activity:'A9'},
{day:2,start:'12:20',end:'13:00',minutes:40,title:'Valutazione, qualità e follow-up',method:'Presentazione portfolio e peer review',output:'Kit revisionato e piano a 30 giorni',activity:'A10'}
] as const;
export const outcomes=[
{id:'O1',description:'Identifica il percorso, il soggetto destinatario e almeno tre vincoli normativi pertinenti in una matrice di fonti.',evidence:'Matrice normativa A2',criterion:'Tre riferimenti corretti, fonte e versione esplicite.'},
{id:'O2',description:'Progetta obiettivo, prova e sequenza didattica coerenti per una microlezione HSE di 25 minuti.',evidence:'Storyboard A3–A4',criterion:'Risultato osservabile, tempi e prova allineati.'},
{id:'O3',description:'Conduce un debrief su un near miss distinguendo fatti, ipotesi, ruoli e segnalazione.',evidence:'A5 + A9',criterion:'Nessuna istruzione tecnica inventata; feedback motivato.'},
{id:'O4',description:'Revisiona affermazioni normative generate con AI classificandole per attendibilità.',evidence:'AI Fact-Check A8',criterion:'Fonte primaria, esito e correzione documentati.'},
{id:'O5',description:'Definisce una verifica finale e un metodo di osservazione del transfer a 30 giorni.',evidence:'Piano A10',criterion:'Indicatori e responsabilità di misura pertinenti.'}
] as const;
export const sourceMatrix=[
{id:'R1',claim:'La valutazione di tutti i rischi e il DVR sono obblighi non delegabili del datore di lavoro.',reference:'D.Lgs. 81/2008, art. 17, comma 1 lett. a; art. 28',source:'N01',use:'Caso ruoli / quiz',status:'Da rileggere nella versione vigente'},
{id:'R2',claim:'Il preposto vigila sulle attività lavorative nell’ambito delle attribuzioni definite dalla legge.',reference:'D.Lgs. 81/2008, art. 19',source:'N01',use:'Near miss / ruoli',status:'Da contestualizzare nel caso reale'},
{id:'R3',claim:'Il lavoratore deve segnalare condizioni di pericolo secondo gli obblighi pertinenti.',reference:'D.Lgs. 81/2008, art. 20',source:'N01',use:'Telefonata / esercizio',status:'Da contestualizzare nelle procedure aziendali'},
{id:'R4',claim:'Per i corsi disciplinati dall’Accordo servono progetto, organizzazione, docenti e verifiche conformi al percorso.',reference:'Accordo 59/CSR, Allegato A, Parte I e Parte IV',source:'N02',use:'Fact check / progettazione',status:'Verificare tipologia e requisiti specifici'},
{id:'R5',claim:'La verifica di apprendimento è distinta dalla verifica dell’efficacia nel lavoro.',reference:'Accordo 59/CSR, Allegato A, Parte IV, punti 6 e 7',source:'N02',use:'Rubrica / follow-up',status:'Verificare applicabilità al destinatario'},
{id:'R6',claim:'Le FAQ ministeriali chiariscono interpretazioni e casi di applicazione.',reference:'FAQ Ministero 27 marzo 2026',source:'N03',use:'Checklist di aggiornamento',status:'Verificare quesito pertinente, non generalizzare'}
] as const;
export const scenarios=[
{id:'C1',sector:'Ristorazione',title:'Il pass scivoloso',story:'Durante il servizio compare liquido sul passaggio fra sala e cucina. Un cameriere cambia bruscamente direzione per evitare di scivolare. Nessun infortunio, il turno è intenso.',facts:['Liquido osservato nel passaggio','Deviazione improvvisa del cameriere','Assenza di infortunio segnalato'],unknown:['Procedura interna di segnalazione','Origine del liquido','Responsabile competente a gestire l’area'],question:'Qual è una risposta coerente con un approccio preventivo?',choices:['Cercare subito il collega colpevole','Segnalare e fare gestire il rischio secondo procedure e competenze','Ignorare perché non è successo nulla'],correct:1,why:'L’evento mancato è informazione per prevenire. La gestione del rischio va coordinata con chi ha ruolo e competenza. Riferimenti: artt. 15, 19, 20, 28 D.Lgs. 81/2008.'},
{id:'C2',sector:'Uffici',title:'Il cavo nella sala condivisa',story:'In una sala riunioni un cavo attraversa una zona di passaggio. Una collega inciampa leggermente senza cadere. La stanza resta occupata.',facts:['Cavo nel percorso','Quasi-inciampo','Presenza di altre persone'],unknown:['Come viene gestita la postazione','Chi è autorizzato a intervenire sui collegamenti','Quale procedura aziendale si applica'],question:'Quale decisione è più appropriata?',choices:['Segnalare e attivare il referente competente, senza manovre improvvisate','Smontare da soli i collegamenti elettrici','Scrivere soltanto una nota anonima online'],correct:0,why:'La segnalazione immediata e la soluzione da parte di chi è competente sono preferibili a interventi tecnici improvvisati. Riferimenti: artt. 19–20 D.Lgs. 81/2008.'},
{id:'C3',sector:'Logistica',title:'Il pallet fuori posizione',story:'Un pallet occupa parte della zona d’interferenza fra transito pedonale e mezzi. Un operatore a piedi cambia percorso all’ultimo momento.',facts:['Pallet fuori posizione','Interferenza con flussi di transito','Manovra evasiva del pedone'],unknown:['Piano dei percorsi interni','Presenza di mezzi in movimento','Autorizzazione a spostare il pallet'],question:'Qual è la risposta metodologicamente migliore?',choices:['Entrare subito nella corsia dei mezzi','Spostare il pallet senza conoscere le procedure','Segnalare e coinvolgere personale autorizzato, rispettando i percorsi sicuri'],correct:2,why:'Non inventare manovre o autorizzazioni. La gestione dipende da DVR, organizzazione e referenti. Riferimenti: artt. 15, 19, 20, 28 D.Lgs. 81/2008.'}
] as const;
export const questions=[
{topic:'Fabbisogno',q:'Quale informazione va raccolta prima di sviluppare le slide?',choices:['Il font preferito','Problema, destinatari, compito e vincoli','Il colore del quiz'],correct:1,why:'L’analisi dei fabbisogni definisce la funzione della formazione. Principio progettuale: Accordo Parte IV, punto 1.'},
{topic:'Ruoli',q:'Chi mantiene gli obblighi non delegabili del datore di lavoro?',choices:['Il datore di lavoro','Sempre il RSPP','Il docente del corso'],correct:0,why:'Art. 17 D.Lgs. 81/2008; non confondere il ruolo tecnico del RSPP con le responsabilità del datore.'},
{topic:'Normativa',q:'Una risposta AI indica una durata per un corso ma non riporta alcuna fonte. Che cosa fai?',choices:['La copi nel materiale','La consideri confermata se è plausibile','Controlli l’Accordo vigente, destinatario e modalità'],correct:2,why:'La bozza AI non dimostra conformità; occorre un riferimento ufficiale e una verifica specifica.'},
{topic:'Progettazione',q:'Quale obiettivo è osservabile?',choices:['Capire la sicurezza','Elencare tre informazioni necessarie per segnalare il pericolo','Conoscere un po’ il decreto'],correct:1,why:'Un verbo osservabile permette di progettare una prova coerente.'},
{topic:'Apprendimento',q:'Il quiz finale e la verifica dell’efficacia sul lavoro sono equivalenti?',choices:['No, misurano aspetti diversi','Sì','Solo in videoconferenza'],correct:0,why:'Accordo 59/CSR Parte IV, punti 6 e 7: la prova a fine corso e il trasferimento durante il lavoro sono distinti.'},
{topic:'Near miss',q:'Nessuno è caduto per un cavo in un passaggio. Che cosa insegni?',choices:['Non segnalare','Segnalare e attivare le procedure prima che accada un danno','Intervenire su ogni presa senza competenza'],correct:1,why:'La prevenzione valorizza anche i quasi-incidenti e richiede azioni coerenti con il proprio ruolo.'},
{topic:'E-learning',q:'Un workshop online di 25 minuti può automaticamente sostituire un corso obbligatorio?',choices:['Sì, con quattro domande','Sì, se ha video e slide','No, dipende dai requisiti specifici e non li soddisfa automaticamente'],correct:2,why:'Modalità, contenuti e soggetti formatori devono soddisfare il percorso normativo concreto.'},
{topic:'Valutazione',q:'Quale prova allinea meglio un obiettivo di segnalazione?',choices:['Simulare una segnalazione basata sui fatti','Contare le slide','Chiedere se la musica piace'],correct:0,why:'Si verifica la prestazione che l’obiettivo dichiara.'},
{topic:'Qualità',q:'Che cosa manca se il gruppo produce slide ma nessuna matrice delle fonti?',choices:['Un titolo creativo','La tracciabilità normativa delle affermazioni','Un colore accessorio'],correct:1,why:'La matrice distingue affermazioni giuridiche da interpretazioni e scelte didattiche.'},
{topic:'Efficacia',q:'Che cosa misuri a distanza di tempo?',choices:['Solo il gradimento','Solo la durata del webinar','Comportamenti osservabili e applicazione nel contesto'],correct:2,why:'Le condizioni di lavoro e le misure organizzative devono essere considerate nel riesame.'},
{topic:'Destinatari',q:'La stessa microlezione è adatta senza modifiche a tutte le mansioni?',choices:['No, bisogna contestualizzarla','Sì, sempre','Sì, basta cambiare il titolo'],correct:0,why:'Contesto, fabbisogno e rischi specifici incidono sul progetto.'},
{topic:'Conformità',q:'Quando si può chiamare obbligatorio e certificante questo laboratorio dimostrativo?',choices:['Se pubblicato su GitHub','Mai senza requisiti e percorso normativo verificati','Se vi partecipano dodici persone'],correct:1,why:'Il prototipo attuale non è una formazione normativamente validata e non rilascia attestati.'}
] as const;
export const rubric=[
{code:'K1',title:'Analisi del bisogno',full:'Il gap di competenze è distinto dai problemi tecnico-organizzativi e collegato ai destinatari.'},
{code:'K2',title:'Tracciabilità normativa',full:'Affermazioni normativamente rilevanti associate a fonte, sezione e data del controllo.'},
{code:'K3',title:'Allineamento didattico',full:'Obiettivi, attività e prove descrivono la stessa prestazione osservabile.'},
{code:'K4',title:'Qualità dell’esperienza',full:'Caso realistico, accessibilità, tempi, partecipazione e debrief ben strutturati.'},
{code:'K5',title:'Valutazione e transfer',full:'Rubrica, evidenze e follow-up non confondono apprendimento e risultato HSE.'}
] as const;
