import React, { useState } from "react";
import { Button, Col, Form, Row, Alert } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../Firebase/firebase";
import "./css/Login.css";

const SignIn = () => {
  const [err, setError] = useState("");
  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const { email, password } = data;

  const changeHandler = (e: any) => {
    setData({ ...data, [e.target.name]: e.target.value });
    setError("");
  };

  let navigate = useNavigate();

  const routeChange = () => {
    let path = `${process.env.PUBLIC_URL}/dashboard/`;
    navigate(path);
  };

  const Login = (e: any) => {
    e.preventDefault();
    auth
      .signInWithEmailAndPassword(email, password)
      .then((user) => {
        console.log(user);
        routeChange();
      })
      .catch((err) => {
        console.log(err);

        let errmsg = err.message;
        if (err.code == "auth/wrong-password")
          errmsg = "Senha inválida. Tente novamente";
        else if (err.code == "auth/user-not-found")
          errmsg = "Usuário não encontrado";
        else if (err.code == "auth/email-already-in-use")
          errmsg = "Este e-mail já é utlizado por outra conta.";

        setError(errmsg);
      });
  };

  return (
    <>
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
                className="card-sigin-main mx-auto my-auto py-4 justify-content-center"
              >
                <div className="card-sigin">
                  <div className="main-card-signin d-md-flex">
                    <div className="wd-100p">
                      <div className="text-muted text-center mb-4">
                        <img
                          src={require("../assets/img/brand/logo_text.png")}
                          className="sign-favicon ht-40"
                          alt="logo"
                        />
                      </div>
                      <div className="">
                        <div className="main-signup-header">
                          <h1 className="display-4 text-center mb-3">Login</h1>
                          <div className="panel panel-primary">
                            <div className="mb-2 border-bottom-0">
                              <div className="tabs-menu1">
                                {err && <Alert variant="danger">{err}</Alert>}
                                <Form>
                                  <Form.Group className="form-group">
                                    <Form.Label className="">Email</Form.Label>{" "}
                                    <Form.Control
                                      className="form-control"
                                      placeholder="usuario@dominio.com"
                                      name="email"
                                      type="text"
                                      value={email}
                                      onChange={changeHandler}
                                      required
                                    />
                                  </Form.Group>
                                  <Form.Group className="form-group">
                                    <div className="d-flex justify-content-between">
                                      <Form.Label>Senha</Form.Label>{" "}
                                      <p className="d-flex align-items-center mb-0">
                                        <Link
                                          className="forget-your-password"
                                          to="#"
                                        >
                                          Esqueceu sua senha?
                                        </Link>
                                      </p>
                                    </div>

                                    <div
                                      className="input-group input-group-merge"
                                      style={{
                                        display: "flex",
                                        flexDirection: "row",
                                      }}
                                    >
                                      <Form.Control
                                        className="form-control"
                                        placeholder="Entre com sua senha"
                                        name="password"
                                        type="password"
                                        value={password}
                                        onChange={changeHandler}
                                        required
                                      />

                                      <span className="input-group-text">
                                        <a href="#" id="eyeToggle">
                                          <i className="fe fe-eye-off tx-white-8"></i>
                                        </a>
                                      </span>
                                    </div>
                                  </Form.Group>

                                  <div className="form-check form-switch">
                                    <input
                                      className="form-check-input"
                                      type="checkbox"
                                      id="rememberMe"
                                    />
                                    <label
                                      className="form-check-label"
                                      id="lblAllowOverClicks"
                                    >
                                      Lembrar meu Login
                                    </label>
                                  </div>
                                  <br />

                                  <Button
                                    variant=""
                                    type="submit"
                                    className="btn btn-lg w-100 btn-primary mb-3"
                                    onClick={Login}
                                  >
                                    Entrar
                                  </Button>

                                  <div className="text-center mt-3">
                                    <p className="text-muted">
                                      Não tem cadastro ainda?{" "}
                                      <Link
                                        to={`${process.env.PUBLIC_URL}/authentication/signup`}
                                        className="signup-link"
                                      >
                                        {" "}
                                        Cadastre-se Aqui.
                                      </Link>
                                    </p>
                                  </div>
                                </Form>
                              </div>
                            </div>
                          </div>
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
    </>
  );
};

SignIn.propTypes = {};

SignIn.defaultProps = {};

export default SignIn;
