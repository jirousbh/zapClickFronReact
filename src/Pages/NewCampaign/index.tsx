import React, { useEffect, useState, useCallback } from "react";

import ReactDatePicker from "react-datepicker";
import Creatable from "react-select/creatable";
import { useDispatch, useSelector } from "react-redux";
import {
  Col,
  Row,
  Button,
  Form,
  Alert,
  InputGroup,
  Modal,
} from "react-bootstrap";

import { auth } from "../../Firebase/firebase";
import { setCompaniesList } from "../../redux/actions/companies";
import { setInstancesList } from "../../redux/actions/instances";

import { getCompaniesList } from "../../services/CompaniesService";
import { getInstancesList } from "../../services/InstancesService";
import {
  setCampaignsList,
  setSelectedCampaignId,
} from "../../redux/actions/campaign";
import {
  createCampaign,
  getCampaignsList,
  updateCampaign,
} from "../../services/CampaignsService";
import { toDateTime } from "../../utils/dates";
import { getClient } from "../../services/ClientsService";
import Select from "../../components/Select";
import { useNavigate } from "react-router-dom";
import SuccessIcon from "../../assets/img/success.svg";

const INITIAL_STATE = {
  company: { label: "Selecione uma Empresa", value: "", selected: true },
  client: { label: "Selecione um Cliente", value: "", selected: true },
};

export default function NewCampaign() {
  const dispatch = useDispatch();

  const companiesList = useSelector(
    (state: any) => state.companiesReducer.companiesList
  );
  const campaignsList = useSelector(
    (state: any) => state.campaignReducer.campaignsList
  );
  const selectedCampaignId = useSelector(
    (state: any) => state.campaignReducer.selectedCampaignId
  );

  const instancesList = useSelector(
    (state: any) => state.instancesReducer.instancesList
  );

  const [createdModalIsOpen, setCreatedModalIsOpen] = useState(false);
  const [errorModalIsOpen, setErrorModalIsOpen] = useState(false);

  const [instancesOptions, setInstancesOptions] = useState([]);

  // Start: Select company and clients
  const [singleSelectCompany, setSingleSelectCompany] = useState<any>("");
  const [singleSelectClient, setSingleSelectClient] = useState<any>("");
  const [companyOptions, setCompanyOptions] = useState<any>([
    INITIAL_STATE.company,
  ]);
  const [clientOptions, setClientOptions] = useState<any>([
    INITIAL_STATE.client,
  ]);
  const [clients, setClients] = useState([]);
  const navigate = useNavigate();

  const navigateToGroups = () => {
    const path = `${process.env.PUBLIC_URL}/campaign-groups`;
    dispatch(setSelectedCampaignId(singleSelectCompany.value));

    navigate(path);
    setCreatedModalIsOpen(false);
  };

  const formatSelectCompany = useCallback(
    async (companyId = null) => {
      debugger;
      const { data: clients } = await getClient(null, false);
      const { data: companies } = await getCompaniesList(null, false);

      const company = companies.map((cmp: any) => {
        return {
          label: cmp.name,
          value: cmp.id,
          selected: cmp.id === companyId,
        };
      });
      debugger;

      setClients(clients);

      if (!!companyId) {
        setCompanyOptions([...company]);
        setSingleSelectCompany(company.find((cmp: any) => cmp.selected));
      }

      setCompanyOptions([...companyOptions, ...company]);
    },
    [companyOptions]
  );

  useEffect(() => {
    if (!selectedCampaignId) {
      formatSelectCompany();
    }
  }, []);

  useEffect(() => {
    console.log(selectedCampaignId, singleSelectCompany, "@@@ company");
    debugger;
    if (!!selectedCampaignId && singleSelectCompany !== "") {
      debugger;
      const campaign = campaignsList.find(
        (cmp: any) => cmp.id === selectedCampaignId
      );
      debugger;
      const filterClient = clients.filter(
        (clt: any) => clt.companyId === singleSelectCompany.value
      );

      const client = filterClient.map((clt: any, index) => {
        console.log(index);
        return {
          label: clt.name,
          value: clt.id,
          selected: clt.id === campaign.client,
        };
      });
      debugger;

      console.log(client, "@@@ client");

      setClientOptions(client);
      setSingleSelectClient(client.find((clt) => clt.selected));
    }
  }, [campaignsList, clients, selectedCampaignId, singleSelectCompany]);

  useEffect(() => {
    if (singleSelectCompany !== "" && !selectedCampaignId) {
      const filterClient = clients.filter(
        (clt: any) => clt.companyId === singleSelectCompany.value
      );

      const client = filterClient.map((clt: any, index) => {
        console.log(index);
        return {
          label: clt.name,
          value: clt.id,
          selected: index === 0 ? true : false,
        };
      });

      setClientOptions(client);
      setSingleSelectClient(client[0]);
    }
  }, [clients, selectedCampaignId, singleSelectCompany.value]);
  //End

  const [err, setError] = useState("");
  const [data, setData] = useState({
    id: "",
    name: "",
    description: "",
    company: "",
    client: "",
    maxClicks: 250,
    entryLink: "",
    endDate: new Date(),
    endPage: "",
    googleTagManager: "",
    facebookPixel: "",
    useZapi: true,
    logo: "",
    instances: [],
    phoneMessage: "",
    wzJoinMsg: "",
    wzLeaveMsg: "",
    projectlAlertNumber: "",
    webHookUrl: "",
  });

  const {
    id,
    name,
    description,
    company,
    client,
    maxClicks,
    entryLink,
    endDate,
    endPage,
    googleTagManager,
    facebookPixel,
    useZapi,
    logo,
    instances,
    phoneMessage,
    wzJoinMsg,
    wzLeaveMsg,
    projectlAlertNumber,
    webHookUrl,
  } = data;

  const changeHandler = (e: any) => {
    setData({ ...data, [e.target.name]: e.target.value });
    setError("");
  };

  const setupCompaniesOptions = () => {
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
        return setCompanyOptions(companiesMapped);
      }
    });
  };

  const getInstances = async () => {
    let instancesListLocal = instancesList;
    if (!instancesListLocal.length) {
      const fetchInstancesResult = await getInstancesList();

      if (fetchInstancesResult?.data.length) {
        instancesListLocal = fetchInstancesResult?.data;
        dispatch(setInstancesList(fetchInstancesResult?.data));
      }
    }
    return instancesListLocal;
  };

  const setupInstancesOptions = async () => {
    const instancesListLocal = await getInstances();
    const instancesMapped = instancesListLocal.map((instance: any) => {
      return {
        value: instance.id,
        label: `${instance.description} - ${instance.api || "z-Api"} - ${
          instance.phone || "NA"
        }`,
        data: instance,
      };
    });

    if (instancesMapped.length) {
      setInstancesOptions(instancesMapped);
      return;
    }
  };

  const setupEditCampaign = async () => {
    debugger;
    let campaignsListLocal = campaignsList;
    if (!campaignsListLocal.length) {
      const fetchCampaignsResult = await getCampaignsList(false);

      if (fetchCampaignsResult?.data.length) {
        campaignsListLocal = fetchCampaignsResult?.data;
        dispatch(setCampaignsList(fetchCampaignsResult?.data));
      }
    }
    debugger;

    const seletedCampaign = campaignsListLocal.find(
      (campaign: any) => campaign.id === selectedCampaignId
    );
    debugger;

    if (seletedCampaign) {
      const getAllInstance = await getInstances();
      const newInstances = seletedCampaign.instances.map(
        (instanceCampaign: any) => {
          return getAllInstance.find((itc: any) => itc.id === instanceCampaign);
        }
      );

      console.log(newInstances, "@@@ newInstances");
      const instances = newInstances.map((itc: any) => ({
        value: itc.id,
        label: `${itc.description} - ${itc.api} - ${itc.phone}`,
        data: { ...itc },
      }));

      setData({
        // @ts-ignore
        id: seletedCampaign.id,
        name: seletedCampaign.name || "",
        description: seletedCampaign.description || "",
        company: seletedCampaign.company || "",
        client: seletedCampaign.client || "",
        maxClicks: seletedCampaign.maxClicks || "",
        entryLink: seletedCampaign.entryLink || "",
        endDate: seletedCampaign.endDate
          ? toDateTime(seletedCampaign.endDate["_seconds"] + 10800)
          : new Date(),
        endPage: seletedCampaign.endPage || "",
        googleTagManager: seletedCampaign.googleTagManager || "",
        facebookPixel: seletedCampaign.facebookPixel || "",
        useZapi: seletedCampaign.useZapi || false,
        logo: seletedCampaign.logo || "",
        instances: instances || [],
        phoneMessage: seletedCampaign.phoneMessage || "",
        wzJoinMsg: seletedCampaign.wzJoinMsg || "",
        wzLeaveMsg: seletedCampaign.wzLeaveMsg || "",
        projectlAlertNumber: seletedCampaign.projectlAlertNumber || "",
        webHookUrl: seletedCampaign.webHookUrl || "",
      });
      formatSelectCompany(seletedCampaign.company || null);
    }
  };

  const saveCampaignData = () => {
    const { id: campaignId, ...restData } = data;
    console.log(restData.instances);
    try {
      const instanceValue = restData.instances.map((int: any) => {
        return int.value;
      });

      const payload = {
        ...restData,
        client: singleSelectClient.value,
        company: singleSelectCompany.value,
        instances: instanceValue,
      };

      campaignId
        ? updateCampaign(payload, campaignId)
        : createCampaign(payload);

      setCreatedModalIsOpen(true);
    } catch (error) {
      setErrorModalIsOpen(true);
    }
  };

  useEffect(() => {
    if (selectedCampaignId) {
      setupEditCampaign();
      setupInstancesOptions();
    } else {
      setupCompaniesOptions();
      setupInstancesOptions();
    }
  }, []);

  return (
    <React.Fragment>
      <div className="breadcrumb-header justify-content-between">
        <div className="left-content">
          <h5 className="mb-4 tx-gray-600">Nova Campanha</h5>
          <h1 className="main-content-title mg-b-0 mg-b-lg-1">
            Informações Gerais
          </h1>
          <h6 className="mb-4 tx-gray-500">
            Preencha as informações da nova campanha
          </h6>
        </div>
      </div>
      {/* <!-- /breadcrumb --> */}

      {/* <!-- row  --> */}
      <Row>
        <Col sm={12} className="col-12">
          {err && <Alert variant="danger">{err}</Alert>}
          <Form>
            <Form.Group className="form-group">
              <Form.Label className="">Nome</Form.Label>{" "}
              <Form.Control
                className="form-control"
                placeholder="Nome da campanha"
                name="name"
                type="text"
                value={name}
                onChange={changeHandler}
                required
              />
              <Form.Label className="">Descrição (Opcional)</Form.Label>{" "}
              <Form.Control
                className="form-control"
                placeholder="Descrição da campanha"
                name="description"
                as="textarea"
                rows={3}
                value={description}
                onChange={changeHandler}
              />
            </Form.Group>
            <Row>
              <Col lg={6}>
                <Form.Group className="form-group">
                  <div className="mb-4">
                    <p className="mg-b-10">Empresa</p>
                    <div className=" SlectBox">
                      <Select
                        options={companyOptions}
                        onChange={(e: any) => {
                          console.log(e.target.value);
                          setSingleSelectCompany({ value: e.target.value });
                        }}
                      />
                    </div>
                  </div>
                </Form.Group>
              </Col>
              <Col lg={6}>
                <div className="mb-4">
                  <p className="mg-b-10">Cliente</p>
                  <div className=" SlectBox">
                    <Select
                      options={clientOptions}
                      onChange={(e: any) =>
                        setSingleSelectClient({ value: e.target.value })
                      }
                    />
                  </div>
                </div>
              </Col>
            </Row>
            <Row>
              <Col lg={6}>
                <Form.Group className="form-group">
                  <Form.Label className="">
                    Quantidade de Cliques por Grupos (Recomendamos 250 por
                    grupos)
                  </Form.Label>{" "}
                  <Form.Control
                    className="form-control"
                    placeholder=""
                    name="maxClicks"
                    type="number"
                    value={maxClicks}
                    onChange={(e) => {
                      console.log(Number(e.target.value));
                      changeHandler({
                        target: {
                          name: e.target.name,
                          value: Number(e.target.value),
                        },
                      });
                    }}
                    required
                  />
                </Form.Group>
              </Col>
              <Col lg={6}>
                <Form.Group className="form-group">
                  <Form.Label className="">Link da Campanha</Form.Label>{" "}
                  <div className="d-flex">
                    https://wtzp.link/r/
                    <Form.Control
                      className="form-control mx-2"
                      placeholder=""
                      name="entryLink"
                      type="text"
                      value={entryLink}
                      onChange={changeHandler}
                      required
                    />
                  </div>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col lg={6}>
                <Form.Group className="form-group">
                  <Form.Label className="">Data Final</Form.Label>{" "}
                  <InputGroup className="input-group reactdate-pic">
                    <InputGroup.Text className="input-group-text">
                      <i className="typcn typcn-calendar-outline tx-24 lh--9 op-6"></i>
                    </InputGroup.Text>
                    <ReactDatePicker
                      className="form-control"
                      selected={endDate}
                      onChange={(date: any) =>
                        setData({
                          ...data,
                          endDate: date,
                        })
                      }
                    />
                  </InputGroup>
                </Form.Group>
              </Col>
              <Col lg={6}>
                <Form.Group className="form-group">
                  <Form.Label className="">Link de Encerramento</Form.Label>{" "}
                  <Form.Control
                    className="form-control mx-2"
                    placeholder="Link completo com https://"
                    name="endPage"
                    type="text"
                    value={endPage}
                    onChange={changeHandler}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col lg={6}>
                <Form.Group className="form-group">
                  <Form.Label className="">Facebook Pixel</Form.Label>{" "}
                  <Form.Control
                    className="form-control"
                    placeholder="Facebook Pixel"
                    name="facebookPixel"
                    type="text"
                    value={facebookPixel}
                    onChange={changeHandler}
                    required
                  />
                </Form.Group>
              </Col>
              <Col lg={6}>
                <Form.Group className="form-group">
                  <Form.Label className="">Google Tag Manager</Form.Label>{" "}
                  <Form.Control
                    className="form-control mx-2"
                    placeholder="GTM-XXXXXX"
                    name="googleTagManager"
                    type="text"
                    value={googleTagManager}
                    onChange={changeHandler}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row style={{ height: 100 }}>
              <Col lg={6}>
                {data.useZapi && (
                  <Form.Group className="form-group">
                    <Form.Label htmlFor="formFile" className="form-label">
                      Logomarca (Imagem JPG até 600x600)
                    </Form.Label>
                    <Form.Control
                      className="form-control"
                      type="file"
                      id="formFile"
                      name="logo"
                      onChange={changeHandler}
                      required
                      accept=".jpg, .jpeg"
                    />
                  </Form.Group>
                )}
              </Col>
              <Col lg={6}>
                <Form className="ms-auto">
                  <Form.Label className="">Usar API WhatsApp?</Form.Label>{" "}
                  <Form.Check
                    checked={useZapi}
                    type="switch"
                    id="custom-switch"
                    name="useZapi"
                    style={{ marginTop: 10 }}
                    onChange={(e) =>
                      setData({
                        ...data,
                        useZapi: !useZapi,
                      })
                    }
                  />
                </Form>
              </Col>
            </Row>
            <Row>
              <Col lg={12}>
                <Form.Label className=""> Instâncias da Campanha</Form.Label>{" "}
                <Creatable
                  classNamePrefix="background"
                  // display="value"
                  options={instancesOptions}
                  value={instances}
                  onChange={(value: any) => {
                    setData({
                      ...data,
                      // @ts-ignore
                      instances: value,
                    });
                  }}
                  // labelledBy="Select"
                  isMulti
                />
              </Col>
            </Row>

            <Row>
              <Col lg={12}>
                <Form.Group className="form-group">
                  <Form.Label className="">Webhook URL</Form.Label>{" "}
                  <Form.Control
                    className="form-control"
                    placeholder="http..."
                    name="webHookUrl"
                    type="text"
                    value={webHookUrl}
                    onChange={changeHandler}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col lg={12}>
                <Form.Group className="form-group">
                  <Form.Label className="">
                    Número para receber alerta
                  </Form.Label>{" "}
                  <Form.Control
                    className="form-control"
                    placeholder="5531XXXXXX"
                    name="projectlAlertNumber"
                    type="text"
                    value={projectlAlertNumber}
                    onChange={changeHandler}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col lg={12}>
                <Form.Group className="form-group">
                  <Form.Label className="">
                    Mensagem a ser enviada após subscrição no Active Campaign
                  </Form.Label>{" "}
                  <Form.Control
                    className="form-control"
                    placeholder="Para enviar mensagem com nome usar $name"
                    name="phoneMessage"
                    as="textarea"
                    rows={3}
                    value={phoneMessage}
                    onChange={changeHandler}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col lg={12}>
                <Form.Group className="form-group">
                  <Form.Label className="">
                    Mensagem a ser enviada após entrada em um grupo de WhatsApp
                  </Form.Label>{" "}
                  <Form.Control
                    className="form-control"
                    placeholder=""
                    name="wzJoinMsg"
                    as="textarea"
                    rows={3}
                    value={wzJoinMsg}
                    onChange={changeHandler}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col lg={12}>
                <Form.Group className="form-group">
                  <Form.Label className="">
                    Mensagem a ser enviada após saída em um grupo de WhatsApp
                  </Form.Label>{" "}
                  <Form.Control
                    className="form-control"
                    placeholder=""
                    name="wzLeaveMsg"
                    as="textarea"
                    rows={3}
                    value={wzLeaveMsg}
                    onChange={changeHandler}
                  />
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Col>

        <Row>
          <Col sm={12} className="col-12 d-flex justify-content-end">
            <Button
              onClick={() => saveCampaignData()}
              variant=""
              className="btn me-2 btn-primary mb-4"
            >
              {id ? "Alterar" : "Salvar"}
            </Button>
          </Col>
        </Row>
      </Row>

      <Modal show={createdModalIsOpen}>
        <Modal.Header>
          <Button
            variant=""
            className="btn btn-close"
            onClick={() => navigateToGroups()}
          >
            x
          </Button>
        </Modal.Header>
        <Modal.Body>
          <div className="tx-center">
            {" "}
            <img
              src={SuccessIcon}
              className="mx-auto d-block mg-b-20"
              alt="InfoImage"
            />
            <h4 className="mg-b-20">
              {id ? "Alterar" : "Cadastrar"} Campanha
            </h4>{" "}
            <p className="mg-b-20 mg-x-20">
              Campanha {id ? "atualizada" : "cadastrada"} com sucesso!
            </p>
            <Button
              variant=""
              aria-label="Close"
              className="btn ripple btn-success pd-x-25 mg-b-20"
              type="button"
              onClick={() => navigateToGroups()}
            >
              Detalhes da Campanha
            </Button>{" "}
          </div>
        </Modal.Body>
      </Modal>

      <Modal show={errorModalIsOpen}>
        <Modal.Header>
          <Button
            variant=""
            className="btn btn-close"
            onClick={() => setErrorModalIsOpen(false)}
          >
            x
          </Button>
        </Modal.Header>
        <Modal.Body>
          <div className="tx-center">
            {" "}
            <i className="icon icon ion-ios-close-circle-outline tx-100 tx-danger lh-1 mg-t-20 d-inline-block"></i>{" "}
            <h4 className="tx-danger mg-b-20">Erro ao salvar</h4>{" "}
            <p className="mg-b-20 mg-x-20">
              Houve um erro ao tentar {id ? "atualizar" : "salvar"} a campanha
            </p>
            <Button
              variant=""
              aria-label="Close"
              className="btn ripple btn-danger pd-x-25"
              type="button"
              onClick={() => setErrorModalIsOpen(false)}
            >
              Fechar
            </Button>{" "}
          </div>
        </Modal.Body>
      </Modal>
    </React.Fragment>
  );
}
