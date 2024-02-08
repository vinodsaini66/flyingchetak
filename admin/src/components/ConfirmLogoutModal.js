import { ExclamationCircleOutlined } from "@ant-design/icons";
import { Modal } from "antd";
import React from "react";

const { confirm } = Modal;

const ConfirmLogout = () => {
  const showConfirm = ({ onLogout }) => {
    confirm({
      icon: <ExclamationCircleOutlined />,
      content: (
        <h1 className="dashboard-table-heading" style={{ textAlign: "center" }}>
          Are you sure you want to log out?
        </h1>
      ),
      onOk() {
        onLogout();
      },
      onCancel() {},
      maskClosable: true,
    });
  };

  return { showConfirm };
};

export default ConfirmLogout;
