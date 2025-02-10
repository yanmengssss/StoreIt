import { request } from "./request";

export const getTotalData = () => {
  return request({
    url: "/file/getFileOverview",
    method: "GET",
  });
};

export const uploadFiless = (data: any) => {
  const formData = new FormData();
  for (const key in data) {
    formData.append(key, data[key]);
  }
  return request({
    url: "/file/upload",
    method: "POST",
    data: formData, // 这里用 FormData 替代 JSON 发送
    headers: {
      "Content-Type": "multipart/form-data; charset=UTF-8",
      pop: true,
    },
  });
};
//   types = [],
//   searchText = "",
//   sort = "$createdAt-desc",
//   limit,
export const getFiless = (data: any) => {
  return request({
    url: "/file/getFile",
    method: "GET",
    params: data,
  });
};

export const reName = (data: any) => {
  return request({
    url: "/file/renameFile",
    method: "POST",
    data,
  });
};

export const deleteFiless = (data: any) => {
  return request({
    url: "/file/deleteFile",
    method: "DELETE",
    data,
  });
};

export const shareFile = (data: any) => {
  return request({
    url: "/file/shareFile",
    method: "POST",
    data,
  });
};
