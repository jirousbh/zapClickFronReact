import React, { useRef, useEffect, useState } from "react";
import ReactApexChart from "react-apexcharts";
import {
  useTable,
  useSortBy,
  useGlobalFilter,
  usePagination,
} from "react-table";
import Select, { SingleValue } from "react-select";
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

import { COLUMNS, DATATABLE, GlobalFilter } from "../Dashboard/data";
import { COMPANIES_COLUMNS } from "./CompaniesTableConfig";
import { auth } from "../../Firebase/firebase";
import {
  createCompany,
  editCompany,
  getCompaniesList,
} from "../../services/CompaniesService";
import { setCompaniesList } from "../../redux/actions/companies";
import { useDispatch, useSelector } from "react-redux";

export default function Companies() {
  const dispatch = useDispatch();

  const [newCompanyModal, setNewCompanyModal] = useState(false);

  const [showHiddenCompanies, setShowHiddenCompanies] = useState(false);

  const [companiesFormated, setCompaniesFormated] = useState([]);

  const [company, setCompany] = useState<any>({
    type: "Cadastrar Empresa",
    id: "",
    name: "",
    active: "",
    isAdmin: "",
  });

  const { type, id, name, active, isAdmin } = company;

  const saveCompany = async () => {
    try {
      const company = {
        id,
        name,
        active,
        isAdmin,
      };
      const payload = {
        company,
        changes: {
          name,
        },
      };
      !id ? await createCompany({ name }) : await editCompany(payload);
      setupCompaniesList(true);
    } catch (error) {
      console.log(error);
    } finally {
      setCompany({
        id: "",
        name: "",
      });
      closeModal();
    }
  };
  console.log(type);

  const closeModal = () => {
    setNewCompanyModal(false);
    setCompany({
      type: "Cadastrar Empresa",
      id: "",
      name: "",
      active: "",
      isAdmin: "",
    });
  };

  const handleEditCompany = (company: any) => {
    setCompany({
      type: "Alterar Empresa",
      id: company.id,
      name: company.name,
      active: company.active,
      isAdmin: company.isAdmin,
    });

    setNewCompanyModal(true);
  };

  const changeHandler = (e: any) => {
    setCompany({ ...company, [e.target.name]: e.target.value });
  };

  const handleHideUnhideCompany = (company: any) => {
    editCompany({
      id,
      changes: {
        active: !company.active,
      },
    });

    setupCompaniesList(showHiddenCompanies);
  };

  const tableInstance = useTable(
    {
      columns: COMPANIES_COLUMNS,
      data: companiesFormated,
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

  const setupCompaniesList = async (showHidden: boolean) => {
    try {
      const fetchCompaniesResult = await getCompaniesList(null, showHidden);

      if (fetchCompaniesResult?.data.length) {
        const companiesMapped = fetchCompaniesResult.data.map(
          (company: any) => {
            return {
              id: company.id,
              name: company.name,
              options: (
                <span className="">
                  <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip>Alterar Empresa</Tooltip>}
                  >
                    <Button
                      variant=""
                      onClick={() => handleEditCompany(company)}
                      className="btn bg-yellow btn-sm rounded-11 me-2"
                    >
                      <i className="fa fa-edit"></i>
                    </Button>
                  </OverlayTrigger>

                  <OverlayTrigger
                    placement="top"
                    overlay={
                      <Tooltip>
                        {company.active
                          ? "Ocultar link"
                          : "Deixar Link Vísivel Novamente"}
                      </Tooltip>
                    }
                  >
                    <Button
                      variant=""
                      onClick={() => handleHideUnhideCompany(company)}
                      className="btn bg-red btn-sm rounded-11 me-2"
                      aria-controls=""
                    >
                      {showHiddenCompanies ? (
                        <i className="fas fa-eye-slash"></i>
                      ) : (
                        <i className="fas fa-eye"></i>
                      )}
                    </Button>
                  </OverlayTrigger>
                </span>
              ),
            };
          }
        );

        dispatch(setCompaniesList(fetchCompaniesResult));
        setCompaniesFormated(companiesMapped);
      }
    } catch (error) {
      console.log("error, fetchCompaniesResult", error);
    }
  };

  const handleHiddenCompanies = () => {
    setShowHiddenCompanies(!showHiddenCompanies);
    setupCompaniesList(!showHiddenCompanies);
  };

  useEffect(() => {
    setupCompaniesList(false);
  }, []);

  return (
    <React.Fragment>
      <div className="breadcrumb-header justify-content-between">
        <div className="left-content">
          <h1 className="main-content-title mg-b-0 mg-b-lg-1">Empresas</h1>
        </div>
      </div>
      {/* <!-- /breadcrumb --> */}

      {/* <!-- row  --> */}
      <Row>
        <Col sm={6} className="col-12">
          <Button
            variant=""
            className="btn me-2 tx-18 btn-primary mb-4"
            onClick={() => setNewCompanyModal(true)}
          >
            Cadastrar Empresa
          </Button>
        </Col>
        <Col sm={6} className="col-12 d-flex justify-content-end">
          <Button
            variant=""
            className="btn btn-outline-primary mb-4"
            onClick={handleHiddenCompanies}
          >
            {!showHiddenCompanies ? (
              <>
                <i className="fas fa-eye-slash me-2"></i>
                Exibir empresas ocultas
              </>
            ) : (
              <>
                <i className="fas fa-eye me-2"></i>
                Exibir empresas visíveis
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
              <h4 className="card-title">Lista de Empresas</h4>
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
        <Modal show={newCompanyModal}>
          <Modal.Header>
            <Modal.Title>{type}</Modal.Title>
            <Button variant="" className="btn btn-close" onClick={closeModal}>
              x
            </Button>
          </Modal.Header>
          <Modal.Body>
            <div className="">
              {" "}
              <Row className="mb-4">
                <Col lg={12}>
                  <Form.Group className="form-group">
                    <Form.Label className="">Nome</Form.Label>{" "}
                    <Form.Control
                      className="form-control"
                      placeholder="Nome da empresa"
                      name="name"
                      type="text"
                      value={name}
                      onChange={changeHandler}
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
                onClick={() => saveCompany()}
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
