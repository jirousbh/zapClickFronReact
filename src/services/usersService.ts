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

export { getUserDetails };
