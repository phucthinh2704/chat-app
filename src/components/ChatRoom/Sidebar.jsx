import { Col, Row } from "antd";
import React from "react";
import UserInfo from "./UserInfo";
import RoomList from "./RoomList";
import styled from "styled-components";

const SidebarStyled = styled.div`
	background-color: #3f0e40;
	color: white;
	height: 100vh;
`;

const Sidebar = () => {
	return (
		<SidebarStyled>
			<Row>
				<Col span={24}>
					<UserInfo></UserInfo>
				</Col>
				<Col span={24}>
					<RoomList></RoomList>
				</Col>
			</Row>
		</SidebarStyled>
	);
};

export default Sidebar;
