import { createCommunityWhatsapp, renameCommunityWhatsapp, updAdminCommunityWhatsapp } from "../../../services/Whatsapp";
import { input, sendIntervalInput, instanceInput, faixaEnviar } from "./common";

export const communities = [
  {
    id: crypto.randomUUID(),
    name: "Criar",
    active: false,
    type: "communities",
    inputs: [
      {
        ...input,
        type: "number",
        label: "Número de Comunidades",
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
        label: "Criar Comunidades (Zapi)",
        action: (formValue: any) => createCommunityWhatsapp(formValue),
      },
    ],
  },
  {
    id: crypto.randomUUID(),
    name: "Renomear",
    active: false,
    type: "communities",
    inputs: [
      {
        ...input,
        type: "text",
        label: "Nome da Comunidade",
        name: "groupName",
      },
      {
        ...faixaEnviar,
        type: "selectNumber",
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
        label: "Renomear Comunidade(s)",
        action: (formValue: any) => renameCommunityWhatsapp(formValue),
      },
      {
        label: "Agendar Comunidade(s)",
        action: () => console.log("Agendar"),
      },
    ],
  },
  {
    id: crypto.randomUUID(),
    name: "Inserir Adm",
    active: false,
    type: "communities",
    inputs: [
      {
        ...input,
        type: "selectNumber",
        label: "Faixa de comunidades a Inserir Admins",
        inputsSelect: [{ name: "linkIdFirst", defaultValue: 1 }, { name: "linkIdLast", defaultValue: 1 }],
      },
      {
        ...input,
        type: "text",
        label: "Números Admin(s)",
        name: "adminNumbers",
      },
      {
        ...sendIntervalInput,
        inputsSelect: [{ name: "intervalFirst", defaultValue: 5 }, { name: "intervalLast", defaultValue: 5 }],
      },
      {
        ...instanceInput,
      },
    ],
    buttons: [
      {
        label: "Inserir Adm na(s) Comunidade(s)",
        action: (formValue: any) => updAdminCommunityWhatsapp(formValue),
      },
    ],
  },
];
