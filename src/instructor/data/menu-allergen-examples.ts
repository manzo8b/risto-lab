/** RISTO-LAB | Ricette dimostrative, non dichiarazioni allergeni di un locale.
 * Contenuti indicativi per esercitazione: ingredienti e fornitori reali possono variare.
 */
export type DishExample = {id:string;title:string;ingredients:string;codes:number[];check:string};
export type DishGroup = {group:string;dishes:DishExample[]};
export const dishExamples:DishGroup[]=[
 {group:'Antipasti',dishes:[
  {id:'A01',title:'Bruschetta al pomodoro',ingredients:'Pane di frumento, pomodoro, basilico, olio',codes:[1],check:'Verificare miscela e ingredienti del pane.'},
  {id:'A02',title:'Supplì al telefono',ingredients:'Riso, pomodoro, mozzarella, uovo, pangrattato di frumento',codes:[1,3,7],check:'Panatura, mozzarella e olio di frittura: controllare prodotti e procedure.'},
  {id:'A03',title:'Fiori di zucca con mozzarella e alici',ingredients:'Fiori, mozzarella, alici, pastella di farina di frumento e acqua',codes:[1,4,7],check:'Qui la pastella illustrativa è senza uova: verificare la ricetta effettiva.'},
  {id:'A04',title:'Caprese',ingredients:'Mozzarella, pomodoro, basilico, olio',codes:[7],check:'Condimenti e preparati aggiuntivi possono cambiare il risultato.'},
  {id:'A05',title:'Panzanella',ingredients:'Pane di frumento, pomodori, cipolla, olio, aceto',codes:[1],check:'Controllare pane e aceto impiegati.'},
  {id:'A06',title:'Pecorino e miele',ingredients:'Pecorino, miele',codes:[7],check:'Se aggiungi crostini o composte cambia la scheda.'},
  {id:'A07',title:'Polpette di melanzane',ingredients:'Melanzane, uovo, pane di frumento, Pecorino',codes:[1,3,7],check:'Verificare panatura, formaggio ed eventuali salse.'}
 ]},
 {group:'Primi',dishes:[
  {id:'P01',title:'Spaghetti alla carbonara',ingredients:'Spaghetti di frumento, uova, Pecorino, guanciale, pepe',codes:[1,3,7],check:'Esempio guida: verificare pasta, formaggio e ingredienti del guanciale.'},
  {id:'P02',title:'Tonnarelli cacio e pepe',ingredients:'Pasta di frumento, Pecorino, pepe',codes:[1,7],check:'Tonnarelli freschi all’uovo? In quel caso verificare e aggiungere 3.'},
  {id:'P03',title:'Bucatini all’amatriciana',ingredients:'Pasta di frumento, guanciale, pomodoro, Pecorino',codes:[1,7],check:'Verificare pasta, guanciale e Pecorino impiegati.'},
  {id:'P04',title:'Pasta alla gricia',ingredients:'Pasta di frumento, guanciale, Pecorino, pepe',codes:[1,7],check:'Formati di pasta speciali possono contenere uova.'},
  {id:'P05',title:'Penne all’arrabbiata',ingredients:'Pasta di frumento, pomodoro, aglio, peperoncino',codes:[1],check:'Salse pronte o formaggi aggiunti cambiano gli allergeni.'},
  {id:'P06',title:'Spaghetti aglio, olio e peperoncino',ingredients:'Pasta di frumento, aglio, olio, peperoncino',codes:[1],check:'Controllare la pasta fornita e gli extra realmente serviti.'},
  {id:'P07',title:'Gnocchi alla romana',ingredients:'Semolino di frumento, latte, burro, Parmigiano, uovo',codes:[1,3,7],check:'In questo esempio si usa uovo; alcune ricette non lo prevedono.'},
  {id:'P08',title:'Lasagne alla bolognese',ingredients:'Sfoglia di frumento e uova, ragù con sedano, besciamella con latte e farina',codes:[1,3,7,9],check:'Controllare sfoglia, ragù, brodo e besciamella, anche se acquistati pronti.'},
  {id:'P09',title:'Trofie al pesto genovese',ingredients:'Trofie di frumento, basilico, pinoli, formaggio, aglio, olio',codes:[1,7],check:'I pinoli non sono una delle frutta a guscio nominate nell’allegato II; pesto con anacardi richiede anche 8.'},
  {id:'P10',title:'Risotto alla milanese',ingredients:'Riso, zafferano, burro, Parmigiano, brodo senza sedano',codes:[7],check:'Se il brodo contiene sedano occorre aggiungere 9; verificare anche preparati.'},
  {id:'P11',title:'Ravioli ricotta e spinaci',ingredients:'Pasta all’uovo di frumento, ricotta, spinaci, Parmigiano',codes:[1,3,7],check:'Controllare pasta fresca, ripieno e condimento.'}
 ]},
 {group:'Secondi',dishes:[
  {id:'S01',title:'Saltimbocca alla romana',ingredients:'Vitello, prosciutto crudo, salvia, burro',codes:[7],check:'Qui non è usata farina; se si infarina, verificare e aggiungere 1.'},
  {id:'S02',title:'Coda alla vaccinara',ingredients:'Coda bovina, sedano, pomodoro, cipolla',codes:[9],check:'Verificare brodo, soffritto e preparati per la salsa.'},
  {id:'S03',title:'Abbacchio a scottadito',ingredients:'Agnello, olio, rosmarino, sale',codes:[],check:'Nessuna delle 14 categorie nella ricetta ipotizzata: non equivale a “senza allergeni”.'},
  {id:'S04',title:'Trippa alla romana',ingredients:'Trippa, sedano, pomodoro, Pecorino',codes:[7,9],check:'Verificare brodo, soffritto e formaggio.'},
  {id:'S05',title:'Pollo alla cacciatora',ingredients:'Pollo, pomodoro, cipolla, sedano, olive',codes:[9],check:'Vino e preparati: verificare eventuali solfiti e soglie applicabili.'},
  {id:'S06',title:'Baccalà alla romana',ingredients:'Baccalà, farina di frumento, pomodoro, uvetta',codes:[1,4],check:'Controllare infarinatura, condimenti e trattamenti del pesce.'},
  {id:'S07',title:'Calamari fritti',ingredients:'Calamari, farina di frumento, olio',codes:[1,14],check:'Eventuali uova nella pastella e frittura condivisa richiedono verifica.'},
  {id:'S08',title:'Parmigiana di melanzane',ingredients:'Melanzane non infarinate, pomodoro, mozzarella, Parmigiano',codes:[7],check:'Panatura, uova o farina in varianti comportano ulteriori categorie.'}
 ]},
 {group:'Dolci',dishes:[
  {id:'D01',title:'Tiramisù classico',ingredients:'Savoiardi di frumento e uova, mascarpone, uova, caffè, cacao',codes:[1,3,7],check:'Verificare composizione dei savoiardi e creme industriali.'},
  {id:'D02',title:'Panna cotta',ingredients:'Panna, latte, zucchero, gelatina bovina',codes:[7],check:'Verificare la reale origine e composizione del gelificante.'},
  {id:'D03',title:'Crostata di visciole',ingredients:'Farina di frumento, burro, uova, confettura di visciole',codes:[1,3,7],check:'Controllare confettura e ingredienti della frolla.'},
  {id:'D04',title:'Torta ricotta e visciole',ingredients:'Farina di frumento, uova, ricotta, burro, visciole',codes:[1,3,7],check:'Controllare frolla, ripieno e decorazioni.'},
  {id:'D05',title:'Cantucci alle mandorle',ingredients:'Farina di frumento, uova, mandorle, zucchero',codes:[1,3,8],check:'Verificare ricetta o etichetta del prodotto acquistato.'}
 ]}
];
export const totalExampleDishes=dishExamples.reduce((n,group)=>n+group.dishes.length,0);
