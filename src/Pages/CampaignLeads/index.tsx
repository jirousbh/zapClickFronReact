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
  ProgressBar,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import QRCodeStyling from "qr-code-styling";

import * as Dashboarddata from "../../components/Dashboard/Dashboard-1/data";
import {
  COLUMNS,
  DATATABLE,
  GlobalFilter,
} from "../../components/Dashboard/Dashboard-1/data";
import { LEADS_COLUMNS } from "./CampaignLeadsTableConfig";

export default function Dashboard() {
  const [campaignSelected, setCampaignSelected] = useState<any>(null);
  const [singleselect, setSingleselect] = useState<SingleValue<number>>(null);
  const [options, setOptions] = useState<any>([]);

  const qrCodeRef = useRef<HTMLElement | undefined>();

  const tableInstance = useTable(
    {
      columns: LEADS_COLUMNS,
      data: [],
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  const onSelect = (value: any) => {
    setSingleselect(value);
    setCampaignSelected(value);
  };

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

  const setCampaignsOptions = () => {
    const campaignsMapped = DATATABLE.map((campaign) => {
      return {
        value: campaign.id,
        label: campaign.name,
        data: campaign,
      };
    });

    setOptions(campaignsMapped);

    if (campaignsMapped.length) {
      onSelect(campaignsMapped[0]);
    }
  };

  useEffect(() => {
    // setCampaignsOptions();
  }, []);

  return (
    <React.Fragment>
      <div className="breadcrumb-header justify-content-between">
        <div className="left-content">
          <h1 className="main-content-title mg-b-0 mg-b-lg-1">Leads</h1>
        </div>
      </div>
      {/* <!-- /breadcrumb --> */}

      {/* <!-- row --> */}
      <Row>
        <Col xl={6} lg={12} md={12} xs={12}>
          <div>
            <div className="mb-4">
              <p className="mg-b-10">Campanha:</p>
              <div className=" SlectBox">
                <Select
                  defaultValue={singleselect}
                  onChange={onSelect}
                  options={options}
                  placeholder="Selecione uma campanha"
                  classNamePrefix="selectform"
                />
              </div>
            </div>

            <h6 className="mb-4 tx-gray-500">
              Números gerais e grupos da sua campanha
            </h6>
          </div>
        </Col>
        {singleselect ? (
          <Col
            xl={6}
            lg={12}
            md={12}
            xs={12}
            className="d-flex align-items-center"
          >
            <Button
              variant=""
              className="d-flex align-items-center btn me-2 btn-primary mb-4"
            >
              <i className="fa fa-edit tx-16 text-white"></i>
              <div className="pb-0 mt-0 mg-l-10">Editar campanha</div>
            </Button>
            <Button
              variant=""
              className="d-flex align-items-center btn me-2 bg-green mb-4"
            >
              <i className="fa fa-magnet tx-16 text-white"></i>
              <div className="pb-0 mt-0 mg-l-10">Ver leads</div>
            </Button>
            <Button
              variant=""
              className="d-flex align-items-center btn me-2 bg-green mb-4"
            >
              <i className="fa fa-link tx-16 text-white"></i>
              <div className="pb-0 mt-0 mg-l-10">Ver links (Legado)</div>
            </Button>
          </Col>
        ) : null}
      </Row>
      {/* <!-- row closed --> */}

      {/* <!-- row --> */}
      {campaignSelected ? (
        <Row>
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
          <Col xl={3} lg={12} md={12} xs={12}>
            <Card className="sales-card">
              <Row>
                <div className="col-8">
                  <div className="ps-4 pt-4 pe-3 pb-4">
                    <div className="">
                      <h6 className="mb-2 tx-12">Data final</h6>
                    </div>
                    <div className="pb-0 mt-0">
                      <div className="d-flex">
                        <h4 className="tx-22 font-weight-semibold mb-2">
                          {campaignSelected.data.endDate}
                        </h4>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-4">
                  <div className="circle-icon bg-warning-transparent text-center align-self-center overflow-hidden">
                    <i className="fa fa-calendar tx-16 text-warning"></i>
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
                      <h6 className="mb-2 tx-12">Links de acesso</h6>
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
                    <i className="fa fa-link tx-16 text-primary"></i>
                  </div>
                </div>
              </Row>
            </Card>
          </Col>
        </Row>
      ) : null}
      {/* <!-- row closed --> */}

      {/* <!-- row  --> */}
      <Row>
        <Col sm={12} className="col-12 d-flex justify-content-end">
          <Button variant="" className="btn me-2 btn-primary mb-4">
            Importar leads
          </Button>
          <Button variant="" className="btn me-2 btn-secondary mb-4">
            Importar leads (Usando API)
          </Button>
        </Col>
      </Row>
      {/* <!-- row closed --> */}

      {/* <!-- row  --> */}
      <Row>
        <Col sm={12} className="col-12">
          <Card>
            <Card.Header>
              <h4 className="card-title">Leads dessa campanha</h4>
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
