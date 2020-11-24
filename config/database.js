const uri =
  "mongodb://Helm:Helm%402020@delivery-system-shard-00-00.fjlge.mongodb.net:27017,delivery-system-shard-00-01.fjlge.mongodb.net:27017,delivery-system-shard-00-02.fjlge.mongodb.net:27017/deliverysystem?ssl=true&replicaSet=atlas-uvbgrx-shard-0&authSource=admin&retryWrites=true&w=majority";

module.exports = {
  'secret': 'secret',
  'database': 'mongodb://127.0.0.1/deliverysystem'
  // 'database': uri
};