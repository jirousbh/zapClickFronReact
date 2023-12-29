import React, { useEffect, useState, useCallback } from "react";
import {
  useTable,
  useSortBy,
  useGlobalFilter,
  usePagination,
} from "react-table";
import { Col, Row, Card, Button } from "react-bootstrap";
import { GlobalFilter } from "../Dashboard/data";
import { LEADS_COLUMNS } from "./CampaignLeadsTableConfig";
import {
  getCampaignsList,
  getLeadsSumaryByGroups,
} from "../../services/CampaignsService";
import { useDispatch, useSelector } from "react-redux";
import { setCampaignsList } from "../../redux/actions/campaign";
import Select from "../../components/Select";

export default function CampaignLeads() {
  const [campaignSelected, setCampaignSelected] = useState<any>([]);
  const [campaignOptions, setCampaignOptions] = useState<any>([]);
  const [leadTotal, setLeadTotal] = useState<any>(null);

  const selectedCampaignId = useSelector(
    (state: any) => state.campaignReducer.selectedCampaignId
  );

  const campaignsList = useSelector(
    (state: any) => state.campaignReducer.campaignsList
  );

  const dispatch = useDispatch();

  const fetchLeads = async (campaignId: any) => {
    try {
      const leads = await getLeadsSumaryByGroups(campaignId);
      const parseLeads = leads.data.map((lead: any) => ({
        ...lead,
        total: lead.entering + lead.leaving,
        current: lead.entering - lead.leaving,
      }));

      setCampaignSelected(parseLeads);

      const entering = parseLeads.reduce(
        (acc: any, lead: any) => acc + lead.entering,
        0
      );

      const leaving = parseLeads.reduce(
        (acc: any, lead: any) => acc + lead.leaving,
        0
      );
      console.log(
        `${parseLeads[0].daybr} a ${parseLeads[parseLeads.length - 1].daybr}`
      );
      setLeadTotal({
        entering,
        leaving,
        period: `${parseLeads[0].daybr} a ${
          parseLeads[parseLeads.length - 1].daybr
        }`,
        campaignId,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleCampaignSelect = ({ value }: any) => {
    const selectedCampaign = campaignOptions.find(
      (campaign: any) => campaign.value === value
    );
    fetchLeads(selectedCampaign.value);
  };

  const onSelect = async (campaign: any) => {
    fetchLeads(campaign.value);
  };

  const setCampaignsOptions = async () => {
    let campaignsListLocal = campaignsList;
    console.log(selectedCampaignId, "@@@ selectedCampaignId");
    if (!campaignsListLocal.length) {
      const fetchCampaignsResult = await getCampaignsList(false);

      if (fetchCampaignsResult?.data.length) {
        campaignsListLocal = fetchCampaignsResult?.data;
        dispatch(setCampaignsList(fetchCampaignsResult?.data));
      }
    }

    const campaignsMapped = campaignsListLocal.map((campaign: any) => {
      return {
        value: campaign.id,
        label: campaign.name,
        data: campaign,
      };
    });

    if (!campaignsMapped.length) return;

    if (!!selectedCampaignId) {
      const campaigns = campaignsMapped.map((campaign: any) => ({
        ...campaign,
        selected: campaign.value === selectedCampaignId,
      }));

      const selectedCampaign = campaigns.find(
        (campaign: any) => campaign.value === selectedCampaignId
      );

      onSelect(selectedCampaign);
      setCampaignOptions(campaigns);
      return;
    }

    const campaigns = campaignsMapped.map((campaign: any, index: any) => ({
      ...campaign,
      selected: index === 0,
    }));

    onSelect(campaigns[0]);
    setCampaignOptions(campaigns);
  };

  const tableInstance = useTable(
    {
      columns: LEADS_COLUMNS,
      data: campaignSelected,
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

  useEffect(() => {
    setCampaignsOptions();
  }, []);

  const htmlToCSV = (html: any, filename: any) => {
    var data = [];
    const rows = html.querySelectorAll("table tr");

    for (var i = 0; i < rows.length; i++) {
      const row = [],
        cols = rows[i].querySelectorAll("td, th");

      for (let j = 0; j < cols.length; j++) {
        row.push(cols[j].innerText);
      }

      data.push(row.join(","));
    }

    //downloadCSVFile(data.join("\n"), filename);
    let csv = data.join("\n");
    let csv_file, download_link;

    csv_file = new Blob([csv], { type: "text/csv" });

    download_link = document.createElement("a");

    download_link.download = filename;

    download_link.href = window.URL.createObjectURL(csv_file);

    download_link.style.display = "none";

    document.body.appendChild(download_link);

    download_link.click();
  };

  const getTable = () => {
    const html = document.getElementById("tbLinkList");
    htmlToCSV(html, `${leadTotal.campaignId}_list.csv`);
  };

  return (
    <React.Fragment>
      <div>
        <div className="left-content">
          <h1 className="main-content-title mg-b-0 mg-b-lg-1">Leads</h1>
            <div className="mb-4">
              <p className="mg-b-10">Campanha:</p>
              <Select
                options={campaignOptions}
                onChange={(e) =>
                  handleCampaignSelect({ value: e.target.value })
                }
              />
          </div>
        </div>
        {/*    <div>
          <Col sm={12} className="col-12">
            <Button
              variant=""
              className="btn me-2 btn-primary mb-4"
              onClick={() => getTable()}
            >
              <i className="fas fa-plus me-2"></i>
              Exportar CSV
            </Button>
          </Col>
        </div> */}
      </div>
      {leadTotal ? (
        <Row>
          <Col xl={3} lg={12} md={12} xs={12}>
            <Card className="sales-card">
              <Row>
                <div className="col-8">
                  <div className="ps-4 pt-4 pe-3 pb-4">
                    <div className="">
                      <h6 className="mb-2 tx-12">TOTAL DE LEADS</h6>
                    </div>
                    <div className="pb-0 mt-0">
                      <div className="d-flex">
                        <h4 className="tx-22 font-weight-semibold mb-2">
                          {leadTotal.entering - leadTotal.leaving}
                        </h4>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-4">
                  <div className="circle-icon bg-warning-transparent text-center align-self-center overflow-hidden">
                    <i className="fe fe-trending-up tx-16 text-success"></i>
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
                      <h6 className="mb-2 tx-12">TOTAL DE SAÍDAS</h6>
                    </div>
                    <div className="pb-0 mt-0">
                      <div className="d-flex">
                        <h4 className="tx-22 font-weight-semibold mb-2">
                          {leadTotal.leaving}
                        </h4>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-4">
                  <div className="circle-icon bg-warning-transparent text-center align-self-center overflow-hidden">
                    <i className="fe fe-trending-down tx-16 text-secondary"></i>
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
                      <h6 className="mb-2 tx-12">TOTAL DE ENTRADAS</h6>
                    </div>
                    <div className="pb-0 mt-0">
                      <div className="d-flex">
                        <h4 className="tx-22 font-weight-semibold mb-2">
                          {leadTotal.entering}
                        </h4>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-4">
                  <div className="circle-icon bg-warning-transparent text-center align-self-center overflow-hidden">
                    <i className="fe fe-arrow-up-circle tx-16 text-primary"></i>
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
                      <h6 className="mb-2 tx-12">PERÍODO</h6>
                    </div>
                    <div className="pb-0 mt-0">
                      <div className="d-flex">
                        <span className="tx-16 font-weight-semibold mb-2">
                          {leadTotal.period}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-4">
                  <div className="circle-icon bg-warning-transparent text-center align-self-center overflow-hidden">
                    <i className="fas fa-calendar text-muted tx-16"></i>
                  </div>
                </div>
              </Row>
            </Card>
          </Col>
        </Row>
      ) : null}
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
                      {[10, 25, 50, 100].map((pageSize) => (
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
                    id="tbLinkList"
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
