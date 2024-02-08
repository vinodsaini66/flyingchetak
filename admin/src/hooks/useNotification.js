import { useState } from "react";

import apiPath from "../constants/apiPath";
import useRequest from "./useRequest";
import { Severty, ShowToast } from "../helper/toast";

const useNotification = () => {
  const api = {
    notificationList: apiPath.recentNotifications,
    notificationDelete: apiPath.deleteActivityNotification,
    notificationRead: apiPath.readNotification,
    notificationUnread: apiPath.unreadNotification,
  };
  const { request } = useRequest();

  const [recentActivityNotifications, setRecentActivityNotifications] =
    useState([]);

  const fetchRecentActivityNotifications = () => {
    request({
      url: api.notificationList,
      method: "GET",
      onSuccess: (data) => {
        if (data.status) {
          setRecentActivityNotifications(data.data.list);
        }
      },
      onError: (error) => {},
    });
  };

  const deleteNotification = (id) => {
    let url;
    if (!!id) {
      url = api.notificationDelete + "/" + "one" + "/" + id;
    } else {
      url = api.notificationDelete + "/" + "all";
    }
    request({
      url: url,
      method: "POST",
      onSuccess: (data) => {
        if (data.status) {
          ShowToast(data.message, Severty.SUCCESS);
          fetchRecentActivityNotifications();
        } else {
          ShowToast(data.message, Severty.ERROR);
        }
      },
    });
  };

  const readNotification = (id) => {
    let url;
    if (!!id) {
      url = api.notificationRead + "/" + "one" + "/" + id;
    } else {
      url = api.notificationRead + "/" + "all";
    }
    request({
      url: url,
      method: "POST",
      onSuccess: (data) => {
        if (data.status) {
          ShowToast(data.message, Severty.SUCCESS);
          fetchRecentActivityNotifications();
        } else {
          ShowToast(data.message, Severty.ERROR);
        }
      },
    });
  };

  const unreadNotification = (id) => {
    let url;
    if (!!id) {
      url = api.notificationUnread + "/" + "one" + "/" + id;
    } else {
      url = api.notificationUnread + "/" + "all";
    }
    request({
      url: url,
      method: "POST",
      onSuccess: (data) => {
        if (data.status) {
          ShowToast(data.message, Severty.SUCCESS);
          fetchRecentActivityNotifications();
        } else {
          ShowToast(data.message, Severty.ERROR);
        }
      },
    });
  };

  return {
    recentActivityNotifications,
    fetchRecentActivityNotifications,
    deleteNotification,
    readNotification,
    unreadNotification,
  };
};

export default useNotification;
