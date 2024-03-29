// @ts-nocheck
import React, { useEffect, useState } from "react";

import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
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

import {
  setCampaignsList,
  setSelectedCampaignId,
} from "../../redux/actions/campaign";

import { COLUMNS } from "./data";

import { toDateTime } from "../../utils/dates";
import {
  getCampaignsList,
  updateCampaign,
} from "../../services/CampaignsService";
import Table from "../../components/Table";

export default function Dashboard() {
  let navigate = useNavigate();
  const dispatch = useDispatch();

  const [showEndedCampaigns, setShowEndedCampaigns] = useState(false);

  const [error, setError] = useState(false);

  const [loadingCampaigns, setLoadingCampaigns] = useState(false);
  const [campaignsListLocal, setCampaignsListLocal] = useState([]);
  const [disabledCampaign, setDisabledCampaign] = useState(false);
  const [disabledStatus, setDisabledStatus] = useState(null);
  const [campaigns, setCampaigns] = useState([])

  const openDisabledCampaignModal = (campaignId: string, active: string) => {
    setDisabledStatus({ campaignId, active });
    setDisabledCampaign(true);
  };

  const handleDisabledCampaign = async () => {
    try {
      await updateCampaign(
        { active: !disabledStatus.active },
        disabledStatus.campaignId
      );
      loadCampaigns();
    } catch (error) {
      console.log(error);
    } finally {
      setDisabledCampaign(false);
    }
  };

  const [topCardsInfo, setTopCardsInfo] = useState({
    totalCampaigns: 0,
    activeCampaigns: 0,
    totalLinks: 0,
    totalClicks: 0,
  });

  const navigateToNewCampaign = (
    isEdit: boolean = false,
    seletedCampaignId = null
  ) => {
    let path = `${process.env.PUBLIC_URL}/new-campaign/`;

    if (isEdit && seletedCampaignId) {
      dispatch(setSelectedCampaignId(seletedCampaignId));
    } else {
      dispatch(setSelectedCampaignId(null));
    }

    navigate(path);
  };

  const navigateTo = (
    navigateToPath: string,
    selectedCampaignId = null,
    name_campaign = null
  ) => {
    let path = `${process.env.PUBLIC_URL}/${navigateToPath}`;

    let id = selectedCampaignId;

    if (!id && !!name_campaign) {
      id = campaigns.find((campaing) => campaing.name === name_campaign).id;
    }

    dispatch(setSelectedCampaignId(id));

    navigate(path);
  };

  const setupProjectList = function (data, admin = false) {
    // const user = auth.onAuthStateChanged((user) => console.log("user", user));

    if (data.length) {
      dispatch(setCampaignsList(data));

      const campaignsUpdated = data.map((campaign) => {
        return {
          name_community: campaign.name,
          totalLinks: campaign.totalLinks,
          projClicks:
            campaign.totalClicks +
            "/" +
            campaign.maxClicks * campaign.totalLinks,
          endDate: toDateTime(campaign.endDate["_seconds"] + 10800)
            .toLocaleString("pt-BR")
            .substring(0, 10),
          entryLink: (
            <Link to={`https://wtzp.link/r/${campaign.entryLink}`}>
              {`https://wtzp.link/r/${campaign.entryLink}`}
              <i className="fas primary fa-external-link-alt ms-2"></i>
            </Link>
          ),
          status: (
            <Form className="ms-auto">
              <Form.Check
                checked={campaign.active}
                type="switch"
                id="custom-switch"
                onChange={() =>
                  openDisabledCampaignModal(campaign.id, campaign.active)
                }
              />
            </Form>
          ),
          options: (
            <span className="">
              <OverlayTrigger
                placement="top"
                overlay={<Tooltip>Grupos da Campanha</Tooltip>}
              >
                <Button
                  variant=""
                  onClick={() => navigateTo("campaign-groups/", campaign.id)}
                  className="btn btn-primary btn-sm rounded-11 me-2"
                >
                  <i className="fa fa-users"></i>
                </Button>
              </OverlayTrigger>

              {campaign.useZapi ? (
                <>
                  <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip>Relatório de Leads</Tooltip>}
                  >
                    <Button
                      variant=""
                      onClick={() => navigateTo("campaign-leads/", campaign.id)}
                      className="btn bg-green btn-sm rounded-11 me-2"
                    >
                      <i className="fa fa-magnet"></i>
                    </Button>
                  </OverlayTrigger>

                  <OverlayTrigger
                    placement="top"
                    overlay={<Tooltip>Mensagens Enviadas</Tooltip>}
                  >
                    <Button
                      variant=""
                      onClick={() =>
                        navigateTo("project-messages/", campaign.id)
                      }
                      className="btn bg-green btn-sm rounded-11 me-2"
                    >
                      <i className="fa fa-comment-dots"></i>
                    </Button>
                  </OverlayTrigger>
                </>
              ) : null}

              {/* {admin ? ( */}
              <OverlayTrigger
                placement="top"
                overlay={<Tooltip>Alterar Campanha</Tooltip>}
              >
                <Button
                  variant=""
                  onClick={() => navigateToNewCampaign(true, campaign.id)}
                  className="btn bg-yellow btn-sm rounded-11"
                >
                  <i className="fa fa-edit"></i>
                </Button>
              </OverlayTrigger>
              {/* ) : null} */}
            </span>
          ),
        };
      });

      setCampaignsListLocal(campaignsUpdated);

      const activeCampaigns = data.filter((campaign) => {
        const projEndDate = new Date(campaign.endDate._seconds * 1000);
        const actualDate = new Date();

        return campaign.active && projEndDate > actualDate;
      }).length;

      const totalClicks = data.reduce((acumulador, campaign) => {
        return acumulador + campaign.totalClicks;
      }, 0);
      const totalLinks = data.reduce((acumulador, campaign) => {
        return acumulador + campaign.totalLinks;
      }, 0);

      setTopCardsInfo({
        totalCampaigns: data?.length | 0,
        activeCampaigns,
        totalLinks,
        totalClicks,
      });
    } else {
      dispatch(setCampaignsList([]));
      setCampaignsListLocal([
        {
          id: 0,
          name: "Nenhum Dado Encontrado...",
          entryLink: "",
          description: "",
          companyId: "",
          company: "",
          clientId: "",
          client: "",
          maxClicks: "",
          endDate: "",
          endDateLabel: "",
          options: "",
        },
      ]);
    }
  };

  const loadCampaigns = async function (showEnded: boolean = false) {
    setLoadingCampaigns(true);

    try {
      const viewEmail = window.sessionStorage.getItem("#email_view") || null;
      const fetchProjResult = await getCampaignsList(showEnded, viewEmail);

      setupProjectList(fetchProjResult.data, false);
      setCampaigns(fetchProjResult.data)
    } catch (error) {
      setError(true);

      setCampaignsListLocal([
        {
          id: 0,
          name: "Erro ao buscar as campanhas...",
          entryLink: "",
          description: "",
          companyId: "",
          company: "",
          clientId: "",
          client: "",
          maxClicks: "",
          endDate: "",
          endDateLabel: "",
          options: "",
        },
      ]);
    } finally {
      setLoadingCampaigns(false);
    }
  };

  const handleEndedCampaigns = () => {
    setShowEndedCampaigns(!showEndedCampaigns);
    loadCampaigns(!showEndedCampaigns);
  };

  useEffect(() => {
    loadCampaigns();
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
                      <h4 className="tx-22 font-weight-semibold mb-2">
                        {!loadingCampaigns ? (
                          topCardsInfo.totalCampaigns
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
                      <h4 className="tx-22 font-weight-semibold mb-2">
                        {!loadingCampaigns ? (
                          topCardsInfo.activeCampaigns
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
                      <h4 className="tx-22 font-weight-semibold mb-2">
                        {!loadingCampaigns ? (
                          topCardsInfo.totalLinks
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
                        {!loadingCampaigns ? (
                          topCardsInfo.totalClicks
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
                  <i className="fa fa-mouse-pointer tx-16 text-secondary"></i>
                </div>
              </div>
            </Row>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col sm={6} className="col-12">
          <Button
            variant=""
            className="btn me-2 btn-primary mb-4"
            onClick={() => navigateToNewCampaign()}
          >
            <i className="fas fa-plus me-2"></i>
            Criar Campanha
          </Button>
        </Col>
        <Col sm={6} className="col-12 d-flex justify-content-end">
          <Button
            variant=""
            className="btn btn-outline-primary mb-4"
            onClick={handleEndedCampaigns}
          >
            {!showEndedCampaigns ? (
              <>
                <i className="fas fa-eye-slash me-2"></i>
                Exibir Campanhas Finalizadas
              </>
            ) : (
              <>
                <i className="fas fa-eye me-2"></i>
                Exibir Campanhas Ativas
              </>
            )}
          </Button>
        </Col>
      </Row>
      <Table
        title="Lista de campanhas"
        columns={COLUMNS}
        data={campaignsListLocal}
        handleNavigate={navigateTo}
      />
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
              Erro ao buscar a lista de campanhas
            </h4>{" "}
            <p className="mg-b-20 mg-x-20">
              Desculpe, ocorreu um erro ao tentar buscar a lista de campanhas.
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
      <Modal show={disabledCampaign}>
        <Modal.Header>
          <Button
            variant=""
            className="btn btn-close"
            onClick={() => setDisabledCampaign(false)}
          >
            x
          </Button>
        </Modal.Header>
        <Modal.Body>
          <div className="">
            <Row className="mb-2">
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <h3>
                  Deseja{" "}
                  <span>
                    {!disabledStatus?.active ? "ativar" : "desativar"}{" "}
                  </span>
                  campanha
                </h3>
                <div
                  style={{
                    textAlign: "center",
                    marginTop: 10,
                    marginBottom: 10,
                  }}
                >
                  <p>
                    Confirme sua ação para evitar que uma campanha não seja
                    desativada por engano
                  </p>
                </div>
              </div>
            </Row>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Button
                variant=""
                aria-label="Confirm"
                className="btn ripple btn-primary pd-x-25"
                type="button"
                onClick={() => handleDisabledCampaign()}
                style={{ width: "300px", marginTop: 10, marginBottom: 20 }}
              >
                Confirmar
              </Button>{" "}
              <Button
                variant=""
                aria-label="Close"
                className="btn ripple btn-danger pd-x-25"
                type="button"
                onClick={() => setDisabledCampaign(false)}
                style={{ width: "300px", marginBottom: 10 }}
              >
                Fechar
              </Button>{" "}
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </React.Fragment>
  );
}
