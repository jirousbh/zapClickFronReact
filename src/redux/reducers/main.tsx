import { combineReducers } from "redux";

import { cartreducer } from "./reducer";
import { groupReducer } from "./groups";
import { campaignReducer } from "./campaign";
import { companiesReducer } from "./companies";
import { instancesReducer } from "./instances";
import { shortenersReducer } from "./shorteners";

const rootred = combineReducers({
  cartreducer,
  campaignReducer,
  groupReducer,
  companiesReducer,
  instancesReducer,
  shortenersReducer,
});

export default rootred;
