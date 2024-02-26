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
  ButtonGroup,
  Dropdown,
  Modal,
  ProgressBar,
  Form,
  Toast,
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
import Factory from "./Components/Form";
import {
  queueLinkId,
  randomIntFromInterval,
  timeOut,
} from "../../utils/queueRequest";
import { buttons } from "./actions";
import { scheduleAddAction } from "../../services/Whatsapp/Common";
import { toast } from "react-toastify";

const INITIAL_STATE = {
  linkIdFirst: "1",
  linkIdLast: "1",
  intervalFirst: "5",
  intervalLast: "5",
  instanceId: "",
  projectId: "",
  adminNumbers: "",
  extraAdmimNumber: "",
  groupName: "asd",
  file: "",
  btnMessage: "",
  btnOptions: [],
  pollMessage: "",
  pollOptions: [],
  name: "",
  startTime: "",
};

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
  const [actionSelected, setActionSelected] = useState<any>(null);
  const [openModal, setOpenModal] = useState(false);
  const [progress, setProgress] = useState(0);
  const [infoProgress, setInfoProgress] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [formValues, setFormValues] = useState(INITIAL_STATE);
  const [seconds, setSeconds] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [show, setShow] = useState(false);
  const [success, setSuccess] = useState<any>([]);

  const handleChangeValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormValues({
      ...formValues,
      projectId: singleSelectCampaign.value,
      [e.target.name]: e.target.value,
    });
  };

  const handleChangeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!(e.target && e.target.files && e.target.files[0])) return;

    const reader = new FileReader();

    reader.readAsDataURL(e.target.files[0]);

    reader.onload = () => {
      const base64String = reader.result;

      setFormValues({
        ...formValues,
        [e.target.name]: base64String,
      });
    };
  };

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
    const groupsResponse: any = await getGroupsByCampaign(campaign.value);
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
    console.log(singleSelectCampaign?.data?.entryLink, "@@@ qrCode");
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

  const handleActiveButton = (id: string) => {
    /* const newButtons = buttonsDropdown.map((bt) => ({
      ...bt,
      active: bt.id === id,
    })); */

    const selectButton = buttons.find((bt) => bt.id === id);

    const isSelect = selectButton?.inputs?.some(
      (stb) => stb.label === "Instância"
    );

    const selectButtonParse = isSelect
      ? {
          ...selectButton,
          instances: singleSelectCampaign.data.instances || [],
        }
      : { ...selectButton };
    setActionSelected(selectButtonParse);
    setProgress(0);
    setOpenModal(true);
  };

  useEffect(() => {
    let interval: any;

    if (isActive) {
      interval = setInterval(() => {
        setSeconds((seconds) => seconds - 1);
      }, 1000);
    } else if (!isActive && seconds !== 0) {
      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [isActive, seconds]);

  function toggleTimer() {
    setIsActive(true);
  }

  function resetTimer() {
    setSeconds(0);
    setIsActive(false);
  }

  const requestWithQueue = async (bt: any) => {
    setLoading(true);
    setShow(true);
    const interval = randomIntFromInterval(
      Number(formValues.intervalFirst),
      Number(formValues.intervalLast)
    );
    const queue = queueLinkId(formValues.linkIdFirst, formValues.linkIdLast);
    console.log({
      queue,
      interval,
      form: formValues.intervalFirst,
      form1: formValues.intervalLast,
      form2: formValues.linkIdFirst,
      form4: formValues.linkIdLast,
    });
    let index = 1;
    for (let linkId of queue) {
      setInfoProgress({ linkId });
      const progressCount = Math.floor((index / queue.length) * 100);
      setSeconds(interval / 1000);
      index++;
      toggleTimer();
      try {
        await timeOut(interval).then(async () => {
          await bt.action({
            ...formValues,
            linkId,
            project: { name: singleSelectCampaign.label },
          });
        });

        setProgress(progressCount);
        setSuccess((prv: any) => [...prv, { linkId, isSuccess: true }]);
        resetTimer();
      } catch (error) {
        setProgress(progressCount);
        setSuccess((prv: any) => [...prv, { linkId, isSuccess: false }]);
        resetTimer();
      }
    }
    setLoading(false);
  };

  const handleClick = (bt: any) => {
    if (!!formValues.linkIdLast) {
      return requestWithQueue(bt);
    }
  };

  const [openModalSchedule, setOpenModalSchedule] = useState(false);
  const handleOpenModalSchedule = () => {
    setOpenModal(false);
    setOpenModalSchedule(true);
  };

  const handleCloseModalSchedule = () => {
    setOpenModal(true);
    setOpenModalSchedule(false);
  };

  const closeModal = () => {
    setOpenModal(false);
    setShow(false);
    setSuccess([]);
    setInfoProgress(null);
  }

  const requestScheduleJob = async () => {
    try { //TODO: colocar toast
      const schedule = await scheduleAddAction({...formValues, sendFunction: actionSelected.sendFunction});
      console.log(schedule.data.message);
      setOpenModalSchedule(false)
      closeModal()
      toast(schedule.data.message)
    } catch (error) {
      handleCloseModalSchedule()
      toast("Não foi possível criar o Agendamento, tente novamente!")
    }
  };

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
        <div style={{marginBottom: 20}}>
          <ButtonGroup>
            <Dropdown>
              <Dropdown.Toggle
                variant=""
                aria-expanded="false"
                aria-haspopup="true"
                className="btn ripple btn-primary"
                data-bs-toggle="dropdown"
                id="dropdownMenuButton"
                type="button"
              >
                Grupos
              </Dropdown.Toggle>
              <Dropdown.Menu
                className="dropdown-menu tx-13"
                style={{ margin: "0px" }}
              >
                {buttons
                  .filter((bt) => bt.type === "groups")
                  .map((bt) => (
                    <Dropdown.Item
                      active={bt.active}
                      onClick={() => handleActiveButton(bt.id)}
                    >
                      {bt.name}
                    </Dropdown.Item>
                  ))}
              </Dropdown.Menu>
            </Dropdown>
          </ButtonGroup>
          <ButtonGroup className="ms-2 mt-2 mb-2">
            <Dropdown>
              <Dropdown.Toggle
                variant=""
                aria-expanded="false"
                aria-haspopup="true"
                className="btn ripple btn-secondary"
                data-bs-toggle="dropdown"
                id="dropdownMenuButton"
                type="button"
              >
                Comunidade
              </Dropdown.Toggle>
              <Dropdown.Menu
                className="dropdown-menu tx-13"
                style={{ margin: "0px" }}
              >
                {buttons
                  .filter((bt) => bt.type === "communities")
                  .map((bt) => (
                    <Dropdown.Item
                      active={bt.active}
                      onClick={() => handleActiveButton(bt.id)}
                    >
                      {bt.name}
                    </Dropdown.Item>
                  ))}
              </Dropdown.Menu>
            </Dropdown>
          </ButtonGroup>
          <ButtonGroup className="ms-2 mt-2 mb-2">
            <Dropdown>
              <Dropdown.Toggle
                variant=""
                aria-expanded="false"
                aria-haspopup="true"
                className="btn ripple btn-danger"
                data-bs-toggle="dropdown"
                id="dropdownMenuButton"
                type="button"
              >
                Envios
              </Dropdown.Toggle>
              <Dropdown.Menu
                className="dropdown-menu tx-13"
                style={{ margin: "0px" }}
              >
                {buttons
                  .filter((bt) => bt.type === "sends")
                  .map((bt) => (
                    <Dropdown.Item
                      active={bt.active}
                      onClick={() => handleActiveButton(bt.id)}
                    >
                      {bt.name}
                    </Dropdown.Item>
                  ))}
              </Dropdown.Menu>
            </Dropdown>
          </ButtonGroup>
          <ButtonGroup className="ms-2 mt-2 mb-2">
            <Dropdown>
              <Dropdown.Toggle
                variant=""
                aria-expanded="false"
                aria-haspopup="true"
                className="btn ripple btn-primary"
                data-bs-toggle="dropdown"
                id="dropdownMenuButton"
                type="button"
              >
                Leads
              </Dropdown.Toggle>
              <Dropdown.Menu
                className="dropdown-menu tx-13"
                style={{ margin: "0px" }}
              >
                {buttons
                  .filter((bt) => bt.type === "leads")
                  .map((bt) => (
                    <Dropdown.Item
                      active={bt.active}
                      onClick={() => handleActiveButton(bt.id)}
                    >
                      {bt.name}
                    </Dropdown.Item>
                  ))}
              </Dropdown.Menu>
            </Dropdown>
          </ButtonGroup>
        </div>
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
      <Modal show={openModal}>
        <Modal.Header>
          <Modal.Title>
            {actionSelected?.title || actionSelected?.name}
          </Modal.Title>
          <Button
            variant=""
            className="btn btn-close"
            onClick={closeModal}
            disabled={loading}
          >
            x
          </Button>
        </Modal.Header>
        <Modal.Body>
          <div className="">
            {actionSelected?.inputs?.map((ipt: any, index: any) => {
              const props = {
                ...ipt,
                instances: actionSelected?.instances,
                handleChangeValue,
                handleChangeFile,
                formValues,
              };
              return <Factory {...props} key={index} />;
            })}
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              marginTop: 10,
              marginBottom: 16,
            }}
          >
            {show && (
              <div
                style={{ background: "#f3f3f8", padding: 10, borderRadius: 10 }}
              >
                {infoProgress && (
                  <p>
                    Requisição do Grupo {infoProgress.linkId} será executada em:{" "}
                    {seconds} segundos.
                  </p>
                )}
                <ProgressBar
                  now={progress}
                  label={`${progress}%`}
                  animated
                  style={{ background: "#FFF" }}
                />
                <div
                  style={{
                    display: "flex",
                    overflow: "auto",
                    whiteSpace: "nowrap",
                    cursor: "pointer",
                    marginTop: 10,
                  }}
                >
                  {success.map((sc: any, index: number) => {
                    const styled = sc.isSuccess
                      ? {
                          backgroundColor: "#00d97e",
                          padding: 5,
                          borderRadius: 5,
                          marginRight: 10,
                          marginBotom: 10,
                          marginTop: 10,
                          marginBottom: 10,
                        }
                      : {
                          backgroundColor: "#e63757",
                          padding: 2,
                          borderRadius: 5,
                          marginRight: 5,
                          marginBotom: 5,
                          marginTop: 10,
                          marginBottom: 10,
                        };

                    return (
                      <div key={`@@Key-${index}`} style={styled}>
                        <p
                          style={{
                            color: "#FFF",
                            fontSize: 9,
                            fontWeight: "bolder",
                          }}
                        >
                          {sc.isSuccess ? "Sucesso - Grupo" : "Erro - Grupo"}{" "}
                          {sc.linkId}
                        </p>
                      </div>
                    );
                  })}
                </div>

                <div />
              </div>
            )}
          </div>
          <div>
            {actionSelected?.buttons?.map((bt: any, index: number) => {              
              const styled =
                index === 0
                  ? "btn ripple btn-primary pd-x-25"
                  : "btn ripple btn-secondary pd-x-25";
              return (
                <Button
                  variant=""
                  aria-label="Confirm"
                  className={styled}
                  type="button"
                  onClick={() => {
                    if (index === 0) {
                      handleClick(bt);
                    } else {
                      handleOpenModalSchedule();
                    }
                  }}
                  style={{ marginRight: 10 }}
                  disabled={loading}
                >
                  {bt.label}
                </Button>
              );
            })}
          </div>
        </Modal.Body>
      </Modal>
      <Modal show={openModalSchedule}>
        <Modal.Header>
          <Modal.Title>Agendamento</Modal.Title>
          <Button
            variant=""
            className="btn btn-close"
            onClick={handleCloseModalSchedule}
          >
            x
          </Button>
        </Modal.Header>
        <Modal.Body>
          <Row className="mb-2">
            <Col lg={12}>
              <Form.Group className="form-group">
                <Form.Label className="">Nome</Form.Label>{" "}
                <Form.Control
                  className="form-control"
                  placeholder="Nome do Agendamento"
                  type="text"
                  onChange={handleChangeValue}
                  name="name"
                  required
                />
              </Form.Group>
            </Col>
            <Col lg={12}>
              <Form.Group className="form-group">
                <Form.Label className="">Data/Hora de Envio</Form.Label>{" "}
                <Form.Control
                  className="form-control"
                  type="datetime-local"
                  name="startTime"
                  onChange={handleChangeValue}
                  required
                />
              </Form.Group>
            </Col>
            <Col lg={12}>
              <Form.Group className="form-group">
                <Form.Label className="">Empresa/Cliente</Form.Label>{" "}
                <Form.Control
                  className="form-control"
                  placeholder="Nome do Agendamento"
                  type="text"
                  value={singleSelectCampaign?.label || ""}
                  disabled={true}
                />
              </Form.Group>
            </Col>
            <Col lg={12}>
              <Form.Group className="form-group">
                <Form.Label className="">Campanha</Form.Label>{" "}
                <Form.Control
                  className="form-control"
                  placeholder="Nome do Agendamento"
                  type="text"
                  value={singleSelectCampaign?.label || ""}
                  disabled={true}
                />
              </Form.Group>
            </Col>
          </Row>
          <Button
            variant=""
            aria-label="Confirm"
            className="btn ripple btn-primary pd-x-25"
            type="button"
            onClick={requestScheduleJob}
          >
            Agendar
          </Button>{" "}
          <Button
            variant=""
            aria-label="Close"
            className="btn ripple btn-danger pd-x-25"
            type="button"
            onClick={handleCloseModalSchedule}
          >
            Cancelar
          </Button>{" "}
        </Modal.Body>
      </Modal>
    </React.Fragment>
  );
}
