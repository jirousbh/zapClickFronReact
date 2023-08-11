export const setSelectedUtm = (utm: any) => {
  return {
    type: "SET_SELECTED_SHORTENER",
    payload: utm,
  };
};
