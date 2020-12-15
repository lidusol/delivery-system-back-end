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
},
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
);


const Item = module.exports = mongoose.model('Item', ItemSchema);

module.exports.setItem = function (itemData, callback) {
  itemData
    .save(callback);
}

module.exports.getItems = function (callback) {
  Item
    .find(callback)
    .exec();
}