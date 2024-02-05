import * as FirebaseService from "./FirebaseService";

const getCampaignsList = async (showEnded: boolean = false) => {
  return FirebaseService.callFirebaseFunction(
    "fetchProjects",
    {
      showEnded,
    }
  );
};

const createCampaign = async (newCampaignData: any) => {
  return FirebaseService.callFirebaseFunction("createProject", {
    project: {
      ...newCampaignData,
    },
  });
};

const updateCampaign = async (editedCampaignData: any, campaignId: any) => {
  return FirebaseService.callFirebaseFunction("editProject", {
    project: campaignId,
    changes: {
      ...editedCampaignData,
    },
  });
};

const getLeadsSumaryByGroups = async (projectId: any) => {
  return FirebaseService.callFirebaseFunction(
    "fetchLeadSumaryByGroups",
    {
      projectId,
    }
  );
};

const importLeads = async (projectId: any, files: any) => {
  const formData = new FormData();
  for (let i = 0; i < files.length; i++) {
    formData.append("files", files[i]);
  }
  return FirebaseService.callFirebaseFunction(
    "importLeadReport",
    { selectLinkProjectId: projectId, formData }
  );
};

export {
  getCampaignsList,
  createCampaign,
  updateCampaign,
  getLeadsSumaryByGroups,
  importLeads,
};
