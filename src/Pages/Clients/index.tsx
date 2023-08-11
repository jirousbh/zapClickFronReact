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
import { createClient, editClient } from "../../services/ClientsService";

export default function Clients() {
  const dispatch = useDispatch();

  const companiesList = useSelector(
    (state: any) => state.companiesReducer.companiesList
  );

  const [singleselect, setSingleselect] = useState<SingleValue<number>>(null);
  const [companiesOptions, setCompaniesOptions] = useState<any>([]);

  const [newClientModal, setNewClientModal] = useState(false);

  const [data, setData] = useState({
    id: "",
    name: "",
    email: "",
  });

  const { id, name, email } = data;

  const changeHandler = (e: any) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const tableInstance = useTable(
    {
      columns: CLIENTS_COLUMNS,
      data: [],
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

  const setupCompaniesList = () => {
    auth.onAuthStateChanged(async (user) => {
      let companiesListLocal = companiesList;
      if (!companiesListLocal.length) {
        const fetchCompaniesResult = await getCompaniesList(user?.email);

        if (fetchCompaniesResult?.data.length) {
          companiesListLocal = fetchCompaniesResult?.data;
          dispatch(setCompaniesList(fetchCompaniesResult?.data));
        }
      }

      const companiesMapped = companiesListLocal.map((company: any) => {
        return {
          value: company.id,
          label: company.name,
          data: company,
        };
      });

      if (companiesMapped.length) {
        setSingleselect(companiesMapped[0]);

        return setCompaniesOptions(companiesMapped);
      }
    });
  };

  const saveCompany = () => {
    if (!singleselect) return;

    try {
      id
        ? // @ts-ignore
          createClient({ name, company: singleselect.id, email })
        : // @ts-ignore
          editClient({ id, name, company: singleselect.id, email });
    } catch (error) {
      console.log(error);
    } finally {
      setNewClientModal(false);
    }
  };

  useEffect(() => {
    setupCompaniesList();
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
            <Modal.Title>Cadastrar cliente</Modal.Title>
            <Button
              variant=""
              className="btn btn-close"
              onClick={() => setNewClientModal(false)}
            >
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
                      onChange={changeHandler}
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
                      name="name"
                      type="text"
                      value={name}
                      onChange={changeHandler}
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
                onClick={() => saveCompany()}
              >
                Confirmar
              </Button>{" "}
              <Button
                variant=""
                aria-label="Close"
                className="btn ripple btn-danger pd-x-25"
                type="button"
                onClick={() => setNewClientModal(false)}
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
