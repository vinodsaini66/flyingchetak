import {
  Card,
  Col,
  DatePicker,
  Input,
  Row,
  Table,
  Tabs,
  Tag,
  Button,
  Tooltip,
} from "antd";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";

import ShowTotal from "../../components/ShowTotal";
import { REFUND_STATUS } from "../../constants";
import apiPath from "../../constants/apiPath";
import { Severty, ShowToast } from "../../helper/toast";
import useDebounce from "../../hooks/useDebounce";
import useRequest from "../../hooks/useRequest";
// import WithdrawalStatus from "./_changeStatus";

const Search = Input.Search;
const { TabPane } = Tabs;

function Refund() {
  const sectionName = "Refund";
  const routeName = "refund";

  const api = {
    list: apiPath.refundList,
    statusChange: apiPath.refundStatusChange,
  };

  const [searchText, setSearchText] = useState("");
  const { request } = useRequest();
  const [list, setList] = useState([]);

  const [loading, setLoading] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const debouncedSearchText = useDebounce(searchText, 300);
  const navigate = useNavigate();
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [requestId, setRequestId] = useState();
  const [requestStatus, setRequestStatus] = useState();
  const [requestShow, setRequestShow] = useState();

  const [statusRefresh, setStatusRefresh] = useState(false);
  const { RangePicker } = DatePicker;

  const view = (id) => {
    navigate(`/refund/view/${id}`);
  };

  const columns = [
    {
      title: "Id",
      render: (_, { _id }) => {
        return _id;
      },
    },
    {
      title: "Name",
      render: (_, { customer }) => {
        return customer ? (
          <Link
            target='_blank'
            rel='noreferrer noopener'
            className='cap'
            to={`/user/customer/view/${customer._id}`}
          >
            {customer && customer.name ? customer.name : "-"}
          </Link>
        ) : (
          "-"
        );
      },
    },
    {
      title: "Amount (USD)",
      dataIndex: "amount",
      key: "amount",
      render: (_, { amount }) => {
        return amount ? <span className='cap'>{amount}</span> : "-";
      },
    },
    {
      title: "Refund For",
      dataIndex: "refund_for",
      key: "refund_for",
      render: (_, { refund_for }) => {
        return refund_for ? <span className='cap'>{refund_for}</span> : "-";
      },
    },
    {
      title: "Transaction Id",
      dataIndex: "transaction_id",
      key: "transaction_id",
      render: (_, { transaction }) => {
        return transaction && transaction.transaction_id ? (
          <span className='cap'>{transaction?.transaction_id}</span>
        ) : (
          "-"
        );
      },
    },
    {
      title: "Status",
      key: "status",
      render: (_, { status, _id }) => {
        let color =
          status === "approved"
            ? "green"
            : status === "rejected"
            ? "red"
            : "yellow";
        return (
          <Tag
            color={color}
            key={status}
            // onClick={() => onClickStatusChange(_id, status)}
          >
            {status === REFUND_STATUS.pending
              ? "Pending"
              : status === REFUND_STATUS.approved
              ? "Approved"
              : "Rejected"}
          </Tag>
        );
      },
    },

    {
      title: "Requested On",
      key: "created_at",
      dataIndex: "created_at",
      render: (_, { created_at }) => {
        return moment(created_at).format("MM-DD-YYYY");
      },
    },

    {
      title: "Action",
      fixed: "right",
      render: (_, { _id, status }) => {
        return (
          <>
            {status == "pending" && (
              <>
                <Tooltip title={"Accept"} color='green' key='acceptRefund'>
                  <Button
                    title='Accept'
                    onClick={(e) => {
                      changeStatus(_id, REFUND_STATUS.approved);
                    }}
                  >
                    <i className='fa fa-check'></i>
                  </Button>
                </Tooltip>
                <Tooltip title='Reject' color='red' key='rejectRefund'>
                  <Button
                    title='Reject'
                    onClick={(e) => {
                      changeStatus(_id, REFUND_STATUS.reject);
                    }}
                  >
                    <i className='fa fa-times'></i>
                  </Button>
                </Tooltip>
              </>
            )}
          </>
        );
      },
    },
  ];

  const changeStatus = (id, status) => {
    request({
      url: api.statusChange + "/" + id + "/" + status,
      method: "POST",
      onSuccess: ({ message }) => {
        if (!status) return;
        ShowToast(message, Severty.SUCCESS);
        fetchData(pagination);
      },
      onError: ({ error }) => {
        ShowToast(error, Severty.ERROR);
      },
    });
  };

  const handleTabChange = (status) => {
    fetchData(pagination, "", status);
  };

  const fetchData = (pagination, filters, orderStatus) => {
    const filterPaymentMethod = filters ? filters.payment_method : null;
    const paymentDoneFilter = filters ? filters.paid : null;
    setLoading(true);
    request({
      url: api.list,
      method: "GET",
      onSuccess: ({ data, status, message }) => {
        if (!status) return;
        setList(data.list.docs);
        setPagination((prev) => ({
          current: pagination.current,
          total: data.total,
        }));
        setLoading(false);
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

  useEffect(() => {
    setLoading(true);
    fetchData(pagination);
  }, [refresh, statusRefresh, debouncedSearchText, startDate, endDate]);

  return (
    <>
      <div className='tabled'>
        <Row gutter={[24, 0]}>
          <Col xs='24' xl={24}>
            <Card
              bordered={false}
              className='criclebox tablespace mb-24'
              title={sectionName + " Management"}
              extra={
                <>
                  <Search
                    size='large'
                    onChange={onSearch}
                    value={searchText}
                    onPressEnter={onSearch}
                    placeholder='Search By User Name'
                  />
                </>
              }
            >
              <div className='total-record-cls'>
                <h4 className='text-right'>
                  {pagination.total
                    ? ShowTotal(pagination.total)
                    : ShowTotal(0)}
                </h4>
              </div>

              <div className='table-responsive customPagination'>
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
                  className='ant-border-space'
                />
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default Refund;
