const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema(
  {
    body: String,
    createdBy: { type: mongoose.Schema.ObjectId, ref: 'User' }
  },
  {
    timestamps: true
  }
);

const barSchema = new mongoose.Schema(
  {
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
    metriQuadrati: String,
    magazzino: {
      presente: String,
      internoEsterno: String
    },
    richiestaTotale: {
      contanti: Number,
      dilazioni: Number
    },
    incassoGiornaliero: {
      minimo: Number,
      massimo: Number
    },
    incassoAnnuale: {
      minimo: Number,
      massimo: Number
    },
    canoneLocazione: {
      iva: String,
      scadenza: String,
      depCauzionale: String,
      speseCondominio: String
    },
    tassaSuoloPubb: String,
    torrefazione: {
      torrefazione: String,
      consumoMensile: Number
    },
    ristrutturato: {
      ristrutturato: String, //this was a number
      vero: String,
      impiantiCertificati: String
    },
    aggi: {
      aggiTotali: Number,
      tabacco: Number,
      lotto: Number,
      sisal: Number,
      giochi: Number,
      varie: Number
    },
    slot: {
      slot: String, //this was a number
      ditta: String,
      percentuale: Number
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
    postiInterni: Number,
    postiEsterni: {
      postiEsterni: Number,
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
    comments: [commentSchema]
  },
  {
    timestamps: true
  }
);

barSchema.set('toJSON', {
  transform: function(doc, json) {
    json.id = json._id;
    delete json._id;
    delete json.__v;
    return json;
  }
});

module.exports = mongoose.model('Bar', barSchema);
