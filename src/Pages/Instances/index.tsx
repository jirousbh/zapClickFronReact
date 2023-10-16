import React, { useRef, useEffect, useState } from "react";
import {
  useTable,
  useSortBy,
  useGlobalFilter,
  usePagination,
} from "react-table";
import Select, { SingleValue } from "react-select";
import {
  Breadcrumb,
  Col,
  Row,
  Card,
  Button,
  OverlayTrigger,
  Tooltip,
  Modal,
  Form,
} from "react-bootstrap";

import { GlobalFilter } from "../Dashboard/data";
import { INSTANCES_COLUMNS } from "./InstancesTableConfig";
import {
  createInstance,
  deleteInstance,
  editInstance,
  getInstancesList,
} from "../../services/InstancesService";

export default function Instances() {
  const [instancesFormated, setInstancesFormated] = useState([]);
  const [instanceModal, setInstanceModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [singleselect, setSingleselect] = useState<any>(null);
  const [instanceOptions, setInstanceOptions] = useState<any>([]);
  const [instanceId, setInstanceId] = useState("");

  const [formValues, setFormValues] = useState({
    type: "Cadastrar Instância",
    id: "",
    instance: "",
    phone: "",
    description: "",
    token: "",
  });

  const handleChangeValue = (name: string, value: string) => {
    setFormValues({
      ...formValues,
      [name]: value,
    });
  };

  const closeModal = () => {
    setFormValues({
      type: "Cadastrar Instância",
      id: "",
      instance: "",
      phone: "",
      description: "",
      token: "",
    });
    setInstanceModal(false);
  };

  const tableInstance = useTable(
    {
      columns: INSTANCES_COLUMNS,
      data: instancesFormated,
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  const {
    getTableProps, // table props from react-table
    headerGroups, // headerGroups, if your table has groupings
    getTableBodyProps, // table body props from react-table
    prepareRow, // Prepare the row (this function needs to be called for each row before getting the row props)
    state,
    setGlobalFilter,
    page, // use, page or rows
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

  const handleEditInstance = (instance: any) => {
    setFormValues({
      type: "Alterar Instância",
      id: instance.id,
      instance: instance.instance,
      phone: instance.phone,
      description: instance.description,
      token: instance.token,
    });
    setSingleselect({ label: instance.api, value: instance.api });
    setInstanceModal(true);
  };

  const openDeleteModal = (instanceId: any) => {
    setInstanceId(instanceId);
    setDeleteModal(true);
  };

  const removeInstance = async () => {
    try {
      console.log("remover");

      await deleteInstance(instanceId);
      setupInstance();
    } catch (error) {
      console.log(error);
    } finally {
      setDeleteModal(false);
    }
  };

  const setupInstance = async () => {
    try {
      const fetchClientsResult = await getInstancesList();
      if (fetchClientsResult?.data.length) {
        const instancesMapped = fetchClientsResult.data.map((instance: any) => {
          return {
            id: instance.id,
            instance: instance.instance,
            phone: instance.phone,
            description: instance.description,
            api: instance.api,
            token: instance.token,
            options: (
              <span className="">
                <OverlayTrigger
                  placement="top"
                  overlay={<Tooltip>Alterar Instância</Tooltip>}
                >
                  <Button
                    variant=""
                    onClick={() => handleEditInstance(instance)}
                    className="btn bg-yellow btn-sm rounded-11 me-2"
                  >
                    <i className="fa fa-edit"></i>
                  </Button>
                </OverlayTrigger>

                <OverlayTrigger
                  placement="top"
                  overlay={<Tooltip>Remover Instância</Tooltip>}
                >
                  <Button
                    variant=""
                    onClick={() => openDeleteModal(instance.id)}
                    className="btn btn-danger btn-sm rounded-11 me-2"
                  >
                    <i className="fas fa-trash"></i>
                  </Button>
                </OverlayTrigger>
              </span>
            ),
          };
        });

        const select = [
          { label: "Própria", value: "Própria" },
          { label: "z-Api", value: "z-Api" },
        ];

        setSingleselect(select[0]);
        setInstanceOptions(select);
        setInstancesFormated(instancesMapped);
      }
    } catch (error) {
      console.log("error, fetchClientsResult", error);
    }
  };

  useEffect(() => {
    setupInstance();
  }, []);

  const saveInstance = async () => {
    try {
      !formValues.id
        ? await createInstance({
            ...formValues,
            instanceApi: singleselect.value,
          })
        : await editInstance({
            ...formValues,
            instanceApi: singleselect.value,
          });

      setupInstance();
    } catch (error) {
      console.log(error);
    } finally {
      closeModal();
    }
  };

  return (
    <React.Fragment>
      <div className="breadcrumb-header justify-content-between">
        <div className="left-content">
          <h1 className="main-content-title mg-b-0 mg-b-lg-1">Instâncias</h1>
        </div>
      </div>
      {/* <!-- /breadcrumb --> */}

      {/* <!-- row  --> */}
      <Row>
        <Col sm={12} className="col-12 d-flex justify-content-end">
          <Button
            onClick={() => setInstanceModal(true)}
            variant=""
            className="btn me-2 tx-18 btn-primary mb-4"
          >
            Cadastrar Instância
          </Button>
        </Col>
      </Row>
      {/* <!-- row closed --> */}

      {/* <!-- row  --> */}
      <Row>
        <Col sm={12} className="col-12">
          <Card>
            <Card.Header>
              <h4 className="card-title">Lista de Instâncias</h4>
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
        <Modal show={deleteModal}>
          <Modal.Body>
            <div style={{ padding: 30 }}>
              <p>Tem certeza que deseja excluir a instância?</p>
              <strong>
                ISSO PODE ATRAPALHAR FILA DE MENSAGENS E OUTRAS FUNÇÕES DO
                SISTEMA
              </strong>
            </div>
            <Button
              variant=""
              aria-label="Confirm"
              className="btn ripple btn-primary pd-x-25"
              type="button"
              onClick={() => removeInstance()}
            >
              Confirmar
            </Button>{" "}
            <Button
              variant=""
              aria-label="Close"
              className="btn ripple btn-danger pd-x-25"
              type="button"
              onClick={() => setDeleteModal(false)}
            >
              Fechar
            </Button>{" "}
          </Modal.Body>
        </Modal>
        <Modal show={instanceModal}>
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
                  <div className="mb-4">
                    <p className="mg-b-10">Empresa</p>
                    <div className=" SlectBox">
                      <Select
                        defaultValue={singleselect}
                        onChange={setSingleselect}
                        options={instanceOptions}
                        placeholder="Selecione uma empresa"
                        classNamePrefix="selectform"
                      />
                    </div>
                  </div>
                </Col>
              </Row>
              <Row className="mb-2">
                <Col lg={12}>
                  <Form.Group className="form-group">
                    <Form.Label className="">Descrição</Form.Label>{" "}
                    <Form.Control
                      className="form-control"
                      placeholder="Descrição"
                      type="text"
                      onChange={(e) =>
                        handleChangeValue("description", e.target.value)
                      }
                      value={formValues.description}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row className="mb-2">
                <Col lg={12}>
                  <Form.Group className="form-group">
                    <Form.Label className="">Instância</Form.Label>{" "}
                    <Form.Control
                      className="form-control"
                      placeholder="Instância"
                      type="text"
                      onChange={(e) =>
                        handleChangeValue("instance", e.target.value)
                      }
                      value={formValues.instance}
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>
              <Row className="mb-2">
                <Col lg={12}>
                  <Form.Group className="form-group">
                    <Form.Label className="">Host:porta*</Form.Label>{" "}
                    <Form.Control
                      className="form-control"
                      placeholder="Host:porta*"
                      type="text"
                      onChange={(e) =>
                        handleChangeValue("token", e.target.value)
                      }
                      value={formValues.token}
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
                onClick={() => saveInstance()}
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
      </Row>
    </React.Fragment>
  );
}
