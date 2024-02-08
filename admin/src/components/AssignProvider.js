import { Badge, Col, Form, Modal, Row, Select, Skeleton } from "antd";
import React, { useEffect, useState } from "react";

import apiPath from "../constants/apiPath";
import { Severty, ShowToast } from "../helper/toast";
import useRequest from "../hooks/useRequest";

export const AssignProvider = ({ show, hide, data, type, refresh }) => {
  const [forms] = Form.useForm();
  const { request } = useRequest();
  const [loading, setLoading] = useState(false);
  const [loadingModel, setLoadingModel] = useState(false);
  const [providerList, setProviderList] = useState([]);

  const getProviderList = () => {
    setLoadingModel(true);
    if (type === "order") {
      getProviderListForOrders();
    } else if (type === "booking") {
      getProviderListForBooking();
    }
  };

  const getProviderListForOrders = () => {
    request({
      url: apiPath.availableProviderList + "/" + data?._id,
      method: "GET",
      onSuccess: (data) => {
        setLoadingModel(false);
        setProviderList(data.data);
      },
      onError: (error) => {
        setLoadingModel(false);
        ShowToast(error, Severty.ERROR);
      },
    });
  };

  const getProviderListForBooking = () => {
    request({
      url: apiPath.bookingProviderList + "/" + data?._id,
      method: "GET",
      onSuccess: (data) => {
        setLoadingModel(false);
        setProviderList(data.data);
      },
      onError: (error) => {
        setLoadingModel(false);
        ShowToast(error, Severty.ERROR);
      },
    });
  };

  useEffect(() => {
    getProviderList();
    if (!data) return;
    console.log(data, "-------data");
    if (data) {
      forms.setFieldsValue({
        ...data,
        service_provider_id: data?.service_provider_id?._id
          ? data?.service_provider_id?._id
          : data?.service_provider_id,
      });
    }
  }, [data]);

  const onCreate = (values) => {
    const { service_provider_id } = values;
    const payload = {};
    setLoading(true);
    // payload.order_id = data._id;
    payload.service_provider_id = service_provider_id;

    if (type === "booking") {
      onCreateBooking(payload);
    } else if (type === "order") {
      onCreateOrder(payload);
    }
  };

  const onCreateBooking = (payload) => {
    request({
      url: apiPath.assignBookingProvider + "/" + data._id,
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

  const onCreateOrder = (payload) => {
    request({
      url: apiPath.assignOrderProvider + "/" + data._id,
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
      width={600}
      title="Assign/Change Provider"
      okText="Ok"
      onCancel={hide}
      okButtonProps={{
        form: "create",
        htmlType: "submit",
        loading: loading,
      }}
    >
      {loadingModel ? (
        <Skeleton active />
      ) : (
        <Form id="create" form={forms} onFinish={onCreate} layout="vertical">
          <Row>
            <Col span={24}>
              <Form.Item
                label="Select Provider"
                name="service_provider_id"
                rules={[
                  { required: true, message: "Please select the provider!" },
                ]}
              >
                <Select
                  showSearch
                  placeholder="Select Provider"
                  filterOption={(input, option) =>
                    (option.label ?? "")
                      .toLowerCase()
                      .includes(input.toLowerCase())
                  }
                >
                  {providerList && providerList.length > 0
                    ? providerList.map((item) => (
                        <Select.Option
                          key={item._id}
                          value={item._id}
                          disabled={item.stock === 0}
                          label={item.name}
                        >
                          {item.name}
                          <span
                            style={{ textAlign: "right", marginLeft: "20px" }}
                          ></span>
                        </Select.Option>
                      ))
                    : null}
                </Select>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      )}
    </Modal>
  );
};
