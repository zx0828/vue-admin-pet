// 第一个代理后端地址
export const baseUrlApi = (url: String) => `/api/${url}`;

//获取当前日期
export const getTodayDate = (offset = 0) => {
  const today = new Date();
  today.setDate(today.getDate() + offset); // 减去1天以获取昨天的日期
  return `${today.getFullYear()}-${("0" + (today.getMonth() + 1)).slice(-2)}-${("0" + today.getDate()).slice(-2)}`;
};
