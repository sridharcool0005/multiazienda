const mongoose = require('mongoose');

const typeSchema = new mongoose.Schema({
  name: String
});

typeSchema.set('toJSON', {
  transform: function(doc, json) {
    json.id = json._id;
    delete json._id;
    delete json.__v;
    return json;
  }
});

module.exports = mongoose.model('Type', typeSchema);
