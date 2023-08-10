import * as FirebaseService from "./FirebaseService";

const getJobsList = async (showEnded: boolean = false) => {
  const fetchJobsResult = await FirebaseService.callFirebaseFunction(
    "fetchJobs"
  );

  return fetchJobsResult;
};

export { getJobsList };
