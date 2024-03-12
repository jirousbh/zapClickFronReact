import * as FirebaseService from "./FirebaseService";
import { noCache } from "./Whatsapp/Common";

const getGroupsByCampaign = async (campaignId: string, userEmail: string | null = null) => {
  const response = await FirebaseService.callFirebaseFunction(
    "fetchLinksByProject",
    {
      projectId: campaignId,
      userEmail
    },
    noCache
  );

  return response;
};

const updateGroup = async (
  url: string,
  groupId: number,
  campaignId: number
) => {
  const response = await FirebaseService.callFirebaseFunction("editLink", {
    link: groupId,
    project: campaignId,
    changes: {
      url,
    },
  });

  return response;
};

const createGroup = async (url: string, campaignId: number) => {
  const response = await FirebaseService.callFirebaseFunction("createLink", {
    project: campaignId,
    link: {
      url,
    },
  });

  return response;
};

const createMultipleGroups = async (urls: string, campaignId: string) => {
  const response = await FirebaseService.callFirebaseFunction("importLinks", {
    project: campaignId,
    link: {
      urls,
    },
  });

  return response;
};

export {
  getGroupsByCampaign,
  updateGroup,
  createGroup,
  createMultipleGroups,
};
