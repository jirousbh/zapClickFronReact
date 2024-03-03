import * as FirebaseService from "../FirebaseService";
import { noCache } from "./Common";

export const sendGroupMessageWhatsapp = async ({
  projectId,
  instanceId,
  linkId,
  grpMessage,
  useMentioned,
}: any) => {
  console.log(
    {
      projectId,
      instanceId,
      linkId,
      grpMessage,
      useMentioned,
    },
    "@@@ create"
  );
  
};

export const sendGroupImageWhatsapp = async ({
  projectId,
  instanceId,
  linkId,
  image,
}: any) => {
  console.log(
    {
      projectId,
      instanceId,
      linkId,
      image,
    },
    "@@@ create"
  );
  return FirebaseService.callFirebaseFunction(
    "sendGroupImage",
    {
      projectId,
      instanceId,
      linkId,
      image,
    },
    noCache
  );
};

export const sendGroupAudioWhatsapp = async ({
  projectId,
  instanceId,
  linkId,
  audio,
}: any) => {
  console.log(
    {
      projectId,
      instanceId,
      linkId,
      audio,
    },
    "@@@ create"
  );
  return FirebaseService.callFirebaseFunction(
    "sendGroupAudio",
    {
      projectId,
      instanceId,
      linkId,
      audio,
    },
    noCache
  );
};

export const sendGroupVideoWhatsapp = async ({
  projectId,
  instanceId,
  linkId,
  video,
}: any) => {
  console.log(
    {
      projectId,
      instanceId,
      linkId,
      video,
    },
    "@@@ create"
  );
  return FirebaseService.callFirebaseFunction(
    "sendGroupVideo",
    {
      projectId,
      instanceId,
      linkId,
      video,
    },
    noCache
  );
};

export const sendGroupButtonWhatsapp = async ({
  projectId,
  instanceId,
  linkId,
  btnMessage,
  btnOptions,
}: any) => {
  console.log(
    {
      projectId,
      instanceId,
      linkId,
      btnMessage,
      btnOptions,
    },
    "@@@ create"
  );
  return FirebaseService.callFirebaseFunction(
    "sendGroupButton",
    {
      projectId,
      instanceId,
      linkId,
      btnMessage,
      btnOptions,
    },
    noCache
  );
};

export const sendGroupFileWhatsapp = async ({
  projectId,
  instanceId,
  linkId,
  file,
}: any) => {
  console.log(
    {
      projectId,
      instanceId,
      linkId,
      file,
    },
    "@@@ create"
  );
  return FirebaseService.callFirebaseFunction(
    "sendGroupFile",
    {
      projectId,
      instanceId,
      linkId,
      file,
    },
    noCache
  );
};

export const sendGroupPollWhatsapp = async ({
  projectId,
  instanceId,
  linkId,
  pollMessage,
  pollOptions,
}: any) => {
  console.log(
    {
      projectId,
      instanceId,
      linkId,
      pollMessage,
      pollOptions,
    },
    "@@@ create"
  );
  return FirebaseService.callFirebaseFunction(
    "sendGroupPoll",
    {
      projectId,
      instanceId,
      linkId,
      pollMessage,
      pollOptions,
    },
    noCache
  );
};
