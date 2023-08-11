import * as FirebaseService from "./FirebaseService";

const getUserDetails = async (userEmail: string | null) => {
  //   const fetchUserResult = await FirebaseService.callFirebaseFunction(
  //     "getUserDetails",
  //     {
  //       userEmail,
  //     }
  //   );

  //   return fetchUserResult;

  return {
    data: {
      userId: "213",
      userDisplayName: "Joel Jr",
      id: "joeljunior.dev@gmail.com",
      emailVerified: false,
      isAnonymous: false,
      phone: null,
      userPlan: "Plano Mensal",
      planPrice: "49",
    },
  };
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

export { getUserDetails, fetchAlertNumber, getMysqlTables, signUpUser };
