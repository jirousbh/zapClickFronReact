import React, { useRef, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import QRCodeStyling from "qr-code-styling";
import { Link, useNavigate } from "react-router-dom";
import {
  Col,
  Row,
  Card,
  Button,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import { GROUPS_COLUMNS } from "./GroupsTableConfig";
import {
  setCampaignsList,
  setSelectedCampaignId,
} from "../../redux/actions/campaign";
import { getCampaignsList } from "../../services/CampaignsService";
import { secondsToDhms, toDateTime } from "../../utils/dates";
import { getGroupsByCampaign } from "../../services/GroupsService";
import { pad } from "../../utils/number";
import { setSelectedGroup } from "../../redux/actions/groups";
import Select from "../../components/Select";
import Table from "../../components/Table";

export default function Dashboard() {
  const dispatch = useDispatch();

  const campaignsList = useSelector(
    (state: any) => state.campaignReducer.campaignsList
  );
  const selectedCampaignId = useSelector(
    (state: any) => state.campaignReducer.selectedCampaignId
  );

  const [campaignGroups, setCampaignGroups] = useState<any>([]);

  const [singleSelectCampaign, setSingleSelectCampaign] = useState<any>(null);
  const [campaignOptions, setCampaignOptions] = useState<any>([]);

  let navigate = useNavigate();

  const navigateTo = (navigateToPath: string) => {
    let path = `${process.env.PUBLIC_URL}/${navigateToPath}`;

    dispatch(setSelectedCampaignId(singleSelectCampaign.value));

    navigate(path);
  };

  const qrCodeRef = useRef<HTMLElement | undefined>();

  const navigateToNewGroup = (
    isEdit: boolean = false,
    selectedGroup: any = null,
    registerMultipleGroups: boolean = false
  ) => {
    let path = `${process.env.PUBLIC_URL}/new-group/`;
    if (isEdit && selectedGroup) {
      dispatch(setSelectedGroup({ selectedGroup, registerMultipleGroups }));
      dispatch(setSelectedCampaignId(selectedGroup.projectId));
    } else {
      dispatch(
        setSelectedGroup({ selectedGroup: null, registerMultipleGroups })
      );
      dispatch(setSelectedCampaignId(null));
    }

    navigate(path);
  };

  const setupGroups = async (campaign: any) => {
    const groupsResponse = await getGroupsByCampaign(campaign.value);
    if (groupsResponse?.data?.length) {
      const groupsList = groupsResponse?.data?.map((group: any) => {
        const urtToShow =
          group.url.length > 35
            ? group.url.substring(0, 35) + "..."
            : group.url;

        let activeTime;
        if (!(group.startTime && group.endTime)) activeTime = "N/A";
        else {
          let diffBettweenDates =
            group.endTime._seconds - group.startTime._seconds;

          activeTime = secondsToDhms(diffBettweenDates);
        }

        return {
          linkId: group.id,
          id: pad(group.id),
          url: (
            <a
              href={`${group.url}`}
              target="_blank"
              rel="noreferrer"
              style={{ color: "#2c7be5" }}
            >
              {urtToShow}
            </a>
          ),
          urlFull: group.url,
          clickCount: group.clickCount + "/" + group.maxClicks,
          projectId: group.projectId,
          project: campaign.data.name,
          activeTime: activeTime,
          startTime: group.startTime
            ? toDateTime(group.startTime["_seconds"]).toLocaleString("pt-BR")
            : "N/A",
          endTime: group.endTime
            ? toDateTime(group.endTime["_seconds"]).toLocaleString("pt-BR")
            : "N/A",
          userLead: group.leadUser || 0,
          isFull: group.isFull,
          entranceRate: group.entranceRate
            ? (group.entranceRate * 100).toFixed(2) + "%"
            : "N/A",

          options: (
            <span className="">
              {group.isFull ? (
                <OverlayTrigger
                  placement="top"
                  overlay={<Tooltip>Ativar Link</Tooltip>}
                >
                  <Link
                    to="#"
                    onClick={() => {}}
                    className="btn btn-primary btn-sm rounded-11 me-2"
                  >
                    <i className="fa fa-link"></i>
                  </Link>
                </OverlayTrigger>
              ) : (
                <OverlayTrigger
                  placement="top"
                  overlay={<Tooltip>Desativar Link</Tooltip>}
                >
                  <Link
                    to="#"
                    onClick={() => {}}
                    className="btn btn-primary btn-sm rounded-11 me-2"
                  >
                    <i className="fa fa-link"></i>
                  </Link>
                </OverlayTrigger>
              )}

              <OverlayTrigger
                placement="top"
                overlay={<Tooltip>Alterar Grupo</Tooltip>}
              >
                <Button
                  variant=""
                  className="btn ripple bg-yellow btn-sm rounded-11 me-2"
                  onClick={() => navigateToNewGroup(true, group)}
                >
                  <i className="fa fa-edit"></i>
                </Button>
              </OverlayTrigger>

              {group.clickCount && group.id === groupsResponse?.data?.length ? (
                <OverlayTrigger
                  placement="top"
                  overlay={<Tooltip>Apagar Grupo</Tooltip>}
                >
                  <Link
                    to="#"
                    onClick={() => {}}
                    className="btn bg-danger btn-sm rounded-11"
                  >
                    <i className="fa fa-trash"></i>
                  </Link>
                </OverlayTrigger>
              ) : null}
            </span>
          ),
        };
      });

      setCampaignGroups(groupsList);
    } else {
      setCampaignGroups([
        {
          linkId: 0,
          id: 0,
          url: "Nenhum Dado Encontrado...",
          urlFull: "",
          clickCount: "",
          projectId: "",
          project: "",
          activeTime: "",
          startTime: "",
          endTime: "",
          userLead: "",
          isFull: "",
          entranceRate: "",
          options: "",
        },
      ]);
    }
  };

  const onSelect = async (campaign: any) => {
    console.log(campaign, "@@@ campaign");
    setSingleSelectCampaign(campaign);

    setupGroups(campaign);
  };

  const handleCampaignSelect = ({ value }: any) => {
    const selectedCampaign = campaignOptions.find(
      (campaign: any) => campaign.value === value
    );
    setSingleSelectCampaign(selectedCampaign);
    setupGroups(singleSelectCampaign);
  };

  const setQrCode = () => {
    if (!singleSelectCampaign) return;

    const qrCodeStyling = new QRCodeStyling({
      width: 280,
      height: 280,
      type: "svg",
      data: singleSelectCampaign?.data?.entryLink || "",
      dotsOptions: {
        color: "#000000",
        type: "rounded",
      },
      backgroundOptions: {
        color: "#FFFFFF",
      },
      imageOptions: {
        crossOrigin: "anonymous",
      },
    });

    qrCodeStyling.append(qrCodeRef.current);
  };

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

  useEffect(() => {
    setCampaignsOptions();
  }, []);

  useEffect(() => {
    setQrCode();
  }, []);

  return (
    <React.Fragment>
      <div className="breadcrumb-header justify-content-between">
        <div className="left-content">
          <h1 className="main-content-title mg-b-0 mg-b-lg-1">Grupos</h1>
        </div>
      </div>

      <Row>
        <Col xl={6} lg={12} md={12} xs={12}>
          <div>
            <div className="mb-4">
              <p className="mg-b-10">Campanha:</p>
              <div className=" SlectBox">
                <Select
                  options={campaignOptions}
                  onChange={(e) =>
                    handleCampaignSelect({ value: e.target.value })
                  }
                />
              </div>
            </div>

            <h6 className="mb-4 tx-gray-500">
              Números gerais e grupos da sua campanha
            </h6>
          </div>
        </Col>
        {singleSelectCampaign ? (
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
              onClick={() => navigateTo("new-campaign/")}
            >
              <i className="fa fa-edit tx-16 text-white"></i>
              <span className="pb-0 mt-0 mg-l-10">Editar campanha</span>
            </Button>
            <Button
              variant=""
              className="d-flex align-items-center btn me-2 bg-green mb-4"
              onClick={() => navigateTo("campaign-leads/")}
            >
              <i className="fa fa-magnet tx-16 text-white"></i>
              <span className="pb-0 mt-0 mg-l-10">Ver leads</span>
            </Button>
            <Button
              variant=""
              className="d-flex align-items-center btn me-2 bg-green mb-4"
            >
              <i className="fa fa-link tx-16 text-white"></i>
              <span className="pb-0 mt-0 mg-l-10">Ver links (Legado)</span>
            </Button>
          </Col>
        ) : null}
      </Row>
      {singleSelectCampaign ? (
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
                        <h4 className="tx-22 font-weight-semibold mb-2">
                          {singleSelectCampaign?.data?.totalLinks}
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
                          {singleSelectCampaign?.data?.totalLinksClickCount}
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
                          {toDateTime(
                            singleSelectCampaign?.data?.endDate["_seconds"] +
                              10800
                          )
                            .toLocaleString("pt-BR")
                            .substring(0, 10)}
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
                <div className="col-8 ">
                  <div className="ps-4 pt-4 pe-3 pb-4">
                    <div className="">
                      <h6 className="mb-2 tx-12">Links de acesso</h6>
                    </div>
                    <div className="pb-0 mt-0">
                      <div className="d-flex">
                        <a
                          className="tx-13 font-weight-semibold mb-2"
                          href={`https://wtzp.link/r/${singleSelectCampaign?.data?.entryLink}`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {`https://wtzp.link/r/${singleSelectCampaign?.data?.entryLink}`}
                        </a>
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
          <Col xl={3} lg={12} md={12} xs={12}>
            <Card className="sales-card">
              <Row>
                <div className="col-8">
                  <div className="ps-4 pt-4 pe-3 pb-4">
                    <div className="">
                      <h6 className="mb-2 tx-12">QR code</h6>
                    </div>
                    <div className="pb-0 mt-0">
                      <div className="d-flex">
                        {/* @ts-ignore */}
                        <div ref={qrCodeRef} />
                      </div>
                    </div>
                  </div>
                </div>
              </Row>
            </Card>
          </Col>
        </Row>
      ) : null}
      <Row>
        <Col sm={12} className="col-12 d-flex justify-content-end">
          <Button
            onClick={() => navigateToNewGroup()}
            variant=""
            className="btn me-2 btn-primary mb-4"
          >
            Cadastrar Grupo
          </Button>
          <Button
            onClick={() => navigateToNewGroup(false, null, true)}
            variant=""
            className="btn me-2 btn-secondary mb-4"
          >
            Cadastrar vários grupos
          </Button>
        </Col>
      </Row>
      <Table
        title="Grupos dessa campanha"
        columns={GROUPS_COLUMNS}
        data={campaignGroups}
      />
    </React.Fragment>
  );
}
