export const setCompaniesList = (list: any[]) => {
  return {
    type: "SET_COMPANIES_LIST",
    payload: list,
  };
};

export const setSelectedCompanyId = (id: any) => {
  return {
    type: "SET_SELECTED_COMPANY_ID",
    payload: id,
  };
};
