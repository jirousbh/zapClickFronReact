interface CampaignState {
  selectedCampaignId: number | null;
  campaignsList: any[];
}

const INIT_STATE: CampaignState = {
  selectedCampaignId: null,
  campaignsList: [],
};

export const campaignReducer = (state = INIT_STATE, action: any) => {
  switch (action.type) {
    case "SET_SELECTED_CAMPAIGN_ID":
      return {
        ...state,
        selectedCampaignId: action.payload,
      };

    case "SET_CAMPAIGN_LIST":
      return {
        ...state,
        campaignsList: action.payload,
      };

    default:
      return state;
  }
};
