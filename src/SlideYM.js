import React, { Component } from "react";
class SlideYM extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nowYM: this.props.now
    };
  }
  styleYM = item => {
    let year = item.slice(0, 4);
    let month = parseInt(item.slice(4, 6));
    return year + " " + month + "月";
  };

  changeYM = e => {
    let time = e.currentTarget.dataset.time;
    this.setState(
      () => ({
        nowYM: time
      }),
      () => {
        this.props.method(this.state.nowYM);
      }
    );
  };
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.now !== this.props.now) {
      this.setState({
        nowYM: this.props.now
      });
    }

    const range = this.props.range;
    const now = this.state.nowYM;
    let space = range.indexOf(now); //算出 now在range裡面第幾個
    let move = (space - 1) * -100;
    let maxMove = (range.length - 3) * -100;
    if (move < maxMove) {
      move = maxMove;
    }
    if (move > 0) {
      move = 0;
    }

    let months = document.querySelectorAll(".month");
    months.forEach(month => {
      month.classList.remove("now");
      let lastTrans = month.classList[1] || "";
      if (lastTrans) {
        month.classList.remove(lastTrans);
      }
      month.classList.add(`move_${move}`);
    });
    months[space].classList.add("now");
  }

  render() {
    const { range } = this.props;

    return (
      <div className="calBar">
        <a className="prev on" onClick={this.props.prev}></a>
        <div className="showYM">
          {range.map(item => (
            <div
              className="month"
              key={item}
              onClick={this.changeYM}
              data-time={item}
            >
              <span>{this.styleYM(item)}</span>
            </div>
          ))}
        </div>
        <a className="next on" onClick={this.props.next}></a>
      </div>
    );
  }
}
export default SlideYM;
