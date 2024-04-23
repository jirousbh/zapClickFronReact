import React, { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../Firebase";
import {
  Button,
  Col,
  Form,
  FormGroup,
  Row,
  Alert,
  Spinner,
  Modal,
} from "react-bootstrap";
import { signUpUser } from "../services/usersService";
const SignUp = () => {
  let navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [termsModalOpened, setTermsModalOpened] = useState(false);
  const [openSuccessModal, setOpenSuccessModal] = useState(false);

  const [err, setError] = useState("");
  const [data, setData] = React.useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    confirmRead: false,
    phone: "+55",
  });
  const { email, password, name, confirmPassword, confirmRead, phone } = data;
  const changeHandler = (e: any) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const routeChange = () => {
    let path = `${process.env.PUBLIC_URL}/authentication/login`;
    navigate(path);
  };

  const routeChangeDashboard = useCallback(() => {
    let path = `${process.env.PUBLIC_URL}/dashboard/`;
    navigate(path);
  }, [navigate]);

  useEffect(() => {
    const hasToken = localStorage.getItem("#email") || "";

    if (!!hasToken) routeChangeDashboard();
  }, [routeChangeDashboard]);

  const signUp = async (e: any) => {
    if (!name) setError("Você deve digitar o seu nome");
    if (!email) setError("Você deve digitar o seu email");
    if (password != confirmPassword)
      setError("Os campos de senha estão diferentes");
    if (confirmRead) setError("Você deve declarar que leu os termos de uso");

    setLoading(true);

    try {
      const result = await signUpUser({
        name,
        email,
        password,
        phone,
      });

      setLoading(false);
      routeChange();
    } catch (error: any) {
      setLoading(false);
      setError(error.message);
    }
  };

  return (
    <div>
      <div className="square-box">
        {" "}
        <div></div> <div></div> <div></div> <div></div> <div></div> <div></div>{" "}
        <div></div> <div></div> <div></div> <div></div> <div></div> <div></div>{" "}
        <div></div> <div></div> <div></div>{" "}
      </div>
      <div className="page .bg-gray-100">
        <div className="page-single">
          <div className="container">
            <Row>
              <Col
                xl={5}
                lg={6}
                md={8}
                sm={8}
                xs={10}
                className="card-sigin-main py-4 justify-content-center mx-auto"
              >
                <div className="card-sigin ">
                  {/* <!-- Demo content--> */}
                  <div className="main-card-signin d-md-flex">
                    <div className="wd-100p">
                      <div className="d-flex mb-4">
                        <Link to="#">
                          <img
                            src={require("../assets/img/brand/logo_text.png")}
                            className="sign-favicon ht-40"
                            alt="logo"
                          />
                        </Link>
                      </div>
                      <div className="">
                        <div className="main-signup-header">
                          <h2 className="text-dark">Cadastro</h2>
                          <h6 className="font-weight-normal mb-4">
                            Preencha as informações abaixo
                          </h6>
                          {err && <Alert variant="danger">{err}</Alert>}
                          <Form>
                            <FormGroup className="form-group">
                              <label>Qual é o Seu nome?</label>{" "}
                              <span className="text-danger">*</span>
                              <Form.Control
                                className="form-control"
                                placeholder="Digite seu nome"
                                type="text"
                                name="name"
                                value={name}
                                onChange={changeHandler}
                              />
                            </FormGroup>
                            <FormGroup className="form-group">
                              <label>Qual será o seu email de acesso?</label>{" "}
                              <span className="text-danger">*</span>
                              <Form.Control
                                className="form-control"
                                placeholder="Enter your email"
                                type="text"
                                name="email"
                                value={email}
                                onChange={changeHandler}
                              />
                            </FormGroup>

                            <FormGroup className="form-group">
                              <label>Crie uma senha</label>{" "}
                              <span className="text-danger">*</span>
                              <Form.Control
                                className="form-control"
                                placeholder="Digite sua senha"
                                type="password"
                                name="password"
                                value={password}
                                onChange={changeHandler}
                              />
                            </FormGroup>

                            <FormGroup className="form-group">
                              <label>Confirme sua senha</label>{" "}
                              <span className="text-danger">*</span>
                              <Form.Control
                                className="form-control"
                                placeholder="Repetir senha"
                                type="password"
                                name="confirmPassword"
                                value={confirmPassword}
                                onChange={changeHandler}
                              />
                            </FormGroup>

                            <div className="form-group">
                              <label className="form-label">
                                Telefone Celular{" "}
                                <span className="text-danger">*</span>
                              </label>

                              <input
                                type="text"
                                id="registerPhoneNumber"
                                className="form-control"
                                pattern=".{17,}"
                                data-inputmask="'mask': '+99 99 99999-9999'"
                                value={phone}
                                onChange={changeHandler}
                                required
                                title="Entre com todos os dígitos do telefone"
                              />
                            </div>

                            <Form className="ms-auto d-flex align-items-center mb-2">
                              <Form.Check
                                checked={confirmRead}
                                type="checkbox"
                                id="custom-switch"
                                name="confirmRead"
                                onChange={(e) =>
                                  setData({
                                    ...data,
                                    confirmRead: !confirmRead,
                                  })
                                }
                              />{" "}
                              <Form.Label className="">
                                Declaro que li os Termos de Uso
                                <span className="text-danger">*</span>{" "}
                                <Link
                                  to="#"
                                  onClick={() => setTermsModalOpened(true)}
                                  className="me-2 mt-1"
                                >
                                  (LER)
                                </Link>
                              </Form.Label>
                            </Form>

                            <Button
                              variant=""
                              className="btn btn-primary btn-block"
                              onClick={signUp}
                            >
                              {loading ? (
                                <Spinner
                                  animation="border"
                                  className="spinner-border"
                                  role="status"
                                >
                                  <span className="sr-only">Salvando...</span>
                                </Spinner>
                              ) : (
                                <>Cadastrar</>
                              )}
                            </Button>

                            <div className="main-signup-footer mt-3 text-center ">
                              <p>
                                Já possui uma conta?{" "}
                                <Link
                                  to={`${process.env.PUBLIC_URL}/authentication/login`}
                                >
                                  Login
                                </Link>
                              </p>
                            </div>
                          </Form>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>
          </div>
        </div>
      </div>

      {/* Terms Modal */}

      <Modal show={termsModalOpened}>
        <Modal.Header>
          <Modal.Title>Termos de Uso</Modal.Title>
          <Button
            variant=""
            className="btn btn-close"
            onClick={() => {
              setTermsModalOpened(false);
            }}
          >
            x
          </Button>
        </Modal.Header>
        <Modal.Body>
          <p>
            Ao marcar "Declaro que Li os Termos de Uso" na tela de cadastro para
            a utilização dos serviços, o usuário estará aderindo e aceitando
            automática e integralmente os termos e condições de uso abaixo
            descritos. A ZapClick pode alterar, a qualquer momento, os termos e
            condições de uso sem qualquer aviso, devendo para tanto incluir a
            nova versão em zapclick.digital/termos.html, reservado ao cliente o
            direito de discordância e cancelamento do serviço. as modificações
            passarão a ser aplicáveis a partir da data de veiculação da nova
            versão no (s) link (s) aqui especificado(s), salvo previsão
            expressamente em contrário presente neste documento. O uso contínuo
            do serviço por parte do usuário, após a realização de qualquer
            mudança nos termos e condições de uso, significa que o usuário está
            de acordo com tais modificações.
            <br />
            <br />
            Ao aceitar os termos o usuário está permitindo que a ZapClick entre
            em contato seja por SMS/Whatsapp ou outra forma de aplicação que
            permita envio de mensagens diretamente ao cliente.
          </p>
        </Modal.Body>
      </Modal>

      {/* Success Modal */}
      <Modal show={openSuccessModal}>
        <Modal.Header>
          <Button
            variant=""
            className="btn btn-close"
            onClick={() => {
              routeChange();
            }}
          >
            x
          </Button>
        </Modal.Header>
        <Modal.Body>
          <div className="tx-center ">
            <i className="icon ion-ios-checkmark-circle-outline tx-100 tx-success lh-1 mg-t-20 d-inline-block"></i>{" "}
            <h4 className="tx-success tx-semibold mg-b-20">Parabéns!</h4>{" "}
            <p className="mg-b-20 mg-x-20">
              Sua conta foi registrada com sucesso, agora você pode entrar na
              plataforma com o email e senha registrados.
            </p>
            <Button
              variant=""
              aria-label="Close"
              className="btn ripple btn-success pd-x-25"
              type="button"
              onClick={() => routeChange()}
            >
              Continuar
            </Button>{" "}
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};
SignUp.propTypes = {};

SignUp.defaultProps = {};

export default SignUp;
