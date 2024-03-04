import {
    Button,
    Card,
    Checkbox,
    Col,
    Form,
    Image,
    Input,
    Modal,
    Row,
    Table,
    Tag,
    Tooltip,
  } from "antd";
  import moment from "moment";
  import React, { useEffect, useState } from "react";
  import { useParams } from "react-router-dom";
  
  import notfound from "../../assets/images/not_found.png";
  import ConfirmationBox from "../../components/ConfirmationBox";
  import ShowTotal from "../../components/ShowTotal";
  import SingleImageUpload from "../../components/SingleImageUpload";
  import apiPath from "../../constants/apiPath";
  import { Severty, ShowToast } from "../../helper/toast";
  import useDebounce from "../../hooks/useDebounce";
  import useRequest from "../../hooks/useRequest";
  
  const Search = Input.Search;
  
  function UTR() {
    const sectionName = "UTR Management";
    const routeName = "utr";
  
    const api = {
      addEdit: apiPath.addEditUtr,
      list: apiPath.getUtr,
    };
  
    const params = useParams();
    const [searchText, setSearchText] = useState("");
    const { request } = useRequest();
    const { showConfirmDelete } = ConfirmationBox();
    const [loading, setLoading] = useState(false);
    const [refresh, setRefresh] = useState(false);
    const [visible, setVisible] = useState(false);
    const [selected, setSelected] = useState();
    const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
  
    const [list, setList] = useState([]);
  
    const debouncedSearchText = useDebounce(searchText, 300);
  
    const columns = [
     
      {
        title: "Url",
        dataIndex: "url",
        key: "url",
      },    
      {
        title: "Key",
        dataIndex: "key",
        key: "key",
      },  
      {
        title: "Date",
        dataIndex: "date",
        key: "date"
      },    
      {
        title: "Created On",
        key: "created_at",
        dataIndex: "created_at",
        render: (_, { created_at }) => {
          return moment(created_at).format("MM-DD-YYYY");
        },
      },
      {
        title: "Action",
        fixed: "right",
        render: (_, record) => {
          return (
            <>
              <Tooltip
                title={"Update " + sectionName}
                color={"purple"}
                key={"update" + routeName}
              >
                <Button
                  title="Edit"
                  onClick={() => {
                    setSelected(record);
                    setVisible(true);
                  }}
                >
                  <i className="fa fa-light fa-pen"></i>
                </Button>
              </Tooltip>
              {/* <Tooltip
                title={"Delete " + sectionName}
                color={"Red"}
                key={"delete" + routeName}
              >
                <Button
                  title="Delete"
                  onClick={(e) =>
                    showConfirmDelete({
                      record,
                      onDelete
                    })
                  }
                  // color={color}
                  // key={is_active}
                >
                  <i className="fas fa-trash"></i>
                </Button>
              </Tooltip> */}
            </>
          );
        },
      },
    ];

    const onDelete = (record) => {
      console.log("fsdbfjshbfsjhfsdh",record)
      let payload = {
        _id:record._id
      }
		  request({
			  url: apiPath.channelDelete,
			  method: 'POST',
        data:payload,
			  onSuccess: (data) => {
          fetchData();
			    },
			  onError: (error) => {
				  ShowToast(error, Severty.ERROR);
			  },
		});

    }
  
    useEffect(() => {
      setLoading(true);
      fetchData();
    }, [refresh, debouncedSearchText, params.type]);
  
    const fetchData = () => {
		setLoading(true);
		request({
			url: apiPath.getUtr,
			method: 'GET',
			onSuccess: (data) => {
				console.log("datadata=========>>>>>>>",data)
				setLoading(false);
				setList(data?.data?.data);
			},
			onError: (error) => {
				ShowToast(error, Severty.ERROR);
			},
		});
	};
  
    const handleChange = (pagination, filters) => {
      fetchData(pagination, filters);
    };
  
    const onSearch = (e) => {
      setSearchText(e.target.value);
      setPagination({ current: 1 });
    };
  
    return (
      <>
        <div className="tabled">
          <Row gutter={[24, 0]}>
            <Col xs="24" xl={24}>
              <Card
                bordered={false}
                className="cap criclebox tablespace mb-24"
                title={sectionName}
                extra={
                  <>
                    {/* <Search
                      size="large"
                      onChange={onSearch}
                      value={searchText}
                      onPressEnter={onSearch}
                      placeholder={`Search By ${params.type} Name`}
                    /> */}
                    {list?.length == 0 && <Button
                      className={"cap"}
                      onClick={(e) => {
                        setVisible(true);
                        setSearchText("");
                      }}
                    >
                      Add UTR
                    </Button>}
                  </>
                }
              >
                <div className="total-record-cls">
                  <h4 className="text-right">
                    {pagination.total
                      ? ShowTotal(pagination.total)
                      : ShowTotal(0)}
                  </h4>
                </div>
                <div className="table-responsive customPagination">
                  <Table
                    loading={loading}
                    columns={columns}
                    dataSource={list}
                    pagination={{
                      defaultPageSize: 10,
                      responsive: true,
                      total: pagination.total,
                      showSizeChanger: true,
                      showQuickJumper: true,
                      pageSizeOptions: ["10", "20", "30", "50"],
                    }}
                    onChange={handleChange}
                    className="ant-border-space"
                  />
                </div>
              </Card>
            </Col>
          </Row>
        </div>
  
        {visible && (
          <AddFrom
            section={sectionName}
            api={api}
            show={visible}
            hide={() => {
              setSelected();
              setVisible(false);
            }}
            data={selected}
            type={params.type}
            refresh={() => setRefresh((prev) => !prev)}
          />
        )}
      </>
    );
  }
  
  const AddFrom = ({ section, api, show, hide,data, type, refresh }) => {
    const [form] = Form.useForm();
    const { request } = useRequest();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
		if (!data) return;
		form.setFieldsValue({ ...data });
	}, [data]);

    const onCreate = (values) => {
      const {  key,url } = values;
      const payload = {};
      setLoading(true);
    //   payload.date = date;
      payload.url = url;
      payload.key = key;
      if(data){
        payload._id = data._id;
      }
  
      request({
        url: apiPath.addEditUtr,
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
        width={400}
        title={"Add Channel"}
        okText="Ok"
        onCancel={hide}
        okButtonProps={{
          form: "create",
          htmlType: "submit",
          loading: loading,
        }}
      >
        <Form id="create" form={form} onFinish={onCreate} layout="vertical">
          <Row>
            
            <Col span={24}>
              <Form.Item
                label={`Url`}
                name="url"
                rules={[
                  { required: true, message: "Please enter the url!" },
                  {
                    min: 2,
                    message: "url should contain atleast 2 characters!",
                  },
                ]}
              >
                <Input
                  autoComplete="off"
                  placeholder={`Enter Url`}
                  className="cap"
                />
              </Form.Item>
            </Col>
  
  
            <Col span={24}>
            <Form.Item
                label={`Key`}
                name="key"
                rules={[
                  { required: true, message: "Please enter the key!" },
                  {
                    min: 2,
                    message: "Key should contain more than 2 characters!",
                  },
                ]}
              >
                <Input
                  autoComplete="off"
                  placeholder={`Enter Key`}
                  className="cap"
                />
              </Form.Item>
            </Col>
            {/* <Col span={24}>
              <Form.Item
                label={`Date`}
                name="date"
                rules={[
                  { required: true, message: "Please enter the date!" },
                ]}
              >
                <Input
                  autoComplete="off"
                  placeholder={`Enter Date`}
                  className="cap"
                  type="date"
                />
              </Form.Item>
            </Col> */}
          </Row>
        </Form>
      </Modal>
    );
  };
  export default UTR;
  