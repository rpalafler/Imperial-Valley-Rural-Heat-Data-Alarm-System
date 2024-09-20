// Import React Hooks
import { useState, useEffect, useContext } from "react";

// CSS Stylesheet
import styles2 from "../RTMA/RTMA.module.css";

import "bootstrap/dist/css/bootstrap.min.css";

// React-Bootstrap
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import Spinner from "react-bootstrap/Spinner";

// Import Context
import { ClimateDataContext, SensorContext } from "../../../../MainApp";

// Create Dropdown Arrays and Default Values
const yearDefault = "2024";

const monthDropdownArray = [
  { id: 1, name: "Jan" },
  { id: 2, name: "Feb" },
  { id: 3, name: "Mar" },
  { id: 4, name: "Apr" },
  { id: 5, name: "May" },
  { id: 6, name: "Jun" },
  { id: 7, name: "Jul" },
  { id: 8, name: "Aug" },
  { id: 9, name: "Sep" },
  { id: 10, name: "Oct" },
  { id: 11, name: "Nov" },
  { id: 12, name: "Dec" },
];

const climateVarDropdown = [
  { id: "td2m", name: "Dew-Point Temp (2-Meters)" },
  { id: "rh2m", name: "Relative Humidity (2-Meters)" },
];

// JavaScript Data Manipulation Functions //
const flatArrayToImageData = (flatArray, width, height) => {
  const uint8ClampedArray = new Uint8ClampedArray(flatArray);
  return new ImageData(uint8ClampedArray, width, height);
};
const imageDataToDataURL = (imageData) => {
  const canvas = document.createElement("canvas");
  canvas.width = imageData.width;
  canvas.height = imageData.height;
  const ctx = canvas.getContext("2d");
  ctx.putImageData(imageData, 0, 0);
  return canvas.toDataURL("image/png");
};

function SensorData() {
  // Import and use the context  //
  const climateDataContext = useContext(ClimateDataContext);
  const sensorContext = useContext(SensorContext);

  // Loading Sensor Data //
  const [loading, setLoading] = useState(() => {
    const value =
      sensorContext.sensorLoading === null
        ? false
        : sensorContext.sensorLoading;
    return value;
  });
  const handleLoading = (boolValue) => {
    setLoading(boolValue);
    sensorContext.setSensorLoading(boolValue);
  };

  // Year Selection and Change Handler //
  const [year, setYear] = useState(() => {
    const value =
      sensorContext.sensorForm === null
        ? yearDefault
        : sensorContext.sensorForm.year;
    return value;
  });
  const handleYearChange = (event) => {
    event.preventDefault();
    setYear(event.target.value);
  };

  // Month Selection and Change Handler //
  const [month, setMonth] = useState(() => {
    const value =
      sensorContext.sensorForm === null
        ? monthDropdownArray[0]["id"]
        : sensorContext.sensorForm.month;
    return value;
  });
  const handleMonthChange = (event) => {
    event.preventDefault();
    setMonth(event.target.value);
  };

  // Day Selection and Change Handler //
  const [day, setDay] = useState(() => {
    const value =
      sensorContext.sensorForm === null ? 1 : sensorContext.sensorForm.day;
    return value;
  });
  const handleDayChange = (event) => {
    event.preventDefault();
    const value = event.target.value;
    if (Number(value) > 0 && Number(value) <= 31) {
      setDay(value);
    } else {
      setDay(1);
    }
  };

  // Hour Selection and Changer Handler //
  const [hour, setHour] = useState(() => {
    const value =
      sensorContext.sensorForm === null ? 0 : sensorContext.sensorForm.hour;
    return value;
  });
  const handleHourChange = (event) => {
    event.preventDefault();
    const value = event.target.value;
    if (Number(value) > 0 && Number(value) <= 23) {
      setHour(value);
    } else {
      setHour(0);
    }
  };

  // Climate Variable Selection and Change Handler //
  const [climateVar, setClimateVar] = useState(() => {
    const value =
      sensorContext.sensorForm === null
        ? climateVarDropdown[0]["id"]
        : sensorContext.sensorForm.climateVar;
    return value;
  });
  const handleClimateVarChange = (event) => {
    event.preventDefault();
    setClimateVar(event.target.value);
  };

  // Perform the following operations when the form is submitted by user //
  const [submitOn, setSubmitOn] = useState(false);
  const handleFormSubmit = (event) => {
    event.preventDefault(); // Prevent page reloading on submission
    setSubmitOn(true);
    handleFormChange();
  };

  // Form that specifies the user's request --> JSON-like object sent to the POST API request //
  const [form, setForm] = useState({
    year: year,
    month: month,
    day: day,
    hour: hour,
    climateVar: climateVar,
  });
  const handleFormChange = () => {
    setForm({
      ...form,
      year: year,
      month: month,
      day: day,
      hour: hour,
      climateVar: climateVar,
    });
    sensorContext.setSensorForm({
      ...form,
      year: year,
      month: month,
      day: day,
      hour: hour,
      climateVar: climateVar,
    });
  };

  // Retrieve data from the specified URL via the server based on the user's request
  useEffect(() => {
    const preparedForm = form;
    console.log(JSON.stringify(preparedForm));
    const sendSensorData = async () => {
      try {
        handleLoading(true);
        const response = await fetch(
          "http://localhost:5000/send_sensor_vis_request",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(preparedForm),
          }
        );
        if (!response.ok) {
          throw new Error(
            "ERROR: Request could not be processed. Reload & Try Again."
          );
        }
        handleLoading(true);
        const responseData = await response.json();
        const rgbaImage = flatArrayToImageData(
          responseData["climate_var_image"],
          responseData["width"],
          responseData["height"]
        );
        const dataURL = imageDataToDataURL(rgbaImage);
        responseData["climate_var_image"] = dataURL;

        sensorContext.setSensorData(responseData);
        console.log("I'm the data you saved:", responseData);
      } catch (error) {
        console.log("ERROR ", error);
      } finally {
        console.log("Process Finished");
        setSubmitOn(false);
        handleLoading(false);
      }
    };
    if (submitOn === true) {
      sendSensorData();
    }
  }, [submitOn]);

  return (
    <>
      <Container className={styles2.inputContainer}>
        <Form onSubmit={handleFormSubmit}>
          <Row xs={2} sm={2} md={2} lg={2} className={styles2.inputRow}>
            <Col>
              <Form.Group
                controlId={"year-selection"}
                className={styles2.inputRowLabel}
              >
                <Form.Label>Year</Form.Label>
                <Form.Control
                  type={"number"}
                  placeholder={"Enter Year (Default 2023)"}
                  value={year}
                  onChange={handleYearChange}
                  className={styles2.inputOption}
                  style={{ cursor: "text" }}
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId={"month-selection"}>
                <Form.Label className={styles2.inputRowLabel}>Month</Form.Label>
                <Form.Select
                  value={month}
                  onChange={handleMonthChange}
                  className={styles2.inputOption}
                >
                  {monthDropdownArray.map((element) => {
                    return (
                      <option
                        value={element.id}
                        className={styles2.inputOption}
                      >
                        {element.name}
                      </option>
                    );
                  })}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <Row xs={2} sm={2} md={2} lg={2} className={styles2.inputRow}>
            <Col>
              <Form.Group controlId={"day-selection"}>
                <Form.Label className={styles2.inputRowLabel}>Day</Form.Label>
                <Form.Control
                  type={"number"}
                  value={day}
                  placeholder={"Enter Day"}
                  onChange={handleDayChange}
                  className={styles2.inputOption}
                  style={{ cursor: "text" }}
                />
              </Form.Group>
            </Col>
            <Col>
              <Form.Group controlId={"hour-selection"}>
                <Form.Label className={styles2.inputRowLabel}>Hour</Form.Label>
                <Form.Control
                  type={"number"}
                  value={hour}
                  placeholder={"Enter Hour"}
                  onChange={handleHourChange}
                  className={styles2.inputOption}
                  style={{ cursor: "text" }}
                />
              </Form.Group>
            </Col>
          </Row>

          <Row xs={1} sm={1} md={1} lg={1} className={styles2.inputRow}>
            <Col>
              <Form.Group controlId={"climateVar-selection"}>
                <Form.Label className={styles2.inputRowLabel}>
                  Climate Variable
                </Form.Label>
                <Form.Select
                  value={climateVar}
                  onChange={handleClimateVarChange}
                  className={styles2.inputOption}
                >
                  {climateVarDropdown.map((element) => {
                    return (
                      <option
                        value={element.id}
                        className={styles2.inputOption}
                      >
                        {element.name}
                      </option>
                    );
                  })}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>

          <Row xs={2} sm={2} md={2} lg={2} className={styles2.inputSubmitRow}>
            <Col>
              <Button
                variant={"primary"}
                type={"submit"}
                disabled={loading}
                className={styles2.inputSubmit}
              >
                {loading === true ? "Loading..." : "Submit"}
              </Button>
            </Col>
            <Col>
              <Button
                variant={"danger"}
                className={styles2.inputClear}
                onClick={() => {
                  climateDataContext.setClimateDataTabOn(false);
                }}
              >
                Close
              </Button>
            </Col>
          </Row>
        </Form>
      </Container>
    </>
  );
}

export default SensorData;
