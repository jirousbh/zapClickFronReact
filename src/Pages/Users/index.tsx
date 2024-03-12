import React, { useEffect, useState, useCallback } from "react";
import {
  useTable,
  useSortBy,
  useGlobalFilter,
  usePagination,
} from "react-table";
import {
  Col,
  Row,
  Form,
  Card,
  Button,
  OverlayTrigger,
  Tooltip,
  Modal,
} from "react-bootstrap";

import { GlobalFilter } from "../Dashboard/data";
import { USERS_COLUMNS } from "./UsersTableConfig";
import Select from "../../components/Select";
import {
  addNewEmail,
  createUser,
  delUserAlternateEmail,
  editUser,
  fetchUserAlternateEmails,
  fetchUsers,
} from "../../services/usersService";
import { getClient } from "../../services/ClientsService";
import { getCompaniesList } from "../../services/CompaniesService";
import { formatDate } from "../../utils/dates";
import { useNavigate } from "react-router-dom";

const INITIAL_STATE = {
  company: { label: "Selecione uma Empresa", value: "", selected: true },
  client: { label: "Selecione um Cliente", value: "" },
};

export default function Users() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<any>([]);
  const [userModal, setUserModal] = useState(false);
  const [emailModal, setEmailModal] = useState(false);
  const [deleteEmailModal, setDeleteEmailModal] = useState(false);
  const [singleSelectCompany, setSingleSelectCompany] = useState<any>("");
  const [singleSelectClient, setSingleSelectClient] = useState<any>("");
  const [companyOptions, setCompanyOptions] = useState<any>([
    INITIAL_STATE.company,
  ]);
  const [clientOptions, setClientOptions] = useState<any>([
    INITIAL_STATE.client,
  ]);
  const [emails, setEmails] = useState([]);
  const [clients, setClients] = useState([]);
  const [emailDelete, setEmailDelete] = useState("");

  const [formValues, setFormValues] = useState({
    type: "Cadastrar Usuário",
    id: "",
    name: "",
    email: "",
    password: "",
  });
  const [formEmailValues, setFormEmailValues] = useState({
    id: "",
    email: "",
    newEmail: "",
  });

  const handleChangeEmailValue = (name: string, value: string) => {
    setFormEmailValues({
      ...formEmailValues,
      [name]: value,
    });
  };

  const handleChangeValue = (name: string, value: string) => {
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  const handleChangeUserView = (email: string) => {
    window.sessionStorage.setItem("#email_view", email);
    navigate("/dashboard");
  };

  const parseUsers = useCallback((users: any) => {
    return users.map((user: any) => {
      const status = !user.disabled ? (
        <span>
          <span className="text-success">●</span> Ativo{" "}
        </span>
      ) : (
        <span>
          <span className="text-danger">●</span> Inativo{" "}
        </span>
      );

      const admin = !!user?.customClaims?.admin ? (
        <span>
          <span className="text-danger">●</span> Admin{" "}
          <i className="fas fa-user-minus mr-4 text-success"></i>
        </span>
      ) : (
        <span>
          <span className="text-success">●</span> Usuário{" "}
          <i className="fas fa-user-ninja mr-4 text-danger"></i>
        </span>
      );

      return {
        id: user.uid,
        name: user.displayName,
        email: (
          <>
            {user.email}
            {"  "}
            <i
              className="fas fa-eye"
              style={{ color: "#2c7be5", cursor: "pointer" }}
              onClick={() => handleChangeUserView(user.email)}
            />
          </>
        ),
        password: user.passwordSalt,
        creationTime: formatDate(user.metadata.creationTime),
        lastSignInTime: formatDate(user.metadata.creationTime),
        status,
        admin,
        plan: user.userPlan,
        options: (
          <span className="">
            <OverlayTrigger
              placement="top"
              overlay={<Tooltip>Alterar Usuário</Tooltip>}
            >
              <Button
                variant=""
                onClick={() =>
                  openEditModal({
                    id: user.uid,
                    name: user.displayName,
                    email: user.email,
                    password: user.passwordSalt,
                  })
                }
                className="btn bg-yellow btn-sm rounded-11 me-2"
              >
                <i className="fa fa-edit"></i>
              </Button>
            </OverlayTrigger>
            <OverlayTrigger
              placement="top"
              overlay={<Tooltip>Emails Relacionados</Tooltip>}
            >
              <Button
                variant=""
                onClick={() =>
                  openEmailModal({
                    id: user.uid,
                    email: user.email,
                  })
                }
                className="btn btn-primary btn-sm rounded-11 me-2"
              >
                <i className="fas fa-at"></i>
              </Button>
            </OverlayTrigger>
          </span>
        ),
      };
    });
  }, []);

  const formatSelectCompany = useCallback(async () => {
    const { data: clients } = await getClient(null, false);
    const { data: companies } = await getCompaniesList(null, false);

    const company = companies.map((cmp: any) => {
      return {
        label: cmp.name,
        value: cmp.id,
        selected: false,
      };
    });

    setClients(clients);
    setCompanyOptions([...companyOptions, ...company]);
  }, [companyOptions]);

  const getUsers = useCallback(async () => {
    const { data: users } = await fetchUsers();
    const formatUser = parseUsers(users);
    setUsers(formatUser);
    formatSelectCompany();
  }, [parseUsers]);

  const saveNewEmail = async () => {
    try {
      const { email, newEmail } = formEmailValues;
      await addNewEmail({ userEmail: email, newEmail });
    } catch (error) {
      console.log(error);
    } finally {
      setEmailModal(false);
    }
  };

  const saveUser = async () => {
    try {
      const { id, name, email, password } = formValues;
      console.log(singleSelectCompany.value, singleSelectClient.value);

      const editPayload = {
        name,
        email,
        password,
        userId: id,
        companyId: singleSelectCompany.value,
        clientId: singleSelectClient.value,
      };
      if (id) {
        await editUser(editPayload);
      } else {
        await createUser({
          name,
          email,
          password,
          companyId: singleSelectCompany.value,
          clientId: singleSelectClient.value,
        });
      }

      getUsers();
    } catch (error) {
      console.log(error);
    } finally {
      closeModal();
    }
  };

  const openEditModal = (user: any) => {
    setFormValues({
      type: "Alterar Usuário",
      id: user.id,
      name: user.name,
      email: user.email,
      password: "",
    });
    setUserModal(true);
  };

  const openEmailModal = async (user: any) => {
    setFormEmailValues({
      id: user.id,
      email: user.email,
      newEmail: "",
    });

    const { data: alternateEmails } = await fetchUserAlternateEmails(
      user.email
    );

    console.log(alternateEmails);
    const newAlternateEmails = alternateEmails.filter(
      (alt: any) => alt !== user.email
    );

    setEmails(newAlternateEmails);

    console.log(newAlternateEmails);
    setEmailModal(true);
  };

  const closeModal = () => {
    setFormValues({
      type: "Cadastrar Usuário",
      id: "",
      name: "",
      email: "",
      password: "",
    });

    setSingleSelectCompany("");
    setSingleSelectClient("");

    setUserModal(false);
  };

  const openRemoveEmailAlternate = (email: string) => {
    setEmailDelete(email);
    setEmailModal(false);
    setDeleteEmailModal(true);
  };

  const closeRemoveEmailAlternate = () => {
    setDeleteEmailModal(false);
    setEmailModal(true);
  };

  const removeEmailAlternate = async () => {
    try {
      await delUserAlternateEmail(formEmailValues.email, emailDelete);
      setEmails((prevState) => prevState.filter((prv) => prv !== emailDelete));
    } catch (error) {
      console.log(error);
    } finally {
      setDeleteEmailModal(false);
      setEmailModal(true);
    }
  };

  useEffect(() => {
    const filterClient = clients.filter(
      (clt: any) => clt.companyId === singleSelectCompany.value
    );

    const client = filterClient.map((clt: any) => {
      return {
        label: clt.name,
        value: clt.id,
      };
    });

    setClientOptions(client);
  }, [clients, singleSelectCompany.value]);

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  const tableInstance = useTable(
    {
      columns: USERS_COLUMNS,
      data: users,
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  const {
    getTableProps,
    headerGroups,
    getTableBodyProps,
    prepareRow,
    state,
    setGlobalFilter,
    page,
    nextPage,
    previousPage,
    canNextPage,
    canPreviousPage,
    pageOptions,
    gotoPage,
    pageCount,
    setPageSize,
  }: any = tableInstance;

  const { globalFilter, pageIndex, pageSize } = state;

  return (
    <React.Fragment>
      <div className="breadcrumb-header justify-content-between">
        <div className="left-content">
          <h1 className="main-content-title mg-b-0 mg-b-lg-1">Usuários</h1>
        </div>
      </div>
      <Row>
        <Col sm={12} className="col-12 d-flex justify-content-end">
          <Button
            variant=""
            className="btn me-2 tx-18 btn-primary mb-4"
            onClick={() => setUserModal(true)}
          >
            Cadastrar Usuário
          </Button>
        </Col>
      </Row>
      <Row>
        <Col sm={12} className="col-12">
          <Card>
            <Card.Header>
              <h4 className="card-title">Lista de usuários</h4>
            </Card.Header>
            <Card.Body className=" pt-0">
              <div className="table-responsive">
                <>
                  <div className="d-flex">
                    <select
                      className=" mb-4 selectpage border me-1"
                      value={pageSize}
                      onChange={(e: any) => setPageSize(Number(e.target.value))}
                    >
                      {[10, 25, 50].map((pageSize) => (
                        <option key={pageSize} value={pageSize}>
                          Exibir {pageSize}
                        </option>
                      ))}
                    </select>
                    <GlobalFilter
                      filter={globalFilter}
                      setFilter={setGlobalFilter}
                    />
                  </div>
                  <table
                    {...getTableProps()}
                    className="table table-bordered text-nowrap mb-0"
                  >
                    <thead>
                      {headerGroups.map((headerGroup: any) => (
                        <tr {...headerGroup.getHeaderGroupProps()}>
                          {headerGroup.headers.map((column: any) => (
                            <th
                              {...column.getHeaderProps(
                                column.getSortByToggleProps()
                              )}
                              className={column.className}
                            >
                              <span className="tabletitle">
                                {column.render("Header")}
                              </span>
                              <span>
                                {column.isSorted ? (
                                  column.isSortedDesc ? (
                                    <i className="fa fa-angle-down"></i>
                                  ) : (
                                    <i className="fa fa-angle-up"></i>
                                  )
                                ) : (
                                  ""
                                )}
                              </span>
                            </th>
                          ))}
                        </tr>
                      ))}
                    </thead>
                    <tbody {...getTableBodyProps()}>
                      {page.map((row: any) => {
                        prepareRow(row);
                        return (
                          <tr className="text-center" {...row.getRowProps()}>
                            {row.cells.map((cell: any) => {
                              return (
                                <td {...cell.getCellProps()}>
                                  {cell.render("Cell")}
                                </td>
                              );
                            })}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                  <div className="d-block d-sm-flex mt-4 ">
                    <span className="">
                      Página{" "}
                      <strong>
                        {pageIndex + 1} de {pageOptions.length}
                      </strong>{" "}
                    </span>
                    <span className="ms-sm-auto ">
                      <Button
                        variant=""
                        className="btn-default tablebutton me-2 d-sm-inline d-block my-1"
                        onClick={() => gotoPage(0)}
                        disabled={!canPreviousPage}
                      >
                        {" Anterior "}
                      </Button>
                      <Button
                        variant=""
                        className="btn-default tablebutton me-2 my-1"
                        onClick={() => {
                          previousPage();
                        }}
                        disabled={!canPreviousPage}
                      >
                        {" << "}
                      </Button>
                      <Button
                        variant=""
                        className="btn-default tablebutton me-2 my-1"
                        onClick={() => {
                          previousPage();
                        }}
                        disabled={!canPreviousPage}
                      >
                        {" < "}
                      </Button>
                      <Button
                        variant=""
                        className="btn-default tablebutton me-2 my-1"
                        onClick={() => {
                          nextPage();
                        }}
                        disabled={!canNextPage}
                      >
                        {" > "}
                      </Button>
                      <Button
                        variant=""
                        className="btn-default tablebutton me-2 my-1"
                        onClick={() => {
                          nextPage();
                        }}
                        disabled={!canNextPage}
                      >
                        {" >> "}
                      </Button>
                      <Button
                        variant=""
                        className="btn-default tablebutton me-2 d-sm-inline d-block my-1"
                        onClick={() => gotoPage(pageCount - 1)}
                        disabled={!canNextPage}
                      >
                        {" Próximo "}
                      </Button>
                    </span>
                  </div>
                </>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Modal show={userModal}>
          <Modal.Header>
            <Modal.Title>{formValues.type}</Modal.Title>
            <Button variant="" className="btn btn-close" onClick={closeModal}>
              x
            </Button>
          </Modal.Header>
          <Modal.Body>
            <div className="">
              {" "}
              <Row className="mb-2">
                <Col lg={12}>
                  <Form.Group className="form-group">
                    <Form.Label className="">Nome de Exibição</Form.Label>{" "}
                    <Form.Control
                      className="form-control"
                      placeholder="Nome do cliente"
                      name="name"
                      type="text"
                      value={formValues.name}
                      onChange={(e) =>
                        handleChangeValue("name", e.target.value)
                      }
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row className="mb-2">
                <Col lg={12}>
                  <Form.Group className="form-group">
                    <Form.Label className="">E-mail</Form.Label>{" "}
                    <Form.Control
                      className="form-control"
                      placeholder="E-mail"
                      name="email"
                      type="text"
                      value={formValues.email}
                      onChange={(e) =>
                        handleChangeValue("email", e.target.value)
                      }
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row className="mb-2">
                <Col lg={12}>
                  <Form.Group className="form-group">
                    <Form.Label className="">Senha</Form.Label>{" "}
                    <Form.Control
                      className="form-control"
                      placeholder="Senha"
                      name="password"
                      type="password"
                      value={formValues.password}
                      onChange={(e) =>
                        handleChangeValue("password", e.target.value)
                      }
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row className="mb-2">
                <Col lg={12}>
                  <div className="mb-4">
                    <p className="mg-b-10">Empresa</p>
                    <div className=" SlectBox">
                      <Select
                        options={companyOptions}
                        onChange={(e) =>
                          setSingleSelectCompany({ value: e.target.value })
                        }
                      />
                    </div>
                  </div>
                </Col>
              </Row>
              {clientOptions &&
                !!clientOptions.length &&
                clientOptions[0].value && (
                  <Row className="mb-2">
                    <Col lg={12}>
                      <div className="mb-4">
                        <p className="mg-b-10">Cliente</p>
                        <div className=" SlectBox">
                          <Select
                            options={clientOptions}
                            onChange={(e) =>
                              setSingleSelectClient({ value: e.target.value })
                            }
                          />
                        </div>
                      </div>
                    </Col>
                  </Row>
                )}
              <Row className="mb-2"></Row>
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
                aria-label="Close"
                className="btn ripple btn-danger pd-x-25"
                type="button"
                onClick={closeModal}
              >
                Fechar
              </Button>{" "}
            </div>
          </Modal.Body>
        </Modal>
        <Modal show={emailModal}>
          <Modal.Header>
            <Modal.Title>Adicionar Email</Modal.Title>
            <Button
              variant=""
              className="btn btn-close"
              onClick={() => setEmailModal(false)}
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
                    <Form.Label className="">E-mail Principal</Form.Label>{" "}
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
                    <Form.Label className="">Novo E-mail</Form.Label>{" "}
                    <Form.Control
                      className="form-control"
                      placeholder="E-mail"
                      name="email"
                      type="text"
                      value={formEmailValues.newEmail}
                      onChange={(e) =>
                        handleChangeEmailValue("newEmail", e.target.value)
                      }
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>
              {!!emails.length && (
                <Row className="mb-2">
                  <Col lg={12}>
                    <div>
                      <h6>Emails Alternativos Cadastrados</h6>
                      <div>
                        {emails.map((email, index) => (
                          <li key={`${email}-${index}`} style={{ margin: 15 }}>
                            {email}
                            {"   "}
                            <i
                              className="fas fa-trash text-danger delUserEmail"
                              style={{ cursor: "pointer" }}
                              onClick={() => openRemoveEmailAlternate(email)}
                            ></i>
                          </li>
                        ))}
                      </div>
                    </div>
                  </Col>
                </Row>
              )}
              <Row className="mb-2"></Row>
              <Button
                variant=""
                aria-label="Confirm"
                className="btn ripple btn-primary pd-x-25"
                type="button"
                onClick={() => saveNewEmail()}
              >
                Confirmar
              </Button>{" "}
              <Button
                variant=""
                aria-label="Close"
                className="btn ripple btn-danger pd-x-25"
                type="button"
                onClick={() => setEmailModal(false)}
              >
                Fechar
              </Button>{" "}
            </div>
          </Modal.Body>
        </Modal>
        <Modal show={deleteEmailModal}>
          <Modal.Header>
            <Modal.Title>Excluir Email</Modal.Title>
            <Button
              variant=""
              className="btn btn-close"
              onClick={() => closeRemoveEmailAlternate()}
            >
              x
            </Button>
          </Modal.Header>
          <Modal.Body>
            <div className="">
              <Row className="mb-2">
                <h3>Deseja excluir o email {emailDelete}?</h3>
              </Row>
              <Button
                variant=""
                aria-label="Confirm"
                className="btn ripple btn-primary pd-x-25"
                type="button"
                onClick={() => removeEmailAlternate()}
              >
                Confirmar
              </Button>{" "}
              <Button
                variant=""
                aria-label="Close"
                className="btn ripple btn-danger pd-x-25"
                type="button"
                onClick={() => closeRemoveEmailAlternate()}
              >
                Fechar
              </Button>{" "}
            </div>
          </Modal.Body>
        </Modal>
      </Row>
    </React.Fragment>
  );
}
