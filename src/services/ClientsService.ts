import * as FirebaseService from "./FirebaseService";

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

const editClient = async ({ client, company, name, email }: any) => {
  const createCompaniyResult = await FirebaseService.callFirebaseFunction(
    "editClient",
    {
      client,
      company,
      changes: {
        name,
        email,
      },
    }
  );

  return createCompaniyResult;
};

export { createClient, editClient };
