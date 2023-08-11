import * as FirebaseService from "./FirebaseService";

const getShortenersList = async (campaignId: number) => {
  const fetchShortnersResult = await FirebaseService.callFirebaseFunction(
    "fetchShorteners",
    {
      projectId: campaignId,
    }
  );

  return fetchShortnersResult;
};

const createShortener = async ({
  projectId,
  url,
  utm_source,
  utm_medium,
  utm_campaign,
  utm_term,
  utm_content,
}: any) => {
  const fetchShortnersResult = await FirebaseService.callFirebaseFunction(
    "createShortener",
    {
      projectId,
      url,
      utm_source,
      utm_medium,
      utm_campaign,
      utm_term,
      utm_content,
    }
  );

  return fetchShortnersResult;
};

const deleteShortener = async ({ projectId, shortId }: any) => {
  const fetchShortnersResult = await FirebaseService.callFirebaseFunction(
    "deleteShortener",
    {
      projectId,
      shortId,
    }
  );

  return fetchShortnersResult;
};

export { getShortenersList, createShortener, deleteShortener };
