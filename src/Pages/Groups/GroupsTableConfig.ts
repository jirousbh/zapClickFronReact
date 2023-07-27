import React from "react";
import { OverlayTrigger, Tooltip, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import ReactApexChart from "react-apexcharts";

export const GROUPS_COLUMNS: any = [
  {
    Header: "Número",
    accessor: "id",
    className: "text-center ",
  },
  {
    Header: "URL",
    accessor: "url",
    className: "text-center ",
  },
  {
    Header: "Cliques",
    accessor: "maxClicks",
    className: "text-center ",
  },
  {
    Header: "Tempo ativo",
    accessor: "endDate",
    className: "text-center ",
  },
  {
    Header: "Opções",
    accessor: "options",
    className: "text-center ",
  },
];

export const GROUPS_DATATABLE = [
  {
    id: 1,
    name: "Projeto Teste",
    totalLinks: 0,
    totalClicks: 0,
    projClicks: 0,
    maxClicks: 0,
    endDate: new Date().toLocaleString("pt-BR").substring(0, 10),
    url: "https://teste.com/",
    options: null,
  },
];
