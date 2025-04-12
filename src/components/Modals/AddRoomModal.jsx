import { Form, Input, Modal } from "antd";
import React, { useContext } from "react";
import { AppContext } from "../../Context/AppProvider";
import addDocument from "../../firebase/services";
import { AuthContext } from "../../Context/AuthProvider";

const AddRoomModal = () => {
	const { isAddRoomVisible, setIsAddRoomVisible } = useContext(AppContext);
	const [form] = Form.useForm();
   const { user } = useContext(AuthContext);
   const { uid } = user;

	const handleOk = () => {
		// Handle OK action
		// Add new room to Firestore
      // form.getFieldsValue() la object cac gia tri cua form { name: "abc", description: "abc"}
      addDocument("rooms", {
         ...form.getFieldsValue(),
         members: [uid],
      })

      // reset form
      form.resetFields();

		setIsAddRoomVisible(false);
	};

	const handleCancel = () => {
		// Handle Cancel action
      form.resetFields();

		setIsAddRoomVisible(false);
	};
	return (
		<div>
			<Modal
				title="Tạo phòng"
				open={isAddRoomVisible}
				onOk={handleOk}
				onCancel={handleCancel}>
				<Form
					form={form}
					layout="vertical">
					<Form.Item
						label="Tên phòng"
						name="name"
						rules={[
							{
								required: true,
								message: "Vui lòng nhập tên phòng",
							},
						]}>
						<Input placeholder="Nhập tên phòng" />
					</Form.Item>
					<Form.Item
						label="Mô tả"
						name="description"
						rules={[
							{
								required: true,
								message: "Vui lòng nhập mô tả",
							},
						]}>
						<Input.TextArea placeholder="Nhập mô tả" />
					</Form.Item>
				</Form>
			</Modal>
		</div>
	);
};

export default AddRoomModal;
