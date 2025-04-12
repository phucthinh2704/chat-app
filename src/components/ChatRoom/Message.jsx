import { Avatar, Typography } from "antd";
import { formatRelative } from "date-fns";
import React from "react";
import styled from "styled-components";

const WrapperStyled = styled.div`
	display: flex;
	flex-direction: column;
	margin-bottom: 10px;

	.author {
		margin-left: 5px;
		font-weight: bold;
	}

	.date {
		margin-left: 10px;
		font-size: 12px;
		color: #a7a7a7;
	}

	.content {
		margin-left: 30px;
	}
`;

// Format the date from seconds to a readable format
const formatDate = (seconds) => {
	let formattedDate = "";

	if (seconds) {
		formattedDate = formatRelative(new Date(seconds * 1000), new Date()); // formatRelative: format thoi gian tu giay sang thoi gian doc duoc

      formattedDate = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1); // chuyen chu cai dau thanh chu hoa
	}

   return formattedDate;
};

const Message = ({ text, displayName, createdAt, photoURL }) => {
	return (
		<WrapperStyled>
			<div>
				<Avatar
					src={photoURL}
					size="small">
					{photoURL ? "" : displayName?.charAt(0).toUpperCase()}
				</Avatar>
				<Typography.Text
					strong
					className="author">
					{displayName}
				</Typography.Text>
				<Typography.Text className="date">{formatDate(createdAt?.seconds)}</Typography.Text>
			</div>
			<div>
				<Typography.Text className="content">{text}</Typography.Text>
			</div>
		</WrapperStyled>
	);
};

export default Message;
