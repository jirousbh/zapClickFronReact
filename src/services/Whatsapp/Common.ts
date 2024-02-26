import * as FirebaseService from "../FirebaseService";
export const noCache = { useCache: false, ttlMinutes: 0 };

function checkObject(object: any) {
  const newForms: any = {};
  const params: any = {};

  for (const property in object) {
    if (object[property] !== "" && object[property].length !== 0) {
      if (
        property === "projectId" ||
        property === "instanceId" ||
        property === "sendFunction"
      ) {
        params[property] = object[property];
      } else {
        newForms[property] = object[property];
      }
    }
  }
  return { newForms, params };
}

export const scheduleAddAction = async (formValues: any) => {
  console.log(formValues, "@@@ fomrValues");
  const { newForms, params } = checkObject(formValues);

  console.log(
    {
      ...newForms,
      params,
    },
    "@@@ scheduleAddJob"
  );
  return FirebaseService.callFirebaseFunction(
    "scheduleAddJob",
    {
      ...newForms,
      minInterval: newForms.intervalFirst,
      maxInterval: newForms.intervalLast,
      firstGrpId: newForms.linkIdFirst,
      lastGrpId: newForms.linkIdLast,
      params,
    },
    noCache
  );
};
