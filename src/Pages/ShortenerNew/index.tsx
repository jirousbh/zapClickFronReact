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
import { createShortener } from "../../services/ShortenersService";

export default function ShortenerNew() {
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
    url: "",
    utm_source: "",
    utm_medium: "",
    utm_campaign: "",
    utm_term: "",
    utm_content: "",
  });

  const {
    id,
    url,
    utm_source,
    utm_medium,
    utm_campaign,
    utm_term,
    utm_content,
  } = data;

  const changeHandler = (e: any) => {
    setData({ ...data, [e.target.name]: e.target.value });
    setError("");
  };

  //   const setupEditShortener = async () => {
  //     if (seletedCampaign) {
  //       setData({
  //       });
  //     }
  //   };

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

  const callCreateShort = async () => {
    try {
      const result = await createShortener({
        projectId: selectedCampaignId,
        url,
        utm_source,
        utm_medium,
        utm_campaign,
        utm_term,
        utm_content,
      });

      setCreatedModalIsOpen(true);
    } catch (error) {
      setErrorModalIsOpen(true);
    }
  };

  useEffect(() => {
    // if (selectedCampaignId) setupEditShortener();
  }, []);

  return (
    <React.Fragment>
      <div className="breadcrumb-header justify-content-between">
        <div className="left-content">
          <h5 className="mb-4 tx-gray-600">Novo link UTM</h5>
          <h6 className="mb-4 tx-gray-500">Preencha as informações abaixo</h6>
        </div>
      </div>
      {/* <!-- /breadcrumb --> */}

      {/* <!-- row  --> */}
      <Row>
        <Col sm={12} className="col-12">
          {err && <Alert variant="danger">{err}</Alert>}
          <Form>
            <Row>
              <Col lg={6}>
                <Form.Group className="form-group">
                  <Form.Label className="">Link da Campanha</Form.Label>{" "}
                  <div className="d-flex">
                    https://wtzp.link/r/
                    <Form.Control
                      className="form-control mx-2"
                      placeholder=""
                      name="url"
                      type="text"
                      value={url}
                      onChange={changeHandler}
                      required
                    />
                  </div>
                </Form.Group>
              </Col>

              <Col lg={6}>
                <Form.Group className="form-group">
                  <Form.Label className="">UTM Source</Form.Label>{" "}
                  <Form.Control
                    className="form-control"
                    placeholder="Ex: facebook"
                    name="utm_source"
                    type="text"
                    value={utm_source}
                    onChange={changeHandler}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col lg={6}>
                <Form.Group className="form-group">
                  <Form.Label className="">UTM Medium</Form.Label>{" "}
                  <Form.Control
                    className="form-control"
                    placeholder="Ex: email"
                    name="utm_medium"
                    type="text"
                    value={utm_medium}
                    onChange={changeHandler}
                    required
                  />
                </Form.Group>
              </Col>

              <Col lg={6}>
                <Form.Group className="form-group">
                  <Form.Label className="">UTM Campaign</Form.Label>{" "}
                  <Form.Control
                    className="form-control"
                    placeholder="Ex: lacamento-01"
                    name="utm_campaign"
                    type="text"
                    value={utm_campaign}
                    onChange={changeHandler}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col lg={6}>
                <Form.Group className="form-group">
                  <Form.Label className="">UTM Content</Form.Label>{" "}
                  <Form.Control
                    className="form-control"
                    placeholder="Ex: botao-paginax"
                    name="utm_content"
                    type="text"
                    value={utm_content}
                    onChange={changeHandler}
                    required
                  />
                </Form.Group>
              </Col>

              <Col lg={6}>
                <Form.Group className="form-group">
                  <Form.Label className="">UTM Term</Form.Label>{" "}
                  <Form.Control
                    className="form-control"
                    placeholder="Ex: palavras-chave"
                    name="utm_term"
                    type="text"
                    value={utm_term}
                    onChange={changeHandler}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Col>

        <Row>
          <Col sm={12} className="col-12 d-flex justify-content-end">
            <Button
              onClick={() => callCreateShort()}
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
              {id ? "Atualizar" : "Cadastrar"} Link
            </h4>{" "}
            <p className="mg-b-20 mg-x-20">
              Link UTM {id ? "atualizado" : "cadastrado"} com sucesso!
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
              Houve um erro ao tentar {id ? "atualizar" : "salvar"} o link UTM
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
