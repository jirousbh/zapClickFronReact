import React, { useRef, useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import ReactApexChart from "react-apexcharts";
import Select, { SingleValue } from "react-select";
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
} from "react-bootstrap";

import {
  COLUMNS,
  DATATABLE,
  GlobalFilter,
} from "../../components/Dashboard/Dashboard-1/data";
import { getCompaniesList } from "../../services/CompaniesService";
import { auth } from "../../Firebase/firebase";
import { setCompaniesList } from "../../redux/actions/companies";
import ReactDatePicker from "react-datepicker";

export default function NewCampaign() {
  const dispatch = useDispatch();

  const campaignsList = useSelector(
    (state: any) => state.campaignReducer.campaignsList
  );
  const selectedCampaignId = useSelector(
    (state: any) => state.campaignReducer.selectedCampaignId
  );

  const [companySelected, setCompanySelected] = useState("");
  const [companiesOptions, setCompanyOptions] = useState([]);

  const [err, setError] = useState("");
  const [data, setData] = useState({
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
    instances: "",
    phoneMessage: "",
    wzJoinMsg: "",
    wzLeaveMsg: "",
    projectlAlertNumber: "",
    webHookUrl: "",
  });

  const {
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

  const setCompaniesOptions = () => {
    auth.onAuthStateChanged(async (user) => {
      let companiesListLocal = campaignsList;
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

  useEffect(() => {
    setCompaniesOptions();
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
                  <div className="mb-3">
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
                  </div>
                </Form.Group>
              </Col>
              <Col lg={6}></Col>
            </Row>
          </Form>
        </Col>
      </Row>
    </React.Fragment>
  );
}
