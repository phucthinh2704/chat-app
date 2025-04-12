import { Col, Row } from 'antd';
import React from 'react';
import Sidebar from './Sidebar';
import ChatWindow from './ChatWindow';

const ChatRoom = () => {
   return (
      <div>
         <Row>
            <Col span={6}>
               <Sidebar></Sidebar>
            </Col>
            <Col span={18}>
               <ChatWindow></ChatWindow>
            </Col>
         </Row>
      </div>
   );
};

export default ChatRoom;