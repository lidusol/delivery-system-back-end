const mongoose = require('mongoose');

const ItemSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  weightRange: {
    type: String,
    required: true
  },
  quantity: {
    type: Number,
    default: 1
  }
});

const Item = module.exports = mongoose.model('Item', ItemSchema);

module.exports.setItem = function (itemData, callback) {
  itemData
    .save(callback)
    .then(result => result)
    .catch(err => console.log(err));
}

module.exports.getItems = function (callback) {
  Item
    .find(callback)
    .exec()
    .then(result => result)
    .catch(err => console.log(err));
}