import { combineReducers } from "redux";
import { cartreducer } from "./reducer";
import { campaignReducer } from "./campaign";
import { groupReducer } from "./groups";

const rootred = combineReducers({
  cartreducer,
  campaignReducer,
  groupReducer,
});

export default rootred;
