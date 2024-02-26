import * as FirebaseService from "../FirebaseService";
import { noCache } from "./Common";

export const createCommunityWhatsapp = async ({
  projectId,
  instanceId,
  project,
}: any) => {
  console.log(
    {
      projectId,
      instanceId,
      project,
    },
    "@@@ create"
  );
  return FirebaseService.callFirebaseFunction(
    "createCommunity",
    {
      projectId,
      instanceId,
      project: { name: "002 Teste Comunidades" },
    },
    noCache
  );
};

export const renameCommunityWhatsapp = async ({
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

export const updAdminCommunityWhatsapp = async ({
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
