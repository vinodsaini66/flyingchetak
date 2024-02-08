import { Form, Input, Modal } from "antd";

const ChangePasswordModal = ({ visible, closeModal, handleCreate }) => {
  const [form] = Form.useForm();

  const onModalOk = () => {
    handleCreate(form.getFieldsValue());
  };

  return (
    <Modal
      visible={visible}
      title="Change password"
      okText="Ok"
      onCancel={closeModal}
      onOk={onModalOk}
      okButtonProps={{
        form: "status",
        htmlType: "submit",
      }}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label="Old Password"
          name="old_password"
          hasFeedback
          rules={[
            { required: true, message: "Please enter the old password!" },
          ]}
        >
          <Input.Password placeholder="Enter Old Password" />
        </Form.Item>
        <Form.Item
          label="New Password"
          name="new_password"
          hasFeedback
          rules={[
            { required: true, message: "Please enter the new password!" },
            {
              pattern: new RegExp(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*]).{8,}$/,
              ),
              message:
                "New password atleast contain 8 characters, atleast contain one captital letter, atleast contain one small letter, atleast contain one digit, atleast contain one special character",
            },
          ]}
        >
          <Input.Password placeholder="Enter New Password" />
        </Form.Item>
        <Form.Item
          label="Confirm New Password"
          name="confirm_new_password"
          dependencies={["new_password"]}
          hasFeedback
          rules={[
            { required: true, message: "Please enter the confirm password!" },
            {
              pattern: new RegExp(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*]).{8,}$/,
              ),
              message:
                "Confirm password atleast contain 8 characters, atleast contain one captital letter, atleast contain one small letter, atleast contain one digit, atleast contain one special character",
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("new_password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error("Confirm password & password does not match!"),
                );
              },
            }),
          ]}
        >
          <Input.Password placeholder="Enter Confirm Password" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ChangePasswordModal;
