const mongoose = require('mongoose');
const contactSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    }

});

contactSchema.statics.duplicateCheck = function(phone, email, callback) {
    if(!phone && !email) throw new Error('Phone and Email cannot be empty');
  try {
      const contact = this.findOne({
            $or: [
                { phone: phone },
                { email: email }
            ]
        }, callback);
        if(contact) return false;
        return true;
  } catch (error) {
      console.log(error);
      return false;
  }
};

const Contact = mongoose.model('Contact', contactSchema);
module.exports = Contact;