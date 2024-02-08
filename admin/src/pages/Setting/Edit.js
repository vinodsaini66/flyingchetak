import {
  Button,
  Card,
  Col,
  Divider,
  Form,
  Input,
  InputNumber,
  Row,
  Skeleton,
} from "antd";
import React, { useEffect, useState } from "react";
import "react-phone-input-2/lib/style.css";
import { useNavigate } from "react-router-dom";
import apiPath from "../../constants/apiPath";
import { Severty, ShowToast } from "../../helper/toast";
import useRequest from "../../hooks/useRequest";
import PhoneInput from "react-phone-input-2";

function Edit() {
  const navigate = useNavigate();
  const sectionName = "Setting";
  const routeName = "setting";
  const settingId = "64e4900eb5543cd63b05286a";

  const api = {
    edit: apiPath.editSetting,
    get: apiPath.getSetting,
  };

  const [form] = Form.useForm();

  const { request } = useRequest();
  // const [loading, setLoading] = useState(false);
  const [mobileNumber, setMobileNumber] = useState({
    mobile: "",
    country_code: "",
  });

  const fetchData = () => {
    // setLoading(true);
    request({
      url: api.get,
      method: "GET",
      onSuccess: (data) => {
        // setLoading(false);
        if (data.data) {
          setMobileNumber({
            mobile: data.data.mobile_number,
            country_code: data.data.country_code,
          });
        }
        console.log("data======>>>",data.data);
        form.setFieldsValue({ ...data.data });
      },
      onError: (error) => {
        ShowToast(error, Severty.ERROR);
      },
    });
  };

  const handleChange = (value, data, event, formattedValue) => {
    var country_code = data.dialCode;
    setMobileNumber({
      country_code: country_code,
      mobile: value.slice(data.dialCode.length),
    });
  };

  const onSubmit = (values) => {
    const payload = { ...values };
    console.log("sbdjhfbsdhjfbs",values)
    payload.mobile_number = mobileNumber.mobile
    request({
      url: api.edit,
      method: "POST",
      data: payload,
      onSuccess: (data) => {
        if (data.status) {
          ShowToast(data.message, Severty.SUCCESS);
        } else {
          ShowToast(data.message, Severty.ERROR);
        }
      },
      onError: (error) => {
        ShowToast(error.response.data.message, Severty.ERROR);
        // setLoading(false);
      },
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <Card title={"Update " + sectionName}>
      <Form
            className='edit-page-wrap'
            form={form}
            onFinish={onSubmit}
            autoComplete='off'
            layout='vertical'
            name='setting_form'
          >
            <Row gutter={[24, 0]}>
              <Divider
                orientation='left'
                orientationMargin={15}
                className='devider-color'
              >
                Contact Setting
              </Divider>

              <Col span={24} xs={24} sm={12} lg={12} xxl={8}>
                <Form.Item
                  label='Email Address'
                  name='email'
                  rules={[
                    {
                      type: "email",
                      message: "The email is not a valid email!",
                    },
                    { required: true, message: "Please enter the email!" },
                    {
                      max: 100,
                      message:
                        "Email should not contain more then 100 characters!",
                    },
                    {
                      min: 5,
                      message: "Email should contain atleast 5 characters!",
                    },
                  ]}
                >
                  <Input
                    maxLength={100}
                    autoComplete='off'
                    placeholder='Email Address'
                  />
                </Form.Item>
              </Col>

              <Col span={24} xs={24} sm={12} lg={12} xxl={8}>
                <Form.Item label='Mobile Number'>
                  <PhoneInput
                    inputProps={{
                      name: "mobile",
                      required: true,
                      autoFocus: false,
                      placeholder: "Enter Mobile Number",
                    }}
                    isValid={(value, country) => {
                      if (value.match(/1234/)) {
                        return "Invalid value: " + value + ", " + country.name;
                      } else if (value.match(/1234/)) {
                        return "Invalid value: " + value + ", " + country.name;
                      } else {
                        return true;
                      }
                    }}
                    country={"us"}
                    value={
                      mobileNumber
                        ? (mobileNumber.country_code
                            ? mobileNumber.country_code
                            : "+1") +
                          (mobileNumber.mobile ? mobileNumber.mobile : null)
                        : "+1"
                    }
                    onChange={handleChange}
                  />
                </Form.Item>
              </Col>
              <Col span={24} xs={24} sm={12} lg={12} xxl={8}>
                <Form.Item
                  label='Address'
                  name='address'
                  rules={[
                    { required: true, message: "Please enter the address!" }
                  ]}
                >
                  <Input
                    maxLength={100}
                    autoComplete='off'
                    placeholder='Enter Address'
                  />
                </Form.Item>
              </Col>
              <Divider
                  orientation='left'
                  orientationMargin={15}
                  className='devider-color'
                >
                  Social Media
                </Divider>
  
                {/* TODO: should there be 2 fields for overall bet commission and per bet commission, for now just taking the overall one */}
                <Col span={24} xs={24} sm={12} lg={12} xxl={8}>
                  <Form.Item
                    label='Facebook'
                    name='facebook'
                    rules={[
                      { required: true, message: "Please enter the facebook url!" },
                    ]}
                  >
                    <Input
                      autoComplete='off'
                      placeholder='Enter facebook Url'
                    />
                  </Form.Item>
                </Col>
                <Col span={24} xs={24} sm={12} lg={12} xxl={8}>
                  <Form.Item
                    label='Instagram'
                    name='instagram'
                    rules={[
                      { required: true, message: "Please enter the instagram url!" },
                    ]}
                  >
                    <Input
                      autoComplete='off'
                      placeholder='Enter instagram Url'
                    />
                  </Form.Item>
                </Col>

              <Divider
                orientation='left'
                orientationMargin={15}
                className='devider-color'
              >
                Game Setting
              </Divider>

              {/* TODO: should there be 2 fields for overall bet commission and per bet commission, for now just taking the overall one */}
              <Col span={24} xs={24} sm={12} lg={12} xxl={8}>
                <Form.Item
                  label='Bet Commission'
                  name='bet_commission'
                  rules={[
                    { required: true, message: "Please enter the email!" },
                  ]}
                >
                  <InputNumber
                    autoComplete='off'
                    placeholder='Enter Bet Commission'
                  />
                </Form.Item>
              </Col>
              <Col span={24} xs={24} sm={12} lg={12} xxl={8}>
                <Form.Item
                  label='Minimum bet amount'
                  name='min_bet'
                  rules={[
                    { required: true, message: "Please enter minimum bet amount!" },
                  ]}
                >
                  <InputNumber
                    autoComplete='off'
                    placeholder='Enter Minimum Bet Amount'
                  />
                </Form.Item>
              </Col>
              <Divider
                orientation='left'
                orientationMargin={15}
                className='devider-color'
              >
                Wallet Setting
              </Divider>
              <Col span={24} xs={24} sm={12} lg={12} xxl={8}>
                <Form.Item
                  label='Minimum withdrawal amount'
                  name='min_withdrawal'
                  rules={[
                    { required: true, message: "Please enter the email!" },
                  ]}
                >
                  <InputNumber
                    autoComplete='off'
                    placeholder='Enter Minimum Withdrawal Amount'
                  />
                </Form.Item>
              </Col>
              <Divider
                orientation='left'
                orientationMargin={15}
                className='devider-color'
              >
                App Setting
              </Divider>
              <Col span={24} xs={24} sm={12} lg={12} xxl={8}>
                <Form.Item
                  label='Referral Bonus'
                  name='referral_bonus'
                  rules={[
                    { required: true, message: "Please Enter Referral Bonus!" },
                  ]}
                >
                  <InputNumber
                    autoComplete='off'
                    placeholder='Enter Referral Bonus'
                  />
                </Form.Item>
              </Col>
            </Row>
            <Button htmlType="submit">Update</Button>
          </Form>
      </Card>
    </>
  );
}

export default Edit;
