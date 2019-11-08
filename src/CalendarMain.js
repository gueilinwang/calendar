import React, { Component } from "react";
import moment from "moment/moment.js";
import "moment/locale/zh-tw";
class CalendarMain extends Component {
  constructor(props) {
    super(props);
  }

  createDates = () => {
    let dates = [];
    for (let i = 0; i < 6; i++) {
      dates.push(
        <div className="dates" key={i}>
          {this.createDate(i)}
        </div>
      );
    }
    return dates;
  };
  createDate = i => {
    let date = [];
    for (let j = 0; j < 7; j++) {
      date.push(
        <div
          className="date"
          key={i + "" + j}
          onClick={this.clickHandler}
        ></div>
      );
    }
    return date;
  };
  clickHandler = e => {
    let target = e.currentTarget;
    if (!target.classList.contains("noData")) {
      document.querySelectorAll(".date").forEach(date => {
        date.classList.remove("active");
      });
      target.classList.add("active");
    }
    console.log(target.getAttribute("date"));
  };
  findFirstDate = () => {
    let initDate = this.props.now + "01";
    const date = moment(initDate);
    let day = date.day();
    const calFirst = moment(initDate).subtract(day, "days");
    return calFirst;
  };

  numberFormat = num => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };
  putData = () => {
    let nowMonth = parseInt(this.props.now.slice(4, 6)) - 1; //找出現在月份
    let dates = document.querySelectorAll(".date");
    let reg = /\//g;
    let { guaranteed, status, available, total, price } = this.props.dataKey;
    let dataArr = this.props.data.filter(obj => {
      //找出當月的資料
      return obj.date.replace(reg, "").includes(this.props.now);
    });
    console.log(dataArr);
    dates.forEach((date, index) => {
      date.classList.remove("otherMonth", "thisMonth", "noData", "active");
      date.removeAttribute("date");
      let dataDate = moment(this.findFirstDate().add(index, "days")).format(
        "YYYY/MM/DD"
      );
      if (
        this.findFirstDate() //找出不是當月的日期,標註otherMonth
          .add(index, "days")
          .month() !== nowMonth
      ) {
        date.classList.add("otherMonth", "noData");
      } else {
        date.classList.add("thisMonth");
      }
      if (dataDate === dataArr[0].date) {
        date.classList.add("active");
      }
      date.setAttribute("date", dataDate);
      let selectData = dataArr.filter(obj => {
        return obj.date === dataDate;
      });

      if (selectData.length > 0) {
        date.innerHTML = `
        <span class='num'>${this.findFirstDate()
          .add(index, "days")
          .date()}</span>
        <span class='date_week none'>${this.findFirstDate()
          .locale("zh-tw")
          .add(index, "days")
          .format("dddd")}</span>
        ${
          selectData[0][guaranteed]
            ? '<span class="guaranteed">成團</span>'
            : ""
        }
         
        ${
          selectData[0][status] === "報名" ||
          selectData[0][status] === "後補" ||
          selectData[0][status] === "預定"
            ? `<span class="status green">${selectData[0][status]}</span>`
            : `<span class="status org">${selectData[0][status]}</span>`
        }
          <span class="sell">可賣: ${selectData[0][available]}</span>
          <span class="group">團位: ${selectData[0][total]}</span>
          <span class="price">$${this.numberFormat(selectData[0][price])}</span>
        
        `;
      } else {
        date.classList.add("noData");
        date.innerHTML = `<span class='num'>${this.findFirstDate()
          .add(index, "days")
          .date()}</span>
          <span class='date_week none'>${this.findFirstDate()
            .locale("zh-tw")
            .add(index, "days")
            .format("dddd")}</span>
          `;
      }
    });
    this.props.listHandler();
  };

  componentDidUpdate() {
    this.putData();
  }
  render() {
    return (
      <div className="calendar_main calendarMode">
        <div className="week">
          <div>星期日</div>
          <div>星期一</div>
          <div>星期二</div>
          <div>星期三</div>
          <div>星期四</div>
          <div>星期五</div>
          <div>星期六</div>
        </div>
        <div className="calendar_content">{this.createDates()}</div>
      </div>
    );
  }
}

export default CalendarMain;
