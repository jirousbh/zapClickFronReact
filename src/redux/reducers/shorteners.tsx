interface CampaignState {
  selectedShortener: number | null;
}

const INIT_STATE: CampaignState = {
  selectedShortener: null,
};

export const shortenersReducer = (state = INIT_STATE, action: any) => {
  switch (action.type) {
    case "SET_SELECTED_GROUP":
      return {
        ...state,
        selectedShortener: action.payload,
      };

    default:
      return state;
  }
};
