import React, { useEffect, useState } from "react";
import { Col, Row, Form } from "react-bootstrap";
import Select from "../../../../components/Select";
import { getInstancesList } from "../../../../services/InstancesService";
import { useDispatch, useSelector } from "react-redux";
import { setInstancesList } from "../../../../redux/actions/instances";

const FileInput = ({ label }: any) => {
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
            name="logo"
            onChange={() => console.log("input")}
            required
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
}: any) => {
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
                style={{ width: 80, marginRight: 10 }}
                min={0}
                required
              />
            ))}
          </div>
        </Form.Group>
      </Col>
    </Row>
  );
};

const TextInput = ({ label, required, type, name, handleChangeValue }: any) => {
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
          />
        </Form.Group>
      </Col>
    </Row>
  );
};

const SelectFormInput = ({
  label,
  instances,
  handleChangeValue,
  name,
}: any) => {
  const [instancesAll, setInstancesAll] = useState([]);
  const instancesList = useSelector(
    (state: any) => state.instancesReducer.instancesList
  );
  const dispatch = useDispatch();

  const fetchClientsResult = async () => {
    try {
      let instancesListLocal = instancesList;
      console.log(instancesListLocal, '@@@ instancesListLocal')
      if (!instancesListLocal.length) {
        const { data } = await getInstancesList();
        instancesListLocal = data;
        dispatch(setInstancesList(data));
      }
      console.log(instances, '@@@ instances')
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
    default:
      return <TextInput {...props} />;
  }
};

export default Factory;
