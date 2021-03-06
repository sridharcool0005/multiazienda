const mongoose = require('mongoose');

const zoneSchema = new mongoose.Schema({
  name: String
});

zoneSchema.set('toJSON', {
  transform: function(doc, json) {
    json.id = json._id;
    delete json._id;
    delete json.__v;
    return json;
  }
});

module.exports = mongoose.model('Zone', zoneSchema);
