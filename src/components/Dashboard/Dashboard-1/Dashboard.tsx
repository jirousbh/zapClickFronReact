// @ts-nocheck
import React, { useEffect, useState } from "react";

import { Link, useNavigate } from "react-router-dom";
import {
  useTable,
  useSortBy,
  useGlobalFilter,
  usePagination,
} from "react-table";
import {
  Breadcrumb,
  Col,
  Row,
  Card,
  Button,
  Form,
  OverlayTrigger,
  Tooltip,
  ProgressBar,
} from "react-bootstrap";

import * as Dashboarddata from "./data";
import { COLUMNS, DATATABLE, GlobalFilter } from "./data";

import * as FirebaseService from "../../../services/FirebaseService";
import { toDateTime } from "../../../utils/dates";
import { auth } from "../../../Firebase/firebase";

export default function Dashboard() {
  let navigate = useNavigate();

  const [showHidden, setShowHidden] = useState(false);
  const [showEndedCampaigns, setShowEndedCampaigns] = useState(false);

  const [loadingCampaigns, setLoadingCampaigns] = useState(false);
  const [campaignsList, setCampaignsList] = useState([]);

  const [topCardsInfo, setTopCardsInfo] = useState({
    totalCampaigns: 0,
    activeCampaigns: 0,
    totalLinks: 0,
    totalClicks: 0,
  });

  const tableInstance = useTable(
    {
      columns: COLUMNS,
      data: campaignsList,
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  const {
    getTableProps, // table props from react-table
    headerGroups, // headerGroups, if your table has groupings
    getTableBodyProps, // table body props from react-table
    prepareRow, // Prepare the row (this function needs to be called for each row before getting the row props)
    state,
    setGlobalFilter,
    page, // use, page or rows
    nextPage,
    previousPage,
    canNextPage,
    canPreviousPage,
    pageOptions,
    gotoPage,
    pageCount,
    setPageSize,
  }: any = tableInstance;

  const { globalFilter, pageIndex, pageSize } = state;

  const navigateToCreateNewCampaign = () => {
    let path = `${process.env.PUBLIC_URL}/new-campaign/`;
    navigate(path);
  };

  const navigateToEditCampaign = () => {};

  const navigateToCampaignGroups = () => {};

  const navigateToCampaignMessages = () => {};

  const navigateToLeads = () => {};

  const setupProjectList = function (data, admin = false) {
    // const user = auth.onAuthStateChanged((user) => console.log("user", user));

    if (data.length) {
      const campaignsUpdated = data.map((campaign) => {
        return {
          id: campaign.id,
          name: <Link to="#">{campaign.name}</Link>,
          totalLinks: campaign.totalLinks,
          projClicks:
            campaign.totalClicks +
            "/" +
            campaign.maxClicks * campaign.totalLinks,
          endDate: toDateTime(campaign.endDate["_seconds"] + 10800)
            .toLocaleString("pt-BR")
            .substring(0, 10),
          entryLink: (
            <Link to={`https://wtzp.link/r/${campaign.entryLink}`}>
              {`https://wtzp.link/r/${campaign.entryLink}`}
              <i className="fas primary fa-external-link-alt ms-2"></i>
            </Link>
          ),
          status: (
            <Form className="ms-auto">
              <Form.Check
                checked={campaign.active}
                type="switch"
                id="custom-switch"
                onChange={() => {}}
              />
            </Form>
          ),
          options: (
            <span className="">
              <OverlayTrigger
                placement="top"
                overlay={<Tooltip>Grupos da Campanha</Tooltip>}
              >
                <Link
                  to="#"
                  onClick={navigateToCampaignGroups}
                  className="btn btn-primary btn-sm rounded-11 me-2"
                >
                  <i className="fa fa-users"></i>
                </Link>
              </OverlayTrigger>

              {campaign.useZapi ? (
                <>
                  <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip>Relatório de Leads</Tooltip>}
                  >
                    <Link
                      to="#"
                      onClick={navigateToEditCampaign}
                      className="btn bg-green btn-sm rounded-11 me-2"
                    >
                      <i className="fa fa-magnet"></i>
                    </Link>
                  </OverlayTrigger>

                  <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip>Mensagens Enviadas</Tooltip>}
                  >
                    <Link
                      to="#"
                      onClick={navigateToEditCampaign}
                      className="btn bg-green btn-sm rounded-11 me-2"
                    >
                      <i className="fa fa-comment-dots"></i>
                    </Link>
                  </OverlayTrigger>
                </>
              ) : null}

              {admin ? (
                <OverlayTrigger
                  placement="top"
                  overlay={<Tooltip>Alterar Campanha</Tooltip>}
                >
                  <Link
                    to="#"
                    onClick={navigateToEditCampaign}
                    className="btn bg-yellow btn-sm rounded-11"
                  >
                    <i className="fa fa-edit"></i>
                  </Link>
                </OverlayTrigger>
              ) : null}
            </span>
          ),
        };
      });

      setCampaignsList(campaignsUpdated);

      const activeCampaigns = data.filter((campaign) => {
        const projEndDate = new Date(campaign.endDate._seconds * 1000);
        const actualDate = new Date();

        return campaign.active && projEndDate > actualDate;
      }).length;

      const totalClicks = data.reduce((acumulador, campaign) => {
        return acumulador + campaign.totalClicks;
      }, 0);
      const totalLinks = data.reduce((acumulador, campaign) => {
        return acumulador + campaign.totalLinks;
      }, 0);

      setTopCardsInfo({
        totalCampaigns: data?.length | 0,
        activeCampaigns,
        totalLinks,
        totalClicks,
      });
    } else {
      setCampaignsList([
        {
          id: 0,
          name: "Nenhum Dado Encontrado...",
          entryLink: "",
          description: "",
          companyId: "",
          company: "",
          clientId: "",
          client: "",
          maxClicks: "",
          endDate: "",
          endDateLabel: "",
          options: "",
        },
      ]);
    }
  };

  const loadCampaigns = async function (showEnded: boolean = false) {
    const fetchProjResult = await FirebaseService.callFirebaseFunction(
      "fetchProjects",
      {
        showEnded,
      }
    );

    setupProjectList(fetchProjResult.data, false);
  };

  const handleEndedCampaigns = () => {
    setShowEndedCampaigns(!showEndedCampaigns);
    loadCampaigns(!showEndedCampaigns);
  };

  useEffect(() => {
    loadCampaigns();
  }, []);

  return (
    <React.Fragment>
      <div className="breadcrumb-header justify-content-between">
        <div className="left-content">
          <h1 className="main-content-title mg-b-0 mg-b-lg-1">CAMPANHAS</h1>
          <h6 className="tx-gray-500">
            Acompanhe os números gerais das suas campanhas e grupos
          </h6>
        </div>
      </div>
      {/* <!-- /breadcrumb --> */}

      {/* <!-- row --> */}
      <Row>
        <Col xl={3} lg={12} md={12} xs={12}>
          <Card className="sales-card">
            <Row>
              <div className="col-8">
                <div className="ps-4 pt-4 pe-3 pb-4">
                  <div className="">
                    <h6 className="mb-2 tx-12">Total de campanhas</h6>
                  </div>
                  <div className="pb-0 mt-0">
                    <div className="d-flex">
                      <h4 className="tx-22 font-weight-semibold mb-2">
                        {topCardsInfo.totalCampaigns}
                      </h4>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-4">
                <div className="circle-icon bg-warning-transparent text-center align-self-center overflow-hidden">
                  <i className="fa fa-folder tx-16 text-warning"></i>
                </div>
              </div>
            </Row>
          </Card>
        </Col>
        <Col xl={3} lg={12} md={12} xs={12}>
          <Card className="sales-card">
            <Row>
              <div className="col-8">
                <div className="ps-4 pt-4 pe-3 pb-4">
                  <div className="">
                    <h6 className="mb-2 tx-12">Campanhas ativas</h6>
                  </div>
                  <div className="pb-0 mt-0">
                    <div className="d-flex">
                      <h4 className="tx-22 font-weight-semibold mb-2">
                        {topCardsInfo.activeCampaigns}
                      </h4>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-4">
                <div className="circle-icon bg-warning-transparent text-center align-self-center overflow-hidden">
                  <i className="fa fa-folder-open tx-16 text-primary"></i>
                </div>
              </div>
            </Row>
          </Card>
        </Col>
        <Col xl={3} lg={12} md={12} xs={12}>
          <Card className="sales-card">
            <Row>
              <div className="col-8">
                <div className="ps-4 pt-4 pe-3 pb-4">
                  <div className="">
                    <h6 className="mb-2 tx-12">Total de grupos</h6>
                  </div>
                  <div className="pb-0 mt-0">
                    <div className="d-flex">
                      <h4 className="tx-22 font-weight-semibold mb-2">
                        {topCardsInfo.totalLinks}
                      </h4>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-4">
                <div className="circle-icon bg-warning-transparent text-center align-self-center overflow-hidden">
                  <i className="fa fa-users tx-16 text-success"></i>
                </div>
              </div>
            </Row>
          </Card>
        </Col>
        <Col xl={3} lg={12} md={12} xs={12}>
          <Card className="sales-card">
            <Row>
              <div className="col-8">
                <div className="ps-4 pt-4 pe-3 pb-4">
                  <div className="">
                    <h6 className="mb-2 tx-12">Total de cliques</h6>
                  </div>
                  <div className="pb-0 mt-0">
                    <div className="d-flex">
                      <h4 className="tx-22 font-weight-semibold mb-2">
                        {topCardsInfo.totalClicks}
                      </h4>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-4">
                <div className="circle-icon bg-warning-transparent text-center align-self-center overflow-hidden">
                  <i className="fa fa-mouse-pointer tx-16 text-secondary"></i>
                </div>
              </div>
            </Row>
          </Card>
        </Col>
      </Row>
      {/* <!-- row closed --> */}

      {/* <!-- row  --> */}
      <Row>
        <Col sm={6} className="col-12">
          <Button
            variant=""
            className="btn me-2 btn-primary mb-4"
            onClick={() => navigateToCreateNewCampaign()}
          >
            Criar Campanha
          </Button>
        </Col>
        <Col sm={6} className="col-12 d-flex justify-content-end">
          <Button
            variant=""
            className="btn btn-outline-primary mb-4"
            onClick={handleEndedCampaigns}
          >
            {!showEndedCampaigns ? (
              <>
                <i className="fas fa-eye-slash me-2"></i>
                Exibir Campanhas Finalizadas
              </>
            ) : (
              <>
                <i className="fas fa-eye me-2"></i>
                Exibir Campanhas Ativas
              </>
            )}
          </Button>
        </Col>
      </Row>
      {/* <!-- row closed --> */}

      {/* <!-- row  --> */}
      <Row>
        <Col sm={12} className="col-12">
          <Card>
            <Card.Header>
              <h4 className="card-title">Lista de campanhas</h4>
            </Card.Header>
            <Card.Body className=" pt-0">
              <div className="table-responsive">
                <>
                  <div className="d-flex">
                    <select
                      className=" mb-4 selectpage border me-1"
                      value={pageSize}
                      onChange={(e: any) => setPageSize(Number(e.target.value))}
                    >
                      {[10, 25, 50].map((pageSize) => (
                        <option key={pageSize} value={pageSize}>
                          Exibir {pageSize}
                        </option>
                      ))}
                    </select>
                    <GlobalFilter
                      filter={globalFilter}
                      setFilter={setGlobalFilter}
                    />
                  </div>
                  <table
                    {...getTableProps()}
                    className="table table-bordered text-nowrap mb-0"
                  >
                    <thead>
                      {headerGroups.map((headerGroup: any) => (
                        <tr {...headerGroup.getHeaderGroupProps()}>
                          {headerGroup.headers.map((column: any) => (
                            <th
                              {...column.getHeaderProps(
                                column.getSortByToggleProps()
                              )}
                              className={column.className}
                            >
                              <span className="tabletitle">
                                {column.render("Header")}
                              </span>
                              <span>
                                {column.isSorted ? (
                                  column.isSortedDesc ? (
                                    <i className="fa fa-angle-down"></i>
                                  ) : (
                                    <i className="fa fa-angle-up"></i>
                                  )
                                ) : (
                                  ""
                                )}
                              </span>
                            </th>
                          ))}
                        </tr>
                      ))}
                    </thead>
                    <tbody {...getTableBodyProps()}>
                      {page.map((row: any) => {
                        prepareRow(row);
                        return (
                          <tr className="text-center" {...row.getRowProps()}>
                            {row.cells.map((cell: any) => {
                              return (
                                <td {...cell.getCellProps()}>
                                  {cell.render("Cell")}
                                </td>
                              );
                            })}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                  <div className="d-block d-sm-flex mt-4 ">
                    <span className="">
                      Página{" "}
                      <strong>
                        {pageIndex + 1} de {pageOptions.length}
                      </strong>{" "}
                    </span>
                    <span className="ms-sm-auto ">
                      <Button
                        variant=""
                        className="btn-default tablebutton me-2 d-sm-inline d-block my-1"
                        onClick={() => gotoPage(0)}
                        disabled={!canPreviousPage}
                      >
                        {" Anterior "}
                      </Button>
                      <Button
                        variant=""
                        className="btn-default tablebutton me-2 my-1"
                        onClick={() => {
                          previousPage();
                        }}
                        disabled={!canPreviousPage}
                      >
                        {" << "}
                      </Button>
                      <Button
                        variant=""
                        className="btn-default tablebutton me-2 my-1"
                        onClick={() => {
                          previousPage();
                        }}
                        disabled={!canPreviousPage}
                      >
                        {" < "}
                      </Button>
                      <Button
                        variant=""
                        className="btn-default tablebutton me-2 my-1"
                        onClick={() => {
                          nextPage();
                        }}
                        disabled={!canNextPage}
                      >
                        {" > "}
                      </Button>
                      <Button
                        variant=""
                        className="btn-default tablebutton me-2 my-1"
                        onClick={() => {
                          nextPage();
                        }}
                        disabled={!canNextPage}
                      >
                        {" >> "}
                      </Button>
                      <Button
                        variant=""
                        className="btn-default tablebutton me-2 d-sm-inline d-block my-1"
                        onClick={() => gotoPage(pageCount - 1)}
                        disabled={!canNextPage}
                      >
                        {" Próximo "}
                      </Button>
                    </span>
                  </div>
                </>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </React.Fragment>
  );
}
