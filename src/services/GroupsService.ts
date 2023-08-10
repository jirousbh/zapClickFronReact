import * as FirebaseService from "./FirebaseService";

const getGroupsByCampaign = async (campaignId: string) => {
  // const response = await FirebaseService.callFirebaseFunction(
  //   "fetchLinksByProject",
  //   {
  //     projectId: campaignId,
  //   }
  // );

  // return response;

  return {
    data: [
      {
        id: 1,
        projectId: "1",
        isFull: true,
        startTime: {
          _seconds: 1691623076886,
        },
        endTime: {
          _seconds: 1691623076899,
        },
        url: "https://chat.whatsapp.com/IeLMKZoxzgJBOiAQ9EO9BH",
        clickCount: 10,
        maxClicks: 20,
        leadUser: 1,
        entranceRate: 20,
      },
    ],
  };
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

export { getGroupsByCampaign, updateGroup, createGroup };
