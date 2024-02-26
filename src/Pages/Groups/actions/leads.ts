import { instanceInput, faixaEnviar, sendIntervalInput } from "./common";

export const leads = [
    {
      id: crypto.randomUUID(),
      name: "Enquete",
      active: false,
      type: "leads",
      inputs: [
        {
          ...faixaEnviar,
          label: "Faixa a alterar",
        },
        {
          ...sendIntervalInput,
        },
        {
          ...instanceInput,
        },
      ],
      buttons: [
        {
          label: "Atualizar Leads",
          action: () => console.log("Renomear"),
        },
      ],
    },
    {
      id: crypto.randomUUID(),
      name: "Exportar Leads",
      active: false,
      type: "leads",
      inputs: [
        {
          ...faixaEnviar,
          label: "Faixa a Exportar",
        },
        {
          ...instanceInput,
        },
      ],
      buttons: [
        {
          label: "Exportar Leads",
          action: () => console.log("Renomear"),
        },
      ],
    },
  ];