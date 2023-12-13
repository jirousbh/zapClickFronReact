export const setClients = (clients: any[]) => {
  console.log(clients, '@@@ SETCLIENTS')
  return {
    type: "SET_CLIENTS",
    payload: clients,
  };
};
