import { combineReducers } from "redux";

import { cartreducer } from "./reducer";
import { groupReducer } from "./groups";
import { campaignReducer } from "./campaign";
import { companiesReducer } from "./companies";
import { instancesReducer } from "./instances";

const rootred = combineReducers({
  cartreducer,
  campaignReducer,
  groupReducer,
  companiesReducer,
  instancesReducer,
});

export default rootred;
