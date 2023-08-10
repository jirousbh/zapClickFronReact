export const setCampaignsList = (list: any[]) => {
  return {
    type: "SET_CAMPAIGN_LIST",
    payload: list,
  };
};

export const setSelectedCampaignId = (id: any) => {
  return {
    type: "SET_SELECTED_CAMPAIGN_ID",
    payload: id,
  };
};
