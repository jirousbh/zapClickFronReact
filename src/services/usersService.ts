import * as FirebaseService from "./FirebaseService";

const getUserDetails = async (userEmail: string | null) => {
  const fetchUserResult = await FirebaseService.callFirebaseFunction(
    "getUserDetails",
    {
      userEmail,
    }
  );

  return fetchUserResult;
};

const fetchUsers = async () => {
  const users = await FirebaseService.callFirebaseFunction("fetchUsers");
  return users;
};

const editUser = async (payload: any) => {
  const user = await FirebaseService.callFirebaseFunction("editUser", payload);
  return user;
};

const createUser = async ({
  name,
  email,
  password,
  companyId,
  clientId,
}: any) => {
  const users = await FirebaseService.callFirebaseFunction("createUser", {
    name,
    email,
    password,
    companyId,
    clientId,
  });
  return users;
};

const addNewEmail = async ({ userEmail, newEmail }: any) => {
  const users = await FirebaseService.callFirebaseFunction(
    "addAlternateEmail",
    {
      userEmail,
      newEmail,
    }
  );
  return users;
};

const fetchUserAlternateEmails = async (email: string) => {
  const emails = await FirebaseService.callFirebaseFunction(
    "fetchUserAlternateEmails",
    {
      email,
    }
  );
  return emails;
};

const delUserAlternateEmail = async (userEmail: string, oldEmail: string) => {
  const emails = await FirebaseService.callFirebaseFunction(
    "delUserAlternateEmail",
    {
      userEmail,
      oldEmail
    }
  );
  return emails;
};

const fetchAlertNumber = async () => {
  const fetchAlertNumberResult = await FirebaseService.callFirebaseFunction(
    "fetchAlertNumber"
  );

  return fetchAlertNumberResult;
};

const getMysqlTables = async () => {
  const fetchAlertNumberResult = await FirebaseService.callFirebaseFunction(
    "getMysqlTables"
  );

  return fetchAlertNumberResult;
};

const signUpUser = async ({ name, email, password, phone }: any) => {
  const fetchAlertNumberResult = await FirebaseService.callFirebaseFunction(
    "createUser",
    {
      name,
      email,
      password,
      phone,
    }
  );

  return fetchAlertNumberResult;
};

export {
  getUserDetails,
  fetchAlertNumber,
  getMysqlTables,
  signUpUser,
  fetchUsers,
  editUser,
  createUser,
  addNewEmail,
  fetchUserAlternateEmails,
  delUserAlternateEmail
};
