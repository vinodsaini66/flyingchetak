import { Col, Form, Input, Modal, Row, Image } from "antd";
import { useEffect, useState } from "react";

import apiPath from "../constants/apiPath";
import { Severty, ShowToast } from "../helper/toast";
import notfound from "../assets/images/not_found.png";
import useRequest from "../hooks/useRequest";
import SingleImageUpload from "./SingleImageUpload";

const EditProfileModal = ({ show, hide, data, refresh }) => {
  const [form] = Form.useForm();
  const { request } = useRequest();
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState("");
  const FileType = [
    "image/png",
    "image/jpg",
    "image/jpeg",
    "image/avif",
    "image/webp",
    "image/gif",
  ];

  const handleImage = (imgURL) => {
    console.log("imgurlimgurl",imgURL)
    if (imgURL && imgURL.length>0) {
      setFile(imgURL[0]);
    } else {
      setFile("");
      if (!data) return setFile([]);
    }
  };

  useEffect(() => {
    if (!data) return;
    form.setFieldsValue({ ...data });
    setFile([
      {
        url: data.image,
      },
    ]);
  }, [data]);

  const onEditProfile = (values) => {
    const { email, name } = values;
    const payload = {};
    setLoading(true);
    payload.email = email;
    payload.name = name;
    request({
      url: apiPath.updateProfile,
      method: "POST",
      data: payload,
      onSuccess: (data) => {
        setLoading(false);
        if (data.status) {
          ShowToast(data.message, Severty.SUCCESS);
          hide();
          refresh();
        } else {
          ShowToast(data.message, Severty.ERROR);
        }
      },
      onError: (error) => {
        ShowToast(error.response.data.message, Severty.ERROR);
        setLoading(false);
      },
    });
  };

  return (
    <Modal
      visible={show}
      title={`${data ? "Edit Profile" : ""}`}
      okText="Ok"
      onCancel={hide}
      okButtonProps={{
        form: "create",
        htmlType: "submit",
        loading: loading,
      }}
    >
      <Form id="create" form={form} onFinish={onEditProfile} layout="vertical">
        <Row>
          <Col span={24}>
            <Form.Item
              label="Name"
              name="name"
              rules={[
                { required: true, message: "Please enter the name!" },
                {
                  pattern: new RegExp(/^[a-zA-Z ]*$/),
                  message: "Only Alphabetic Characters Allowed",
                },
              ]}
            >
              <Input placeholder="Enter Name" />
            </Form.Item>
          </Col>

          {/* <Col span={24}>
            <Form.Item
              label="Email Address"
              name="email"
              rules={[
                {
                  type: "email",
                  message: "The input is not valid E-mail!",
                },
                { required: true, message: "Please enter the email!" },
              ]}
            >
              <Input placeholder="Enter Email Address" disabled />
            </Form.Item>
          </Col> */}

          {/* <Col span={24}>
            <Form.Item
              label="Upload Profile"
              name="image"
              rules={[
                {
                  validator: () => {
                    if (file !== undefined) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error("Image is required"));
                  },
                },
              ]}
            >
              <SingleImageUpload
                fileType={FileType}
                imageType={"profile"}
                btnName={"Profile"}
                onChange={(data) => handleImage(data)}
                isRequired={true}
              />
              <div className="mt-2">
                <Image
                  width={120}
                  src={
                    file && file.length > 0 && file !== "" && file[0].url
                      ? file[0].url
                      : notfound
                  }
                ></Image>
              </div>
            </Form.Item>
          </Col> */}
        </Row>
      </Form>
    </Modal>
  );
};

export default EditProfileModal;
