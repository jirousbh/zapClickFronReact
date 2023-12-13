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
  editUser,
  fetchUserAlternateEmails,
  fetchUsers,
} from "../../services/usersService";
import { getClient } from "../../services/ClientsService";
import { getCompaniesList } from "../../services/CompaniesService";
import { formatDate } from "../../utils/dates";

export default function Users() {
  const [users, setUsers] = useState<any>([]);
  const [userModal, setUserModal] = useState(false);
  const [emailModal, setEmailModal] = useState(false);
  const [singleselect, setSingleselect] = useState<any>("");
  const [singleselectClient, setSingleselectClient] = useState<any>("");
  const [companyOptions, setCompanyOptionsOptions] = useState<any>([]);
  const [clientOptions, setClientOptionsOptions] = useState<any>([]);
  const [emails, setEmails] = useState([]);

  const [formValues, setFormValues] = useState({
    type: "Cadastrar Cliente",
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

      const admin = user.customClaims.admin ? (
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
        email: user.email,
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
      const editPayload = {
        name,
        email,
        password,
        userId: id,
        companyId: singleselect.value,
        clientId: singleselectClient.value,
      };
      if (id) {
        await editUser(editPayload);
      } else {
        await createUser({
          name,
          email,
          password,
          companyId: singleselect.value,
          clientId: singleselectClient.value,
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
    setEmails(alternateEmails);

    console.log(alternateEmails);
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
    setUserModal(false);
  };

  const removeEmailAlternate = (email: string) => {
    window.alert(`Deseja remover o e-mail ${email}?`);
    if (window.confirm("OK")) {
      console.log("user removed");
    } else {
      console.log("user not removed");
    }
  };

  const formatSelectCompany = async () => {
    const { data: clients } = await getClient(null, false);
    const { data: companies } = await getCompaniesList(null, false);

    const company = companies.map((cmp: any) => {
      return {
        label: cmp.name,
        value: cmp.id,
      };
    });

    const client = clients.map((clt: any) => {
      return {
        label: clt.name,
        value: clt.id,
      };
    });

    setCompanyOptionsOptions(company);
    setClientOptionsOptions(client);
  };

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
                        select={singleselect}
                        options={companyOptions}
                        onChange={(e) =>
                          setSingleselect({ value: e.target.value })
                        }
                      />
                    </div>
                  </div>
                </Col>
              </Row>
              <Row className="mb-2">
                <Col lg={12}>
                  <div className="mb-4">
                    <p className="mg-b-10">Cliente</p>
                    <div className=" SlectBox">
                      <Select
                        select={singleselectClient}
                        options={clientOptions}
                        onChange={(e) =>
                          setSingleselectClient({ value: e.target.value })
                        }
                      />
                    </div>
                  </div>
                </Col>
              </Row>
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
              <Row className="mb-2">
                <Col lg={12}>
                  <div>
                    <h6>Emails Alternativos Cadastrados</h6>
                    <div>
                      {emails.map((email, index) => (
                        <li key={`${email}-${index}`}>
                          {email}{" "}
                          <i
                            className="fas fa-trash text-danger delUserEmail"
                            onClick={() => removeEmailAlternate(email)}
                          ></i>
                        </li>
                      ))}
                    </div>
                  </div>
                </Col>
              </Row>
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
      </Row>
    </React.Fragment>
  );
}
