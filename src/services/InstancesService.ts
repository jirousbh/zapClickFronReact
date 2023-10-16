import * as FirebaseService from "./FirebaseService";

const getInstancesList = async () => {
  const fetchInstancesResult = await FirebaseService.callFirebaseFunction(
    "fetchInstances"
  );

  return fetchInstancesResult;
};

const createInstance = async (instance: any) => {
  return FirebaseService.callFirebaseFunction("createInstance", {
    instance: {
      description: instance.description,
      instance: instance.instance,
      token: instance.token,
      api: instance.instanceApi,
    },
  });
};

const editInstance = async (instance: any) => {
  return FirebaseService.callFirebaseFunction("editInstance", {
    instanceId: instance.id,
    changes: {
      description: instance.description,
      instance: instance.instance,
      token: instance.token,
      api: instance.instanceApi,
    },
  });
};

const deleteInstance = async (instanceId: any) => {
  return FirebaseService.callFirebaseFunction("deleteInstance", { instanceId });
};

export { getInstancesList, createInstance, editInstance, deleteInstance };
