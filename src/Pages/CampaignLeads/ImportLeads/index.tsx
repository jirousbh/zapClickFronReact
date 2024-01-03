import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Col, Row, Button, Form, Modal } from "react-bootstrap";
import SuccessIcon from "../../../assets/img/success.svg";
import {
  getCampaignsList,
  importLeads,
} from "../../../services/CampaignsService";
import { setCampaignsList } from "../../../redux/actions/campaign";
import Select from "../../../components/Select";

export default function ImportLeads() {
  const navigate = useNavigate();
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
  const [options, setOptions] = useState<any>([]);

  const [createdModalIsOpen, setCreatedModalIsOpen] = useState(false);

  const [selectedFiles, setSelectedFiles] = useState<any>([]);

  const handleFileChange = (e: any) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
  };

  const navigateToLeads = () => {
    const path = `${process.env.PUBLIC_URL}/campaign-leads/`;
    setCreatedModalIsOpen(false);
    navigate(path);
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
      onSelect(campaignsMapped[0]);
      setOptions(campaignsMapped);
    }
  };

  const setGroupForm = () => {
    setCampaignsOptions();
  };

  const saveGroupData = async () => {
    try {
      await importLeads(campaignSelected.value, selectedFiles);

      setCreatedModalIsOpen(true);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setGroupForm();
  }, []);

  return (
    <React.Fragment>
      <div className="breadcrumb-header justify-content-between">
        <div className="left-content">
          <h5 className="mb-4 tx-gray-600">IMPORTAR LEADS</h5>
          <h1 className="main-content-title mg-b-0 mg-b-lg-1">
            Informações do Grupo
          </h1>
          <h6 className="mb-4 tx-gray-500">
            Importe suas conversas e tenha informações sobre os leads
          </h6>
        </div>
      </div>
      {/* <!-- /breadcrumb --> */}

      {/* <!-- row  --> */}
      <Row>
        <Col sm={12} className="col-12">
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
                  <Form.Label className="">Arquivo(s)</Form.Label>{" "}
                  <input
                    type="file"
                    id="files"
                    name="files"
                    className="form-control"
                    accept=".txt"
                    required={true}
                    multiple={true}
                    onChange={handleFileChange}
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
            Importar
          </Button>
        </Col>
      </Row>

      <Modal show={createdModalIsOpen}>
        <Modal.Header>
          <Button
            variant=""
            className="btn btn-close"
            onClick={() => navigateToLeads()}
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
              Importar Leads
            </h4>{" "}
            <p className="mg-b-20 mg-x-20">
              Leads importados com sucesso!
            </p>
            <Button
              variant=""
              aria-label="Close"
              className="btn ripple btn-success pd-x-25 mg-b-20"
              type="button"
              onClick={() => navigateToLeads()}
            >
              Fechar
            </Button>{" "}
          </div>
        </Modal.Body>
      </Modal>
    </React.Fragment>
  );
}
