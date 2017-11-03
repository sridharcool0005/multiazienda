const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true },
  passwordHash: {type: String, required: true }
});

userSchema
  .virtual('password')
  .set(setPassword);

userSchema
  .virtual('passwordConfirmation')
  .set(setPasswordConfirmation);

userSchema
  .path('passwordHash')
  .validate(validatePasswordHash);

userSchema
  .path('email')
  .validate(validateEmail);

userSchema.methods.validatePassword = validatePassword;

userSchema.set('toJSON', {
  transform: function(doc, json) {
    json.id = json._id;
    delete json._id;
    delete json.passwordHash;
    delete json.__v;
    return json;
  }
});

module.exports = mongoose.model('User', userSchema);

function setPassword(value) {
  this._password = value;
  this.passwordHash = bcrypt.hashSync(value, bcrypt.genSaltSync(8));
}

function setPasswordConfirmation(passwordConfirmation) {
  this._passwordConfirmation = passwordConfirmation;
}

function validatePasswordHash() {
  if(this.isNew) {
    if (!this._password) {
      return this.invalidate('password', 'A password is required.');
    }
    if (this._password.length < 2){
      this.invalidate('password', 'Password must be at least 2 characters.');
    }
    if(this._password !== this._passwordConfirmation) {
      return this.invalidate('passwordConfirmation', 'Passwords do not match.');
    }
  }
}

function validateEmail(email) {
  if(!validator.isEmail(email)) {
    return this.invalidate('email', 'Must be a valid email address!');
  }
}

function validatePassword(password) {
  return bcrypt.compareSync(password, this.passwordHash);
}
