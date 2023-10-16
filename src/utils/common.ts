export const parseClient = (clients: any, companies: any) => {
  return clients.map((client: any) => {
    const { id, name } = companies.find(
      (company: any) => company.id === client.companyId
    ) || { id: "", name: "" };

    return {
      ...client,
      company: { id, name },
    };
  });
};
