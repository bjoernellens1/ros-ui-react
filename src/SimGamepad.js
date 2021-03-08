
import React, { Component } from 'react';
// import classNames from 'classnames'
import {
  CButton,
  CRow,
  CCol,
  CCard,
  CCardHeader,
  CCardBody,
  CProgress,
  CProgressBar
} from '@coreui/react'
import ROSLIB from 'roslib'
import AxisBar from './AxisBar';
import SimJoystick from './SimJoystick';





class SimGamepad extends Component {

  constructor(props) {
    super(props);
    this.controllers = {};
    this.state = {
      buttons: [0,0,0,0],
      axes: [0,0,0,0],
      joys: [0,0]
    };
    this.ros = new ROSLIB.Ros();
  }








  componentDidMount() {
    console.log("didmount");


    // If there is an error on the backend, an 'error' emit will be emitted.
    this.ros.on('error', function (error) {
      console.log(error);
    });

    // Find out exactly when we made a connection.
    this.ros.on('connection', function () {
      console.log('Connection made!');
    });

    this.ros.on('close', function () {
      console.log('Connection closed.');
    });

    this.ros.connect('ws://192.168.5.180:9090');

    this.topic = new ROSLIB.Topic({
      ros: this.ros,
      name: '/joy7',
      messageType: 'sensor_msgs/Joy'
    });



    setInterval(this.timerEnd, 20);

  }


  timerEnd = () => {

    var joyMsg = {
      header:
      {
        seq: 0,
        stamp: 0,
        frame_id: ""
      },
      axes: [],
      buttons: []
    };

    // for (var i = 0; i < this.controllers[0].axes.length; i++) {
    //   joyMsg.axes.push(this.controllers[0].axes[i]);
    // }

    joyMsg.axes = this.state.axes;
    joyMsg.buttons = this.state.buttons;

    this.topic.publish(joyMsg);


  }

  buttonOn = (index) =>{
    var buttonVals = this.state.buttons;
    buttonVals[index] = 1;
    this.setState({ buttons: buttonVals});
  }

  buttonOff = (index) =>{
    var buttonVals = this.state.buttons;
    buttonVals[index] = 0;
    this.setState({ buttons: buttonVals});
  }

  joyStop = (index) =>{
    var axisVals =  this.state.axes;
    axisVals[2*index] = 0;
    axisVals[2*index+1] = 0;
    this.setState({ axes: axisVals});
  }

  joyMove = (x, y, index) =>{
    var axisVals =  this.state.axes;
    axisVals[2*index] = x;
    axisVals[2*index+1] = y;
    this.setState({ axes: axisVals});
  }





  render() {

    let cols = this.state.buttons.map((item, index) => <CCol col="6" sm="4" md="2" xl className="mb-3 mb-xl-0">
      <CButton block color={item > 0 ? "primary" : "secondary"} onPointerDown={() => this.buttonOn(index)} onPointerUp={() => this.buttonOff(index)} >{index}</CButton>
    </CCol>);

    let stickDisplays = this.state.joys.map((item, index) => <CCol col="6" sm="4" md="2" xl className="mb-3 mb-xl-0">
      <SimJoystick size={40} move={(x,y) => this.joyMove(x,y, index)} stop={() => this.joyStop(index)} />
      
    </CCol>);

    let axisDisplays = this.state.axes.map((item, index) => <CCol col="6" sm="4" md="2" xl className="mb-3 mb-xl-0">
      <AxisBar value={item}/>
    </CCol>);

    return (

      <CCard>
        <CCardHeader>
          <strong>Simulated Controller</strong>
        </CCardHeader>
        <CCardBody>
          <CRow className="align-items-center">
            {cols}
          </CRow>
          <CRow className="align-items-center mt-3" >
            {axisDisplays}
          </CRow>
          <CRow className="align-items-center mt-3" >
            {stickDisplays}
          </CRow>

          
          {/* <Joystick size={100} baseColor="red" stickColor="blue" move={handleMove} stop={handleStop}></Joystick> */}

        </CCardBody>
      </CCard>

    );
  }
}

export { SimGamepad };