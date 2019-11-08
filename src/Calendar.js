import React, { Component } from "react";
import "./calendar.css";
import CalendarMain from "./CalendarMain";
import SlideYM from "./SlideYM";

class Calendar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      nowYM: this.props.set.initYearMonth,
      rangeYM: []
    };
  }
  nextMonth = () => {
    let length = this.state.rangeYM.length;
    let nowIndex = this.state.rangeYM.indexOf(this.state.nowYM);
    if (nowIndex < length - 1) {
      this.setState(() => ({
        nowYM: this.state.rangeYM[nowIndex + 1]
      }));
    }
  };
  prevMonth = () => {
    let nowIndex = this.state.rangeYM.indexOf(this.state.nowYM);
    if (nowIndex > 0) {
      this.setState({
        nowYM: this.state.rangeYM[nowIndex - 1]
      });
    }
  };

  switchMode = e => {
    let main = document.querySelector(".calendar_main");
    main.classList.toggle("listMode");
    main.classList.toggle("calendarMode");
    this.listModeHandler();
    let mode = document.querySelector(".changeMode");
    if (main.classList.contains("listMode")) {
      mode.innerHTML = `
      <span class="ic">&#128197;</span>
      <span class="text">切換月曆顯示</span>`;
    } else {
      mode.innerHTML = `<span class="ic">&#9776;</span>
      <span class="text">切換列表顯示</span>`;
    }
  };

  listModeHandler = () => {
    let main = document.querySelector(".calendar_main");
    if (main.classList.contains("listMode")) {
      let dates = document.querySelectorAll(".date");
      dates.forEach(date => {
        date.classList.remove("none");
        if (date.classList.contains("noData")) {
          date.classList.add("none");
        }
        let first = date.firstElementChild;
        let sec = first.nextElementSibling;
        first.classList.remove("weekend");
        sec.classList.remove("weekend");
        if (sec.textContent === "星期六" || sec.textContent === "星期日") {
          first.classList.add("weekend");
          sec.classList.add("weekend");
        }
      });
    }
  };
  dataHandler = data => {
    let reg = /\//g;
    let arr = data.sort(function(a, b) {
      let x = a.date.replace(reg, "");
      let y = b.date.replace(reg, "");
      if (x < y) {
        return -1;
      }
      if (x > y) {
        return 1;
      }
      return -1;
    });
    let arr2 = [];
    for (let i = 0; i < arr.length; i++) {
      arr2.push(arr[i].date.replace(reg, "").slice(0, 6));
    }
    const result = Array.from(new Set(arr2)); //篩選出所有資料的總年月
    this.setState(() => ({
      data: arr,
      rangeYM: result
    }));
  };
  inputData = data => {
    let newData = this.state.data;
    data.forEach(obj => {
      newData.push(obj);
    });
    this.dataHandler(newData);
  };
  resetData = data => {
    this.dataHandler(data);
  };
  componentDidMount() {
    let urlRegExp = /\b((http|https):\/\/?)[^\s()<>]+(?:\([\w\d]+\)|([^[:punct:]\s]|\/?))/g;

    if (
      typeof (this.props.set.dataSource === "string") &&
      urlRegExp.test(this.props.set.dataSource)
    ) {
      const req = new Request(this.props.set.dataSource);
      fetch(req)
        .then(res => {
          return res.json();
        })
        .then(result => {
          this.dataHandler(result);
        })
        .catch(err => {
          console.log(err);
        });
    } else {
      this.dataHandler(this.props.set.dataSource);
    }
  }
  changeNow = now => {
    this.setState(() => ({
      nowYM: now
    }));
  };

  render() {
    return (
      <div className="calendarContainer">
        <div className="calendar">
          <SlideYM
            range={this.state.rangeYM}
            now={this.state.nowYM}
            method={this.changeNow}
            next={this.nextMonth}
            prev={this.prevMonth}
          />
          <CalendarMain
            now={this.state.nowYM}
            data={this.state.data}
            listHandler={this.listModeHandler}
            dataKey={this.props.dataKey}
          />
        </div>
        <div className="changeMode" onClick={this.switchMode}>
          <span className="ic">&#9776;</span>
          <span className="text">切換列表顯示</span>
        </div>
      </div>
    );
  }
}

export default Calendar;
