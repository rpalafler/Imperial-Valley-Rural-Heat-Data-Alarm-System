import { useState, useEffect, useContext } from 'react' ;

// CSS Stylesheet
import styles2 from './RTMA.module.css' ;

import 'bootstrap/dist/css/bootstrap.min.css';

// React-Bootstrap
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import Spinner from 'react-bootstrap/Spinner';


// Import Context
import { RTMAContext } from '../../../../MainApp' ;


// Create Dropdown Arrays and Default Values
const yearDefault = '2024' ;

const monthDropdownArray = [
    {id: '01', name: 'Jan'},
    {id: '02', name: 'Feb'},
    {id: '03', name: 'Mar'},
    {id: '04', name: 'Apr'},
    {id: '05', name: 'May'},
    {id: '06', name: 'Jun'},
    {id: '07', name: 'Jul'},
    {id: '08', name: 'Aug'},
    {id: '09', name: 'Sep'},
    {id: '10', name: 'Oct'},
    {id: '11', name: 'Nov'},
    {id: '12', name: 'Dec'},
] ;


// JavaScript Data Manipulation Functions //
const flatArrayToImageData = (flatArray, width, height) => {
    const uint8ClampedArray = new Uint8ClampedArray(flatArray);
    return new ImageData(uint8ClampedArray, width, height);
};
const imageDataToDataURL = (imageData) => {
    const canvas = document.createElement('canvas');
    canvas.width = imageData.width;
    canvas.height = imageData.height;
    const ctx = canvas.getContext('2d');
    ctx.putImageData(imageData, 0, 0);
    return canvas.toDataURL('image/png');
};



function RTMA() {
    // Import and use the context  //
    const rtmaContext = useContext(RTMAContext) ;


    // Year Selection and Change Handler //
    const [year, setYear] = useState(() => {
        const value = rtmaContext.rtmaForm === null ? yearDefault : rtmaContext.rtmaForm.year ;
        return value ;
    }) ;
    const handleYearChange = (event) => {
        event.preventDefault() ;
        setYear(event.target.value) ;
    } ;


    // Month Selection and Change Handler //
    const [month, setMonth] = useState(() => {
        const value = rtmaContext.rtmaForm === null ? monthDropdownArray[0]['id'] : rtmaContext.rtmaForm.month ;
        return value ;
    }) ;
    const handleMonthChange = (event) => {
        event.preventDefault() ;
        setMonth(event.target.value) ;
    } ;


    // Day Selection and Change Handler //
    const [day, setDay] = useState(() => {
        const value = rtmaContext.rtmaForm === null ? 1 : rtmaContext.rtmaForm.day ;
        return value ; 
    }) ;
    const [formProcessedDay, setFormProcessedDay] = useState(() => {
        const value = rtmaContext.rtmaForm === null ? "01" : rtmaContext.rtmaForm.day ;
        return value ;
    }) ;
    const handleDayChange = (event) => {
        event.preventDefault() ;
        const value = event.target.value ;
        if( (Number(value) > 0) && (Number(value) <= 31) ){
            setDay(value) ;
            const formattedValue = value.length === 1 ? `0${value}` : value;
            setFormProcessedDay(formattedValue) ;
        } else{
            setDay(1) ;
            setFormProcessedDay("01") ;
        }
    } ;


    // Hour Selection and Changer Handler //
    const [hour, setHour] = useState(() => {
        const value = rtmaContext.rtmaForm === null ? 0 : rtmaContext.rtmaForm.hour ;
        return value ;
    })
    const [hourFormSubmit, setHourFormSubmit] = useState(() => {
        const value = rtmaContext.rtmaForm === null ? "00" : rtmaContext.rtmaForm.day ;
        return value ;
    })
    const handleHourChange = (event) => {
        event.preventDefault() ;
        const value = event.target.value ;
        if( (Number(value) > 0) && (Number(value) <= 23) ){
            setHour(value) ;
            const formattedValue = value.length === 1 ? `0${value}` : value;
            setHourFormSubmit(formattedValue) ;
        } else{
            setHour(0) ;
            setHourFormSubmit("00") ;
        }
    } ;


    // Perform the following operations when the form is submitted by user //
    const [submitOn, setSubmitOn] = useState(false) ;
    const handleFormSubmit = (event) => {
        event.preventDefault() ; // Prevent page reloading on submission
        setSubmitOn(true) ;
        handleFormChange() ;
    } ;


    // Form that specifies the user's request --> JSON-like object sent to the POST API request //
    const [form, setForm] = useState({
        year: year,
        month: month,
        day: formProcessedDay,
        hour: hourFormSubmit,
    }) ;
    const handleFormChange = () => {
        setForm({
            ...form,
            year: year,
            month: month,
            day: formProcessedDay,
            hour: hourFormSubmit,
        }) ;
        rtmaContext.setRtmaForm({
            ...form,
            year: year,
            month: month,
            day: formProcessedDay,
            hour: hourFormSubmit,
        }) ;
    } ;


    // Retrieve data from the specified URL via the server based on the user's request
    useEffect(() => {
        const preparedForm = form ;
        console.log(JSON.stringify(preparedForm)) ;
        const sendRTMAData = async() => {
            try {
                const response = await fetch("http://localhost:5000/send_RTMA_request", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(preparedForm), 
                }) ;
                if(!response.ok){
                    throw new Error("ERROR: Request could not be processed. Reload & Try Again.")
                }
                const responseData = await response.json() ;
                const rgbaImage = flatArrayToImageData(responseData['climate_var_image'], responseData['width'], responseData['height']) ;
                const dataURL = imageDataToDataURL(rgbaImage) ;

                const windImage = flatArrayToImageData(responseData['wind_image'], responseData['width'], responseData['height']) ;
                const windDataURL = imageDataToDataURL(windImage) ;

                responseData['climate_var_image'] = dataURL ;
                responseData['wind_image'] = windDataURL ;

                rtmaContext.setRtmaData(responseData) ;
                console.log("I'm the data you saved:", responseData) ;
            } catch(error) {
                console.log("ERROR ", error) ;
            } finally {
                console.log("Process Finished") ;
                setSubmitOn(false) ;
            }
        }
        if(submitOn === true) {
            sendRTMAData() ;
        }
    }, [submitOn])
    

    return(
        <>
        <Container className={styles2.inputContainer}>
            <Form onSubmit={handleFormSubmit}>
                <Row xs={2} sm={2} md={2} lg={2} className={styles2.inputRow}>
                    <Col>
                        <Form.Group controlId={"year-selection"} className={styles2.inputRowLabel}>
                            <Form.Label>
                                Year
                            </Form.Label>
                            <Form.Control type={"number"} placeholder={"Enter Year (Default 2023)"} value={year} onChange={handleYearChange} 
                                className={styles2.inputOption} style={{cursor: "text"}} />
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group controlId={"month-selection"}>
                            <Form.Label className={styles2.inputRowLabel}>
                                Month
                            </Form.Label>
                            <Form.Select value={month} onChange={handleMonthChange} className={styles2.inputOption}>
                                {monthDropdownArray.map((element) => {
                                    return(
                                        <option value={element.id} className={styles2.inputOption}>{element.name}</option>
                                    ) ;
                                })}
                            </Form.Select>
                        </Form.Group>
                    </Col>
                </Row>

                <Row xs={1} sm={1} md={1} lg={1} className={styles2.inputRow}>
                    <Col>
                        <Form.Group controlId={"day-selection"}>
                            <Form.Label className={styles2.inputRowLabel}>
                                Day
                            </Form.Label>
                            <Form.Control type={"number"} value={day} placeholder={"Enter Day"} onChange={handleDayChange} 
                                className={styles2.inputOption} style={{cursor: "text"}} />
                        </Form.Group>
                    </Col>
                    <Col>
                        <Form.Group controlId={"hour-selection"}>
                            <Form.Label className={styles2.inputRowLabel}>
                                Hour
                            </Form.Label>
                            <Form.Control type={"number"} value={hour} placeholder={"Enter Hour"} onChange={handleHourChange} 
                                className={styles2.inputOption} style={{cursor: "text"}} />
                        </Form.Group>
                    </Col>
                </Row>

                <Row xs={2} sm={2} md={2} lg={2} className={styles2.inputRow}>
                    <Col>
                        <Button variant={"primary"} type={"submit"} className={styles2.inputSubmit}>
                            Submit
                        </Button>
                    </Col>
                    <Col>
                        <Button variant={"danger"} className={styles2.inputClear}>
                            Cancel
                        </Button>
                    </Col>
                </Row>
            </Form>
        </Container>
        </>
    ) ;
}

export default RTMA ;