import moment from "moment";
import Delete from "../assets/images/delete.svg";
import notification from "../assets/images/icon/notification.svg";

const RecentNotificationItem = ({ item, deleteNotification }) => {
  return (
    <div className="notification-inner">
      <div className="notification-img">
        <img src={notification} />
      </div>
      <div className="notification-cont">
        <div className="notification-left">
          <h4> {item.title} </h4>
          <p> {item.description} </p>
          <small>
            {" "}
            {item.created_at
              ? moment(item.created_at).format("DD-MM-YYYY")
              : ""}{" "}
          </small>
        </div>

        <div className="notification-right">
          <a onClick={(e) => deleteNotification(item._id)}>
            <img src={Delete} />
          </a>
        </div>
      </div>
    </div>
  );
};

export default RecentNotificationItem;
