import { Card, Col, Form, Input, Modal, Row } from "antd";
import { useEffect, useState } from "react";

import apiPath from "../constants/apiPath";
import { Severty, ShowToast } from "../helper/toast";
import useRequest from "../hooks/useRequest";

export const AppSettingModal = ({ show, hide, data, refresh }) => {
  const [form] = Form.useForm();
  const { request } = useRequest();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!data) return;
    form.setFieldsValue({ ...data });
  }, [data]);

  const onAppSetting = (values) => {
    setLoading(true);
    request({
      url: apiPath.updateAppSetting,
      method: "POST",
      data: values,
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
      width={1200}
      visible={show}
      title={`${data ? "Update App Setting" : ""}`}
      okText="Ok"
      onCancel={hide}
      okButtonProps={{
        form: "create",
        htmlType: "submit",
        loading: loading,
      }}
    >
      <Form id="create" form={form} onFinish={onAppSetting} layout="vertical">
        <Row gutter={[12, 0]}>
          <Col span={24} md={12}>
            <Card title="Android Details" className="app-seting-card">
              <Col span={24}>
                <Form.Item
                  label="App Store URL"
                  name="app_store_url"
                  rules={[
                    {
                      required: true,
                      message: "Please enter the app store URL!",
                    },
                  ]}
                >
                  <Input placeholder="Enter App Store URL" />
                </Form.Item>
              </Col>

              <Col span={24}>
                <Form.Item
                  label="Version"
                  name="android_version"
                  rules={[
                    { required: true, message: "Please enter the version!" },
                  ]}
                >
                  <Input placeholder="Enter Android Version" />
                </Form.Item>
              </Col>

              <Col span={24}>
                <Form.Item
                  label="Share Content"
                  name="android_share_content"
                  rules={[
                    {
                      required: true,
                      message: "Please enter the share content!",
                    },
                  ]}
                >
                  <Input.TextArea
                    showCount
                    maxLength={500}
                    style={{ height: 120, marginBottom: 15 }}
                    placeholder="Share Android Content"
                  />
                </Form.Item>
              </Col>
            </Card>
          </Col>

          <Col span={24} md={12}>
            <Card title="IOS Details" className="app-seting-card">
              <Col span={24}>
                <Form.Item
                  label="Play Store URL"
                  name="play_store_url"
                  rules={[
                    {
                      required: true,
                      message: "Please enter the play store URL!",
                    },
                  ]}
                >
                  <Input placeholder="Enter Play Store URL" />
                </Form.Item>
              </Col>

              <Col span={24}>
                <Form.Item
                  label="Version"
                  name="ios_version"
                  rules={[
                    { required: true, message: "Please enter the version!" },
                  ]}
                >
                  <Input placeholder="Enter IOS Version" />
                </Form.Item>
              </Col>

              <Col span={24}>
                <Form.Item
                  label="Share Content"
                  name="ios_share_content"
                  rules={[
                    {
                      required: true,
                      message: "Please enter the share content!",
                    },
                  ]}
                >
                  <Input.TextArea
                    showCount
                    maxLength={500}
                    style={{ height: 120, marginBottom: 15 }}
                    placeholder="Share IOS Content"
                  />
                </Form.Item>
              </Col>
            </Card>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};
