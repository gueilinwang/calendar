import React from "react";
import ReactDOM from "react-dom";
import Calendar from "./Calendar";

const setting = {
  dataSource: "http://localhost:3004/clientData",
  initYearMonth: "201812"
};
const dataKey = {
  // 保證出團
  guaranteed: "certain",
  // 狀態
  status: "state",
  // 可賣團位
  available: "onsell",
  // 團位
  total: "total",
  // 價格
  price: "price"
};
Window.Calendar = ReactDOM.render(
  <Calendar set={setting} dataKey={dataKey} />,
  document.getElementById("root")
);
