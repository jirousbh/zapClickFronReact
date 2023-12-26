interface CampaignState {
  selectedGroup: number | null;
  registerMultipleGroups?: boolean;
}

const INIT_STATE: CampaignState = {
  selectedGroup: null,
  registerMultipleGroups: false,
};

export const groupReducer = (state = INIT_STATE, action: any) => {
  console.log(action);

  switch (action.type) {
    case "SET_SELECTED_GROUP":
      return {
        ...state,
        selectedGroup: action.payload.selectedGroup,
        registerMultipleGroups: action.payload.registerMultipleGroups || false,
      };

    default:
      return state;
  }
};
