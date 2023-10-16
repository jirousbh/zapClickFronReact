import React, { useRef, useEffect, useState } from "react";

import ReactApexChart from "react-apexcharts";
import Select, { SingleValue } from "react-select";
import { useDispatch, useSelector } from "react-redux";
import {
  Breadcrumb,
  Col,
  Row,
  Card,
  Button,
  Modal,
  Form,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import {
  useTable,
  useSortBy,
  useGlobalFilter,
  usePagination,
} from "react-table";

import { COLUMNS, DATATABLE, GlobalFilter } from "../Dashboard/data";

import { auth } from "../../Firebase/firebase";

import { setCompaniesList } from "../../redux/actions/companies";

import { CLIENTS_COLUMNS } from "./ClientsTableConfig";

import { getCompaniesList } from "../../services/CompaniesService";
import {
  createClient,
  editClient,
  getClient,
} from "../../services/ClientsService";
import { parseClient } from "../../utils/common";

export default function Clients() {
  const dispatch = useDispatch();

  const companiesList = useSelector(
    (state: any) => state.companiesReducer.companiesList
  );

  const [singleselect, setSingleselect] = useState<any>(null);
  const [companiesOptions, setCompaniesOptions] = useState<any>([]);

  const [clientsFormated, setClientsFormated] = useState([]);

  const [showHiddenClients, setShowHiddenClients] = useState(false);
  const [newClientModal, setNewClientModal] = useState(false);

  const [formValues, setFormValues] = useState({
    type: "Cadastrar Cliente",
    id: "",
    name: "",
    email: "",
  });

  const handleChangeValue = (name: string, value: string) => {
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  const { type, id, name, email } = formValues;

  const tableInstance = useTable(
    {
      columns: CLIENTS_COLUMNS,
      data: clientsFormated,
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  const {
    getTableProps,
    headerGroups,
    getTableBodyProps,
    prepareRow,
    state,
    setGlobalFilter,
    page,
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

  const setCompanies = async () => {
    const fetchCompaniesResult = await getCompaniesList(null);

    if (fetchCompaniesResult?.data.length) {
      dispatch(setCompaniesList(fetchCompaniesResult?.data));
      return fetchCompaniesResult?.data;
    }
  };

  const handleEditClient = (client: any) => {
    setFormValues({
      type: "Alterar Cliente",
      id: client.id,
      name: client.name,
      email: client.email,
    });
    setSingleselect({ label: client.company.name, value: client.company.id });
    setNewClientModal(true);
  };

  const closeModal = () => {
    setFormValues({
      type: "Cadastrar Cliente",
      id: "",
      name: "",
      email: "",
    });
    setNewClientModal(false);
  };

  const handleHideUnhideClient = (client: any, company: any) => {
    editClient({
      client: client.id,
      company,
      changes: {
        active: !client.active,
      },
    });

    setupClientsList(showHiddenClients);
  };

  const setupClientsList = async (showHidden: boolean = false) => {
    let companiesListLocal = companiesList;
    if (!companiesListLocal.length) {
      companiesListLocal = await setCompanies();
    }
    try {
      const { data: clients } = await getClient(null, showHidden);
      if (clients?.length) {
        const { data: companies } = await getCompaniesList(null, true);
        const newClient = parseClient(clients, companies);

        const clientsMapped = newClient.map((client: any) => {
          return {
            ...client,
            options: (
              <span className="">
                <OverlayTrigger
                  placement="top"
                  overlay={<Tooltip>Alterar Cliente</Tooltip>}
                >
                  <Button
                    variant=""
                    onClick={() => handleEditClient(client)}
                    className="btn bg-yellow btn-sm rounded-11 me-2"
                  >
                    <i className="fa fa-edit"></i>
                  </Button>
                </OverlayTrigger>

                <OverlayTrigger
                  placement="top"
                  overlay={
                    <Tooltip>
                      {client.active
                        ? "Ocultar link"
                        : "Deixar Link Vísivel Novamente"}
                    </Tooltip>
                  }
                >
                  <Button
                    variant=""
                    onClick={() =>
                      handleHideUnhideClient(client, client.companyId)
                    }
                    className="btn btn-danger btn-sm rounded-11 me-2"
                  >
                    {client.active ? (
                      <i className="fas fa-eye-slash"></i>
                    ) : (
                      <i className="fas fa-eye"></i>
                    )}
                  </Button>
                </OverlayTrigger>
              </span>
            ),
          };
        });

        const selectCompanies = companies.map((company: any) => {
          return {
            label: company.name,
            value: company.id,
          };
        });

        setSingleselect(selectCompanies[0]);
        setCompaniesOptions(selectCompanies);
        setClientsFormated(clientsMapped);
      }
    } catch (error) {
      console.log("error, fetchClientsResult", error);
    }
  };

  const saveClient = async () => {
    if (!singleselect) return;

    try {
      !id
        ? // @ts-ignore
          await createClient({ name, company: singleselect.value, email })
        : // @ts-ignore
          await editClient({ id, company: singleselect.value, name, email });
      setupClientsList();
    } catch (error) {
      console.log(error);
    } finally {
      closeModal();
    }
  };

  useEffect(() => {
    setupClientsList();
  }, []);

  return (
    <React.Fragment>
      <div className="breadcrumb-header justify-content-between">
        <div className="left-content">
          <h1 className="main-content-title mg-b-0 mg-b-lg-1">Clients</h1>
        </div>
      </div>
      {/* <!-- /breadcrumb --> */}

      {/* <!-- row  --> */}
      <Row>
        <Col sm={12} className="col-12 d-flex justify-content-end">
          <Button
            variant=""
            className="btn me-2 tx-18 btn-primary mb-4"
            onClick={() => setNewClientModal(true)}
          >
            Cadastrar Cliente
          </Button>
        </Col>
      </Row>
      {/* <!-- row closed --> */}

      {/* <!-- row  --> */}
      <Row>
        <Col sm={12} className="col-12">
          <Card>
            <Card.Header>
              <h4 className="card-title">Lista de clientes</h4>
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

        <Modal show={newClientModal}>
          <Modal.Header>
            <Modal.Title>{type}</Modal.Title>
            <Button variant="" className="btn btn-close" onClick={closeModal}>
              x
            </Button>
          </Modal.Header>
          <Modal.Body>
            <div className="">
              {" "}
              <Row className="mb-2">
                <Col lg={12}>
                  <Form.Group className="form-group">
                    <Form.Label className="">Nome</Form.Label>{" "}
                    <Form.Control
                      className="form-control"
                      placeholder="Nome do cliente"
                      name="name"
                      type="text"
                      value={name}
                      onChange={(e) =>
                        handleChangeValue("name", e.target.value)
                      }
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row className="mb-2">
                <Col lg={12}>
                  <Form.Group className="form-group">
                    <Form.Label className="">Email</Form.Label>{" "}
                    <Form.Control
                      className="form-control"
                      placeholder="Email"
                      name="email"
                      type="text"
                      value={email}
                      onChange={(e) =>
                        handleChangeValue("email", e.target.value)
                      }
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row className="mb-2">
                <Col lg={12}>
                  <div className="mb-4">
                    <p className="mg-b-10">Empresa</p>
                    <div className=" SlectBox">
                      <Select
                        defaultValue={singleselect}
                        onChange={setSingleselect}
                        options={companiesOptions}
                        placeholder="Selecione uma empresa"
                        classNamePrefix="selectform"
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
                onClick={() => saveClient()}
              >
                Confirmar
              </Button>{" "}
              <Button
                variant=""
                aria-label="Close"
                className="btn ripple btn-danger pd-x-25"
                type="button"
                onClick={closeModal}
              >
                Fechar
              </Button>{" "}
            </div>
          </Modal.Body>
        </Modal>
      </Row>
    </React.Fragment>
  );
}
