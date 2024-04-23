import React, { useEffect, useState } from "react";
import { Col, Row, Card, Button, ButtonGroup, Dropdown } from "react-bootstrap";
import { LEADS_COLUMNS } from "./CampaignLeadsTableConfig";
import {
  getCampaignsList,
  getLeadsSumaryByGroups,
} from "../../services/CampaignsService";
import { useDispatch, useSelector } from "react-redux";
import {
  setCampaignsList,
  setSelectedCampaignId,
} from "../../redux/actions/campaign";
import Select from "../../components/Select";
import { useNavigate } from "react-router-dom";
import { exportToCSV } from "../../utils/export-to-csv";
import Table from "../../components/Table";

export default function CampaignLeads() {
  const [campaignSelected, setCampaignSelected] = useState<any>([]);
  const [campaignOptions, setCampaignOptions] = useState<any>([]);
  const [leadTotal, setLeadTotal] = useState<any>(null);

  const selectedCampaignId = useSelector(
    (state: any) => state.campaignReducer.selectedCampaignId
  );

  const campaignsList = useSelector(
    (state: any) => state.campaignReducer.campaignsList
  );

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const navigateTo = () => {
    let path = `${process.env.PUBLIC_URL}/import-leads/`;

    dispatch(setSelectedCampaignId(campaignSelected.value));

    navigate(path);
  };

  const fetchLeads = async (campaignId: any) => {
    try {
      const leads = await getLeadsSumaryByGroups(campaignId);
      const parseLeads = leads.data.map((lead: any) => ({
        ...lead,
        total: lead.entering + lead.leaving,
        current: lead.entering - lead.leaving,
      }));

      setCampaignSelected(parseLeads);

      const entering = parseLeads.reduce(
        (acc: any, lead: any) => acc + lead.entering,
        0
      );

      const leaving = parseLeads.reduce(
        (acc: any, lead: any) => acc + lead.leaving,
        0
      );
      console.log(
        `${parseLeads[0].daybr} a ${parseLeads[parseLeads.length - 1].daybr}`
      );
      setLeadTotal({
        entering,
        leaving,
        period: `${parseLeads[0].daybr} a ${
          parseLeads[parseLeads.length - 1].daybr
        }`,
        campaignId,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleCampaignSelect = ({ value }: any) => {
    const selectedCampaign = campaignOptions.find(
      (campaign: any) => campaign.value === value
    );
    dispatch(setSelectedCampaignId(value));
    fetchLeads(selectedCampaign.value);
  };

  const onSelect = async (campaign: any) => {
    fetchLeads(campaign.value);
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
    console.log(selectedCampaignId, "selectedCampaignId leads");
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

  const getTable = () => {
    const campaignId = leadTotal?.campaignId || "example-test";
    const html = document.getElementById("tbLinkList");
    console.log(html, "html");
    exportToCSV(html, `${campaignId}_list.csv`);
  };

  return (
    <React.Fragment>
      <div>
        <div className="left-content">
          <h1
            className="main-content-title mg-b-0 mg-b-lg-1"
            style={{ marginTop: 20 }}
          >
            Leads
          </h1>
          <div className="mb-4">
            <p className="mg-b-10">Campanha:</p>
            <Select
              options={campaignOptions}
              onChange={(e) => handleCampaignSelect({ value: e.target.value })}
            />
          </div>
        </div>
        {leadTotal?.campaignId && (
          <div style={{ display: "flex" }}>
            <div>
              <Button
                variant=""
                className="btn me-2 btn-primary mb-4"
                onClick={() => getTable()}
              >
                <i className="fas fa-plus me-2"></i>
                Exportar CSV
              </Button>
            </div>
            <div>
              <Button
                variant=""
                className="btn me-2 btn-secondary mb-4"
                onClick={() => navigateTo()}
              >
                <i className="fas fa-upload me-2"></i>
                Importar Leads
              </Button>
            </div>
          </div>
        )}
      </div>
      {leadTotal ? (
        <Row>
          <Col xl={3} lg={12} md={12} xs={12}>
            <Card className="sales-card">
              <Row>
                <div className="col-8">
                  <div className="ps-4 pt-4 pe-3 pb-4">
                    <div className="">
                      <h6 className="mb-2 tx-12">TOTAL DE LEADS</h6>
                    </div>
                    <div className="pb-0 mt-0">
                      <div className="d-flex">
                        <h4 className="tx-22 font-weight-semibold mb-2">
                          {leadTotal.entering - leadTotal.leaving}
                        </h4>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-4">
                  <div className="circle-icon bg-warning-transparent text-center align-self-center overflow-hidden">
                    <i className="fe fe-trending-up tx-16 text-success"></i>
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
                      <h6 className="mb-2 tx-12">TOTAL DE SAÍDAS</h6>
                    </div>
                    <div className="pb-0 mt-0">
                      <div className="d-flex">
                        <h4 className="tx-22 font-weight-semibold mb-2">
                          {leadTotal.leaving}
                        </h4>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-4">
                  <div className="circle-icon bg-warning-transparent text-center align-self-center overflow-hidden">
                    <i className="fe fe-trending-down tx-16 text-secondary"></i>
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
                      <h6 className="mb-2 tx-12">TOTAL DE ENTRADAS</h6>
                    </div>
                    <div className="pb-0 mt-0">
                      <div className="d-flex">
                        <h4 className="tx-22 font-weight-semibold mb-2">
                          {leadTotal.entering}
                        </h4>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-4">
                  <div className="circle-icon bg-warning-transparent text-center align-self-center overflow-hidden">
                    <i className="fe fe-arrow-up-circle tx-16 text-primary"></i>
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
                      <h6 className="mb-2 tx-12">PERÍODO</h6>
                    </div>
                    <div className="pb-0 mt-0">
                      <div className="d-flex">
                        <span className="tx-16 font-weight-semibold mb-2">
                          {leadTotal.period}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-4">
                  <div className="circle-icon bg-warning-transparent text-center align-self-center overflow-hidden">
                    <i className="fas fa-calendar text-muted tx-16"></i>
                  </div>
                </div>
              </Row>
            </Card>
          </Col>
        </Row>
      ) : null}
      <Table
        title="Leads dessa campanha"
        columns={LEADS_COLUMNS}
        data={campaignSelected}
      />
    </React.Fragment>
  );
}
