const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  body: String,
  createdBy: { type: mongoose.Schema.ObjectId, ref: 'User' }
}, {
  timestamps: true
});

const barSchema = new mongoose.Schema({
  codiceAttivita: String,
  archiviato: Boolean,
  tipologiaAttivita: { type: mongoose.Schema.ObjectId, ref: 'Type' },
  zona: { type: mongoose.Schema.ObjectId, ref: 'Zone' },
  locationId: String,
  denominazioneAttivita: String,
  fotoAttivita: String,
  titolareAttivita: String,
  indirizzo: { type: mongoose.Schema.ObjectId, ref: 'Location' },
  referente: String,
  metriQuadrati: String, //this was a number
  magazzino: {
    presente: String,
    internoEsterno: String
  },
  richiestaTotale: {
    contanti: String,
    dilazioni: String
  },
  incassoGiornaliero: {
    minimo: String, //this was a number
    massimo: String //this was a number
  },
  incassoAnnuale: {
    minimo: String, //this was a number
    massimo: String //this was a number
  },
  canoneLocazione: {
    iva: String,
    scadenza: String, //this was a number
    depCauzionale: String, //this was a number
    speseCondominio: String //this was a number
  },
  tassaSuoloPubb: String,
  torrefazione: {
    torrefazione: String,
    consumoMensile: String //this was a number
  },
  ristrutturato: {
    ristrutturato: String, //this was a number
    vero: String,
    impiantiCertificati: String
  },
  aggi: {
    aggiTotali: String, //this was a number
    tabacco: String, //this was a number
    lotto: String, //this was a number
    sisal: String, //this was a number
    giochi: String, //this was a number
    varie: String //this was a number
  },
  slot: {
    slot: String, //this was a number
    ditta: String,
    percentuale: String
  },
  commercialista: {
    nome: String,
    telefono: String,
    email: String
  },
  affittoAzienda: {
    affittoAzienda: String,
    importo: String,
    garanzie: String
  },
  orarioApertura: String,
  giornoRiposo: String,
  postiInterni: String,
  postiEsterni: {
    postiEsterni: String,
    areaPrivata: String
  },
  addetti: {
    numeroTitolari: String, //this was a number
    dipendenti: String
  },
  cannaFumaria: String,
  riservatoDominio: String, //this was a number
  attrezzatureComodato: String,
  clienti: [{ type: mongoose.Schema.ObjectId, ref: 'Client' }],
  comments: [ commentSchema ]
}, {
  timestamps: true
});

barSchema.set('toJSON', {
  transform: function(doc, json) {
    json.id = json._id;
    delete json._id;
    delete json.__v;
    return json;
  }
});

module.exports = mongoose.model('Bar', barSchema);
