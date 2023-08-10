interface CompaniesState {
  selectedCompanyId: number | null;
  companiesList: any[];
}

const INIT_STATE: CompaniesState = {
  selectedCompanyId: null,
  companiesList: [],
};

export const companiesReducer = (state = INIT_STATE, action: any) => {
  switch (action.type) {
    case "SET_SELECTED_COMPANY_ID":
      return {
        ...state,
        selectedCompanyId: action.payload,
      };

    case "SET_COMPANIES_LIST":
      return {
        ...state,
        companiesList: action.payload,
      };

    default:
      return state;
  }
};
