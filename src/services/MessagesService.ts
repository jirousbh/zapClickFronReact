import * as FirebaseService from "./FirebaseService";

const sendBulkVideo = async ({
  tableName,
  instances,
  grpMessage,
  video,
}: any) => {
  const sendBulkVideosResult = await FirebaseService.callFirebaseFunction(
    "sendBulkVideo",
    {
      tableName,
      instances,
      grpMessage,
      video,
    }
  );

  return sendBulkVideosResult;
};

export { sendBulkVideo };
