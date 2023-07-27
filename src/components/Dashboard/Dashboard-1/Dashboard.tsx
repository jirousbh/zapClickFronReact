import React from "react";
import ReactApexChart from "react-apexcharts";
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
  ProgressBar,
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import * as Dashboarddata from "./data";
import { COLUMNS, DATATABLE, GlobalFilter } from "./data";
export default function Dashboard() {
  const tableInstance = useTable(
    {
      columns: COLUMNS,
      data: DATATABLE,
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

  let navigate = useNavigate();

  const routeChange = () => {
    let path = `${process.env.PUBLIC_URL}/new-campaign/`;
    navigate(path);
  };

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
                      <h4 className="tx-22 font-weight-semibold mb-2">20</h4>
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
                      <h4 className="tx-22 font-weight-semibold mb-2">10</h4>
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
                      <h4 className="tx-22 font-weight-semibold mb-2">5</h4>
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
                      <h4 className="tx-22 font-weight-semibold mb-2">5</h4>
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
        <Col sm={12} className="col-12">
          <Button
            variant=""
            className="btn me-2 btn-primary mb-4"
            onClick={() => routeChange()}
          >
            Criar Campanha
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
