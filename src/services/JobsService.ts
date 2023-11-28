import * as FirebaseService from "./FirebaseService";

const getJobsList = async (showEnded: boolean = false) => {
  return FirebaseService.callFirebaseFunction("fetchJobs", {
    jobId: 0,
    fetchMedia: false,
  });
};

const getJobLogs = async (jobId: string | number) => {
  return FirebaseService.callFirebaseFunction("fetchJobLogs", {
    jobId,
  });
};

const editJob = async (job: any) => {
  const payload = {
    jobId: job.id,
    job: {
      startTime: job.startTime,
      firstGrpId: job.firstGrpId,
      lastGrpId: job.lastGrpId,
      minInterval: job.minInterval,
      maxInterval: job.maxInterval,
      status: job.status,
    },
  };
  return FirebaseService.callFirebaseFunction("editJob", payload);
};

const sendJob = async (jobId: string | number, phoneNumber: string) => {
  const payload = {
    jobId,
    phoneNumber,
  };
  console.log(payload)
  return FirebaseService.callFirebaseFunction("testSendJob", payload);
};

const deleteJob = async (jobId: number | string) => {
  return FirebaseService.callFirebaseFunction("deleteJob", {
    jobId,
  });
};

export { getJobsList, getJobLogs, editJob, deleteJob, sendJob };
