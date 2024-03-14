import React, { useState } from "react";

import {
  Card,
  Col,
  Dropdown,
  Breadcrumb,
  Nav,
  Row,
  Tab,
  FormGroup,
  Form,
  Button,
} from "react-bootstrap";
import { Link } from "react-router-dom";
// import { LightgalleryProvider, LightgalleryItem } from "react-lightgallery";
import { LightGallery } from "../Gallery/data";
import { auth } from "../../../Firebase";
import { getUserDetails } from "../../../services/usersService";
import IntlTelInput from "react-intl-tel-input";

const Profile = () => {
  const [userData, setUserData] = React.useState<any>(null);

  const [err, setError] = useState("");
  const [data, setData] = useState({
    email: "",
    password: "",
    validationPassword: "",
    phone: "",
  });

  const { email, password, validationPassword, phone } = data;

  const changeHandler = (e: any) => {
    setData({ ...data, [e.target.name]: e.target.value });
    setError("");
  };

  const handlePhoneChange = (status: any, phoneNumber: any, country: any) => {
    console.log({ phoneNumber });
    console.log({ status });
    console.log({ country });

    setData({
      ...data,
      phone: phoneNumber,
    });
  };

  // const PhotobookImage = ({ url }) => (
  //   <React.Fragment>
  //     <img src={url} alt="" />
  //   </React.Fragment>
  // );

  // const PhotoItem = ({ image, group }) => (
  //   <LightgalleryItem group={group} src={image}>
  //     <PhotobookImage url={image} />
  //   </LightgalleryItem>
  // );

  const loadUserData = async () => {
    auth.onAuthStateChanged(async (actualUser) => {
      if (!actualUser) return;

      try {
        const userResult = await getUserDetails(actualUser?.email);
        setUserData(userResult.data);
      } catch (error) {}
    });
  };
  const openInNewTab = (url: string) => {
    window.open(url, "_blank", "noreferrer");
  };

  React.useEffect(() => {
    loadUserData();
  });

  return (
    <div>
      {/* <!-- breadcrumb --> */}
      <div className="breadcrumb-header justify-content-between">
        <div className="left-content">
          <span className="main-content-title mg-b-0 mg-b-lg-1">
            PERFIL E ASSINATURA
          </span>
        </div>
      </div>
      {/* <!-- /breadcrumb --> */}

      <Row>
        <Col lg={12} md={12}>
          <Card className="custom-card customs-cards">
            <Card.Body className=" d-md-flex bg-white">
              {/* <div className="">
                <span className="profile-image pos-relative">
                  <img
                    className="br-5"
                    alt=""
                    src={require("../../../assets/img/faces/profile.jpg")}
                  />
                  <span className="bg-success text-white wd-1 ht-1 rounded-pill profile-online"></span>
                </span>
              </div> */}
              <div className="my-md-auto mt-4 prof-details">
                <h4 className="font-weight-semibold ms-md-4 ms-0 mb-1 pb-0">
                  {userData && userData.userDisplayName
                    ? userData.userDisplayName
                    : ""}
                </h4>

                <p className="text-muted ms-md-4 ms-0 mb-2">
                  <span>
                    <i className="fa fa-phone me-2"></i>
                  </span>
                  <span className="font-weight-semibold me-2">Telefone:</span>
                  <span>
                    {userData && userData.phone ? userData.phone : "N/A"}
                  </span>
                </p>
                <p className="text-muted ms-md-4 ms-0 mb-2">
                  <span>
                    <i className="fa fa-envelope me-2"></i>
                  </span>
                  <span className="font-weight-semibold me-2">Email:</span>
                  <span>{userData && userData.id ? userData.id : ""}</span>
                </p>
              </div>
            </Card.Body>
          </Card>
          <span className=" py-0 ">
            <div className="profile-tab tab-menu-heading border-bottom-0 ">
              <Tab.Container
                id="left-tabs-example"
                defaultActiveKey="Assinatura"
              >
                <Nav
                  variant="pills"
                  className="nav profile-tabs main-nav-line tabs-menu profile-nav-line bg-white mb-4 border-0 br-5 mb-0	"
                >
                  <Nav.Item className="me-1">
                    <Nav.Link className=" mb-2 mt-2" eventKey="Assinatura">
                      Assinatura
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item className="me-1">
                    <Nav.Link className="mb-2 mt-2" eventKey="Plans">
                      Planos
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item className="me-1">
                    <Nav.Link className="mb-2 mt-2" eventKey="AccountSettings">
                      Account Settings
                    </Nav.Link>
                  </Nav.Item>
                </Nav>
                <Row className=" row-sm ">
                  <Col lg={12} md={12}>
                    <div className="custom-card main-content-body-profile">
                      <Tab.Content>
                        <Tab.Pane eventKey="Assinatura">
                          <div
                            className="main-content-body tab-pane  active"
                            id="about"
                          >
                            <Card>
                              <Card.Body className=" p-0 border-0 p-0 rounded-10">
                                <div className="p-4">
                                  <p className="m-b-5">Plano atual</p>
                                  <h4 className="tx-15 text-uppercase mb-3">
                                    {userData && userData.userPlan
                                      ? userData.userPlan
                                      : ""}
                                  </h4>
                                </div>
                                <div className="border-top"></div>

                                <div className="p-4">
                                  <p className="m-b-5">Valor</p>
                                  <h4 className="tx-15 text-uppercase mb-3">
                                    R${" "}
                                    {userData && userData.planPrice
                                      ? userData.planPrice
                                      : ""}
                                  </h4>
                                </div>
                              </Card.Body>
                            </Card>
                          </div>
                        </Tab.Pane>

                        <Tab.Pane eventKey="Plans">
                          <div
                            className="main-content-body tab-pane border-top-0"
                            id="friends"
                          >
                            <Row className="d-flex align-items-center justify-content-center">
                              <Col sm={12} xxl={3} md={6} lg={6}>
                                <Card className="p-3 pricing-card">
                                  <Card.Header className="text-justified pt-2">
                                    <p className="tx-18 font-weight-semibold mb-1">
                                      Plano Mensal
                                      {userData &&
                                      userData.userPlan === "Plano Mensal" ? (
                                        <span className=" tx-11 float-end badge bg-primary text-white px-2 py-1 rounded-pill mt-2">
                                          {"Seu plano atual"}
                                        </span>
                                      ) : (
                                        ""
                                      )}
                                    </p>

                                    <p className="text-justify font-weight-semibold mb-1">
                                      {" "}
                                      <span className="tx-30 me-2">R$</span>
                                      <span className="tx-30 me-1">49,90</span>
                                      <span className="tx-24">
                                        <span className="op-5 text-muted tx-20">
                                          /
                                        </span>{" "}
                                        mês
                                      </span>
                                    </p>
                                  </Card.Header>
                                  <Card.Body className="pt-2">
                                    <ul className="text-justify pricing-body text-muted ps-0">
                                      <li className="mb-4">
                                        <span className="text-primary me-2 p-1 bg-primary-transparent  rounded-pill tx-8">
                                          <i className="fa fa-check"></i>
                                        </span>{" "}
                                        <strong>10</strong> Campanhas
                                        Simultâneas/mês
                                      </li>
                                      <li className="mb-4">
                                        <span className="text-primary me-2 p-1 bg-primary-transparent  rounded-pill tx-8">
                                          <i className="fa fa-check"></i>
                                        </span>{" "}
                                        Grupos ilimitados
                                      </li>
                                    </ul>
                                  </Card.Body>
                                  <Card.Footer className=" text-center border-top-0 pt-1">
                                    <Button
                                      className="btn btn-lg btn-primary text-white btn-block"
                                      disabled={
                                        userData &&
                                        userData.userPlan === "Plano Mensal"
                                      }
                                      onClick={() =>
                                        openInNewTab(
                                          `https://pay.hotmart.com/E72356909C?off=qxmwjian&checkoutMode=10&bid=1623777460085&email=${
                                            userData?.id ? userData.id : ""
                                          }`
                                        )
                                      }
                                    >
                                      <span className="ms-4 me-4">
                                        Assinar Plano Mensal
                                      </span>
                                    </Button>
                                  </Card.Footer>
                                </Card>
                              </Col>

                              <Col sm={12} xxl={3} md={6} lg={6}>
                                <Card className="p-3 pricing-card">
                                  <Card.Header className="text-justified pt-2">
                                    <p className="tx-18 font-weight-semibold mb-1">
                                      Plano Semestral
                                      {userData &&
                                      userData.userPlan ===
                                        "Plano Semestral" ? (
                                        <span className=" tx-11 float-end badge bg-primary text-white px-2 py-1 rounded-pill mt-2">
                                          {"Seu plano atual"}
                                        </span>
                                      ) : (
                                        ""
                                      )}
                                    </p>

                                    <p className="text-justify font-weight-semibold mb-1">
                                      {" "}
                                      <span className="tx-30 me-2">R$</span>
                                      <span className="tx-30 me-1">249,00</span>
                                      <span className="tx-24">
                                        <span className="op-5 text-muted tx-20">
                                          /
                                        </span>{" "}
                                        mês
                                      </span>
                                    </p>
                                  </Card.Header>
                                  <Card.Body className="pt-2">
                                    <ul className="text-justify pricing-body text-muted ps-0">
                                      <li className="mb-4">
                                        <span className="text-primary me-2 p-1 bg-primary-transparent  rounded-pill tx-8">
                                          <i className="fa fa-check"></i>
                                        </span>{" "}
                                        <strong>50</strong> Campanhas
                                        Simultâneas/mês
                                      </li>
                                      <li className="mb-4">
                                        <span className="text-primary me-2 p-1 bg-primary-transparent  rounded-pill tx-8">
                                          <i className="fa fa-check"></i>
                                        </span>{" "}
                                        Grupos ilimitados
                                      </li>
                                    </ul>
                                  </Card.Body>
                                  <Card.Footer className=" text-center border-top-0 pt-1">
                                    <Button
                                      className="btn btn-lg btn-primary text-white btn-block"
                                      disabled={
                                        userData &&
                                        userData.userPlan === "Plano Semestral"
                                      }
                                      onClick={() =>
                                        openInNewTab(
                                          `https://pay.hotmart.com/E72356909C?off=8scfw3cn&checkoutMode=10&bid=1623777460085&email=${
                                            userData?.id ? userData.id : ""
                                          }`
                                        )
                                      }
                                    >
                                      <span className="ms-4 me-4">
                                        Assinar Plano Semestral
                                      </span>
                                    </Button>
                                  </Card.Footer>
                                </Card>
                              </Col>
                            </Row>
                          </div>
                        </Tab.Pane>
                        <Tab.Pane eventKey="AccountSettings">
                          <div
                            className="main-content-body tab-pane  border-0"
                            id="settings"
                          >
                            <Card>
                              <Card.Body
                                className=" border-0"
                                data-select2-id="12"
                              >
                                <Form
                                  className="form-horizontal"
                                  data-select2-id="11"
                                >
                                  <div className="mb-4 main-content-label">
                                    Account
                                  </div>
                                  <FormGroup className="form-group ">
                                    <Row className=" row-sm">
                                      <Col md={3}>
                                        <Form.Label className="form-label">
                                          Email
                                        </Form.Label>
                                      </Col>
                                      <Col md={9}>
                                        <Form.Control
                                          type="text"
                                          className="form-control"
                                          placeholder="Email"
                                          value={email}
                                          onChange={changeHandler}
                                        />
                                      </Col>
                                    </Row>
                                  </FormGroup>

                                  <FormGroup className="form-group ">
                                    <Row className=" row-sm">
                                      <Col md={3}>
                                        <Form.Label className="form-label">
                                          Telefone
                                        </Form.Label>
                                      </Col>
                                      <Col md={9}>
                                        <div className="input-group ">
                                          <IntlTelInput
                                            containerClassName="intl-tel-input mb-5 mb-sm-0"
                                            inputClassName="form-control"
                                            value={phone}
                                            onPhoneNumberChange={
                                              handlePhoneChange
                                            }
                                          />
                                        </div>
                                      </Col>
                                    </Row>
                                  </FormGroup>

                                  <FormGroup className="form-group ">
                                    <Row className=" row-sm">
                                      <Col md={3}>
                                        <Form.Label className="form-label">
                                          Nova senha
                                        </Form.Label>
                                      </Col>
                                      <Col md={9}>
                                        <Form.Control
                                          type="text"
                                          className="form-control"
                                          placeholder="Nova senha"
                                          value={password}
                                          onChange={changeHandler}
                                        />
                                      </Col>
                                    </Row>
                                  </FormGroup>

                                  <FormGroup className="form-group ">
                                    <Row className=" row-sm">
                                      <Col md={3}>
                                        <Form.Label className="form-label">
                                          Confirmar senha
                                        </Form.Label>
                                      </Col>
                                      <Col md={9}>
                                        <Form.Control
                                          type="text"
                                          className="form-control"
                                          placeholder="Confirmar senha"
                                          value={validationPassword}
                                          onChange={changeHandler}
                                        />
                                      </Col>
                                    </Row>
                                  </FormGroup>

                                  <FormGroup className="form-group float-end">
                                    <Row className=" row-sm">
                                      <Col md={12}>
                                        {" "}
                                        <Link
                                          className="btn btn-primary mb-1"
                                          to="#"
                                        >
                                          Salvar alterações
                                        </Link>{" "}
                                      </Col>
                                    </Row>
                                  </FormGroup>
                                </Form>
                              </Card.Body>
                            </Card>
                          </div>
                        </Tab.Pane>
                      </Tab.Content>
                    </div>
                  </Col>
                </Row>
              </Tab.Container>
            </div>
          </span>
        </Col>
      </Row>

      {/* <!-- Row --> */}
      <Row className=" row-sm">
        <Col lg={12} md={12}>
          <div className="tab-content"></div>
          {/* </div> */}
        </Col>
      </Row>
      {/* <!-- row closed --> */}
    </div>
  );
};

Profile.propTypes = {};

Profile.defaultProps = {};

export default Profile;
