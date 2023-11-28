import firebase from "firebase/compat/app";
import { Functions, httpsCallable } from "firebase/functions";

import { TtlStorage } from "../utils/ttl-storage";

let _functions: Functions;
let _ttlStorage: TtlStorage;
let _verbose: boolean;

const cacheInvalidation = [
  {
    onCall: ["createProject", "editProject"],
    clean: ["fetchProjects", "fetchUserCompanyProjects"],
  },
  {
    onCall: [
      "createLink",
      "editLink",
      "deleteLink",
      "importLinks",
      "createCommunity",
    ],
    clean: ["fetchLinksByProject", "fetchProjects"],
  },
  {
    onCall: ["createCompany", "editCompany"],
    clean: ["fetchCompanies"],
  },
  {
    onCall: ["createClient", "editClient"],
    clean: ["fetchCompanyClients", "fetchClients"],
  },
  {
    onCall: ["createInstance", "editInstance", "deleteInstance"],
    clean: ["fetchInstances", "getInstance"],
  },
  {
    onCall: ["scheduleAddJob", "editJob", "deleteJob", "testSendJob"],
    clean: ["fetchJobs", "fetchJobLogs"],
  },
];

const init = function (
  ttlStorage: TtlStorage,
  functions: Functions,
  verbose = true
) {
  _ttlStorage = ttlStorage;
  _functions = functions;

  if (verbose) {
    console.log(`Firebase module initiating in verbose mode`);
  }

  _verbose = verbose;
};

const callFirebaseFunction = async function (
  name: string,
  params = {},
  options = { useCache: true, ttlMinutes: 30 }
) {
  if (_verbose) {
    console.log(`calling ${name}`);
  }

  let cacheKey;

  if (options.useCache) {
    cacheKey = `${name}-${JSON.stringify(params, null, 0)}`;

    const cachedResult = _ttlStorage.get(cacheKey);

    if (cachedResult) {
      if (_verbose) {
        console.log(`resolved ${name} using cache`);
      }

      return cachedResult;
    }
  }

  const firebaseFunction = httpsCallable(_functions, name);

  const result = await firebaseFunction(params);

  if (options.useCache) {
    if (_verbose) {
      console.log(`cached ${name}`);
    }

    // @ts-ignore
    _ttlStorage.set(cacheKey, result, options.ttlMinutes * 60 * 1000);
  }

  invalidateCache(name);

  return result;
};

const invalidateCache = function (name: string) {
  cacheInvalidation.forEach(function ({
    onCall,
    clean,
  }: {
    onCall: string[];
    clean: string[];
  }) {
    if (onCall.includes(name)) {
      if (_verbose) {
        console.log(
          `${name} was called, cleaning cache for ${clean.join(",")}`
        );
      }

      for (let i = 0; i < clean.length; i++) {
        _ttlStorage.deleteAllThatStartWith(clean[i]);
      }
    }
  });
};

export { init, callFirebaseFunction };
