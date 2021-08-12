
import React, { useRef, useEffect, useState } from "react";
import '../views/Dashboard.css';
// nodejs library that concatenates classes
// react plugin used to create charts
import { Line, Bar } from "react-chartjs-2";

import useFetch from "customHooks/useFetch";
// reactstrap components
import {
  Button,
  ButtonGroup,
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  Label,
  FormGroup,
  Input,
  Table,
  Row,
  Col,
  UncontrolledTooltip,
} from "reactstrap";

// core components
import {
  chartExample1,
  chartExample2,
  chartExample3,
  chartExample4,
} from "variables/charts.js";

import axios from "axios";

let stonks = chartExample1['data1'];

const months = {
  0: 'Jan',
  1: 'Feb',
  2: 'March',
  3: 'Apr',
  4: 'May',
  5: 'June',
  6: 'July',
  7: 'Aug',
  8: 'Sept',
  9: 'Oct',
  10: 'Nov',
  11: 'Dec'
}



function Dashboard(props) {
  var url = "http://localhost:5000/stocks/"
  const stockRes = useFetch('http://localhost:5000/stocks/aapl');

  const [query, setQuery] = useState('');
  const [historicalData, setHistoricalData] = useState(null);

  const textInputRef = useRef();

  const lineChartContainer = useRef();
  const [chartInstance, setChartInstance] = React.useState(null);



    useEffect(() => {
      if(lineChartContainer && lineChartContainer.current) {
        const myInstance = lineChartContainer.current.chartInstance;
        setChartInstance(myInstance);
         
      let ctx = lineChartContainer.current.chartInstance
      console.log(ctx);
      //console.log(ctx.data);
      //console.log(ctx.data.labels);
      }
      

     


    },[historicalData]);
 
    
    if(!stockRes.response){
      return(<div>loading</div>)
    }

   

    const updateDataset = (datasetIndex, newData) => {
      chartInstance.data.datasets[datasetIndex].data = newData;
      chartInstance.update();
    };

    const update_Y_Axis = (newLabelData) => {
      
      chartInstance.data.labels = newLabelData;
      chartInstance.update();
    };

    const retrieveSpecificDataAndSet = async () => {
     // const letsSee = useFetchStock('http://localhost:5000/stocks/aapl');
     const res = await axios.get(url + query);
     if(res.status == 200){
       const history_data = res.data.data;
       setHistoricalData(history_data);

       let dates = [];
       let closingPrice = []
       let allPrices = history_data;
       //console.log(allPrices);
       allPrices.forEach(function(item, index){
         var myDate = new Date(item.date * 1000);
         var month = months[myDate.getMonth()];
         var day = myDate.getDate();
         var year = myDate.getFullYear();
   
         var myDateString = `${month} ${day} ${year}`;
         dates.push(myDateString);
         closingPrice.push(item.close);
       })
       //console.log(dates);

       
     updateDataset(0, closingPrice);
     update_Y_Axis(dates);
       
       
       
       console.log(res.data.data);
       console.log('retrieved')
     }
    }

    

   

    const onButtonClick = async () => {
       console.log(query);
       console.log(historicalData);
       //we update the chart via response and set state as well
       //if done otherwise, the chart will not update 
       //but only on double clicking
       await retrieveSpecificDataAndSet();



   
      
      
      if(!chartInstance){
        console.log('no chart instance');
        return;
      }
    };


   


    
  return (
    <>
      <div className="content">
  


        <Row className="alignCenterItems">
        <Col lg="4" >
            <Card className="card-chart">
              <CardHeader>
                <h5 className="card-category">Enter Ticker Symbol</h5>
                <CardTitle tag="h3">
                  <i className="tim-icons icon-zoom-split text-primary" />{" "}
                  Search
                </CardTitle>
              </CardHeader>
              

              <Input type="text" 
                className="" defaultValue="aapl"
                
                 ref={textInputRef}
                 onChange={(e) => {setQuery(e.target.value)}}
                 
                 ></Input>
              <Button onClick={onButtonClick}>Search</Button>
            </Card>
          </Col>
          
          
        </Row>
        <Row>
        <Col xs="12">
            <Card className="card-chart">
              <CardHeader>
                <Row>
                  <Col className="text-left" sm="6">
                    <h5 className="card-category">Historical Closing</h5>
                    <CardTitle tag="h2">ClosingPrice</CardTitle>

                  </Col>
                </Row>
              </CardHeader>
              <CardBody>
                <div className="chart-area">
                  <Line
                    data={stonks}
                    options={chartExample1.options}
                    ref={lineChartContainer}
                  />
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col lg="4">
            <Card className="card-chart">
              <CardHeader>
                <h5 className="card-category">Total Shipments</h5>
                <CardTitle tag="h3">
                  <i className="tim-icons icon-bell-55 text-info" /> 763,215
                </CardTitle>
              </CardHeader>
              <CardBody>
                <div className="chart-area">
                  <Line
                    data={chartExample2.data}
                    options={chartExample2.options}
                  />
                </div>
              </CardBody>
            </Card>
          </Col>
          <Col lg="4">
            <Card className="card-chart">
              <CardHeader>
                <h5 className="card-category">Daily Sales</h5>
                <CardTitle tag="h3">
                  <i className="tim-icons icon-delivery-fast text-primary" />{" "}
                  3,500€
                </CardTitle>
              </CardHeader>
              <CardBody>
                <div className="chart-area">
                  <Bar
                    data={chartExample3.data}
                    options={chartExample3.options}
                  />
                </div>
              </CardBody>
            </Card>
          </Col>
          <Col lg="4">
            <Card className="card-chart">
              <CardHeader>
                <h5 className="card-category">Completed Tasks</h5>
                <CardTitle tag="h3">
                  <i className="tim-icons icon-send text-success" /> 12,100K
                </CardTitle>
              </CardHeader>
              <CardBody>
                <div className="chart-area">
                  <Line
                    data={chartExample4.data}
                    options={chartExample4.options}
                  />
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col lg="6" md="12">
            <Card className="card-tasks">
              <CardHeader>
                <h6 className="title d-inline">Tasks(5)</h6>
                <p className="card-category d-inline"> today</p>
                <UncontrolledDropdown>
                  <DropdownToggle
                    caret
                    className="btn-icon"
                    color="link"
                    data-toggle="dropdown"
                    type="button"
                  >
                    <i className="tim-icons icon-settings-gear-63" />
                  </DropdownToggle>
                  <DropdownMenu aria-labelledby="dropdownMenuLink" right>
                    <DropdownItem
                      href="#pablo"
                      onClick={(e) => e.preventDefault()}
                    >
                      Action
                    </DropdownItem>
                    
                    <DropdownItem
                      href="#pablo"
                      onClick={(e) => e.preventDefault()}
                    >
                      Another action
                    </DropdownItem>
                    <DropdownItem
                      href="#pablo"
                      onClick={(e) => e.preventDefault()}
                    >
                      Something else
                    </DropdownItem>
                  </DropdownMenu>
                </UncontrolledDropdown>
              </CardHeader>
              <CardBody>
                <div className="table-full-width table-responsive">
                  <Table>
                    <tbody>
                      <tr>
                        <td>
                          something
                        </td>
                        <td>
                          <p className="title">Update the Documentation</p>
                          <p className="text-muted">
                            Dwuamish Head, Seattle, WA 8:47 AM
                          </p>
                        </td>
                        <td className="td-actions text-right">
                       another smth
                        </td>
                      </tr>
                      
                      
                   
                      <tr>
                        <td>
                          <FormGroup check>
                            <Label check>
                              <Input defaultValue="" type="checkbox" />
                              <span className="form-check-sign">
                                <span className="check" />
                              </span>
                            </Label>
                          </FormGroup>
                        </td>
                        <td>
                          <p className="title">Arival at export process</p>
                          <p className="text-muted">
                            Capitol Hill, Seattle, WA 12:34 AM
                          </p>
                        </td>
                        <td className="td-actions text-right">
                          <Button
                            color="link"
                            id="tooltip217595172"
                            title=""
                            type="button"
                          >
                            <i className="tim-icons icon-pencil" />
                          </Button>
                          <UncontrolledTooltip
                            delay={0}
                            target="tooltip217595172"
                            placement="right"
                          >
                            Edit Task
                          </UncontrolledTooltip>
                        </td>
                      </tr>
                    </tbody>
                  </Table>
                </div>
              </CardBody>
            </Card>
          </Col>
          <Col lg="6" md="12">
            <Card>
              <CardHeader>
                <CardTitle tag="h4">Simple Table</CardTitle>
              </CardHeader>
              <CardBody>
                <Table className="tablesorter" responsive>
                  <thead className="text-primary">
                    <tr>
                      <th>Name</th>
                      <th>Country</th>
                      <th>City</th>
                      <th className="text-center">Salary</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Dakota Rice</td>
                      <td>Niger</td>
                      <td>Oud-Turnhout</td>
                      <td className="text-center">$36,738</td>
                    </tr>
                    <tr>
                      <td>Minerva Hooper</td>
                      <td>Curaçao</td>
                      <td>Sinaai-Waas</td>
                      <td className="text-center">$23,789</td>
                    </tr>
                   
                  </tbody>
                </Table>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default Dashboard;
