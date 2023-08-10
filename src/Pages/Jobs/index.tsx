// @ts-nocheck
import React, { useEffect, useState } from "react";

import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  useTable,
  useSortBy,
  useGlobalFilter,
  usePagination,
} from "react-table";
import {
  Col,
  Row,
  Card,
  Button,
  Form,
  OverlayTrigger,
  Tooltip,
  Spinner,
  Modal,
} from "react-bootstrap";

import { GlobalFilter } from "../../components/Dashboard/Dashboard-1/data";

import { JOBS_COLUMNS } from "./JobsTableConfig";

import { getJobsList } from "../../services/JobsService";
import { getCampaignsList } from "../../../services/CampaignsService";

import { toDateTime } from "../../../utils/dates";

export default function Jobs() {
  let navigate = useNavigate();
  const dispatch = useDispatch();

  const [showEndedCampaigns, setShowEndedCampaigns] = useState(false);

  const [error, setError] = useState(false);

  const [loadingJobs, setLoadingJobs] = useState(false);
  const [jobsList, setJobsList] = useState([]);

  const [topCardsInfo, setTopCardsInfo] = useState({
    totalJobs: 0,
    alreadyToExecute: 0,
    concludedWithSuccess: 0,
    concludedWithError: 0,
  });

  const tableInstance = useTable(
    {
      columns: JOBS_COLUMNS,
      data: jobsList,
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

  const navigateToNewCampaign = (
    isEdit: boolean = false,
    seletedCampaignId = null
  ) => {
    let path = `${process.env.PUBLIC_URL}/new-campaign/`;

    // if (isEdit && seletedCampaignId) {
    //   dispatch(setSelectedCampaignId(seletedCampaignId));
    // } else {
    //   dispatch(setSelectedCampaignId(null));
    // }

    navigate(path);
  };

  const navigateTo = (navigateToPath: string, seletedCampaignId = null) => {
    let path = `${process.env.PUBLIC_URL}/${navigateToPath}`;

    // dispatch(setSelectedCampaignId(seletedCampaignId));

    navigate(path);
  };

  const setupJobsList = function (data, admin = false) {
    // const user = auth.onAuthStateChanged((user) => console.log("user", user));

    if (data.length) {
      let totalStatus = [0, 0, 0, 0, 0];

      const jobsUpdated = data.map((job) => {
        totalStatus[doc.status]++;

        const params = JSON.parse(job.params);

        bdStatus =
          '<span class="badge bg-' +
          doc.classList +
          '">' +
          doc.statusId +
          " - " +
          doc.description +
          "</span>";

        return {
          jobId: job.jobId,
          name: job.name,
          projectId: null,
          startTime: job.startTimeStr,
          groups: job.firstGrpId + " a " + job.lastGrpId,
          interval: job.minInterval + " a " + job.maxInterval + " seg",
          status: bdStatus,
          options: null,
          //   options: (
          //     <span className="">
          //       <OverlayTrigger
          //         placement="top"
          //         overlay={<Tooltip>Grupos da Campanha</Tooltip>}
          //       >
          //         <Link
          //           to="#"
          //           onClick={() => navigateTo("campaign-groups/", campaign.id)}
          //           className="btn btn-primary btn-sm rounded-11 me-2"
          //         >
          //           <i className="fa fa-users"></i>
          //         </Link>
          //       </OverlayTrigger>

          //       {campaign.useZapi ? (
          //         <>
          //           <OverlayTrigger
          //             placement="top"
          //             overlay={<Tooltip>Relatório de Leads</Tooltip>}
          //           >
          //             <Link
          //               to="#"
          //               onClick={() => navigateTo("campaign-leads/", campaign.id)}
          //               className="btn bg-green btn-sm rounded-11 me-2"
          //             >
          //               <i className="fa fa-magnet"></i>
          //             </Link>
          //           </OverlayTrigger>

          //           <OverlayTrigger
          //             placement="top"
          //             overlay={<Tooltip>Mensagens Enviadas</Tooltip>}
          //           >
          //             <Link
          //               to="#"
          //               onClick={() =>
          //                 navigateTo("project-messages/", campaign.id)
          //               }
          //               className="btn bg-green btn-sm rounded-11 me-2"
          //             >
          //               <i className="fa fa-comment-dots"></i>
          //             </Link>
          //           </OverlayTrigger>
          //         </>
          //       ) : null}

          //       {admin ? (
          //         <OverlayTrigger
          //           placement="top"
          //           overlay={<Tooltip>Alterar Campanha</Tooltip>}
          //         >
          //           <Link
          //             to="#"
          //             onClick={() => navigateToNewCampaign(true, campaign.id)}
          //             className="btn bg-yellow btn-sm rounded-11"
          //           >
          //             <i className="fa fa-edit"></i>
          //           </Link>
          //         </OverlayTrigger>
          //       ) : null}
          //     </span>
          //   ),
        };
      });

      setJobsList(jobsUpdated);

      setTopCardsInfo({
        totalJobs: data?.length | 0,
        alreadyToExecute: totalStatus[1],
        concludedWithSuccess: totalStatus[3],
        concludedWithError: totalStatus[4],
      });
    } else {
      setJobsList([
        {
          jobId: "",
          name: "Nenhum Dado Encontrado...",
          projectId: "",
          startTime: "",
          groups: "",
          interval: "",
          status: "",
          options: "",
        },
      ]);
    }
  };

  const loadJobs = async function (showEnded: boolean = false) {
    setLoadingJobs(true);

    try {
      const fetchJobsResult = await getJobsList(showEnded);

      setupJobsList(fetchJobsResult.data, false);
    } catch (error) {
      setError(true);

      setJobsList([
        {
          id: 0,
          name: "Erro ao buscar os agendamentos...",
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
    } finally {
      setLoadingJobs(false);
    }
  };

  const handleEndedCampaigns = () => {
    setShowEndedCampaigns(!showEndedCampaigns);
    loadJobs(!showEndedCampaigns);
  };

  useEffect(() => {
    loadJobs();
  }, []);

  const LoadingSpinner = () => (
    <Spinner
      animation="border"
      variant="primary"
      className="spinner-border me-2 text-primary"
      role="status"
    >
      <span className="sr-only">Carregando...</span>
    </Spinner>
  );

  return (
    <React.Fragment>
      <div className="breadcrumb-header justify-content-between">
        <div className="left-content">
          <h1 className="main-content-title mg-b-0 mg-b-lg-1">AGENDAMENTOS</h1>
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
                    <h6 className="mb-2 tx-12">Total de Agendamentos</h6>
                  </div>
                  <div className="pb-0 mt-0">
                    <div className="d-flex">
                      <h4 className="tx-22 font-weight-semibold mb-2">
                        {!loadingJobs ? (
                          topCardsInfo.totalJobs
                        ) : (
                          <LoadingSpinner />
                        )}
                      </h4>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-4">
                <div className="circle-icon bg-warning-transparent text-center align-self-center overflow-hidden">
                  <i className="fa fa-users tx-16 text-warning"></i>
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
                    <h6 className="mb-2 tx-12">Prontos para execução</h6>
                  </div>
                  <div className="pb-0 mt-0">
                    <div className="d-flex">
                      <h4 className="tx-22 font-weight-semibold mb-2">
                        {!loadingJobs ? (
                          topCardsInfo.alreadyToExecute
                        ) : (
                          <LoadingSpinner />
                        )}
                      </h4>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-4">
                <div className="circle-icon bg-warning-transparent text-center align-self-center overflow-hidden">
                  <i className="fa fa-clock tx-16 text-primary"></i>
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
                    <h6 className="mb-2 tx-12">Finalizados com sucesso</h6>
                  </div>
                  <div className="pb-0 mt-0">
                    <div className="d-flex">
                      <h4 className="tx-22 font-weight-semibold mb-2">
                        {!loadingJobs ? (
                          topCardsInfo.concludedWithSuccess
                        ) : (
                          <LoadingSpinner />
                        )}
                      </h4>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-4">
                <div className="circle-icon bg-warning-transparent text-center align-self-center overflow-hidden">
                  <i className="fa fa-rocket tx-16 text-success"></i>
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
                    <h6 className="mb-2 tx-12">Finalizados com Erro</h6>
                  </div>
                  <div className="pb-0 mt-0">
                    <div className="d-flex">
                      <h4 className="tx-22 font-weight-semibold mb-2">
                        {!loadingJobs ? (
                          topCardsInfo.concludedWithError
                        ) : (
                          <LoadingSpinner />
                        )}
                      </h4>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-4">
                <div className="circle-icon bg-warning-transparent text-center align-self-center overflow-hidden">
                  <i className="fa fa-error tx-16 text-secondary"></i>
                </div>
              </div>
            </Row>
          </Card>
        </Col>
      </Row>
      {/* <!-- row closed --> */}

      {/* <!-- row  --> */}
      <Row>
        <Col sm={12} className="col-12">
          <Card>
            <Card.Header>
              <h4 className="card-title">Lista de Agendamentos</h4>
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

      <Modal show={error}>
        <Modal.Header>
          <Button
            variant=""
            className="btn btn-close"
            onClick={() => setError(false)}
          >
            x
          </Button>
        </Modal.Header>
        <Modal.Body>
          <div className="tx-center">
            {" "}
            <i className="icon icon ion-ios-close-circle-outline tx-100 tx-danger lh-1 mg-t-20 d-inline-block"></i>{" "}
            <h4 className="tx-danger mg-b-20">
              Erro ao buscar a lista de agendamentos
            </h4>{" "}
            <p className="mg-b-20 mg-x-20">
              Desculpe, ocorreu um erro ao tentar buscar a lista de
              agendamentos.
              <br />
              Por favor tente novamente, caso o erro continue, entre em contato
              com o admiistrador do sitema.
            </p>
            <Button
              variant=""
              aria-label="Close"
              className="btn ripple btn-danger pd-x-25"
              type="button"
              onClick={() => setError(false)}
            >
              Fechar
            </Button>{" "}
          </div>
        </Modal.Body>
      </Modal>
    </React.Fragment>
  );
}
