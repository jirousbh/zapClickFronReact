import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../Firebase/firebase";
import { Button, Col, Form, FormGroup, Row, Alert } from "react-bootstrap";
import { signUpUser } from "../services/usersService";
const SignUp = () => {
  const [err, setError] = useState("");
  const [data, setData] = React.useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    confirmRead: "",
    phone: "+55",
  });
  const { email, password, name, confirmPassword, confirmRead, phone } = data;
  const changeHandler = (e: any) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const Signup = (e: any) => {
    if (!name) setError("Você deve digitar o seu nome");
    if (!email) setError("Você deve digitar o seu email");
    if (password != confirmPassword)
      setError("Os campos de senha estão diferentes");
    if (confirmRead) setError("Você deve declarar que leu os termos de uso");

    // e.preventDefault();
    // auth
    //   .createUserWithEmailAndPassword(email, password)
    signUpUser({
      name,
      email,
      password,
      phone,
    })
      .then((user) => {
        console.log(user);
        routeChange();
      })
      .catch((err) => {
        console.log(err);
        setError(err.message);
      });
  };
  let navigate = useNavigate();
  const routeChange = () => {
    let path = `${process.env.PUBLIC_URL}/dashboard/dashboard-1/`;
    navigate(path);
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
                            src={require("../assets/img/brand/favicon.png")}
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
                              <Form.Control
                                className="form-control"
                                placeholder="Enter your firstname and lastname"
                                type="text"
                                name="name"
                                value={name}
                                onChange={changeHandler}
                              />
                            </FormGroup>
                            <FormGroup className="form-group">
                              <label>Qual será o seu email de acesso?</label>{" "}
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

                            <Button
                              variant=""
                              className="btn btn-primary btn-block"
                              onClick={Signup}
                            >
                              Cadastrar
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
    </div>
  );
};
SignUp.propTypes = {};

SignUp.defaultProps = {};

export default SignUp;
