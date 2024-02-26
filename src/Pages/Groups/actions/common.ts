export const input = {
    type: "",
    label: "",
    required: true,
  };
  
export const faixaEnviar = {
    ...input,
    type: "selectNumber",
    label: "Faixa a enviar",
    inputsSelect: [{ name: "linkIdFirst", defaultValue: 1 }, { name: "linkIdLast", defaultValue: 1 }],
  };
  
export const sendIntervalInput = {
    ...input,
    type: "selectNumber",
    label: "Intevalo para envio em segundos",
    inputsSelect: [{ name: "intervalFirst", defaultValue: 5 }, { name: "intervalLast", defaultValue: 5 }],
  };
  
export const instanceInput = {
    ...input,
    type: "select",
    label: "Instância",
    name: "instanceId",
  };