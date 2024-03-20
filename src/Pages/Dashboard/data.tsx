import React from "react";
import { OverlayTrigger, Tooltip, Form } from "react-bootstrap";
import { Link } from "react-router-dom";
import ReactApexChart from "react-apexcharts";
//Sales Activity
export class Statistics2 extends React.Component<
  {},
  { options: any; series: any }
> {
  constructor(props: any) {
    super(props);
    this.state = {
      series: [
        {
          name: "Sales",
          data: [32, 15, 63, 51, 136, 62, 99, 42, 178, 76, 32, 180],
        },
      ],
      options: {
        chart: {
          height: 280,
          type: "line",
          zoom: {
            enabled: false,
          },
          dropShadow: {
            enabled: true,
            enabledOnSeries: undefined,
            top: 5,
            left: 0,
            blur: 3,
            color: "#000",
            opacity: 0.1,
          },
        },
        dataLabels: {
          enabled: false,
        },
        legend: {
          position: "top",
          horizontalAlign: "left",
          offsetX: -15,
          fontWeight: "bold",
        },
        stroke: {
          curve: "smooth",
          width: "3",
        },
        grid: {
          borderColor: "#f2f6f7",
        },
        colors: ["var(--primary-bg-color)" || "#1fc5db"],

        yaxis: {
          title: {
            text: "Growth",
            style: {
              color: "#adb5be",
              fontSize: "14px",
              fontFamily: "poppins, sans-serif",
              fontWeight: 600,
              cssClass: "apexcharts-yaxis-label",
            },
          },
          labels: {
            formatter: function (y: any) {
              return y.toFixed(0) + "";
            },
          },
        },
        xaxis: {
          type: "number",
          categories: [
            "1",
            "2",
            "3",
            "4",
            "5",
            "6",
            "7",
            "8",
            "9",
            "10",
            "11",
            "12",
          ],
          axisBorder: {
            show: true,
            color: "rgba(119, 119, 142, 0.05)",
            offsetX: 0,
            offsetY: 0,
          },
          axisTicks: {
            show: true,
            borderType: "solid",
            color: "rgba(119, 119, 142, 0.05)",
            width: 6,
            offsetX: 0,
            offsetY: 0,
          },
          labels: {
            rotate: -90,
          },
        },
      },
    };
  }

  render() {
    return (
      <div id="chart">
        <ReactApexChart
          options={this.state.options}
          series={this.state.series}
          type="line"
          height={270}
        />
      </div>
    );
  }
}
export class Budget extends React.Component<{}, { options: any; series: any }> {
  constructor(props: any) {
    super(props);

    this.state = {
      series: [
        {
          name: "This Week",
          data: [44, 42, 57, 86, 58, 55, 70],
        },
        {
          name: "Last Week",
          data: [-34, -22, -37, -56, -21, -35, -60],
        },
      ],
      options: {
        chart: {
          stacked: true,
          type: "bar",
          height: 250,
          borderRadius: 5,
          toolbar: {
            show: false,
          },
        },
        grid: {
          borderColor: "#f2f6f7",
        },
        colors: [
          "var(--primary-bg-color)" || "var(--primary-bg-color)",
          "#e4e7ed",
        ],
        plotOptions: {
          bar: {
            colors: {
              ranges: [
                {
                  from: -100,
                  borderRadius: 5,
                  to: -46,
                  color: "#ebeff5",
                },
                {
                  from: -45,
                  borderRadius: 5,
                  to: 0,
                  color: "#ebeff5",
                },
              ],
            },
            columnWidth: "25%",
          },
        },
        dataLabels: {
          enabled: false,
        },
        legend: {
          show: true,
          position: "top",
        },

        yaxis: {
          title: {
            style: {
              color: "#adb5be",
              fontSize: "14px",
              fontFamily: "poppins, sans-serif",
              fontWeight: 600,
              cssClass: "apexcharts-yaxis-label",
            },
          },
          labels: {
            formatter: function (y: any) {
              return y.toFixed(0) + "";
            },
          },
        },
        xaxis: {
          type: "day",
          categories: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "sat"],
          axisBorder: {
            show: true,
            color: "rgba(119, 119, 142, 0.05)",
            offsetX: 0,
            offsetY: 0,
          },
          axisTicks: {
            show: true,
            borderType: "solid",
            color: "rgba(119, 119, 142, 0.05)",
            width: 6,
            offsetX: 0,
            offsetY: 0,
          },

          labels: {
            rotate: -90,
          },
        },
      },
    };
  }

  render() {
    return (
      <div id="chart">
        <ReactApexChart
          options={this.state.options}
          series={this.state.series}
          type="bar"
          height={260}
        />
      </div>
    );
  }
}

export class Viewers1 extends React.Component<
  {},
  { options: any; series: any }
> {
  constructor(props: any) {
    super(props);

    this.state = {
      series: [
        {
          name: "Male",
          data: [51, 44, 55, 42, 58, 50, 62],
        },
        {
          name: "Female",
          data: [56, 58, 38, 50, 64, 45, 55],
        },
      ],
      options: {
        chart: {
          height: 270,
          type: "line",
          toolbar: {
            show: false,
          },
          background: "none",
          fill: "#fff",
        },
        grid: {
          borderColor: "#f2f6f7",
        },
        colors: [
          "var(--primary-bg-color)" || "var(--primary-bg-color)",
          "#e4e7ed",
        ],

        background: "transparent",
        dataLabels: {
          enabled: false,
        },
        stroke: {
          curve: "straight",
          width: 2,
        },

        legend: {
          show: true,
          position: "top",
        },

        xaxis: {
          show: false,
          axisBorder: {
            show: false,
            color: "rgba(119, 119, 142, 0.05)",
            offsetX: 0,
            offsetY: 0,
          },
          axisTicks: {
            show: false,
            borderType: "solid",
            color: "rgba(119, 119, 142, 0.05)",
            width: 6,
            offsetX: 0,
            offsetY: 0,
          },
          labels: {
            rotate: -90,
          },
        },
        yaxis: {
          show: false,
          axisBorder: {
            show: false,
          },
          axisTicks: {
            show: false,
          },
        },
        tooltip: {
          x: {
            format: "dd/MM/yy HH:mm",
          },
        },
      },
    };
  }

  render() {
    return (
      <div id="chart">
        <ReactApexChart
          options={this.state.options}
          series={this.state.series}
          type="line"
          height={270}
        />
      </div>
    );
  }
}

export const COLUMNS: any = [
  {
    Header: "Nome",
    Cell: ({ value }: any) => (
      <p style={{ color: "#2c7be5", cursor: "pointer", fontSize: 15 }}>
        {value}
      </p>
    ),
    accessor: "name_community",
    className: "text-center ",
  },
  {
    Header: "Grupos",
    accessor: "totalLinks",
    className: "text-center ",
  },
  {
    Header: "Cliques",
    accessor: "projClicks",
    className: "text-center ",
  },
  {
    Header: "Data Final",
    accessor: "endDate",
    className: "text-center ",
  },
  {
    Header: "Link",
    accessor: "entryLink",
    className: "text-center ",
  },
  {
    Header: "Status",
    accessor: "status",
  },
  {
    Header: "Opções",
    accessor: "options",
    className: "text-center ",
  },
];

const getItemOptions = () => {
  let options =
    '<a href="#!" class="link-primary projectLinks fas fa-users adminItem" title="Grupos da Campanha"></a>&nbsp;&nbsp;';

  if (true) {
    options +=
      '<button href="#!" class="btn btn-success btn-sm projectLeads fas fa-people-arrows" title="Relatório de Leads"></button> ';
    options +=
      '<button href="#!" class="btn btn-success btn-sm projectMessages fas fa-comment-dots" title="Mensagens Enviadas"></button> ';
  }

  if (true) {
    options +=
      '<a href="#!" class="link-warning projectEdit fas fa-edit" title="Alterar Campanha"></a>&nbsp;&nbsp;';
  }

  return { options };
};

export const DATATABLE = [
  {
    id: 1,
    name: "Projeto Teste",
    totalLinks: 0,
    totalClicks: 0,
    projClicks: 0,
    maxClicks: 0,
    endDate: new Date().toLocaleString("pt-BR").substring(0, 10),
    entryLink: "https://wtzp.link/r/",
    status: (
      <Form className="ms-auto">
        <Form.Check type="switch" id="custom-switch" onClick={() => {}} />
      </Form>
    ),
    options: (
      <span className="">
        <OverlayTrigger
          placement="top"
          overlay={<Tooltip>Grupos da Campanha</Tooltip>}
        >
          <Link to="#" className="btn btn-primary btn-sm rounded-11 me-2">
            <i className="fa fa-users"></i>
          </Link>
        </OverlayTrigger>
        <OverlayTrigger
          placement="top"
          overlay={<Tooltip>Alterar Campanha</Tooltip>}
        >
          <Link to="#" className="btn bg-yellow btn-sm rounded-11">
            <i className="fa fa-edit"></i>
          </Link>
        </OverlayTrigger>
      </span>
    ),
  },
];

export const GlobalFilter = ({ filter, setFilter }: any) => {
  return (
    <span className="d-flex ms-auto">
      <input
        value={filter || ""}
        onChange={(e) => setFilter(e.target.value)}
        className="form-control mb-4"
        placeholder="Filtrar..."
      />
    </span>
  );
};
