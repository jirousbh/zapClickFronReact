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

const createCompany = async ({ name }: any) => {
  const createCompaniyResult = await FirebaseService.callFirebaseFunction(
    "createCompany",
    {
      name,
    }
  );

  return createCompaniyResult;
};

const editCompany = async ({ company, name }: any) => {
  const createCompaniyResult = await FirebaseService.callFirebaseFunction(
    "editCompany",
    {
      company,
      changes: {
        name,
      },
    }
  );

  return createCompaniyResult;
};

export { getCompaniesList, createCompany, editCompany };
