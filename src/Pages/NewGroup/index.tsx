import React, { useRef, useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import ReactApexChart from "react-apexcharts";
import { useNavigate } from "react-router-dom";
import { SingleValue } from "react-select";
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
  Modal,
} from "react-bootstrap";
import { getCampaignsList } from "../../services/CampaignsService";
import { setCampaignsList } from "../../redux/actions/campaign";
import { createGroup, updateGroup } from "../../services/GroupsService";
import Select from "../../components/Select";

export default function NewGroup() {
  let navigate = useNavigate();
  const dispatch = useDispatch();

  const campaignsList = useSelector(
    (state: any) => state.campaignReducer.campaignsList
  );
  const selectedGroup = useSelector(
    (state: any) => state.groupReducer.selectedGroup
  );
  console.log(selectedGroup, "@@@ selectedGroup");
  const selectedCampaignId = useSelector(
    (state: any) => state.campaignReducer.selectedCampaignId
  );

  const [campaignSelected, setCampaignSelected] = useState<any>(null);
  const [options, setOptions] = useState<any>([]);

  const [createdModalIsOpen, setCreatedModalIsOpen] = useState(false);
  const [errorModalIsOpen, setErrorModalIsOpen] = useState(false);

  const [err, setError] = useState("");
  const [data, setData] = useState({
    url: selectedGroup?.projectId ? selectedGroup.url : "",
  });

  const { url } = data;

  const handleChangeValue = (name: string, value: string) => {
    setData({
      ...data,
      [name]: value,
    });
  };

  const onSelect = async (value: any) => {
    setCampaignSelected(value);
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

    if (campaignsMapped.length) {
      if (selectedCampaignId) {
        const selectedCampaign = campaignsMapped.find(
          (campaign: any) => campaign.value === selectedCampaignId
        );

        if (selectedCampaign) onSelect(selectedCampaign);
      }
    }

    setOptions(campaignsMapped);
  };

  const setGroupForm = () => {
    setCampaignsOptions();

    if (selectedGroup) {
      setData({
        url: selectedGroup.url,
      });
    }
  };

  const saveGroupData = async () => {
    try {
      selectedGroup
        ? await updateGroup(url, selectedGroup?.id, campaignSelected.value)
        : await createGroup(url, campaignSelected.value);

      setCreatedModalIsOpen(true);
    } catch (error) {
      console.log(error);
      setErrorModalIsOpen(true);
    }
  };

  useEffect(() => {
    setGroupForm();
  }, []);

  return (
    <React.Fragment>
      <div className="breadcrumb-header justify-content-between">
        <div className="left-content">
          <h5 className="mb-4 tx-gray-600">
            {selectedGroup ? "Alterar Grupo" : "Novo grupo"}
          </h5>
          <h1 className="main-content-title mg-b-0 mg-b-lg-1">
            Informações do Grupo
          </h1>
          <h6 className="mb-4 tx-gray-500">
            Preencha as informações para cadastrar o grupo
          </h6>
        </div>
      </div>
      {/* <!-- /breadcrumb --> */}

      {/* <!-- row  --> */}
      <Row>
        <Col sm={12} className="col-12">
          {err && <Alert variant="danger">{err}</Alert>}
          <Form>
            <Col xl={10} lg={12} md={12} xs={12}>
              <div>
                <Form.Group className="form-group">
                  <Form.Label className="">Campanha</Form.Label>{" "}
                  <div className=" SlectBox">
                    <Select
                      options={options}
                      onChange={(e) =>
                        setCampaignSelected({ value: e.target.value })
                      }
                    />
                  </div>
                </Form.Group>
              </div>
            </Col>
            <Row>
              <Col xl={10} lg={12} md={12} xs={12}>
                <Form.Group className="form-group">
                  <Form.Label className="">URL</Form.Label>{" "}
                  <Form.Control
                    className="form-control"
                    placeholder="Ex: https://chat.whatsapp.com/B9zVoUON2LBAZRjuG0eQd"
                    name="url"
                    value={data.url}
                    type="text"
                    onChange={(e) => handleChangeValue("url", e.target.value)}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Col>
      </Row>
      <Row>
        <Col sm={12} className="col-12 d-flex justify-content-end">
          <Button
            onClick={() => saveGroupData()}
            variant=""
            className="btn me-2 btn-primary mb-4"
          >
            {selectedGroup ? "Alterar" : "Salvar"}
          </Button>
        </Col>
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
              {selectedGroup ? "Atualizar" : "Cadastrar"} Grupo
            </h4>{" "}
            <p className="mg-b-20 mg-x-20">
              Grupo {selectedGroup ? "atualizado" : "cadastrado"} com sucesso!
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
              Houve um erro ao tentar {selectedGroup ? "atualizar" : "salvar"} o
              grupo
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
