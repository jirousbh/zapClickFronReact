import * as FirebaseService from "./FirebaseService";

const getClient = async (
  userEmail?: string | null,
  showHidden: boolean = false
) => {
  const fetchClients = await FirebaseService.callFirebaseFunction(
    "fetchClients",
    {
      showHidden,
      userEmail,
    }
  );

  return fetchClients;
};

const createClient = async ({ name, company, email }: any) => {
  const createCompaniyResult = await FirebaseService.callFirebaseFunction(
    "createClient",
    {
      company,
      client: {
        name,
        email,
      },
    }
  );

  return createCompaniyResult;
};

const editClient = async ({ id, company, name, email }: any) => {
  const createCompaniyResult = await FirebaseService.callFirebaseFunction(
    "editClient",
    {
      client: id,
      company,
      changes: {
        name,
        email,
      },
    }
  );

  return createCompaniyResult;
};

export { createClient, editClient, getClient };
