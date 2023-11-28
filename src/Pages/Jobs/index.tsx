// @ts-nocheck
import React, { useEffect, useState } from "react";

import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
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

import { GlobalFilter } from "../Dashboard/data";

import { JOBS_COLUMNS, JOB_LOGS_COLUMNS } from "./JobsTableConfig";

import {
  deleteJob,
  editJob,
  getJobsList,
  getJobLogs,
  sendJob
} from "../../services/JobsService";
import Select from "../../components/Select";

export default function Jobs() {
  const [showEndedCampaigns, setShowEndedCampaigns] = useState(false);
  const [error, setError] = useState(false);
  const [loadingJobs, setLoadingJobs] = useState(false);
  const [jobsList, setJobsList] = useState([]);
  const [openModalEdit, setOpenModalEdit] = useState(false);
  const [openModalDelete, setOpenModalDelete] = useState(false);
  const [openModalSend, setOpenModalSend] = useState(false);
  const [openModalJobLogs, setOpenModalJobLogs] = useState(false);
  const [jobId, setJobId] = useState(null);
  const [jobLogs, setJobLogs] = useState([]);
  const [singleselect, setSingleselect] = useState<any>(null);
  const [jobOptions, setJobOptions] = useState<any>([]);
  const [jobName, setJobName] = useState("");
  const [formValues, setFormValues] = useState({
    type: "",
    id: "",
    startTime: "",
    firstGrpId: "",
    lastGrpId: "",
    minInterval: "",
    maxInterval: "",
    phone: "",
  });

  const openJobLogsModal = async (jobId: string | number, jobName) => {
    try {
      const { data: jobLogs } = await getJobLogs(jobId);

      const jobLogsFormatted = jobLogs.map((job) => {
        const statusSuccess = job.success ? "success" : "danger";
        const className = `badge bg-${statusSuccess}`;
        const success = (
          <span className={className}>{job.success ? "Sim" : "Não"}</span>
        );
        console.log(job.success, className, success);

        return { ...job, success };
      });
      setJobLogs(jobLogsFormatted);
      setJobName(jobName);
      setOpenModalJobLogs(true);
    } catch (error) {
      console.log(error, "@@@ ErrorFetchJobLogs");
    }
  };

  const handleChangeValue = (name: string, value: string) => {
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  const [topCardsInfo, setTopCardsInfo] = useState({
    totalJobs: 0,
    alreadyToExecute: 0,
    concludedWithSuccess: 0,
    concludedWithError: 0,
  });

  const tableJobLogsInstance = useTable(
    {
      columns: JOB_LOGS_COLUMNS,
      data: jobLogs,
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  );

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

  const calculateJobs = (jobs, statusId) => {
    return jobs.filter((job) => job.statusId === statusId).length;
  };

  const openModalEditJob = (job) => {
    setFormValues({
      type: `Alterar Agendamento de: ${job.name}`,
      id: String(job.jobId),
      startTime: job.startTimeStr,
      firstGrpId: String(job.firstGrpId),
      lastGrpId: String(job.lastGrpId),
      minInterval: String(job.minInterval),
      maxInterval: String(job.maxInterval),
    });
    const status = [
      {
        value: "0",
        label: "0 - Desativado",
      },
      { value: "1", label: "1 - Pronto pra Execução" },
      { value: "2", label: "2 - Executando" },
      { value: "3", label: "3 - Finalizado com Erros" },
      { value: "4", label: "4 - Finalizado com Sucesso" },
      { value: "5", label: "5 - A enviar a confirmação" },
    ];

    setSingleselect({
      value: String(job.statusId),
      label: `${job.statusId} - ${job.description}`,
    });

    setJobOptions(status);
    setOpenModalEdit(true);
  };

  const closeModalEditJob = () => {
    setFormValues({
      type: `Alterar Agendamento de: ${""}`,
      id: "",
      name: "",
      startTime: "",
      firstGrpId: "",
      lastGrpId: "",
      minInterval: "",
      maxInterval: "",
      phone: "",
    });
    setOpenModalEdit(false);
  };

  const openModalDeleteJob = (jobId: string | number) => {
    setJobId(jobId);
    setOpenModalDelete(true);
  };

  const editJobList = async () => {
    try {
      await editJob({ ...formValues, status: singleselect.value });
      closeModalEditJob();
      loadJobs();
    } catch (error) {
      console.log(error);
    }
  };

  const deleteJobList = async () => {
    try {
      await deleteJob(jobId);
      setOpenModalDelete(false);
      loadJobs();
    } catch (error) {
      console.log(error);
    }
  };

  const openModalSendJob = (id, name) => {
    setJobName(name);
    setJobId(id)
    setOpenModalSend(true);
  };

  const sendJobList = async () => {
    try {
      await sendJob(jobId, formValues.phone)
      closeModalSendJob();
    } catch(error) {
      console.log(`[sendJob] - ${error}`)
    }
  };

  const closeModalSendJob = () => {
    setOpenModalSend(false);
    setFormValues({
      ...formValues,
      phone: "",
    });
  };

  const setupJobsList = function (jobs, admin = false) {
    if (jobs.length) {
      const jobsUpdated = jobs.map((job) => {
        const className = `badge bg-${job.classList}`;
        const status = (
          <span className={className}>
            {job.statusId} - {job.description}
          </span>
        );

        return {
          jobId: job.jobId,
          name: job.name,
          projectId: null,
          startTime: job.startTimeStr,
          groups: job.firstGrpId + " a " + job.lastGrpId,
          interval: job.minInterval + " a " + job.maxInterval + " seg",
          status,
          options: (
            <span className="">
              <OverlayTrigger
                placement="top"
                overlay={<Tooltip>Enviar Job</Tooltip>}
              >
                <Button
                  variant=""
                  onClick={() => openModalSendJob(job.jobId, job.name)}
                  className="btn btn-primary btn-sm rounded-11 me-2"
                >
                  <i className="fa fa-paper-plane"></i>
                </Button>
              </OverlayTrigger>
              <OverlayTrigger
                placement="top"
                overlay={<Tooltip>Ver Logs</Tooltip>}
              >
                <Button
                  variant=""
                  onClick={() => openJobLogsModal(job.jobId, job.name)}
                  className="btn btn-dark btn-sm rounded-11 me-2"
                >
                  <i className="fa fa-file"></i>
                </Button>
              </OverlayTrigger>
              <OverlayTrigger
                placement="top"
                overlay={<Tooltip>Editar Job</Tooltip>}
              >
                <Button
                  variant=""
                  onClick={() => openModalEditJob(job)}
                  className="btn bg-yellow btn-sm rounded-11 me-2"
                >
                  <i className="fa fa-edit"></i>
                </Button>
              </OverlayTrigger>
              <OverlayTrigger
                placement="top"
                overlay={<Tooltip>Remover Job</Tooltip>}
              >
                <Button
                  variant=""
                  onClick={() => openModalDeleteJob(job.jobId)}
                  className="btn btn-danger btn-sm rounded-11 me-2"
                >
                  <i className="fas fa-trash"></i>
                </Button>
              </OverlayTrigger>
            </span>
          ),
        };
      });

      setJobsList(jobsUpdated);

      setTopCardsInfo({
        totalJobs: jobs?.length | 0,
        alreadyToExecute: calculateJobs(jobs, 1),
        concludedWithSuccess: calculateJobs(jobs, 4),
        concludedWithError: calculateJobs(jobs, 3),
      });
    }
    /*     } else {
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
    } */
  };

  const loadJobs = async function (showEnded: boolean = false) {
    setLoadingJobs(true);

    try {
      const { data: jobs } = await getJobsList(showEnded);
      console.log(jobs, "@@@ jobs");
      setupJobsList(jobs, false);
    } catch (error) {
    } finally {
      setLoadingJobs(false);
    }
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
                  <i className="fa fa-check-square tx-16 text-success"></i>
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
                  <i className="fa fa-ban tx-16 text-danger"></i>
                </div>
              </div>
            </Row>
          </Card>
        </Col>
      </Row>
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
        <Modal show={openModalEdit}>
          <Modal.Header>
            <Modal.Title>{formValues.type}</Modal.Title>
            <Button
              variant=""
              className="btn btn-close"
              onClick={() => closeModalEditJob()}
            >
              x
            </Button>
          </Modal.Header>
          <Modal.Body>
            <div className="">
              <Row className="mb-2">
                <Col lg={12}>
                  <Form.Group className="form-group">
                    <Form.Label className="">Data/Hora de Envio</Form.Label>{" "}
                    <input
                      type="datetime-local"
                      defaultValue={formValues.startTime}
                      onChange={(e) =>
                        handleChangeValue(
                          "startTime",
                          e.target.value.replace("T", " ")
                        )
                      }
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row className="mb-2">
                <Col lg={12}>
                  <Form.Group className="form-group">
                    <Form.Label className="">Faixa de Grupos</Form.Label>{" "}
                    <div style={{ display: "flex", flexDirection: "row" }}>
                      <Form.Control
                        className="form-control"
                        name="Faixa de Grupos"
                        type="number"
                        defaultValue={formValues.firstGrpId}
                        onChange={(e) =>
                          handleChangeValue("firstGrpId", e.target.value)
                        }
                        style={{ width: 80 }}
                        min={0}
                        required
                      />
                      <Form.Control
                        className="form-control"
                        name="Faixa de Grupos"
                        type="number"
                        defaultValue={formValues.lastGrpId}
                        onChange={(e) =>
                          handleChangeValue("lastGrpId", e.target.value)
                        }
                        style={{ width: 80 }}
                        min={0}
                        required
                      />
                    </div>
                  </Form.Group>
                </Col>
              </Row>
              <Row className="mb-2">
                <Col lg={12}>
                  <Form.Group className="form-group">
                    <Form.Label className="">Intervalo de Envio</Form.Label>{" "}
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                      }}
                    >
                      <Form.Control
                        className="form-control"
                        name="Intervalo de Envio"
                        type="number"
                        defaultValue={formValues.minInterval}
                        onChange={(e) =>
                          handleChangeValue("minInterval", e.target.value)
                        }
                        style={{ width: 80 }}
                        min={0}
                        required
                      />
                      <Form.Control
                        className="form-control"
                        name="Intervalo de Envio"
                        type="number"
                        defaultValue={formValues.maxInterval}
                        onChange={(e) =>
                          handleChangeValue("maxInterval", e.target.value)
                        }
                        style={{ width: 80 }}
                        min={0}
                        required
                      />
                      <p style={{ marginLeft: 5 }}>seg</p>
                    </div>
                  </Form.Group>
                </Col>
              </Row>
              <Row className="mb-2">
                <Col lg={12}>
                  <div className="mb-4">
                    <p className="mg-b-10">Status</p>
                    <div className=" SlectBox">
                      <Select
                        select={singleselect}
                        options={jobOptions}
                        onChange={(e) =>
                          setSingleselect({ value: e.target.value })
                        }
                      />
                    </div>
                  </div>
                </Col>
              </Row>
              <Button
                variant=""
                aria-label="Confirm"
                className="btn ripple btn-primary pd-x-25"
                type="button"
                onClick={() => editJobList()}
              >
                Confirmar
              </Button>{" "}
              <Button
                variant=""
                aria-label="Close"
                className="btn ripple btn-danger pd-x-25"
                type="button"
                onClick={() => closeModalEditJob()}
              >
                Fechar
              </Button>{" "}
            </div>
          </Modal.Body>
        </Modal>
        <Modal show={openModalDelete}>
          <Modal.Body>
            <div>
              <p>Tem certeza qeu deseja excluir o agendamento?</p>
              <Button
                variant=""
                aria-label="Confirm"
                className="btn ripple btn-primary pd-x-25"
                type="button"
                onClick={() => deleteJobList()}
              >
                Confirmar
              </Button>{" "}
              <Button
                variant=""
                aria-label="Close"
                className="btn ripple btn-danger pd-x-25"
                type="button"
                onClick={() => setOpenModalDelete(false)}
              >
                Fechar
              </Button>{" "}
            </div>
          </Modal.Body>
        </Modal>
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
      <Modal show={openModalSend}>
        <Modal.Header>
          <Modal.Title>Testar Envio de: {jobName}</Modal.Title>
          <Button
            variant=""
            className="btn btn-close"
            onClick={closeModalSendJob}
          >
            x
          </Button>
        </Modal.Header>
        <Modal.Body>
          <div className="">
            <Row className="mb-2">
              <Col lg={12}>
                <Form.Group className="form-group">
                  <Form.Label className="">Telefone para envio</Form.Label>{" "}
                  <Form.Control
                    className="form-control"
                    name="Telefone para envio"
                    placeholder="5531XXXXXXXXX"
                    type="text"
                    onChange={(e) => handleChangeValue("phone", e.target.value)}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <Button
              variant=""
              aria-label="Confirm"
              className="btn ripple btn-primary pd-x-25"
              type="button"
              onClick={sendJobList}
            >
              Confirmar
            </Button>{" "}
            <Button
              variant=""
              aria-label="Close"
              className="btn ripple btn-danger pd-x-25"
              type="button"
              onClick={closeModalSendJob}
            >
              Cancelar
            </Button>{" "}
          </div>
        </Modal.Body>
      </Modal>
      <Modal show={openModalJobLogs} size="lg" style={{ width: "100%" }}>
        <Modal.Header>
          <Modal.Title>Logs de: {jobName}</Modal.Title>
          <Button
            variant=""
            className="btn btn-close"
            onClick={() => setOpenModalJobLogs(false)}
          >
            x
          </Button>
        </Modal.Header>
        <Modal.Body style={{ width: "100%" }}>
          {" "}
          {/* Job Logs Table*/}
          <div className="table-responsive">
            {!!jobLogs.length ? (
              <table
                {...tableJobLogsInstance.getTableProps()}
                className="table table-bordered text-nowrap mb-0"
              >
                <thead>
                  {tableJobLogsInstance.headerGroups.map((headerGroup: any) => (
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

                <tbody {...tableJobLogsInstance.getTableBodyProps()}>
                  {tableJobLogsInstance.page.map((row: any) => {
                    tableJobLogsInstance.prepareRow(row);
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
            ) : (
              <h4>Não foi Encontrado Logs para esse Agendamento.</h4>
            )}
          </div>
        </Modal.Body>
      </Modal>
    </React.Fragment>
  );
}
