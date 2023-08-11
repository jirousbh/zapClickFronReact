import React, { useRef, useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import ReactApexChart from "react-apexcharts";
import { useNavigate } from "react-router-dom";
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
  Modal,
} from "react-bootstrap";
import { getCampaignsList } from "../../services/CampaignsService";
import { setCampaignsList } from "../../redux/actions/campaign";
import { createGroup, updateGroup } from "../../services/GroupsService";

export default function NewGroup() {
  let navigate = useNavigate();
  const dispatch = useDispatch();

  const campaignsList = useSelector(
    (state: any) => state.campaignReducer.campaignsList
  );
  const selectedGroup = useSelector(
    (state: any) => state.groupReducer.selectedGroup
  );
  const selectedCampaignId = useSelector(
    (state: any) => state.campaignReducer.selectedCampaignId
  );

  const [campaignSelected, setCampaignSelected] = useState<any>(null);
  const [singleselect, setSingleselect] = useState<SingleValue<any>>(null);
  const [options, setOptions] = useState<any>([]);

  const [createdModalIsOpen, setCreatedModalIsOpen] = useState(false);
  const [errorModalIsOpen, setErrorModalIsOpen] = useState(false);

  const [err, setError] = useState("");
  const [data, setData] = useState({
    url: "",
  });

  const { url } = data;

  const changeHandler = (e: any) => {
    setData({ ...data, [e.target.name]: e.target.value });
    setError("");
  };

  const onSelect = async (value: any) => {
    setSingleselect(value);
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
          (campaign: any) => campaign.value == selectedCampaignId
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

  const saveGroupData = () => {
    try {
      selectedGroup
        ? updateGroup(url, selectedGroup.id, selectedGroup.projectId)
        : createGroup(url, singleselect.value);

      setCreatedModalIsOpen(true);
    } catch (error) {
      setErrorModalIsOpen(true);
    }
  };

  const saveIsDisabled = () => {
    if (selectedGroup) return !url?.length;

    return !url?.length && !singleselect.value;
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
                <div className="mb-4">
                  <div className=" SlectBox">
                    <Select
                      defaultValue={singleselect}
                      onChange={onSelect}
                      options={options}
                      placeholder="Selecione uma campanha"
                      classNamePrefix="selectform"
                      isDisabled={!!selectedGroup}
                    />
                  </div>
                </div>
              </div>
            </Col>

            <Row>
              <Col xl={10} lg={12} md={12} xs={12}>
                <Form.Group className="form-group">
                  <Form.Label className="">URL</Form.Label>{" "}
                  <Form.Control
                    className="form-control"
                    placeholder="Url do grupo"
                    name="name"
                    type="text"
                    value={url}
                    onChange={changeHandler}
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
            disabled={
              selectedGroup ? !url?.length : !url?.length && !singleselect
            }
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
