import React, { useRef, useEffect, useState } from "react";

import ReactApexChart from "react-apexcharts";
import { useNavigate } from "react-router-dom";
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
  Modal,
  ProgressBar,
  Spinner,
} from "react-bootstrap";

import { auth } from "../../Firebase";

import { setCampaignsList } from "../../redux/actions/campaign";
import { setInstancesList } from "../../redux/actions/instances";

import { getCampaignsList } from "../../services/CampaignsService";
import { getInstancesList } from "../../services/InstancesService";
import { createGroup, updateGroup } from "../../services/GroupsService";
import { fetchAlertNumber, getMysqlTables } from "../../services/usersService";
import { sendBulkVideo } from "../../services/MessagesService";
import { startTimer } from "../../utils/dates";

export default function SendingBulkMessages() {
  let navigate = useNavigate();
  const dispatch = useDispatch();

  const selectedGroup = useSelector(
    (state: any) => state.groupReducer.selectedGroup
  );
  const instancesList = useSelector(
    (state: any) => state.instancesReducer.instancesList
  );
  const campaignsList = useSelector(
    (state: any) => state.campaignReducer.campaignsList
  );
  const selectedCampaignId = useSelector(
    (state: any) => state.campaignReducer.selectedCampaignId
  );

  let bulkMessagingDelayMsg: any = [];
  let bulkMessagingDelayTime: any = [];
  let bulkMessagingIterator = 0;
  let bulkMessagingErrElem = "";
  let bulkMessagingInstancesSelected = [];
  let bulkMessginPercent = 0;
  let bulkMessagingTotalNumbers = 0;

  const [tableSelect, setTableSelect] = useState<SingleValue<any>>(null);

  const [sqlTablesOptions, setMySqlTablesOptions] = useState<any>([]);
  const [instancesOptions, setInstancesOptions] = useState([]);

  const [confirmSendModalOpen, setConfirmSendModalOpen] = useState(false);
  const [createdModalIsOpen, setCreatedModalIsOpen] = useState(false);
  const [errorModalIsOpen, setErrorModalIsOpen] = useState(false);

  const [sendingMessages, setSendingMessages] = useState(false);

  const [grpNextAction, setGrpNextAction] = useState("");
  const [grpLastAction, setGrpLastAction] = useState("");

  const [progress, setProgress] = useState(0);

  const [err, setError] = useState("");

  const [totalSent, setTotalSent] = useState(0);

  const [data, setData] = useState({
    alertNumber: "",
    minInterval: 4,
    maxInterval: 8,
    grpMessage: "",
    btnText: "",
    btnUrl: "",
    grpVideoB64: "",
    instances: [],
  });

  const {
    alertNumber,
    minInterval,
    maxInterval,
    grpMessage,
    btnText,
    btnUrl,
    grpVideoB64,
    instances,
  } = data;

  function randomIntFromInterval(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  const changeHandler = (e: any) => {
    setData({ ...data, [e.target.name]: e.target.value });
    setError("");
  };

  const setupTableOptions = async (myTablesData: any) => {
    const myTablesDataMapped = myTablesData.results.map((table: any) => {
      return {
        value: table.Tables_in_coolh425_numbers,
        label: table.Tables_in_coolh425_numbers,
        data: table,
      };
    });

    setMySqlTablesOptions(myTablesDataMapped);
  };

  const loadTableOptions = async () => {
    const fetchMySqlTablesResult = await getMysqlTables();

    if (fetchMySqlTablesResult?.data) {
      setupTableOptions(fetchMySqlTablesResult?.data);
    }
  };

  const setupBulkMessageInterface = (delayInSec: any, delayBefore: any) => {
    bulkMessagingDelayTime[bulkMessagingIterator] = delayInSec;

    bulkMessagingDelayMsg[bulkMessagingIterator] =
      "Mensagem usando " +
      bulkMessagingInstancesSelected.length +
      " instância(s) será enviada em: <span id='time'>" +
      bulkMessagingDelayTime[bulkMessagingIterator] +
      "</span>";

    if (bulkMessagingIterator != 0) {
      setGrpNextAction(bulkMessagingDelayMsg[bulkMessagingIterator]);

      startTimer(
        bulkMessagingDelayTime[bulkMessagingIterator],
        document.getElementById("time")
      );
    }
  };

  const bullkMessagingSuccessCallback = function (result: any) {
    if (result.data.totalTries) {
      setGrpLastAction(
        `Mensagem enviada usando ${result.data.totalTries} instância(s)`
      );

      bulkMessginPercent = Math.round(
        (bulkMessagingIterator + 1) / bulkMessagingTotalNumbers
      );

      bulkMessginPercent = bulkMessginPercent * 100;

      setProgress(bulkMessginPercent);

      setGrpNextAction(bulkMessagingDelayMsg[bulkMessagingIterator + 1]);

      startTimer(
        bulkMessagingDelayTime[bulkMessagingIterator + 1],
        document.getElementById("time")
      );

      setTotalSent(totalSent + result.data.totalTries - result.data.errorCount);
    } else {
      setGrpNextAction("");
      setSendingMessages(false);
      bulkMessagingIterator = bulkMessagingTotalNumbers;
    }

    if (result.data.errorCount) {
      // window.removeEventListener("beforeunload", preventExitWindow);
      // document.getElementById("grpLastAction").innerHTML =
      //   '<span class="badge bg-danger">Erro ao enviar mensagem</span>';
      // bulkMessagingErrElem.innerHTML =
      //   bulkMessagingErrElem.innerHTML +
      //   "Erro tentativa " +
      //   (bulkMessagingIterator + 1) +
      //   " - " +
      //   result.data.errorMsg +
      //   "<br>";
      // bulkMessagingErrElem.style.display = "";
    }
  };

  const sendVideos = () => {
    const initTime = Date.now();
    const delayInSec = randomIntFromInterval(
      Number(minInterval),
      Number(maxInterval)
    );

    const bulkMessagingInstancesSelected = instances.map(
      (instance: any) => instance.value
    );

    sendBulkVideo({
      tableName: tableSelect.value,
      instances: bulkMessagingInstancesSelected,
      grpMessage,
      video: grpVideoB64,
    })
      .then((result) => {
        bullkMessagingSuccessCallback(result);

        bulkMessagingIterator++;

        if (bulkMessagingIterator < bulkMessagingTotalNumbers) {
          if (Date.now() - initTime > delayInSec * 1000) {
            sendVideos();
          } else {
            const adjustedDelay = delayInSec * 1000 - (Date.now() - initTime);

            setupBulkMessageInterface(delayInSec, adjustedDelay);

            setTimeout(() => {
              sendVideos();
            }, adjustedDelay);
          }
        } else {
          console.log("finalizado!");
        }
      })
      .catch((error) => {
        console.error(error);
        // bullkMessagingErrorCallback(error);
        sendVideos();
      });
  };

  const sendBulkMessages = () => {
    setSendingMessages(true);

    // bulkMessagingDelayMsg = [];
    // bulkMessagingDelayTime = [];

    // bulkMessagingIterator = totalSent - 3;
    if (grpVideoB64) sendVideos();
    // else if (btnUrl && btnText) sendButtons();
    // else sendMessages();
  };

  const validateSendBulkMessages = () => {
    try {
      setError("");

      if (!alertNumber) {
        setError(
          "É necessário ter cadastrado um número de alerta de instância"
        );
      } else if (!tableSelect) {
        setError("É necessário selecionar uma tabela para envio de mensagens");
      } else if (!instances?.length) {
        setError("É necessário selecionar ao menos uma instância");
      } else if (!grpMessage) {
        setError("É necessário digitar uma mensagem para enviar");
      } else if (btnText && !btnUrl) {
        setError("É necessário ter uma url para o botão");
      } else if (
        btnText != "" &&
        !(btnUrl.startsWith("http://") || btnUrl.startsWith("https://"))
      ) {
        setError("A url precisa iniciar com http:// ou https://");
      } else {
        setConfirmSendModalOpen(true);
      }
    } catch (error) {
      setErrorModalIsOpen(true);
    }
  };

  const getAlertNumber = async () => {
    const fetchAlertNumberResult = await fetchAlertNumber();

    if (fetchAlertNumberResult?.data) {
      setData({
        ...data,
        alertNumber: fetchAlertNumberResult.data.alertNumber,
      });
    }
  };

  const changeNumber = () => {};

  const importData = () => {};

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

  useEffect(() => {
    getAlertNumber();
    loadTableOptions();
    setupInstancesOptions();
  }, []);

  return (
    <React.Fragment>
      <div className="breadcrumb-header justify-content-between">
        <div className="left-content">
          <h1 className="main-content-title mg-b-0">Envio em massa</h1>
          <h6 className="mb-4 tx-gray-500">Envio de mensagens (Beta)</h6>
        </div>
      </div>
      {/* <!-- /breadcrumb --> */}

      {/* <!-- row  --> */}
      <Row>
        <Col sm={12} className="col-12">
          <Form>
            <Row className="align-items-end">
              <Col xl={4} lg={8} md={8} xs={8}>
                <Form.Group className="form-group">
                  <Form.Label className="">
                    Numero a receber alerta* - atualmente:{" "}
                    {alertNumber || "Nenhum"}
                  </Form.Label>{" "}
                  <Form.Control
                    className="form-control"
                    placeholder=""
                    name="alertNumber"
                    type="text"
                    value={alertNumber}
                    onChange={changeHandler}
                    required
                  />
                </Form.Group>
              </Col>

              <Col xl={4} lg={8} md={8} xs={8}>
                <Button
                  onClick={() => changeNumber()}
                  variant=""
                  className="btn btn-danger mb-4"
                >
                  <i className="fas fa-mobile"></i> Alterar número
                </Button>
              </Col>
            </Row>
          </Form>
        </Col>
      </Row>

      {/* <!-- row  --> */}
      <Row>
        <Col lg={4}>
          <Form.Label className="">Intervalo para envio em segundos</Form.Label>{" "}
          <Row>
            <Col lg={2}>
              <Form.Group className="form-group">
                <Form.Control
                  className="form-control"
                  placeholder=""
                  name="minInterval"
                  type="number"
                  value={minInterval}
                  onChange={changeHandler}
                  required
                />
              </Form.Group>
            </Col>
            <Col lg={2}>
              <Form.Group className="form-group">
                <Form.Control
                  className="form-control"
                  placeholder=""
                  name="maxInterval"
                  type="number"
                  value={maxInterval}
                  onChange={changeHandler}
                  required
                />
              </Form.Group>
            </Col>
          </Row>
        </Col>
      </Row>

      {/* <!-- row  --> */}
      <Row>
        <Col sm={12} className="col-12">
          <Form>
            <Row className="align-items-end">
              <Col xl={4} lg={8} md={8} xs={8}>
                <Form.Group className="form-group">
                  <Form.Label className="">
                    Selecione Tabela do Banco
                  </Form.Label>{" "}
                  <div className=" SlectBox">
                    <Select
                      defaultValue={tableSelect}
                      onChange={setTableSelect}
                      options={sqlTablesOptions}
                      placeholder="Selecione a tabela"
                      classNamePrefix="selectform"
                    />
                  </div>
                </Form.Group>
              </Col>

              <Col xl={4} lg={8} md={8} xs={8}>
                <Button
                  onClick={() => importData()}
                  variant=""
                  className="btn btn-primary mb-4"
                >
                  <i className="fas fa-table"></i> Importar dados
                </Button>
              </Col>
            </Row>
          </Form>
        </Col>
      </Row>

      {/* <!-- row  --> */}
      <Row>
        <Col xl={4} lg={8} md={8} xs={8}>
          <Form.Group className="form-group">
            <Form.Label className="">Mensagem</Form.Label>{" "}
            <Form.Control
              className="form-control"
              placeholder="Se for enviar de uma tabela com nomes use o varíavel $name no texto para aparecer o nome da pessoa. Ex: Olá $name."
              name="grpMessage"
              as="textarea"
              rows={3}
              value={grpMessage}
              onChange={changeHandler}
              required
            />
          </Form.Group>
        </Col>
      </Row>

      {/* <!-- row  --> */}
      <Row>
        <Col xl={4} lg={8} md={8} xs={8}>
          <Form.Group className="form-group">
            <Form.Label className="">Texto do Botão</Form.Label>{" "}
            <Form.Control
              className="form-control"
              placeholder="Texto do Botão"
              name="btnText"
              type="text"
              value={btnText}
              onChange={changeHandler}
              required
            />
          </Form.Group>
        </Col>
      </Row>

      {/* <!-- row  --> */}
      <Row>
        <Col xl={4} lg={8} md={8} xs={8}>
          <Form.Group className="form-group">
            <Form.Label className="">Url do Botão</Form.Label>{" "}
            <Form.Control
              className="form-control"
              placeholder="https://..."
              name="btnUrl"
              type="text"
              value={btnUrl}
              onChange={changeHandler}
              required
            />
          </Form.Group>
        </Col>
      </Row>

      {/* <!-- row  --> */}
      <Row>
        <Col xl={4} lg={8} md={8} xs={8}>
          <Form.Group className="form-group">
            <Form.Label htmlFor="formFile" className="form-label">
              Vídeo
            </Form.Label>
            <span>Dica: use um vídeo já enviado pelo Whatsapp</span>
            <Form.Control
              className="form-control"
              type="file"
              id="formFile"
              name="grpVideoB64"
              value={grpVideoB64}
              onChange={changeHandler}
              required
            />
          </Form.Group>
        </Col>
      </Row>

      {/* <!-- row  --> */}
      <Row className="mb-3">
        <Col xl={4} lg={8} md={8} xs={8}>
          <Form.Label htmlFor="formFile" className="form-label">
            Instâncias
          </Form.Label>
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

      {err && <Alert variant="danger">{err}</Alert>}
      {/* <!-- row  --> */}
      <Row>
        <Col sm={12} className="col-12">
          <Button
            onClick={() => validateSendBulkMessages()}
            variant=""
            className="btn me-2 btn-primary mb-4"
            disabled={sendingMessages}
          >
            <i className="fa fa-comments"></i> Enviar Mensagem
          </Button>
        </Col>
      </Row>

      <Row>
        <Col sm={12} className="col-12">
          <Card>
            <Card.Body>
              <div className="mb-4">
                <h4 className="mb-2">
                  <span id="createGroupLabel">Envio de Mensagens</span>
                  {sendingMessages ? (
                    <>
                      <Spinner
                        animation="border"
                        className="spinner-border"
                        role="status"
                      >
                        <span className="sr-only">Carregando...</span>
                      </Spinner>
                      <small>Aguarde. Não Feche essa janela!!!</small>
                    </>
                  ) : null}
                </h4>

                <small>Ultima Ação: {grpLastAction}</small>
                <br />
                <small>Proxima Ação: {grpNextAction}</small>
              </div>

              <div className="text-wrap">
                <div className="progress mg-b-10">
                  <ProgressBar
                    className="progress-bar-lg"
                    // @ts-ignore
                    now={progress}
                    variant="info"
                    label={`${progress}%`}
                  ></ProgressBar>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        <Col xl={4} lg={6} className="col-12">
          <div className="card">
            <div className="card-body">
              <div className="row align-items-center">
                <div className="col">
                  <h6 className="text-uppercase text-muted mb-2">
                    Total de Números Cadastrados
                  </h6>

                  <span className="h2 mb-0" id="totalNumbers">
                    <div
                      className="spinner-border spinner-border-sm text-success"
                      role="status"
                    >
                      <span className="visually-hidden">Carregando...</span>
                    </div>
                    <small>Aguardando Selecionar Tabela...</small>
                  </span>
                </div>
                <div className="col-auto">
                  <span className="h2 fas fa-mobile-alt text-muted mb-0"></span>
                </div>
              </div>
            </div>
          </div>
        </Col>

        <Col xl={4} lg={6} className="col-12">
          <div className="card">
            <div className="card-body">
              <div className="row align-items-center">
                <div className="col">
                  <h6 className="text-uppercase text-muted mb-2">
                    Total Mensagens Enviadas
                  </h6>

                  <span className="h2 mb-0" id="totalSent">
                    <div
                      className="spinner-border spinner-border-sm text-success"
                      role="status"
                    >
                      <span className="visually-hidden">Carregando...</span>
                    </div>
                    <small>
                      {totalSent || "Aguardando Selecionar Tabela..."}
                    </small>
                  </span>
                </div>
                <div className="col-auto">
                  <span className="h2 fas fa-check text-muted mb-0"></span>
                </div>
              </div>
            </div>
          </div>
        </Col>
      </Row>

      {/* Confirmation Modal */}
      <Modal
        size="sm"
        show={confirmSendModalOpen}
        aria-labelledby="example-modal-sizes-title-sm"
      >
        <Modal.Header>
          <Modal.Title>Small Modal</Modal.Title>
          <Button
            variant=""
            className="btn btn-close ms-auto"
            onClick={() => {
              setConfirmSendModalOpen(false);
            }}
          >
            x
          </Button>
        </Modal.Header>
        <Modal.Body>
          <p>
            Tem certeza que deseja enviar essa mensagem usando{" "}
            {instances.length} instância(s)"
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="primary"
            onClick={() => {
              sendBulkMessages();
            }}
          >
            Confirmar
          </Button>
          <Button
            variant="secondary"
            onClick={() => {
              setConfirmSendModalOpen(false);
            }}
          >
            Cancelar
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal */}
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
