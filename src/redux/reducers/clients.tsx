interface ClientState {
  clientsList: any[];
}

const INIT_STATE: ClientState = {
  clientsList: [],
};

export const clientsReducer = (state = INIT_STATE, action: any) => {
  console.log(state, action, '@@@ action')
  switch (action.type) {
    case "SET_CLIENTS":
      return {
        ...state,
        clientsList: action.payload,
      };
    default:
      return state;
  }
};
