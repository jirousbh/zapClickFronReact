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
  Form,
  Alert,
} from "react-bootstrap";

import {
  COLUMNS,
  DATATABLE,
  GlobalFilter,
} from "../../components/Dashboard/Dashboard-1/data";

export default function NewCampaign() {
  const [err, setError] = useState("");
  const [data, setData] = useState({
    name: "",
    description: "",
    company: "",
    client: "",
    clicks: "",
    link: "",
  });

  const { name, description, company, client, clicks, link } = data;

  const changeHandler = (e: any) => {
    setData({ ...data, [e.target.name]: e.target.value });
    setError("");
  };

  return (
    <React.Fragment>
      <div className="breadcrumb-header justify-content-between">
        <div className="left-content">
          <h5 className="mb-4 tx-gray-600">Nova Campanhas</h5>
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
                    name="clicks"
                    type="text"
                    value={clicks}
                    onChange={changeHandler}
                    required
                  />
                </Form.Group>
              </Col>
              <Col lg={6}>
                <Form.Group className="form-group">
                  <Form.Label className="">Link da Campanha</Form.Label>{" "}
                  <Form.Control
                    className="form-control"
                    placeholder=""
                    name="link"
                    type="text"
                    value={link}
                    onChange={changeHandler}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Col>
      </Row>
    </React.Fragment>
  );
}
