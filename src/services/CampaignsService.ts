import * as FirebaseService from "./FirebaseService";
import { noCache } from "./Whatsapp/Common";
import axios from "axios";

const getCampaignsList = async (
  showEnded: boolean = false,
  userEmail: string | null = null
) => {
  return FirebaseService.callFirebaseFunction(
    "fetchProjects",
    {
      showEnded,
      userEmail,
    },
    noCache
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
  return FirebaseService.callFirebaseFunction("fetchLeadSumaryByGroups", {
    projectId,
  });
};

/* const importLeads = async (projectId: any, files: any) => {
  const formData = new FormData();

  console.log(files[0], files.length);
  for (let i = 0; i < files.length; i++) {
    formData.append("files", files[i]);
  }
  formData.append("selectLinkProjectId", projectId);
  console.log(formData.getAll("files"), "formData");

  return FirebaseService.callFirebaseFunction("importLeadReport", formData);
}; */

const importLeads = async (projectId: any, files: any) => {
  const formData = new FormData();

  console.log(files[0], files.length);
  for (let i = 0; i < files.length; i++) {
    formData.append("files", files[i]);
  }
  formData.append("selectLinkProjectId", projectId);
  console.log(formData.getAll("files"), "formData");

  const accessToken = localStorage.getItem("accessToken") || "";

  return axios.post(
    "http://xmicroserver.ddns.net:5002/zapclick-9efd3/us-central1/importLeadReport",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
};

export {
  getCampaignsList,
  createCampaign,
  updateCampaign,
  getLeadsSumaryByGroups,
  importLeads,
};
