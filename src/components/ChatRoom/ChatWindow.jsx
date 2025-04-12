import { UserOutlined } from "@ant-design/icons";
import { Alert, Avatar, Button, Form, Input, Tooltip } from "antd";
import React, { useContext, useMemo, useState } from "react";
import styled from "styled-components";
import Message from "./Message";
import { AppContext } from "../../Context/AppProvider";
import addDocument from "../../firebase/services";
import { AuthContext } from "../../Context/AuthProvider";
import useFirestore from "../../hooks/useFirestore";

const WrapperStyled = styled.div`
	height: 100vh;
`;

const HeaderStyled = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	height: 56px;
	padding-left: 20px;
	padding-right: 40px;
	border-bottom: 1px solid rgba(230, 230, 230);

	.header {
		&__info {
			display: flex;
			flex-direction: column;
			justify-content: center;
		}

		&__title {
			margin: 0;
			font-weight: bold;
		}

		&__description {
			font-size: 12px;
		}
	}
`;
const ContentStyled = styled.div`
	height: calc(100% - 56px);
	display: flex;
	flex-direction: column;
	padding: 11px;
	justify-content: flex-end;
`;

const ButtonGroupStyled = styled.div`
	display: flex;
	align-items: center;
`;

const FormStyled = styled(Form)`
	display: flex;
	justify-content: space-between;
	align-items: center;
	gap: 8px;
	padding: 2px;
	border: 1px solid rgba(230, 230, 230);
	border-radius: 2px;

	.ant-form-item {
		//  Để thẻ input chiếm hết chiều dài
		flex: 1;
		margin-bottom: 0;
	}
`;

const MessageListStyled = styled.div`
	max-height: 100%;
	overflow-y: auto; // tạo thanh scroll cuộn dọc
`;

const ChatWindow = () => {
	const { selectedRoom, members, setIsInviteMemberVisible } =
		useContext(AppContext);
	const { user } = useContext(AuthContext);
	const { uid, photoURL, displayName } = user; // lấy thông tin người dùng từ context
	const [form] = Form.useForm(); // tạo form để sử dụng trong component

	const [inputValue, setInputValue] = useState(""); // state để lưu giá trị của input
	const handleInputChange = (e) => {
		setInputValue(e.target.value); // cập nhật giá trị của input khi người dùng nhập
	};

	const handleOnSubmit = () => {
		addDocument("messages", {
			text: inputValue,
			uid,
			photoURL,
			roomId: selectedRoom.id,
			displayName,
		});

		form.resetFields(["message"]); // reset lại form sau khi gửi tin nhắn
	};

	const condition = useMemo(() => {
		return {
			fieldName: "roomId",
			operator: "==",
			compareValue: selectedRoom.id,
		};
	}, [selectedRoom.id]); // tạo điều kiện để lấy danh sách tin nhắn từ firestore

	const messages = useFirestore("messages", condition); // lấy danh sách tin nhắn từ firestore
	// console.log({ messages });
	return (
		<WrapperStyled>
			{selectedRoom.id ? (
				<>
					<HeaderStyled>
						<div className="header__info">
							<p className="header__title">
								{selectedRoom?.name}
							</p>
							<span className="header__description">
								{selectedRoom?.description}
							</span>
						</div>
						<ButtonGroupStyled>
							<Button
								icon={<UserOutlined />}
								type="text"
								onClick={() => setIsInviteMemberVisible(true)}>
								Mời
							</Button>{" "}
							{/** type=text thì button không co border */}
							<Avatar.Group
								size="small"
								max={{
									count: 3,
									style: {
										color: "#f56a00",
										backgroundColor: "#fde3cf",
									},
								}}>
								{members.map((member) => (
									<Tooltip
										key={member.id}
										title={member.displayName}>
										<Avatar src={member.photoURL}>
											{member.photoURL
												? ""
												: member.displayName
														.charAt(0)
														.toUpperCase()}
										</Avatar>
									</Tooltip>
								))}
							</Avatar.Group>
						</ButtonGroupStyled>
					</HeaderStyled>
					<ContentStyled>
						<MessageListStyled>
							{messages.map((mes) => (
								<Message
									key={mes.id}
									text={mes.text}
									photoURL={mes.photoURL}
									displayName={mes.displayName}
									createdAt={mes.createdAt}></Message>
							))}
						</MessageListStyled>
						<FormStyled form={form}>
							<Form.Item name="message">
								<Input
									onChange={handleInputChange}
									onPressEnter={handleOnSubmit}
									placeholder="Nhập tin nhắn..."
									variant="outlined"
									autoComplete="off"></Input>
							</Form.Item>
							<Button
								type="primary"
								onClick={handleOnSubmit}>
								Gửi
							</Button>
						</FormStyled>
					</ContentStyled>
				</>
			) : (
				<Alert
					message="Hãy chọn phòng"
					type="info"
					showIcon
					style={{ margin: "5px" }}
					closable
				/>
			)}
		</WrapperStyled>
	);
};

export default ChatWindow;
