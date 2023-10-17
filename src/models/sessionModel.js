import mongoose from "mongoose";

const sessionSchema = mongoose.Schema({
  uuid: {
    type: String,
    default: undefined,
  },
  wardenID: {
    type: String,
    required: true,
  },
  wardenName: {
    type: String,
  },
  clientName: {
    type: String,
  },
  datetime: {
    type: Date,
    required: true,
  },
  mode: {
    type: String,
  },
});

const Session = mongoose.model("Session", sessionSchema);

export default Session;
