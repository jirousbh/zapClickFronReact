import React, { useEffect, useState } from "react";

import Select, { SingleValue } from "react-select";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
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
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";

import { GlobalFilter } from "../Dashboard/data";

import { setCampaignsList } from "../../redux/actions/campaign";
import { setSelectedUtm } from "../../redux/actions/shorteners";

import { SHORTENERS_COLUMNS } from "./ShortenersTableConfig";

import { getCampaignsList } from "../../services/CampaignsService";
import {
  deleteShortener,
  getShortenersList,
} from "../../services/ShortenersService";

export default function Dashboard() {
  let navigate = useNavigate();
  const dispatch = useDispatch();

  const campaignsList = useSelector(
    (state: any) => state.campaignReducer.campaignsList
  );
  const selectedCampaignId = useSelector(
    (state: any) => state.campaignReducer.selectedCampaignId
  );

  const [loading, setLoading] = useState<any>(false);

  const [campaignSelected, setCampaignSelected] = useState<any>(null);
  const [singleselect, setSingleselect] = useState<SingleValue<number>>(null);
  const [options, setOptions] = useState<any>([]);

  const [shortenersList, setShortenersList] = useState<any>([]);

  const tableInstance = useTable(
    {
      columns: SHORTENERS_COLUMNS,
      data: shortenersList,
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

  const setCampaignsOptions = async () => {
    let campaignsListLocal = campaignsList;
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

    if (campaignsMapped.length) {
      if (selectedCampaignId) {
        const selectedCampaign = campaignsMapped.find(
          (campaign: any) => campaign.id === selectedCampaignId
        );

        if (selectedCampaign) {
          onSelect(selectedCampaign);

          return setOptions(campaignsMapped);
        }
      }

      return setOptions(campaignsMapped);
    }
  };

  const goToCreate = (isEdit: boolean = false, link: any = null) => {
    let path = `${process.env.PUBLIC_URL}/shortener-new/`;

    if (isEdit && link) {
      dispatch(setSelectedUtm(link));
    } else {
      dispatch(setSelectedUtm(null));
    }

    navigate(path);
  };

  const deleteUtm = async (shortId: number) => {
    try {
      await deleteShortener({
        projectId: campaignSelected.id,
        shortId,
      });

      await setupShorteners(campaignSelected);
    } catch (error) {
      console.log(error);
    }
  };

  const setupShorteners = async (campaign: any) => {
    try {
      setLoading(true);

      const shortenersResponse = await getShortenersList(campaign.id);

      if (shortenersResponse?.data?.length) {
        const shortenersList = shortenersResponse?.data?.map((utm: any) => {
          return {
            id: utm.id,
            url:
              "<a href='https://wtzp.link/e/" +
              utm.url +
              "' target='_blank'>https://wtzp.link/e/" +
              utm.url +
              "</a>",
            utm_source: utm.utm_source,
            utm_medium: utm.utm_medium,
            utm_campaign: utm.utm_campaign,
            utm_term: utm.utm_term,
            utm_content: utm.utm_content,
            options: (
              <>
                <OverlayTrigger
                  placement="top"
                  overlay={<Tooltip>Editar Link UTM</Tooltip>}
                >
                  <Button
                    variant=""
                    className="btn ripple bg-yellow btn-sm rounded-11 me-2"
                    onClick={() => goToCreate(true, utm)}
                  >
                    <i className="fa fa-edit"></i>
                  </Button>
                </OverlayTrigger>
                <OverlayTrigger
                  placement="top"
                  overlay={<Tooltip>Editar Link UTM</Tooltip>}
                >
                  <Button
                    variant=""
                    className="btn ripple bg-yellow btn-sm rounded-11 me-2"
                    onClick={() => deleteUtm(utm.id)}
                  >
                    <i className="fa fa-trash"></i>
                  </Button>
                </OverlayTrigger>
              </>
            ),
          };
        });

        setShortenersList(shortenersList);
      } else {
        setShortenersList([
          {
            id: 0,
            url: "Nenhum Dado Encontrado...",
            utm_source: "",
            utm_medium: "",
            utm_campaign: "",
            utm_term: "",
            utm_content: "",
            options: "",
          },
        ]);
      }
    } catch (error) {
      setShortenersList([
        {
          id: 0,
          url: "Erro ao buscar os links...",
          utm_source: "",
          utm_medium: "",
          utm_campaign: "",
          utm_term: "",
          utm_content: "",
          options: "",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const onSelect = async (value: any) => {
    setSingleselect(value);
    setCampaignSelected(value);

    setupShorteners(value);
  };

  useEffect(() => {
    setCampaignsOptions();
  }, []);

  return (
    <React.Fragment>
      <div className="breadcrumb-header justify-content-between">
        <div className="left-content">
          <h1 className="main-content-title mg-b-0 mg-b-lg-1">Links UTM</h1>
          <h6 className="mb-4 tx-gray-500">
            Números gerais de UTM da sua campanha
          </h6>
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
          </div>
        </Col>
      </Row>
      {/* <!-- row closed --> */}

      {/* <!-- row  --> */}
      <Row>
        <Col sm={12} className="col-12 d-flex justify-content-end">
          <Button
            variant=""
            className="btn me-2 tx-18 btn-primary mb-4"
            onClick={() => goToCreate()}
          >
            Cadastrar Link UTM
          </Button>
        </Col>
      </Row>
      {/* <!-- row closed --> */}

      {/* <!-- row  --> */}
      <Row>
        <Col sm={12} className="col-12">
          <Card>
            <Card.Header>
              <h4 className="card-title">UTM's dessa campanha</h4>
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
