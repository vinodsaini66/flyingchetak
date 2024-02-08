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

function Index() {
  const sectionName = "Category";
  const routeName = "category";

  const api = {
    status: apiPath.statusCategory,
    addEdit: apiPath.addEditCategory,
    list: apiPath.listCategory,
    status: apiPath.statusCategory,
  };

  const params = useParams();
  const [searchText, setSearchText] = useState("");
  const { request } = useRequest();
  const { showConfirm } = ConfirmationBox();
  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [visible, setVisible] = useState(false);
  const [selected, setSelected] = useState();
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });

  const [list, setList] = useState([]);

  const debouncedSearchText = useDebounce(searchText, 300);

  const columns = [
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      render: (_, { image }) => (
        <Image width={50} src={image ? image : notfound} />
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (_, { name }) => {
        return name ? <span className="cap">{name}</span> : "-";
      },
    },
    {
      title: "Featured",
      key: "is_featured",
      render: (_, { is_featured }) => {
        return is_featured ? (
          <Tag color="blue" className="cap">
            Featured
          </Tag>
        ) : (
          "-"
        );
      },
    },
    {
      title: "Status",
      key: "is_active",
      filters: [
        {
          text: "Active",
          value: true,
        },
        {
          text: "Inactive",
          value: false,
        },
      ],
      render: (_, { is_active, _id }) => {
        let color = is_active ? "green" : "red";
        return (
          <a>
            <Tag
              onClick={(e) =>
                showConfirm({
                  record: _id,
                  path: api.status,
                  onLoading: () => setLoading(true),
                  onSuccess: () => setRefresh((prev) => !prev),
                })
              }
              color={color}
              key={is_active}
            >
              {is_active ? "Active" : "Inactive"}
            </Tag>
          </a>
        );
      },
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
          </>
        );
      },
    },
  ];

  useEffect(() => {
    setLoading(true);
    fetchData(pagination);
  }, [refresh, debouncedSearchText, params.type]);

  const fetchData = (pagination, filters) => {
    const filterActive = filters ? filters.is_active : null;

    request({
      url:
        api.list +
        `/${params.type}/` +
        `?status=${filterActive ? filterActive.join(",") : ""}&page=${
          pagination ? pagination.current : 1
        }&limit=${
          pagination ? pagination.pageSize : 10
        }&search=${debouncedSearchText}`,
      method: "GET",
      onSuccess: (data) => {
        setLoading(false);
        setList(data.data.list.docs);
        setPagination((prev) => ({
          current: pagination.current,
          total: data.data.list.totalDocs,
        }));
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
              title={params.type + " " + sectionName}
              extra={
                <>
                  <Search
                    size="large"
                    onChange={onSearch}
                    value={searchText}
                    onPressEnter={onSearch}
                    placeholder={`Search By ${params.type} Name`}
                  />
                  <Button
                    className={"cap"}
                    onClick={(e) => {
                      setVisible(true);
                      setSearchText("");
                    }}
                  >
                    Add {params.type} Category
                  </Button>
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
          type={params.type}
          data={selected}
          refresh={() => setRefresh((prev) => !prev)}
        />
      )}
    </>
  );
}

const AddFrom = ({ section, api, show, hide, type, data, refresh }) => {
  const [form] = Form.useForm();
  const { request } = useRequest();
  const [file, setFile] = useState([]);
  const [image, setImage] = useState([]);
  const [loading, setLoading] = useState(false);
  const FileType = [
    "image/png",
    "image/jpg",
    "image/jpeg",
    "image/avif",
    "image/webp",
    "image/gif",
  ];

  const handleImage = (imgURL) => {
    if (imgURL && imgURL.length > 0) {
      setFile(imgURL);
    } else {
      setFile([]);
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

  const onCreate = (values) => {
    const { name, featured } = values;
    const payload = {};
    setLoading(true);
    payload.name = name;
    payload.type = type;
    payload.image = file && file.length > 0 ? file[0].url : "";

    if (featured === true || featured === false) {
      payload.is_featured = featured;
    } else {
      payload.is_featured = false;
    }

    request({
      url: `${data ? api.addEdit + "/" + data._id : api.addEdit}`,
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
      width={800}
      title={`${data ? "Update " + section : "Create a New " + section}`}
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
              label={`Name`}
              name="name"
              rules={[
                { required: true, message: "Please enter the name!" },
                {
                  max: 50,
                  message: "Name should not contain more then 50 characters!",
                },
                {
                  min: 2,
                  message: "Name should contain atleast 2 characters!",
                },
              ]}
            >
              <Input
                autoComplete="off"
                placeholder={`Enter Name`}
                className="cap"
              />
            </Form.Item>
          </Col>

          <Col span={24} className="verticalCustomSelect">
            <Form.Item name="featured" valuePropName="checked">
              <Checkbox defaultChecked={data?.is_featured ? true : false}>
                Featured
              </Checkbox>
            </Form.Item>
          </Col>

          <Col span={24}>
            <Form.Item
              label="Upload Image"
              name="image"
              rules={[
                {
                  validator: () => {
                    if (file !== undefined && file?.length > 0) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error("Image is required"));
                  },
                },
              ]}
            >
              <SingleImageUpload
                fileType={FileType}
                imageType={"brand"}
                btnName={"Image"}
                onChange={(data) => handleImage(data)}
              />
              <div className="mt-2">
                {" "}
                <Image
                  width={120}
                  src={
                    file && file.length > 0 && file !== "" && file[0].url
                      ? file[0].url
                      : notfound
                  }
                ></Image>{" "}
              </div>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default Index;
