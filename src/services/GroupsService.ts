import * as FirebaseService from "./FirebaseService";

const getGroupsByCampaign = async (campaignId: string) => {
  const response = await FirebaseService.callFirebaseFunction(
    "fetchLinksByProject",
    {
      projectId: campaignId,
    }
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

//Features Whatsapp
const createGroupWhatsapp = async ({
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
  const response = await FirebaseService.callFirebaseFunction(
    "createGroup",
    {
      projectId,
      instanceId,
      project: { name: "002 Teste Comunidades" },
      extraAdminNumber,
    },
    { useCache: false, ttlMinutes: 0 }
  );
  console.log(response);
  return response;
};

const renameGroupWhatsapp = async ({
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
  const response = await FirebaseService.callFirebaseFunction("renameGroup", {
    projectId,
    instanceId,
    linkId,
    groupName,
  }, { useCache: false, ttlMinutes: 0 });
  return response;
};

const changeGroupImageWhatsapp = async ({
  projectId,
  instanceId,
  linkId,
}: any) => {
  //TODO: Passar a image para o endpoint
  console.log(
    {
      projectId,
      instanceId,
      linkId,
    },
    "@@@ changeGroupImageWhatsapp"
  );

  /* const response = await FirebaseService.callFirebaseFunction(
    "changeGroupImage",
    {
      data: {
        projectId,
        instanceId,
        linkId,
      },
    }
  );

  return response; */
};

const updateGroupDescWhatsapp = async ({
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
    const response = await FirebaseService.callFirebaseFunction(
    "updateGroupDesc",
    {
        projectId,
        instanceId,
        linkId,
        description,
    }, { useCache: false, ttlMinutes: 0 }
  );

  return response;
};

const fixGroupLinkWhatsapp = async ({ projectId, instanceId, linkId }: any) => {
  console.log(
    {
      projectId,
      instanceId,
      linkId,
    },
    "@@@ updateGroupDescWhatsapp"
  );
    const response = await FirebaseService.callFirebaseFunction("fixGroupLink", {
      projectId,
      instanceId,
      linkId,
    }, { useCache: false, ttlMinutes: 0 }
  );

  return response;
};

const updAdminGroupWhatsapp = async ({
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
  const response = await FirebaseService.callFirebaseFunction("updAdminGroup", {
      projectId,
      instanceId,
      linkId,
      adminNumbers,
    
  }, { useCache: false, ttlMinutes: 0 });

  return response;
};

export {
  getGroupsByCampaign,
  updateGroup,
  createGroup,
  createMultipleGroups,
  createGroupWhatsapp,
  renameGroupWhatsapp,
  changeGroupImageWhatsapp,
  updateGroupDescWhatsapp,
  fixGroupLinkWhatsapp,
  updAdminGroupWhatsapp,
};
