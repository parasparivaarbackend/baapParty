import mongoose from 'mongoose';

// One document per ticket series, e.g. _id "YW-UP-LKO". `seq` is incremented
// atomically so two complaints can never receive the same number.
const CounterSchema = new mongoose.Schema({
  _id: { type: String },
  seq: { type: Number, default: 0 },
});

export default mongoose.models.Counter || mongoose.model('Counter', CounterSchema);
