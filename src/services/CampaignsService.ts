import * as FirebaseService from "./FirebaseService";

const getCampaignsList = async (showEnded: boolean = false) => {
  const fetchProjResult = await FirebaseService.callFirebaseFunction(
    "fetchProjects",
    {
      showEnded,
    }
  );

  return fetchProjResult;

  // return {
  //   data: [
  //     {
  //       id: 1,
  //       name: "Testando",
  //       totalLinks: 2,
  //       totalClicks: 4,
  //       maxClicks: 10,
  //       endDate: {
  //         _seconds: 1691623076886,
  //       },
  //       entryLink: "test.com",
  //       active: true,
  //       useZapi: true,
  //     },
  //     {
  //       id: 2,
  //       name: "Testando 2",
  //       totalLinks: 5,
  //       totalClicks: 8,
  //       maxClicks: 11,
  //       endDate: {
  //         _seconds: 1691623076886,
  //       },
  //       entryLink: "test2.com",
  //       active: true,
  //       useZapi: false,
  //     },
  //   ],
  // };
};

const createCampaign = async (newCampaignData: any) => {
  const response = await FirebaseService.callFirebaseFunction("createProject", {
    project: {
      ...newCampaignData,
    },
  });

  return response;
};

const updateCampaign = async (editedCampaignData: any, campaignId: any) => {
  const response = await FirebaseService.callFirebaseFunction("editProject", {
    project: campaignId,
    changes: {
      ...editedCampaignData,
    },
  });
  return response;
};

const getLeadsSumaryByGroups = async (projectId: any) => {
  const response = await FirebaseService.callFirebaseFunction(
    "fetchLeadSumaryByGroups",
    {
      projectId,
    }
  );

  return response;
};

const importLeads = async (projectId: any, files: any) => {
  const formData = new FormData();
  for (let i = 0; i < files.length; i++) {
    formData.append("files", files[i]);
  }
  const response = await FirebaseService.callFirebaseFunction(
    "importLeadReport",
    { selectLinkProjectId: projectId, formData }
  );

  return response;
};

export {
  getCampaignsList,
  createCampaign,
  updateCampaign,
  getLeadsSumaryByGroups,
  importLeads,
};
