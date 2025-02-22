import { headers } from "next/headers";
import { request } from "./request";

export const getOtp = (data: any) => {
  return request({
    url: "/user/getLogiOtp",
    method: "POST",
    data,
  });
};

export const login = (data: any) => {
  return request({
    url: "/user/login",
    method: "POST",
    data,
    headers: {
      noAu: false,
    },
  });
};

export const register = (data: any) => {
  return request({
    url: "/user/register",
    method: "POST",
    data,
    headers: {
      noAu: false,
    },
  });
};

export const getInfo = () => {
  return request({
    url: "/user/userInfo",
    method: "GET",
  });
};

export const logOut = () => {
  return request({
    url: "/user/logout",
    method: "POST",
  });
};
