import axios from "axios";
import {baseURL, apiPath} from "../constant/ApiRoutes";

const client = axios.create({
  baseURL: baseURL,
});
// const baseURL=""

interface RequestParams {
  url: string;
  method: string;
  data?: any;
  onSuccess?: (response: any) => void;
  onError?: (error: any) => void;
  header?: Record<string, string>;
  onErrorSubmit?: (error: any) => void;
}

const useRequest = () => {
  const request = async ({
    url,
    method: tmethod,
    data,
    onSuccess,
    onError,
    header,
    onErrorSubmit,
  }:RequestParams) => {
    const method = tmethod.trim().toUpperCase();
    let token = localStorage.getItem("token")
      ? localStorage.getItem("token")
      : "";
    const headers = {
      ...header,
      Authorization: `Bearer ${token}`,
    };

    try {
      const response = await client({
        url,
        method,
        data,
        headers: { ...headers },
      });
      
      if (onSuccess) {
        onSuccess(response.data);
      } else {
        // onErrorSubmit(response.data);
      }
      return response.data;
    } catch (err:any) {
      console.log("object",err);
      if (err.response.status === 401) {
        // logout();
      }
      if (err.response.data.message === "jwt expired") {
        // logout();
      }
      if (onError) {
        onError(err);
      }
      // throw err;
    }
  };

  return { request };
};

export default useRequest;
