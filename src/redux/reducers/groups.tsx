interface CampaignState {
  selectedGroup: number | null;
}

const INIT_STATE: CampaignState = {
  selectedGroup: null,
};

export const groupReducer = (state = INIT_STATE, action: any) => {
  switch (action.type) {
    case "SET_SELECTED_GROUP":
      return {
        ...state,
        selectedGroup: action.payload,
      };

    default:
      return state;
  }
};
