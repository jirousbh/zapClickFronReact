import * as FirebaseService from "../FirebaseService";
import { noCache } from "./Common";

export const createGroupWhatsapp = async ({
  projectId,
  instanceId,
  project,
  extraAdminNumber,
}: any) => {
  /* project: {name: ""} */
  console.log(
    {
      projectId,
      instanceId,
      project,
      extraAdminNumber,
    },
    "@@@ create"
  );
  return FirebaseService.callFirebaseFunction(
    "createGroup",
    {
      projectId,
      instanceId,
      project,
      extraAdminNumber,
    },
    noCache
  );
};

export const renameGroupWhatsapp = async ({
  projectId,
  instanceId,
  groupName,
  linkId,
}: any) => {
  console.log(
    {
      projectId,
      instanceId,
      linkId,
      groupName,
    },
    "@@@ response send"
  );
  return FirebaseService.callFirebaseFunction(
    "renameGroup",
    {
      projectId,
      instanceId,
      linkId,
      groupName,
    },
    noCache
  );
};

export const changeGroupImageWhatsapp = async ({
  projectId,
  instanceId,
  linkId,
  file,
}: any) => {
  //TODO: Passar a image para o endpoint
  console.log(
    {
      projectId,
      instanceId,
      linkId,
      file,
    },
    "@@@ changeGroupImageWhatsapp"
  );

  return FirebaseService.callFirebaseFunction("changeGroupImage", {
    projectId,
    instanceId,
    linkId,
    image: file,
  }, noCache);
};

export const updateGroupDescWhatsapp = async ({
  projectId,
  instanceId,
  linkId,
  description,
}: any) => {
  console.log(
    {
      projectId,
      instanceId,
      linkId,
      description,
    },
    "@@@ updateGroupDescWhatsapp"
  );
  return FirebaseService.callFirebaseFunction(
    "updateGroupDesc",
    {
      projectId,
      instanceId,
      linkId,
      description,
    },
    noCache
  );
};

export const fixGroupLinkWhatsapp = async ({ projectId, instanceId, linkId }: any) => {
  console.log(
    {
      projectId,
      instanceId,
      linkId,
    },
    "@@@ updateGroupDescWhatsapp"
  );
  return FirebaseService.callFirebaseFunction(
    "fixGroupLink",
    {
      projectId,
      instanceId,
      linkId,
    },
    noCache
  );
};

export const updAdminGroupWhatsapp = async ({
  projectId,
  instanceId,
  linkId,
  adminNumbers,
}: any) => {
  console.log(
    {
      projectId,
      instanceId,
      linkId,
      adminNumbers,
    },
    "@@@ updAdminGroupWhatsapp"
  );
  return FirebaseService.callFirebaseFunction(
    "updAdminGroup",
    {
      projectId,
      instanceId,
      linkId,
      adminNumbers,
    },
    noCache
  );
};
