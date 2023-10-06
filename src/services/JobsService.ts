import * as FirebaseService from "./FirebaseService";

const getJobsList = async (showEnded: boolean = false) => {
  const fetchJobsResult = await FirebaseService.callFirebaseFunction(
    "fetchJobs", {jobId:0,fetchMedia:false}
  );

  return fetchJobsResult;
};

export { getJobsList };
