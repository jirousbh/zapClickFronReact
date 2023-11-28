export const JOBS_COLUMNS: any = [
  {
    Header: "Número",
    accessor: "jobId",
    className: "text-center ",
  },
  {
    Header: "Nome",
    accessor: "name",
    className: "text-center ",
  },
  {
    Header: "Campanha",
    accessor: "projectId",
    className: "text-center ",
  },
  {
    Header: "Data Agendada",
    accessor: "startTime",
    className: "text-center ",
  },
  {
    Header: "Faixa de Grupos",
    accessor: "groups",
    className: "text-center ",
  },
  {
    Header: "Intervalo de Envio",
    accessor: "interval",
    className: "text-center ",
  },
  {
    Header: "Status",
    accessor: "status",
    className: "text-center ",
  },
  {
    Header: "Opções",
    accessor: "options",
    className: "text-center ",
  },
];

export const JOB_LOGS_COLUMNS: any = [
  {
    Header: "GRUPO",
    accessor: "link",
    className: "text-center ",
  },
  {
    Header: "EXECUTOU?",
    accessor: "success",
    className: "text-center ",
  },
  {
    Header: "MSG DE ERRO",
    accessor: "errorMessage",
    className: "text-center ",
  },
  {
    Header: "DATA/HORA EXEC",
    accessor: "dateTimeStr",
    className: "text-center ",
  },
];
