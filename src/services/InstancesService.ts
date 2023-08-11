import * as FirebaseService from "./FirebaseService";

const getInstancesList = async () => {
  // const fetchInstancesResult = await FirebaseService.callFirebaseFunction(
  //   "fetchInstances"
  // );

  // return fetchInstancesResult;

  return {
    data: [
      {
        id: 1,
        description: "Testando",
        api: "SIM",
        phone: 21394488393,
      },
      {
        id: 2,
        description: "Testando 2",
      },
    ],
  };
};

export { getInstancesList };
