
import React, { useRef, useEffect, useState } from "react";
import '../views/Dashboard.css';
// nodejs library that concatenates classes
// react plugin used to create charts
import { Line, Bar } from "react-chartjs-2";
import Linechart from '../components/Chart/Linechart';

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
  var url = "http://localhost:5000/stocks/";
  var sumUrl = 'http://localhost:5000/stocks/summary/';
  var newsUrl = 'http://localhost:5000/stocks/news/';
  //const stockRes = useFetch('http://localhost:5000/stocks/aapl');

  const [query, setQuery] = useState('');
  const [historicalData, setHistoricalData] = useState(null);
  const [summary, setSummary] = useState(null);
  const [news, setNews] = useState(null);

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

      if(historicalData){
        console.log("we have history");
        let dates = [];
       let closingPrice = []
       let allPrices = historicalData;
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


      }
      

     


    },[]);
 


    const updateDataset = (datasetIndex, newData) => {
      if(chartInstance){
        chartInstance.data.datasets[datasetIndex].data = newData;
      chartInstance.update();
      }
      else{
        console.log("no chart instance - still loading");
      }
      
    };

    const update_Y_Axis = (newLabelData) => {
      if(chartInstance){
      
      chartInstance.data.labels = newLabelData;
      chartInstance.update();
      }
      else{
        console.log("no chart instance - still loading");
      }
    };

    const retrieveSpecificDataAndSet = async () => {
     // const letsSee = useFetchStock('http://localhost:5000/stocks/aapl');
     const res = await axios.get(url + query);
     if(res.status == 200){
       if(res.data.data){
        console.log(res.data.data);
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

       }else{
         console.log('invalid data request');
       }
       
       
       
       
     }
    }

    

    const retrieveSummaryProfile = async () => {
      const res = await axios.get(sumUrl + query);
      console.log('retrieving summary');
      console.log(res);
      if(res.status == 200){
        if(res.data.data){
         console.log(res.data.data);
         setSummary(res.data.data);

         
 
 
        }else{
          console.log('invalid data request');
        }
        
        
        
        
      }







    }

    const retrieveStockNews = async () => {
      const res = await axios.get(newsUrl + query);
      console.log('retrieving news');
      console.log(res);
      if(res.status == 200){
        if(res.data.data){
         console.log(res.data.data);
         console.log('res data from news source');
         setNews(res.data.data);

         
 
 
        }else{
          console.log('invalid data request');
        }
        
        
        
        
      }

    }

   

    const onButtonClick = async () => {
      // console.log(query);
       //console.log(historicalData);
       //we update the chart via response and set state as well
       //if done otherwise, the chart will not update 
       //but only on double clicking
    
      
       await retrieveSummaryProfile();
      
       

       await retrieveStockNews();



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
                <h5 className="card-category">{query && <h5>{query}</h5>}</h5>
                <CardTitle tag="h3">
                 Summary
                </CardTitle>
              </CardHeader>
              <CardBody>
                <div className="chart-area" id="overflowthis">
                 
                  <p>{summary && summary.summaryProfile}</p>
                 
                </div>
              </CardBody>
            </Card>
          </Col>
          <Col lg="4">
            <Card className="card-chart">
              <CardHeader>
                <h5 className="card-category">Financials</h5>
                
              </CardHeader>
              <CardBody>
                <div className="chart-area">
                  <ul>
                    <li>Profit Margins: {summary && summary.profitMargins}</li>
                    <br />
                    <li>Book Value: {summary && summary.bookValue}</li>
                    <br />
                    <li>Fifty Two Week Change: {summary && summary.fiftyTwoWeekChange}</li>
                    <br />
                    <li>Website: <a href={summary && summary.website}> {
                      summary && summary.website
                    }</a></li>
                  </ul>
                 
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
                      {
                        news &&
                        news.map((newsItem, index) => {
                          return (
                            <tr key={index}>
                              <td>{newsItem.author}</td>
                              <td>{newsItem.text}</td>
                              <td>{newsItem.namespace}</td>
                              <td>{newsItem.entity}</td>
                            </tr>
                          );

                        })
                      }
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
