import {
  sendGroupAudioWhatsapp,
  sendGroupButtonWhatsapp,
  sendGroupFileWhatsapp,
  sendGroupImageWhatsapp,
  sendGroupMessageWhatsapp,
  sendGroupPollWhatsapp,
  sendGroupVideoWhatsapp,
} from "../../../services/Whatsapp";
import { input, instanceInput, faixaEnviar, sendIntervalInput } from "./common";

export const sends = [
  {
    id: crypto.randomUUID(),
    name: "Enviar Mensagem",
    active: false,
    type: "sends",
    sendFunction: "sendGroupMessage",
    inputs: [
      {
        ...faixaEnviar,
      },
      {
        ...input,
        type: "switch",
        label: "Usar Menção Oculta?",
        name: "useMentioned"
      },
      {
        ...input,
        type: "textArea",
        label: "Mensagem",
        name:"grpMessage"
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
        label: "Enviar Mensagem",
        action: (formValue: any) => sendGroupMessageWhatsapp(formValue),
      },
      {
        label: "Agendar Envio",
        action: () => console.log("Renomear"),
      },
    ],
  },
  {
    id: crypto.randomUUID(),
    name: "Enviar Imagem",
    active: false,
    type: "sends",
    sendFunction: "sendGroupImage",
    inputs: [
      {
        ...faixaEnviar,
      },
      {
        ...input,
        type: "file",
        label: "Imagem",
      },
      {
        ...input,
        type: "textArea",
        label: "Legenda",
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
        label: "Enviar Imagem",
        action: (formValue: any) => sendGroupImageWhatsapp(formValue),
      },
      {
        label: "Agendar Envio",
        action: () => console.log("Renomear"),
      },
    ],
  },
  {
    id: crypto.randomUUID(),
    name: "Enviar Áudio",
    active: false,
    type: "sends",
    sendFunction: "sendGroupAudio",
    inputs: [
      {
        ...faixaEnviar,
      },
      {
        ...input,
        type: "file",
        label: "Áudio",
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
        label: "Enviar Áudio",
        action: (formValue: any) => sendGroupAudioWhatsapp(formValue),
      },
      {
        label: "Agendar Envio",
        action: () => console.log("Renomear"),
      },
    ],
  },
  {
    id: crypto.randomUUID(),
    name: "Enviar Vídeo",
    active: false,
    type: "sends",
    sendFunction: "sendGroupVideo",
    inputs: [
      {
        ...faixaEnviar,
      },
      {
        ...input,
        type: "file",
        label: "Vídeo",
      },
      {
        ...input,
        type: "textArea",
        label: "Legenda",
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
        label: "Enviar Vídeo",
        action: (formValue: any) => sendGroupVideoWhatsapp(formValue),
      },
      {
        label: "Agendar Envio",
        action: () => console.log("Renomear"),
      },
    ],
  },
  {
    id: crypto.randomUUID(),
    name: "Enviar Arquivo",
    active: false,
    type: "sends",
    sendFunction: "sendGroupFile",
    inputs: [
      {
        ...faixaEnviar,
      },
      {
        ...input,
        type: "file",
        label: "Arquivo",
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
        label: "Enviar Arquivo",
        action: (formValue: any) => sendGroupFileWhatsapp(formValue),
      },
      {
        label: "Agendar Envio",
        action: () => console.log("Renomear"),
      },
    ],
  },
  {
    id: crypto.randomUUID(),
    name: "Txt com botão",
    active: false,
    type: "sends",
    sendFunction: "sendGroupButton",
    inputs: [
      {
        ...faixaEnviar,
      },
      {
        ...input,
        type: "textArea",
        label: "Mensagem",
        name: "btnMessage",
      },
      {
        ...input,
        type: "selectOptions",
        label: "Botão",
        placeholder: "Ex: nome do botão - URL do botão",
        name: "btnOptions",
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
        label: "Enviar Mensagem com botão",
        action: (formValue: any) => sendGroupButtonWhatsapp(formValue),
      },
      {
        label: "Agendar Envio",
        action: () => console.log("Renomear"),
      },
    ],
  },
  {
    id: crypto.randomUUID(),
    name: "Enquete",
    active: false,
    type: "sends",
    sendFunction: "sendGroupPoll",
    inputs: [
      {
        ...faixaEnviar,
      },
      {
        ...input,
        type: "textArea",
        label: "Texto da Enquete",
        name: "pollMessage",
      },
      {
        ...input,
        type: "selectOptions",
        label: "Opções da Enquete",
        placeholder: "Digite a opção da enquete",
        name: "pollOptions",
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
        label: "Enviar Enquete",
        action: (formValue: any) => sendGroupPollWhatsapp(formValue),
      },
      {
        label: "Agendar Envio",
        action: () => console.log("Renomear"),
      },
    ],
  },
];
