import React from 'react'
import '../AppBar/AppBar.scss'
import 'font-awesome/css/font-awesome.min.css'
import { Container as BootstrapContainer, Row, Col, InputGroup, FormControl } from 'react-bootstrap'
import Avartar from '../../img/avatar.jpg'

function AppBar() {
  return (
    <nav className="navbar-app">
      <BootstrapContainer className='trello-container'>
        <Row>
          <Col sm={6} xs={12} className='col-no-padding'>
            <div className='app-actions'>
              <div className='item all'><i className='fa fa-th'></i></div>
              <div className='item home'><i className='fa fa-home'></i></div>
              <div className='item boards'><i className='fa fa-columns' /><strong>Trello</strong></div>
              <div className='item search'>
                <InputGroup className='group-search'>
                  <FormControl className='input-search' placeholder='Search' /><i className='fa fa-search'/>
                  <InputGroup.Text className='input-icon-search' />
                </InputGroup>
              </div>
            </div>
          </Col>
          <Col sm={6} xs={12} className='col-no-padding'>
            <div className="user-actions">
              <div className='item quick'><i className='fa fa-plus-square-o' /></div>
              <div className='item news'><i className='fa fa-info-circle' /></div>
              <div className='item notification'><i className='fa fa-bell-o' /></div>
              <div className='avatar'><img src={Avartar} alt="" width="30" height="30" className="d-inline-block align-text-top" /></div>
            </div>
          </Col>
        </Row>
      </BootstrapContainer>
    </nav>
  );
}

export default AppBar;
