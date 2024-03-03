import React, { useEffect, useState } from "react";
import { Col, Row, Form, Toast } from "react-bootstrap";
import Select from "../../../../components/Select";
import { getInstancesList } from "../../../../services/InstancesService";
import { useDispatch, useSelector } from "react-redux";
import { setInstancesList } from "../../../../redux/actions/instances";
import Creatable from "react-select/creatable";

const SwitchToggle = ({ label, handleChangeValue, name, formValues }: any) => {
  return (
    <Row className="mb-2">
      <Col lg={12}>
        <Form.Group className="form-group">
          <Form.Label className="">{label}</Form.Label>{" "}
          <Form.Check
            type="switch"
            id="custom-switch"
            name={name}
            onChange={(e) => {
              const event = {
                target: {
                  name,
                  value: e.target.checked
                }
              }
              handleChangeValue(event)
            }}
            value={formValues[name]}
          />
        </Form.Group>
      </Col>
    </Row>
  );
};

const FileInput = ({ label, handleChangeFile, name, formValues }: any) => {
  return (
    <Row className="mb-2">
      <Col lg={12}>
        <Form.Group className="form-group">
          <Form.Label htmlFor="formFile" className="form-label">
            {label}
          </Form.Label>
          <Form.Control
            className="form-control"
            type="file"
            id="formFile"
            name={name}
            onChange={handleChangeFile}
            required
            value={formValues[name]}
            accept=".jpg, .jpeg"
          />
        </Form.Group>
      </Col>
    </Row>
  );
};

const SelectNumberInput = ({
  label,
  handleChangeValue,
  name,
  inputsSelect,
  formValues
}: any) => {
  const styledInput =
    inputsSelect.length === 1
      ? { width: "100%" }
      : { width: 80, marginRight: 10 };
  return (
    <Row className="mb-2">
      <Col lg={12}>
        <Form.Group className="form-group">
          <Form.Label className="">{label}</Form.Label>{" "}
          <div style={{ display: "flex", flexDirection: "row" }}>
            {inputsSelect?.map((inpt: any, index: any) => (
              <Form.Control
                key={index}
                className="form-control"
                name={inpt.name}
                type="number"
                onChange={handleChangeValue}
                style={styledInput}
                min={1}
                required
                defaultValue={inpt.defaultValue || 1}
                value={formValues[name]}
              />
            ))}
          </div>
        </Form.Group>
      </Col>
    </Row>
  );
};

const TextInput = ({ label, required, type, name, handleChangeValue, formValues}: any) => {
  return (
    <Row className="mb-2">
      <Col lg={12}>
        <Form.Group className="form-group">
          <Form.Label className="">{label}</Form.Label>{" "}
          <Form.Control
            className="form-control"
            type={type}
            onChange={(e) => {
              console.log({ [e.target.name]: e.target.value });
              handleChangeValue(e);
            }}
            required={required}
            name={name}
            value={formValues[name]}
          />
        </Form.Group>
      </Col>
    </Row>
  );
};

const TextAreaInput = ({
  label,
  required,
  type,
  name,
  handleChangeValue,
  formValues,
}: any) => {
  return (
    <Row className="mb-2">
      <Col lg={12}>
        <Form.Group className="form-group">
          <Form.Label className="">{label}</Form.Label>{" "}
          <Form.Control
            as="textarea"
            rows={3}
            className="form-control"
            onChange={(e) => {
              console.log({ [e.target.name]: e.target.value });
              handleChangeValue(e);
            }}
            required={required}
            value={formValues[name]}
            name={name}
          />
        </Form.Group>
      </Col>
    </Row>
  );
};

const SelectOptions = ({
  label,
  name,
  handleChangeValue,
  placeholder,
  formValues
}: any) => {
  const handleChangeOptions = (options: any) => {
    const value: string[] = [];
    options.forEach((opt: any) => {
      value.push(opt.value);
    });

    const event = {
      target: {
        name,
        value,
      },
    };

    handleChangeValue(event);
  };

  return (
    <Row className="mb-2">
      <Col lg={12}>
        <Form.Group className="form-group">
          <Form.Label className="">{label}</Form.Label>{" "}
          <Creatable
            placeholder={placeholder}
            classNamePrefix="background"
            isMulti
            name={name}
            onChange={(e) => handleChangeOptions(e)}
            value={formValues[name]}
          />
        </Form.Group>
        {/*         <div>
        <button onClick={openAlert} className="btn-sm btn-primary mt-2" style={{marginRight: 10, border: 'none'}}>
					        Adicionar Opção
					      </button>
        <button className="btn-sm btn-danger mt-2" style={{border: 'none'}}>
					        Remover Opção
					      </button>
        </div> */}
      </Col>
    </Row>
  );
};

const SelectFormInput = ({
  label,
  instances,
  handleChangeValue,
  name,
  formValues
}: any) => {
  const [instancesAll, setInstancesAll] = useState([]);
  const instancesList = useSelector(
    (state: any) => state.instancesReducer.instancesList
  );
  const dispatch = useDispatch();

  const fetchClientsResult = async () => {
    try {
      let instancesListLocal = instancesList;
      console.log(instancesListLocal, "@@@ instancesListLocal");
      if (!instancesListLocal.length) {
        const { data } = await getInstancesList();
        instancesListLocal = data;
        dispatch(setInstancesList(data));
      }
      console.log(instances, "@@@ instances");
      const newInstances = instances
        .map((ist: any) => {
          const newData = instancesListLocal
            .filter((dt: any) => dt.id === ist)
            .map((dt: any, index: any) => ({
              label: `${dt.description} - ${dt.api} - ${dt.phone}`,
              value: dt.id,
            }));
          return newData;
        })
        .flat(1);

      setInstancesAll(newInstances);
      if (!!newInstances.length) {
        const event = {
          target: {
            name: "instanceId",
            value: newInstances[0].value,
          },
        };
        handleChangeValue(event);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchClientsResult();
  }, []);

  return (
    <Row className="mb-2">
      <Col lg={12}>
        <Form.Group className="form-group">
          <Form.Label className="">{label}</Form.Label>{" "}
          <Select
            options={instancesAll}
            onChange={(e) => {
              handleChangeValue(e);
            }}
            name={name}
          />
        </Form.Group>
      </Col>
    </Row>
  );
};

const Factory: React.FC = (props: any) => {
  switch (props.type) {
    case "file":
      return <FileInput {...props} />;
    case "select":
      return <SelectFormInput {...props} />;
    case "selectNumber":
      return <SelectNumberInput {...props} />;
    case "textArea":
      return <TextAreaInput {...props} />;
    case "selectOptions":
      return <SelectOptions {...props} />;
      case "switch":
        return <SwitchToggle {...props} />
    default:
      return <TextInput {...props} />;
  }
};

export default Factory;
