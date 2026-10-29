// Contenuti originali di RISTO-LAB Instructor, revisione editoriale 2026-10-29.
// Laboratorio informativo NON certificante, non sostituisce corsi obbligatori.
export const safetySources = {
  "normattiva": {
    "label": "D.Lgs. 9 aprile 2008, n. 81 — testo vigente, Normattiva",
    "url": "https://www.normattiva.it/eli/id/2008/04/30/008G0104/CONSOLIDATED"
  },
  "accordo": {
    "label": "Accordo Stato-Regioni 17 aprile 2025 — Ministero del Lavoro",
    "url": "https://lavoro.gov.it/temi-e-priorita/salute-e-sicurezza/focus/pagine/accordo-stato-regioni-del-17042025-materia-di-formazione"
  },
  "gu": {
    "label": "Accordo 59/CSR — Gazzetta Ufficiale n. 119 del 24 maggio 2025",
    "url": "https://www.gazzettaufficiale.it/atto/serie_generale/caricaDettaglioAtto/originario?atto.codiceRedazionale=25A03080&atto.dataPubblicazioneGazzetta=2025-05-24&elenco30giorni=true"
  },
  "inail": {
    "label": "INAIL — Valutare il rischio",
    "url": "https://www.inail.it/portale/prevenzione-e-sicurezza/it/come-fare-per/valutare-il-rischio.html"
  }
} as const;

export const safetyLessons = [
  {
    "slug": "fondamenti-decreto-81-2008",
    "number": 1,
    "title": "D.Lgs. 81/2008: struttura e principi",
    "duration": 15,
    "tag": "Norma di riferimento",
    "articles": "Artt. 1, 2, 15 e Titolo I",
    "intro": "Il cosiddetto Testo Unico tutela la salute e la sicurezza nei luoghi di lavoro. Questa lezione insegna a orientarsi nel testo, senza scambiare il riassunto per la norma.",
    "objectives": [
      "Distinguere la legge dalle procedure della singola azienda",
      "Capire la funzione delle definizioni e delle misure generali di tutela",
      "Trovare il testo vigente e riconoscere una versione datata"
    ],
    "sections": [
      {
        "title": "Perché esiste il decreto",
        "paragraphs": [
          "Il D.Lgs. 81/2008 coordina regole di tutela della salute e sicurezza sul lavoro. Non è un semplice manuale per addetti alla sicurezza: coinvolge l’organizzazione aziendale, le responsabilità dei soggetti, la valutazione dei rischi, l’informazione e la formazione. Il suo campo di applicazione e le eventuali discipline specifiche si verificano nelle disposizioni pertinenti.",
          "Quando si legge una norma bisogna distinguere le definizioni (articolo 2), le misure generali di tutela (articolo 15), gli obblighi attribuiti a figure differenti e le regole riferite a rischi particolari. Individuare l’articolo è più affidabile che citare soltanto «lo dice la 81»."
        ]
      },
      {
        "title": "Come orientarsi tra fonti differenti",
        "paragraphs": [
          "La legge contiene obblighi e principi generali. Il DVR descrive la valutazione dei rischi della specifica organizzazione. Le procedure aziendali disciplinano comportamenti operativi coerenti con le misure adottate. L’Accordo Stato-Regioni del 2025 si concentra invece su aspetti della formazione individuati dalla legge: sono livelli collegati, non equivalenti.",
          "La consultazione deve sempre partire dalla versione aggiornata. Il link a Normattiva permette di leggere l’atto e controllarne la vigenza; un vecchio PDF può essere utile come materiale storico, ma non prova l’aggiornamento di una prescrizione."
        ]
      },
      {
        "title": "Il principio di prevenzione",
        "paragraphs": [
          "L’articolo 15 indica misure generali di tutela: nella pratica significa riconoscere i pericoli, agire sull’organizzazione, scegliere misure adeguate, informare e formare, verificare nel tempo. Non basta distribuire una lista di regole: occorre tradurle in azioni effettive.",
          "Un esempio: in un deposito si accumulano scatole davanti a un’uscita. La soluzione non è «fare più attenzione» soltanto; occorre gestire l’ostacolo secondo procedure e competenze, individuare perché si ripete e verificare che il passaggio rimanga libero."
        ]
      }
    ],
    "case": {
      "title": "Un cartello trovato online",
      "situation": "Un collega stampa una scheda sulla sicurezza scaricata anni fa, dicendo che è la versione più recente del decreto.",
      "prompt": "Quali verifiche fai prima di usarla in una lezione?",
      "solution": "Individua articolo e data, apri Normattiva, controlla la versione vigente e distingui l’eventuale scheda divulgativa dalla fonte ufficiale. In caso di dubbio coinvolgi il referente competente."
    },
    "vocab": [
      [
        "Norma",
        "Disposizione giuridica da leggere nel suo contesto."
      ],
      [
        "Vigenza",
        "Periodo e versione in cui il testo è applicabile."
      ],
      [
        "Prevenzione",
        "Insieme di misure che evita o riduce i rischi."
      ]
    ],
    "quiz": [
      {
        "q": "Qual è la fonte prioritaria per consultare il testo vigente del decreto?",
        "choices": [
          "Un post senza data",
          "Il testo consolidato su Normattiva",
          "La prima slide trovata online"
        ],
        "correct": 1,
        "why": "Le sintesi sono utili per imparare, ma la fonte normativa deve essere consultata nella versione vigente."
      },
      {
        "q": "Il DVR e il D.Lgs. 81/2008 sono lo stesso documento?",
        "choices": [
          "No, il decreto disciplina obblighi; il DVR riguarda la valutazione dell’organizzazione",
          "Sì, sono sinonimi",
          "Il DVR sostituisce sempre la legge"
        ],
        "correct": 0,
        "why": "La valutazione dei rischi si svolge nel quadro delle disposizioni della legge, non al loro posto."
      },
      {
        "q": "Quale comportamento mostra un approccio preventivo?",
        "choices": [
          "Ignorare un ostacolo finché non provoca un infortunio",
          "Limitarsi a ricordare di stare attenti",
          "Segnalare l’ostacolo, far attuare misure appropriate e verificarne l’efficacia"
        ],
        "correct": 2,
        "why": "L’approccio preventivo opera prima del danno e prevede misure adeguate e follow-up."
      }
    ]
  },
  {
    "slug": "ruoli-e-responsabilita",
    "number": 2,
    "title": "Chi fa cosa: ruoli e responsabilità",
    "duration": 20,
    "tag": "Sistema di prevenzione",
    "articles": "Artt. 2, 17–20, 31–33, 47",
    "intro": "La sicurezza è un sistema di ruoli diversi. Impariamo chi organizza, chi vigila, chi supporta tecnicamente e chi rappresenta i lavoratori.",
    "objectives": [
      "Riconoscere cinque figure essenziali e le differenze tra loro",
      "Non confondere consulenza tecnica, vigilanza e rappresentanza",
      "Saper impostare una segnalazione concreta senza attribuire obblighi impropri"
    ],
    "sections": [
      {
        "title": "Datore di lavoro e obblighi non delegabili",
        "paragraphs": [
          "Il datore di lavoro ha responsabilità organizzative e obblighi specifici previsti dal decreto. L’articolo 17 individua due obblighi non delegabili: la valutazione di tutti i rischi con elaborazione del relativo documento e la designazione del responsabile del servizio di prevenzione e protezione.",
          "Il fatto che un esperto esterno contribuisca a valutazioni, formazione o procedure non trasferisce automaticamente le responsabilità attribuite dalla legge. Prima di dire «se ne occupa il consulente» va compreso chi decide, chi collabora e chi deve verificare."
        ]
      },
      {
        "title": "Preposto, lavoratore, RSPP e RLS",
        "paragraphs": [
          "Il preposto sovrintende all’attività lavorativa e vigila nei limiti dell’incarico e delle attribuzioni; gli articoli 2 e 19 ne descrivono il ruolo e gli obblighi. Il lavoratore, ai sensi dell’articolo 20, si prende cura della propria sicurezza e di quella delle altre persone coinvolte, segue le istruzioni ricevute e segnala condizioni di pericolo conosciute.",
          "Il RSPP dirige il servizio di prevenzione e protezione sotto il profilo tecnico-organizzativo e collabora secondo le attribuzioni del servizio (articoli 31–33). L’RLS rappresenta i lavoratori sui temi di salute e sicurezza (articolo 47 e seguenti). I due acronimi non identificano la stessa figura."
        ]
      },
      {
        "title": "La segnalazione come abilità professionale",
        "paragraphs": [
          "Segnalare non significa accusare: significa fornire fatti rilevanti, luogo, momento e condizione riscontrata, attraverso i canali aziendali previsti. L’eventuale urgenza o pericolo grave richiede di seguire le istruzioni di emergenza e di coinvolgere chi è competente.",
          "Un briefing efficace separa sempre osservazione («un cavo attraversa il passaggio») da ipotesi («forse qualcuno lo ha spostato») e decisione («serve la verifica del responsabile competente»). Non improvvisare interventi tecnici fuori dal proprio ruolo."
        ]
      }
    ],
    "case": {
      "title": "Telefonata tra due reparti",
      "situation": "Giulia chiama Arianna: «È caduta una scatola dal ripiano. Lo diciamo all’RLS così sistema lui il magazzino?»",
      "prompt": "Chi può ricevere una segnalazione, chi deve valutare un intervento e perché l’RLS non è un manutentore?",
      "solution": "La segnalazione segue le procedure interne e coinvolge il preposto o altro referente previsto. L’RLS rappresenta i lavoratori e può essere coinvolto per le sue funzioni; non si presume che effettui interventi tecnici o sostituisca i responsabili aziendali."
    },
    "vocab": [
      [
        "Preposto",
        "Figura di sovrintendenza e vigilanza, nei limiti delle attribuzioni."
      ],
      [
        "RSPP",
        "Responsabile del Servizio di prevenzione e protezione."
      ],
      [
        "RLS",
        "Rappresentante dei lavoratori per la sicurezza."
      ]
    ],
    "quiz": [
      {
        "q": "Quale obbligo rientra tra quelli non delegabili del datore di lavoro?",
        "choices": [
          "La valutazione dei rischi con elaborazione del documento",
          "La compilazione di ogni modulo di presenza",
          "L’esecuzione di ogni manutenzione"
        ],
        "correct": 0,
        "why": "L’articolo 17 elenca gli obblighi non delegabili, inclusa la valutazione dei rischi."
      },
      {
        "q": "Il RSPP coincide con l’RLS?",
        "choices": [
          "Sì, sono sigle equivalenti",
          "No, il primo riguarda il servizio di prevenzione e protezione, il secondo rappresenta i lavoratori",
          "Dipende dal numero di dipendenti"
        ],
        "correct": 1,
        "why": "Funzioni e basi normative sono differenti. Una stessa persona non è automaticamente titolare di entrambe."
      },
      {
        "q": "Che cosa rende utile una segnalazione?",
        "choices": [
          "Una spiegazione basata su voci",
          "Solo il nome del presunto colpevole",
          "Fatti osservabili, luogo e canale di comunicazione appropriato"
        ],
        "correct": 2,
        "why": "La segnalazione utile permette di gestire il rischio senza speculazioni."
      }
    ]
  },
  {
    "slug": "pericoli-rischi-e-dvr",
    "number": 3,
    "title": "Pericolo, rischio, DVR e prevenzione",
    "duration": 20,
    "tag": "Analisi dei rischi",
    "articles": "Artt. 2, 15, 17, 28–29",
    "intro": "Riconoscere un pericolo non equivale a valutare un rischio. Vediamo come passare dall’osservazione alle misure e perché il DVR non è una checklist generica.",
    "objectives": [
      "Distinguere pericolo, rischio e misura preventiva",
      "Descrivere la finalità generale del DVR",
      "Analizzare un caso senza inventare punteggi o prescrizioni"
    ],
    "sections": [
      {
        "title": "Pericolo e rischio non sono sinonimi",
        "paragraphs": [
          "Un pericolo è una proprietà o situazione che ha il potenziale di provocare un danno. Il rischio riguarda la possibilità che quel danno si verifichi nelle condizioni concrete di esposizione e con determinate conseguenze. Per questo lo stesso pericolo può richiedere valutazioni differenti in contesti organizzativi diversi.",
          "Durante la formazione possiamo riconoscere un pavimento bagnato come possibile fonte di caduta; non possiamo concludere, senza dati e competenze, che l’azienda abbia un determinato livello di rischio o che una misura specifica sia obbligatoriamente sufficiente."
        ]
      },
      {
        "title": "Che cosa fa la valutazione dei rischi",
        "paragraphs": [
          "L’articolo 28 riguarda l’oggetto della valutazione dei rischi e il relativo documento. L’articolo 29 disciplina le modalità di effettuazione. La valutazione deve considerare il contesto dell’organizzazione e consentire di individuare misure di prevenzione e protezione e un programma per il miglioramento della sicurezza.",
          "Il DVR non è una dispensa da copiare: deriva dalla valutazione effettiva dell’organizzazione, con ruoli e consultazioni previsti dalla normativa. L’articolo 17 riconduce la valutazione dei rischi a un obbligo non delegabile del datore di lavoro."
        ]
      },
      {
        "title": "Prevenzione, protezione e verifica",
        "paragraphs": [
          "In un esercizio di aula è utile scomporre una situazione in quattro passaggi: fatti osservati; informazioni mancanti; misure da far valutare a chi è competente; verifica successiva. Questo allenamento costruisce un linguaggio utile e non sostituisce il processo aziendale di valutazione.",
          "Un quasi-incidente o near miss può essere un segnale da prendere sul serio anche quando nessuno si è fatto male. L’analisi di cause e misure compete ai soggetti appropriati e deve seguire le procedure aziendali."
        ]
      }
    ],
    "case": {
      "title": "Il corridoio durante la consegna",
      "situation": "Durante il servizio un carrello blocca parzialmente una via di passaggio. Un collega cambia percorso all’ultimo momento senza ferirsi.",
      "prompt": "Separa pericolo, osservazioni, dati mancanti e azioni che richiedono valutazione.",
      "solution": "Pericolo: intralcio del passaggio. Fatti: carrello presente e deviazione del collega. Dati mancanti: layout, procedure, frequenza, altre interferenze. Azione: segnalare e gestire la situazione con il referente secondo le procedure, verificando le misure approvate."
    },
    "vocab": [
      [
        "Pericolo",
        "Potenziale di provocare un danno."
      ],
      [
        "Rischio",
        "Possibilità di danno e conseguenze nel contesto."
      ],
      [
        "DVR",
        "Documento che riporta la valutazione dei rischi dell’organizzazione."
      ]
    ],
    "quiz": [
      {
        "q": "Quale affermazione è corretta?",
        "choices": [
          "Pericolo e rischio significano sempre la stessa cosa",
          "Il rischio dipende anche dalle condizioni reali di esposizione",
          "Se non c’è stato un infortunio non esiste alcun rischio"
        ],
        "correct": 1,
        "why": "La valutazione considera la concreta situazione lavorativa; una semplice etichetta non è sufficiente."
      },
      {
        "q": "Il DVR può essere sostituito da una checklist generica scaricata online?",
        "choices": [
          "No: è legato alla valutazione dell’organizzazione",
          "Sì, se è stampata",
          "Sì, se contiene molte pagine"
        ],
        "correct": 0,
        "why": "La documentazione della valutazione deve riflettere rischi e misure propri dell’attività."
      },
      {
        "q": "Che cosa fare dopo un quasi-incidente?",
        "choices": [
          "Ignorarlo perché non ci sono feriti",
          "Diffondere ipotesi sui colpevoli",
          "Segnalare secondo le procedure e promuovere la valutazione delle misure"
        ],
        "correct": 2,
        "why": "Un near miss è un’occasione per prevenire ulteriori eventi."
      }
    ]
  },
  {
    "slug": "informazione-formazione-addestramento",
    "number": 4,
    "title": "Informazione, formazione e addestramento",
    "duration": 20,
    "tag": "Apprendimento sul lavoro",
    "articles": "Artt. 36–37",
    "intro": "Ricevere un avviso, partecipare a una lezione e imparare una manovra pratica sono esperienze differenti. La legge distingue questi livelli di apprendimento.",
    "objectives": [
      "Distinguere informazione, formazione e addestramento",
      "Collegare l’apprendimento a compiti e rischi concreti",
      "Comprendere perché attestato e competenza osservata non coincidono automaticamente"
    ],
    "sections": [
      {
        "title": "Articolo 36: informazione",
        "paragraphs": [
          "L’articolo 36 disciplina gli obblighi di informazione dei lavoratori. In termini didattici l’informazione serve a conoscere elementi rilevanti su rischi, misure e procedure. Una comunicazione può essere necessaria, ma non equivale in ogni caso a un percorso di formazione.",
          "Una buona informazione usa parole comprensibili e canali idonei: per esempio spiegare dove leggere una procedura di emergenza e a chi rivolgersi. Occorre accertare che il messaggio sia accessibile e pertinente ai destinatari."
        ]
      },
      {
        "title": "Articolo 37: formazione e addestramento",
        "paragraphs": [
          "La formazione prevista dall’articolo 37 è un percorso mirato all’acquisizione di conoscenze e competenze relative alla salute e sicurezza. L’addestramento è una dimensione pratica distinta, applicabile quando richiesta: si verifica attraverso l’esercizio sul compito e sotto le condizioni previste dalle disposizioni pertinenti.",
          "La durata e le modalità per le diverse figure non si deducono da questa breve lezione; si controllano nel percorso specifico individuato dall’Accordo del 17 aprile 2025 e dalle altre norme applicabili. Non tutti i soggetti o rischi seguono una medesima regola."
        ]
      },
      {
        "title": "Come si dimostra l’apprendimento",
        "paragraphs": [
          "Una prova di aula può simulare un passaggio di consegne: il partecipante identifica un pericolo, segnala l’osservazione e descrive il passaggio successivo. Questa attività produce elementi osservabili, ma non si sostituisce alle prove o ai registri richiesti per i percorsi obbligatori.",
          "Il docente dovrebbe chiedere non soltanto «hai capito?», ma «che cosa faresti e perché?». Una micro-esercitazione commentata rende evidenti dubbi e interpretazioni errate; la conformità legale richiede comunque le condizioni previste dalla normativa."
        ]
      }
    ],
    "case": {
      "title": "La nuova macchina in cucina",
      "situation": "Un nuovo addetto riceve via email una scheda di una macchina e un messaggio: «L’hai letta, quindi puoi usarla».",
      "prompt": "Quali distinzioni faresti fra informazione, formazione e addestramento?",
      "solution": "La scheda può essere una fonte informativa ma non prova, da sola, che siano stati soddisfatti gli obblighi di formazione e, dove richiesto, addestramento pratico. Il responsabile deve verificare requisiti e procedure applicabili prima dell’impiego."
    },
    "vocab": [
      [
        "Informazione",
        "Comunicazione di elementi rilevanti su rischi e misure."
      ],
      [
        "Formazione",
        "Percorso di acquisizione di competenze e conoscenze."
      ],
      [
        "Addestramento",
        "Attività pratica per apprendere comportamenti e uso sicuro, quando previsto."
      ]
    ],
    "quiz": [
      {
        "q": "Una comunicazione informativa sostituisce sempre la formazione obbligatoria?",
        "choices": [
          "Sì",
          "No",
          "Solo se inviata via email"
        ],
        "correct": 1,
        "why": "Articoli 36 e 37 disciplinano obblighi e funzioni differenti."
      },
      {
        "q": "Che cosa caratterizza soprattutto l’addestramento?",
        "choices": [
          "La partecipazione a una chat",
          "Una locandina sulla parete",
          "La componente pratica prevista per specifiche attività"
        ],
        "correct": 2,
        "why": "L’addestramento si collega alla prova pratica, dove richiesto dalla disciplina applicabile."
      },
      {
        "q": "Una prova svolta in questo laboratorio rilascia crediti per la formazione obbligatoria?",
        "choices": [
          "No, è un’esercitazione integrativa non certificante",
          "Sì, sempre",
          "Dipende da quante risposte si indovinano"
        ],
        "correct": 0,
        "why": "I crediti e le attestazioni di corsi obbligatori richiedono requisiti, organizzazione e verifiche formalmente conformi."
      }
    ]
  },
  {
    "slug": "accordo-stato-regioni-2025",
    "number": 5,
    "title": "Accordo Stato-Regioni 2025: come progettare i corsi",
    "duration": 25,
    "tag": "Progettazione e verifica",
    "articles": "Accordo 59/CSR, Allegato A; art. 37 D.Lgs. 81/2008",
    "intro": "L’Accordo del 17 aprile 2025 disciplina durata e contenuti minimi di specifici percorsi formativi, con regole su organizzazione ed erogazione. Impariamo a porre le domande giuste.",
    "objectives": [
      "Individuare l’Accordo 59/CSR e la sua relazione con l’articolo 37",
      "Distinguere un corso obbligatorio da un laboratorio integrativo",
      "Elaborare una checklist di verifica prima di proporre una formazione aziendale"
    ],
    "sections": [
      {
        "title": "Che cos’è l’Accordo 59/CSR",
        "paragraphs": [
          "Il 17 aprile 2025 la Conferenza Stato-Regioni ha approvato l’Accordo 59/CSR, pubblicato nella Gazzetta Ufficiale n. 119 del 24 maggio 2025. È finalizzato a individuare durata e contenuti minimi dei percorsi formativi in materia di salute e sicurezza previsti dal D.Lgs. 81/2008, in attuazione dell’articolo 37, comma 2.",
          "L’Accordo va letto insieme alla legge e alle altre regole applicabili: non significa che tutte le figure abbiano lo stesso corso, che ogni modalità a distanza sia sempre ammessa o che una videolezione senza adeguata organizzazione possa bastare."
        ]
      },
      {
        "title": "Da un titolo di corso a un progetto formativo",
        "paragraphs": [
          "Prima di erogare un percorso obbligatorio occorre identificare esattamente i destinatari e la tipologia di formazione. Si verifica chi può operare come soggetto formatore, quali requisiti devono avere i docenti, quali contenuti e durate minime si applicano e quali modalità sono consentite. La verifica va fatta per il percorso specifico, non per analogia.",
          "La progettazione include inoltre elementi organizzativi, criteri per la frequenza e per le prove, tracciabilità della documentazione e modalità di verifica dell’apprendimento e dell’efficacia, secondo quanto previsto dalla disciplina pertinente. Eventuali disposizioni transitorie o chiarimenti ministeriali devono essere controllati prima dell’applicazione."
        ]
      },
      {
        "title": "Un laboratorio complementare resta tale",
        "paragraphs": [
          "Un workshop che presenta la sicurezza con casi, giochi, quiz e slide può migliorare attenzione e comprensione. Tuttavia, se non soddisfa le condizioni previste per un corso obbligatorio, non va pubblicizzato come formazione «valida ai sensi dell’art. 37» e non deve rilasciare attestazioni che suggeriscano una conformità non dimostrata.",
          "RISTO-LAB Instructor ospita un laboratorio aperto e non certificante. Per eventuali proposte aziendali di formazione obbligatoria occorrono verifica specialistica delle disposizioni vigenti e soggetti formatori/docenti aventi i requisiti applicabili."
        ]
      }
    ],
    "case": {
      "title": "Il corso acquistato in fretta",
      "situation": "Un’azienda chiede: «Ci servono 3 ore di corso online uguali per tutti e un attestato. Potete farlo domani?»",
      "prompt": "Prepara cinque domande da fare prima di formulare una risposta o un preventivo.",
      "solution": "1) Quale figura e quale percorso devono essere formati? 2) Quali rischi e mansioni sono coinvolti? 3) Chi è il soggetto formatore e quali requisiti hanno i docenti? 4) Quali modalità e durate sono previste per quel percorso? 5) Quali registrazioni, verifiche e attestazioni sono richieste? Verificare sul testo e con professionista HSE."
    },
    "vocab": [
      [
        "59/CSR",
        "Numero di repertorio dell’Accordo Stato-Regioni del 17 aprile 2025."
      ],
      [
        "Soggetto formatore",
        "Soggetto che organizza il percorso nei limiti e con i requisiti della disciplina applicabile."
      ],
      [
        "Verifica dell’apprendimento",
        "Accertamento dei risultati del percorso secondo criteri previsti."
      ]
    ],
    "quiz": [
      {
        "q": "Quando è stato approvato l’Accordo 59/CSR?",
        "choices": [
          "17 aprile 2025",
          "9 aprile 2008",
          "24 maggio 2026"
        ],
        "correct": 0,
        "why": "L’Accordo è del 17 aprile 2025 ed è stato pubblicato in G.U. il 24 maggio 2025."
      },
      {
        "q": "Qual è il primo passo per progettare un corso obbligatorio?",
        "choices": [
          "Scegliere il colore delle slide",
          "Individuare destinatari, percorso e requisiti normativi",
          "Stampare subito gli attestati"
        ],
        "correct": 1,
        "why": "Ogni percorso deve essere verificato rispetto alla propria disciplina, non a uno schema indistinto."
      },
      {
        "q": "Un workshop pubblico da 25 minuti come questa lezione soddisfa automaticamente gli obblighi di formazione?",
        "choices": [
          "Sì, se il quiz è difficile",
          "Sì, se c’è un link al Ministero",
          "No: è una risorsa di studio complementare non certificante"
        ],
        "correct": 2,
        "why": "Collegamenti e attività didattiche non bastano a dimostrare la conformità di un percorso obbligatorio."
      }
    ]
  }
] as const;

export type SafetyLesson = (typeof safetyLessons)[number];
