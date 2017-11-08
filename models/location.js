const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
  locationId: { type: String, unique: true },
  addressHTML: String,
  addressFormatted: String,
  lat: Number,
  lng: Number,
  type: String
});

locationSchema.set('toJSON', {
  transform: function(doc, json) {
    json.id = json._id;
    delete json._id;
    delete json.__v;
    return json;
  }
});

module.exports = mongoose.model('Location', locationSchema);
