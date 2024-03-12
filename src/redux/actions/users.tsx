export const setUSerView = (email: string) => {
  return {
    type: "SET_USER_VIEW",
    payload: email,
  };
};
