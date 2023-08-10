import { combineReducers } from "redux";

import { cartreducer } from "./reducer";
import { groupReducer } from "./groups";
import { campaignReducer } from "./campaign";
import { companiesReducer } from "./companies";

const rootred = combineReducers({
  cartreducer,
  campaignReducer,
  groupReducer,
  companiesReducer,
});

export default rootred;
