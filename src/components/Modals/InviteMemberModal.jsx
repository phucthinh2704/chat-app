import { Avatar, Form, Input, Modal, Select, Spin } from "antd";
import React, { useContext, useMemo, useState } from "react";
import { AppContext } from "../../Context/AppProvider";
import { AuthContext } from "../../Context/AuthProvider";
import { debounce } from "lodash";
import { db } from "../../firebase/config";

const DebounceSelect = ({ fetchOptions, debounceTimeout = 300, curMembers, ...props }) => {
	// debounceTimeout: thoi gian debounce (tranh goi API qua nhieu lan gay lang phi)
	// fetchOptions: ham lay du lieu tu API

	const [fetching, setFetching] = useState(false); // flag cho biet dang fetch du lieu hay khong
	const [options, setOptions] = useState([]); // state chua du lieu lay tu API

	const debounceFetcher = useMemo(() => {
		const loadOptions = (value) => {
			setOptions([]); // reset options
			setFetching(true); // bat dau fetch du lieu

			fetchOptions(value, curMembers).then((newOptions) => {
				setOptions(newOptions); // set options
				setFetching(false); // ket thuc fetch du lieu
			});
		};
		return debounce(loadOptions, debounceTimeout);
	}, [debounceTimeout, fetchOptions, curMembers]);
	return (
		<Select
			labelInValue
			optionLabelProp="children" // de hien thi label trong select
			onSearch={debounceFetcher}
			notFoundContent={fetching ? <Spin size="small" /> : null}
			filterOption={false}
			{...props}>
			{
				// [{ value: "1", label: "abc", photoURL: "" }, { value: "2", label: "xyz", photoURL: "" }]
				options.map((opt) => (
					<Select.Option
						key={opt.value}
						value={opt.value}
						title={opt.label} 
						
						// tooltip khi hover vao
					>
						<Avatar src={opt.photoURL}>
							{opt.photoURL
								? ""
								: opt.label?.charAt(0).toUpperCase()}
						</Avatar>
						{` ${opt.label}`}
					</Select.Option>
				))
			}
		</Select>
	);
};

const fetchUserList = async (search, curMembers) => {
	return db
		.collection("users")
		.where("keywords", "array-contains", search)
		.orderBy("displayName")
		.limit(20)
		.get()
		.then((snapshot) => {
			return snapshot.docs.map((doc) => ({
				label: doc.data().displayName,
				value: doc.data().uid,
				photoURL: doc.data().photoURL,
			})).filter((opt) => !curMembers.includes(opt.value)); // loc danh sach thanh vien da co trong room
		});
};

const InviteMemberModal = () => {
	const { isInviteMemberVisible, setIsInviteMemberVisible, selectedRoomId, selectedRoom } =
		useContext(AppContext);
	const [form] = Form.useForm();

	const [value, setValue] = useState([]); // state chua gia tri cua select

	const handleOk = () => {
		// Handle OK action
      // update room members in current room
      const roomRef = db.collection("rooms").doc(selectedRoomId);

      roomRef.update({
         members: [...selectedRoom.members, ...value.map((item) => item.value)],
      })
		setIsInviteMemberVisible(false);
	};

	const handleCancel = () => {
		// Handle Cancel action
		form.resetFields();

		setIsInviteMemberVisible(false);
	};

	// console.log({ value });
	return (
		<div>
			<Modal
				title="Mời thêm thành viên"
				open={isInviteMemberVisible}
				onOk={handleOk}
				onCancel={handleCancel}>
				<Form
					form={form}
					layout="vertical">
					<DebounceSelect
						mode="multiple"
						label="Tên các thành viên"
						value={value}
						placeholder="Nhập tên thành viên"
						fetchOptions={fetchUserList}
						onChange={(newValue) => setValue(newValue)}
						style={{ width: "100%" }}
                  curMembers={selectedRoom.members} // truyền vào danh sách thành viên hiện tại trong phòng
                  ></DebounceSelect>
				</Form>
			</Modal>
		</div>
	);
};

export default InviteMemberModal;
