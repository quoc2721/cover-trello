import React from 'react';
import { Container as BootstrapContainer, Row, Col } from 'react-bootstrap';
import Avartar from '../../img/avatar.jpg'
import '../BoardBar/BoardBar.scss';

function BoardBar() {
  return (
    <nav className="navbar-board">
      <BootstrapContainer className="trello-container">
        <Row>
          <Col className="col-no-padding">
            <div className="board-info">
              <div className="item board-logo-icon">
                <i className="fa fa-coffee" /><strong>Project</strong>
              </div>
              <div className='divider'></div>

              <div className="item board-type">Private Workspace</div>
              <div className='divider'></div>

              <div className="item member-avatar">
                <img src={Avartar}></img>
                <img src={Avartar}></img>
                <img src={Avartar}></img>
                <img src={Avartar}></img>
                <span className='more-members'>+7</span>
                <span className='invite'>Invite</span>
              </div>
            </div>
          </Col>
          <Col sm={2} xs={12} className='col-no-padding'>
            <div className='board-actions'>
                <div className='item menu'><i className='fa fa-ellipsis-h mr-2' />Show menu</div>
            </div>
          </Col>
        </Row>
      </BootstrapContainer>
    </nav>
  );
}

export default BoardBar;
