import {
  changeGroupImageWhatsapp,
  createGroupWhatsapp,
  fixGroupLinkWhatsapp,
  renameGroupWhatsapp,
  updAdminGroupWhatsapp,
  updateGroupDescWhatsapp,
} from "../../../services/Whatsapp";
import { input, instanceInput, faixaEnviar, sendIntervalInput } from "./common";

export const groups = [
  {
    id: crypto.randomUUID(),
    name: "Criar",
    title: "Criar Grupo",
    type: "groups",
    inputs: [
      {
        ...input,
        type: "selectNumber",
        label: "Número de grupos",
        inputsSelect: [{ name: "linkIdLast", defaultValue: 1 }],
      },
      {
        ...input,
        type: "text",
        label: "Número Admin Reserva",
        name: "extraAdminNumber",
      },
      {
        ...instanceInput,
      },
    ],
    buttons: [
      {
        label: "Criar Grupos",
        action: (formValues: any) => createGroupWhatsapp(formValues),
      },
    ],
  },
  {
    id: crypto.randomUUID(),
    name: "Renomear",
    title: "Renomear Grupo",
    active: false,
    type: "groups",
    sendFunction: "renameGroup",
    inputs: [
      {
        ...input,
        type: "text",
        label: "Nome do Grupo",
        name: "groupName",
      },
      {
        ...input,
        type: "selectNumber",
        label: "Faixa a alterar",
        inputsSelect: [{ name: "linkIdFirst", defaultValue: 1 }, { name: "linkIdLast", defaultValue: 1 }],
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
        label: "Renomear Grupos",
        action: (formValue: any) => renameGroupWhatsapp(formValue),
      },
      {
        label: "Agendar Grupos",
        action: () => console.log("Agendar"),
      },
    ],
  },
  {
    id: crypto.randomUUID(),
    name: "Alt Imagem",
    title: "Alterar Imagem",
    active: false,
    type: "groups",
    inputs: [
      {
        ...faixaEnviar,
      },
      {
        ...input,
        type: "file",
        label: "Imagem",
        name: "file",
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
        label: "Alterar Imagem do(s) Grupos",
        action: (formValue: any) => changeGroupImageWhatsapp(formValue),
      },
    ],
  },
  {
    id: crypto.randomUUID(),
    name: "Alt Descrição",
    title: "Alterar Descrição",
    active: false,
    type: "groups",
    inputs: [
      {
        ...faixaEnviar,
      },
      {
        ...input,
        type: "text",
        label: "Descrição do Grupo",
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
        label: "Alterar descrição do(s) Grupos",
        action: (formValue: any) => updateGroupDescWhatsapp(formValue),
      },
    ],
  },
  {
    id: crypto.randomUUID(),
    name: "Atualizar Links",
    title: "Atualizar Links",
    active: false,
    type: "groups",
    inputs: [
      {
        ...faixaEnviar,
        label: "Faixa a Atualizar Link Quebrados",
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
        label: "Atualizar Links",
        action: (formValue: any) => fixGroupLinkWhatsapp(formValue),
      },
    ],
  },
  {
    id: crypto.randomUUID(),
    name: "Inserir Admin",
    title: "Inserir Admin",
    active: false,
    type: "groups",
    inputs: [
      {
        ...input,
        type: "selectNumber",
        label: "Faixa de grupos a Inserir Admins",
        inputsSelect: [{ name: "linkIdFirst" }, { name: "linkIdLast" }],
      },
      {
        ...input,
        type: "text",
        label: "Números Admin(s)",
        name: "adminNumbers",
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
        label: "Inserir Adm no(s) Grupo(s)",
        action: (formValue: any) => updAdminGroupWhatsapp(formValue),
      },
    ],
  },
];
