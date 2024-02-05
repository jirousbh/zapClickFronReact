import {
  changeGroupImageWhatsapp,
  createGroupWhatsapp,
  fixGroupLinkWhatsapp,
  renameGroupWhatsapp,
  updAdminGroupWhatsapp,
  updateGroupDescWhatsapp,
} from "../../services/GroupsService";

const input = {
  type: "",
  label: "",
  required: true,
};

const faixaEnviar = {
  ...input,
  type: "selectNumber",
  label: "Faixa a enviar",
  inputsSelect: [{ name: "linkIdFirst" }, { name: "linkIdLast" }],
};

const sendIntervalInput = {
  ...input,
  type: "selectNumber",
  label: "Intevalo para envio em segundos",
  inputsSelect: [{ name: "intervalFirst" }, { name: "intervalLast" }],
};

const instanceInput = {
  ...input,
  type: "select",
  label: "Instância",
  name: "instanceId",
};

//Create -> {project: {name: campaignName} }
//Faixa a enviar ou alterar -> quantidade de iterações -> linkId: 1, linkId: 2
//Intervalo para cada envio -> Intervalo para envio em segundos
const groups = [
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
        inputsSelect: [{ name: "linkIdLast" }],
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
    inputs: [
      //Entender como funciona Faixa a alterar e Intervalo para envio em segundos
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
        inputsSelect: [{ name: "linkIdFirst" }, { name: "linkIdLast" }],
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
        name: "image",
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

const communities = [
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
        action: () => console.log("Renomear"),
      },
    ],
  },
  {
    id: crypto.randomUUID(),
    name: "Renomear",
    active: false,
    type: "communities",
  },
  {
    id: crypto.randomUUID(),
    name: "Inserir Adm",
    active: false,
    type: "communities",
  },
];

const sends = [
  {
    id: crypto.randomUUID(),
    name: "Enviar Mensagem",
    active: false,
    type: "sends",
    inputs: [
      {
        ...faixaEnviar,
      },
      {
        ...input,
        type: "text",
        label: "Usar Menção Oculta?",
      },
      {
        ...input,
        type: "text",
        label: "Mensagem",
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
        action: () => console.log("Renomear"),
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
        type: "text",
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
        action: () => console.log("Renomear"),
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
        action: () => console.log("Renomear"),
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
        type: "text",
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
        action: () => console.log("Renomear"),
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
        action: () => console.log("Renomear"),
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
    inputs: [
      {
        ...faixaEnviar,
      },
      {
        ...input,
        type: "text",
        label: "Mensagem",
      },
      {
        ...input,
        type: "text",
        label: "Texto do Botão",
      },
      {
        ...input,
        type: "text",
        label: "Url do Botão",
      },
      {
        ...input,
        type: "text",
        label: "Botão",
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
        action: () => console.log("Renomear"),
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
    inputs: [
      {
        ...faixaEnviar,
      },
      {
        ...input,
        type: "text",
        label: "Texto da Enquete",
      },
      {
        ...input,
        type: "text",
        label: "Opções da Enquete",
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
        action: () => console.log("Renomear"),
      },
      {
        label: "Agendar Envio",
        action: () => console.log("Renomear"),
      },
    ],
  },
];

const leads = [
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

export const buttons = [...groups, ...communities, ...sends, ...leads];
