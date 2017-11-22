const mongoose = require('mongoose');

const commentActivitySchema = new mongoose.Schema(
  {
    body: String,
    createdBy: { type: mongoose.Schema.ObjectId, ref: 'User' }
  },
  {
    timestamps: true
  }
);

const activitySchema = new mongoose.Schema({
  data: Date,
  bar: { type: mongoose.Schema.ObjectId, ref: 'Bar' },
  comments: [commentActivitySchema]
});

const commentClientSchema = new mongoose.Schema(
  {
    body: String,
    createdBy: { type: mongoose.Schema.ObjectId, ref: 'User' }
  },
  {
    timestamps: true
  }
);

const clientSchema = new mongoose.Schema(
  {
    nome: String,
    cognome: String,
    archiviato: Boolean,
    indirizzo: { type: mongoose.Schema.ObjectId, ref: 'Location' },
    telefono: String,
    email: String,
    sab: String,
    tipologiaAttivita: [{ type: mongoose.Schema.ObjectId, ref: 'Type' }],
    zona: [{ type: mongoose.Schema.ObjectId, ref: 'Zone' }],
    importoInvestimento: {
      anticipo: Number,
      totale: Number
    },
    esperienza: String,
    note: String,
    attivitaViste: [activitySchema],
    comments: [commentClientSchema]
  },
  {
    timestamps: true
  }
);

clientSchema.set('toJSON', {
  transform: function(doc, json) {
    json.id = json._id;
    delete json._id;
    delete json.__v;
    return json;
  }
});

module.exports = mongoose.model('Client', clientSchema);
