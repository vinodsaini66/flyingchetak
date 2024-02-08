import {
  CheckCircleOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { Button, Modal } from "antd";
import { Severty, ShowToast } from "../helper/toast";
import useRequest from "../hooks/useRequest";

const { confirm } = Modal;

const VerificationBox = () => {
  const { request } = useRequest();

  const showVerify = ({ record, path, onLoading, onSuccess }) => {
    setTimeout(() => {
      confirm({
        icon: <ExclamationCircleOutlined />,
        content: <Button>Are You Sure To Verify Service Provider?</Button>,
        onOk() {
          verificationStatusChange(record, path, onLoading, onSuccess);
        },
        onCancel() {},
        maskClosable: true, // This allows closing the modal by clicking outside
      });
    }, 5);
  };

  const verificationStatusChange = (record, path, onLoading, onSuccess) => {
    onLoading(true);
    const url = path + "/" + record;
    request({
      url: url,
      method: "POST",
      onSuccess: (data) => {
        onSuccess();
        onLoading(false);
      },
      onError: (error) => {
        ShowToast(error, Severty.ERROR);
      },
    });
  };

  return { showVerify };
};

export default VerificationBox;
