import * as FirebaseService from "./FirebaseService";

const getCompaniesList = async (
  userEmail?: string | null,
  showHidden: boolean = false
) => {
  const fetchCompaniesResult = await FirebaseService.callFirebaseFunction(
    "fetchCompanies",
    {
      showHidden,
      userEmail,
    }
  );

  return fetchCompaniesResult;
};

export { getCompaniesList };
