import React, { useRef, useEffect, useState } from "react";

import ReactApexChart from "react-apexcharts";
import ReactDatePicker from "react-datepicker";
import Creatable from "react-select/creatable";
import Select, { SingleValue } from "react-select";
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
  Form,
  Alert,
  InputGroup,
  Modal,
} from "react-bootstrap";

import { auth } from "../../Firebase/firebase";

import { COLUMNS, DATATABLE, GlobalFilter } from "../Dashboard/data";

import { setCompaniesList } from "../../redux/actions/companies";
import { setInstancesList } from "../../redux/actions/instances";

import { getCompaniesList } from "../../services/CompaniesService";
import { getInstancesList } from "../../services/InstancesService";
import { setCampaignsList } from "../../redux/actions/campaign";
import {
  createCampaign,
  getCampaignsList,
  updateCampaign,
} from "../../services/CampaignsService";
import { toDateTime } from "../../utils/dates";

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

  const [companySelected, setCompanySelected] = useState("");
  const [companiesOptions, setCompanyOptions] = useState([]);
  const [instancesOptions, setInstancesOptions] = useState([]);

  const [err, setError] = useState("");
  const [data, setData] = useState({
    id: "",
    name: "",
    description: "",
    company: "",
    client: "",
    maxClicks: "250",
    entryLink: "",
    endDate: new Date(),
    endPage: "",
    googleTagManager: "",
    facebookPixel: "",
    useZapi: false,
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

  const setupInstancesOptions = () => {
    auth.onAuthStateChanged(async (user) => {
      let instancesListLocal = instancesList;
      if (!instancesListLocal.length) {
        const fetchInstancesResult = await getInstancesList();

        if (fetchInstancesResult?.data.length) {
          instancesListLocal = fetchInstancesResult?.data;
          dispatch(setInstancesList(fetchInstancesResult?.data));
        }
      }

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
        return setInstancesOptions(instancesMapped);
      }
    });
  };

  const setupEditCampaign = async () => {
    let campaignsListLocal = campaignsList;
    if (!campaignsListLocal.length) {
      const fetchCampaignsResult = await getCampaignsList(false);

      if (fetchCampaignsResult?.data.length) {
        campaignsListLocal = fetchCampaignsResult?.data;
        dispatch(setCampaignsList(fetchCampaignsResult?.data));
      }
    }

    const seletedCampaign = campaignsListLocal.find(
      (campaign: any) => campaign.id === selectedCampaignId
    );

    if (seletedCampaign) {
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
        instances: seletedCampaign.instances || [],
        phoneMessage: seletedCampaign.phoneMessage || "",
        wzJoinMsg: seletedCampaign.wzJoinMsg || "",
        wzLeaveMsg: seletedCampaign.wzLeaveMsg || "",
        projectlAlertNumber: seletedCampaign.projectlAlertNumber || "",
        webHookUrl: seletedCampaign.webHookUrl || "",
      });
    }
  };

  const saveCampaignData = () => {
    const { id: campaignId, ...restData } = data;

    try {
      campaignId
        ? updateCampaign(restData, campaignId)
        : createCampaign(restData);

      setCreatedModalIsOpen(true);
    } catch (error) {
      setErrorModalIsOpen(true);
    }
  };

  useEffect(() => {
    setupCompaniesOptions();
    setupInstancesOptions();
    if (selectedCampaignId) setupEditCampaign();
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
                  <Form.Label className="">Empresa</Form.Label>{" "}
                  <Form.Control
                    className="form-control"
                    placeholder="Empresa"
                    name="company"
                    type="text"
                    value={company}
                    onChange={changeHandler}
                    required
                  />
                </Form.Group>
              </Col>
              <Col lg={6}>
                <Form.Group className="form-group">
                  <Form.Label className="">Cliente</Form.Label>{" "}
                  <Form.Control
                    className="form-control"
                    placeholder="Cliente"
                    name="client"
                    type="text"
                    value={client}
                    onChange={changeHandler}
                    required
                  />
                </Form.Group>
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
                    onChange={changeHandler}
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

            <Row>
              <Col lg={6}>
                <Form.Group className="form-group">
                  <Form.Label htmlFor="formFile" className="form-label">
                    Logomarca (Imagem JPG até 600x600)
                  </Form.Label>
                  <Form.Control
                    className="form-control"
                    type="file"
                    id="formFile"
                    name="logo"
                    value={logo}
                    onChange={changeHandler}
                    required
                  />
                </Form.Group>
              </Col>
              <Col lg={6}>
                <Form className="ms-auto">
                  <Form.Label className="">Usar API WhatsApp?</Form.Label>{" "}
                  <Form.Check
                    checked={useZapi}
                    type="switch"
                    id="custom-switch"
                    name="useZapi"
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
                <Creatable
                  classNamePrefix="background"
                  // display="value"
                  options={instancesOptions}
                  value={instances}
                  onChange={(value) =>
                    setData({
                      ...data,
                      // @ts-ignore
                      instances: value,
                    })
                  }
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
            onClick={() => setCreatedModalIsOpen(false)}
          >
            x
          </Button>
        </Modal.Header>
        <Modal.Body>
          <div className="tx-center">
            {" "}
            <i className="icon icon ion-ios-close-circle-outline tx-100 tx-success lh-1 mg-t-20 d-inline-block"></i>{" "}
            <h4 className="tx-success mg-b-20">
              {id ? "Atualizar" : "Cadastrar"} Campanha
            </h4>{" "}
            <p className="mg-b-20 mg-x-20">
              Campanha {id ? "atualizada" : "cadastrada"} com sucesso!
            </p>
            <Button
              variant=""
              aria-label="Close"
              className="btn ripple btn-success pd-x-25"
              type="button"
              onClick={() => setCreatedModalIsOpen(false)}
            >
              Fechar
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
