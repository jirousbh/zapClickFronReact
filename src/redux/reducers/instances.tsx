interface CompaniesState {
  instancesList: any[];
}

const INIT_STATE: CompaniesState = {
  instancesList: [],
};

export const instancesReducer = (state = INIT_STATE, action: any) => {
  switch (action.type) {
    case "SET_INSTANCES_LIST":
      return {
        ...state,
        instancesList: action.payload,
      };

    default:
      return state;
  }
};
