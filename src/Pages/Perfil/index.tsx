import React, { useEffect, useState/* , CSSProperties */ } from "react";
/* import {
  useTable,
  useSortBy,
  useGlobalFilter,
  usePagination,
} from "react-table"; */
import { Col, Row, Form, /* Card, */ Button, Modal } from "react-bootstrap";

/* import { PERFIL_COLUMNS } from "./PerfilTableConfig"; */
import { editUser, getUserDetails } from "../../services/usersService";

export default function Perfil() {
  const [user, setUser] = useState<any>({});
  const [userModal, setUserModal] = useState(false);
  const [formEmailValues, setFormEmailValues] = useState({
    id: "",
    email: "",
    phone: "",
    password: "",
  });

  const handleChangeEmailValue = (name: string, value: string) => {
    setFormEmailValues({
      ...formEmailValues,
      [name]: value,
    });
  };

  const fetchUser = async () => {
    try {
      const userEmail = localStorage.getItem('#email') || ""
      const { data } = await getUserDetails(userEmail);
      setUser(data);
    } catch (error) {
      console.log(error);
    }
  };

  const openUserModal = () => {
    setFormEmailValues({
      id: user.userId,
      email: user.id,
      phone: "",
      password: "",
    });
    setUserModal(true);
  };

  const saveUser = async () => {
    try {
      const { id, email, password, phone } = formEmailValues;
      await editUser({
        userId: id,
        email,
        password,
        phone,
        companyId: "",
        clientId: "",
      });
      fetchUser();
    } catch (error) {
      console.log(error);
    } finally {
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <>
      {!!user && !!user.id && (
        <div style={{ margin: 60 }}>
          <div>
            <header style={{ marginBottom: 40 }}>
              <div>
                <h3>Perfil</h3>
                <h6 style={{ color: "#95aac9" }}>
                  Veja informações da sua conta
                </h6>
              </div>
            </header>
            <div style={{ display: "flex" }}>
              <div
                style={{
                  background: "#FFF",
                  borderRadius: 20,
                  padding: 30,
                  minWidth: 300,
                  border: "2px solid #e0dfdf",
                }}
              >
                <div>
                  <div>
                    <h5>Dados Cadastrais ({user.userDisplayName})</h5>
                  </div>
                  <div style={{ marginTop: 30 }}>
                    <div>
                      <h6 style={{ color: "#95aac9" }}>E-MAIL</h6>
                      <p>{user.id}</p>
                    </div>
                    <div>
                      <h6 style={{ color: "#95aac9" }}>TELEFONE</h6>
                      <p>N/A</p>
                    </div>
                  </div>
                  <div>
                    <Button
                      variant=""
                      aria-label="Confirm"
                      className="btn ripple btn-primary pd-x-25"
                      type="button"
                      onClick={() => openUserModal()}
                    >
                      Alterar Telefone/Senha
                    </Button>{" "}
                  </div>
                </div>
              </div>
              <div
                style={{
                  background: "#FFF",
                  borderRadius: 20,
                  padding: 30,
                  minWidth: 300,
                  marginLeft: 40,
                  border: "2px solid #e0dfdf",
                }}
              >
                <div>
                  <div>
                    <h5>Assinatura Ativa</h5>
                  </div>
                  <div style={{ marginTop: 30 }}>
                    <div>
                      <h6 style={{ color: "#95aac9" }}>PLANO ATUAL</h6>
                      <p>{user.userPlan}</p>
                    </div>
                    <div>
                      <h6 style={{ color: "#95aac9" }}>VALOR</h6>
                      <p>{user.planPrice}</p>
                    </div>
                  </div>
                  <div>
                    <Button
                      variant=""
                      aria-label="Confirm"
                      className="btn ripple btn-primary pd-x-25"
                      type="button"
                      onClick={() => console.log("le")}
                    >
                      Assinar Plano
                    </Button>{" "}
                  </div>
                </div>
              </div>
            </div>
            <Modal show={userModal}>
              <Modal.Header>
                <Modal.Title>Alterar Usuário</Modal.Title>
                <Button
                  variant=""
                  className="btn btn-close"
                  onClick={() => setUserModal(false)}
                >
                  x
                </Button>
              </Modal.Header>
              <Modal.Body>
                <div className="">
                  {" "}
                  <Row className="mb-2">
                    <Col lg={12}>
                      <Form.Group className="form-group">
                        <Form.Label className="">E-mail</Form.Label>{" "}
                        <Form.Control
                          className="form-control"
                          placeholder="E-mail"
                          name="email"
                          type="text"
                          value={formEmailValues.email}
                          onChange={(e) =>
                            handleChangeEmailValue("email", e.target.value)
                          }
                          required
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row className="mb-2">
                    <Col lg={12}>
                      <Form.Group className="form-group">
                        <Form.Label className="">Telefone Celular</Form.Label>{" "}
                        <Form.Control
                          className="form-control"
                          placeholder="Telefone"
                          name="phone"
                          type="text"
                          value={formEmailValues.phone}
                          onChange={(e) =>
                            handleChangeEmailValue("phone", e.target.value)
                          }
                          required
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row className="mb-2">
                    <Col lg={12}>
                      <Form.Group className="form-group">
                        <Form.Label className="">Nova Senha</Form.Label>{" "}
                        <Form.Control
                          className="form-control"
                          placeholder="Senha"
                          name="password"
                          type="text"
                          value={formEmailValues.password}
                          onChange={(e) =>
                            handleChangeEmailValue("password", e.target.value)
                          }
                          required
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row className="mb-2">
                    <Col lg={12}>
                      <Form.Group className="form-group">
                        <Form.Label className="">Confirmar Senha</Form.Label>{" "}
                        <Form.Control
                          className="form-control"
                          placeholder="Senha"
                          name="password"
                          type="text"
                          value={formEmailValues.password}
                          onChange={(e) =>
                            handleChangeEmailValue("password", e.target.value)
                          }
                          required
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Button
                    variant=""
                    aria-label="Confirm"
                    className="btn ripple btn-primary pd-x-25"
                    type="button"
                    onClick={() => saveUser()}
                  >
                    Confirmar
                  </Button>{" "}
                  <Button
                    variant=""
                    aria-label="Closes"
                    className="btn ripple btn-danger pd-x-25s"
                    type="button"
                    onClick={() => setUserModal(false)}
                  >
                    Fechar
                  </Button>{" "}
                </div>
              </Modal.Body>
            </Modal>
          </div>
        </div>
      )}
    </>
  );
}
