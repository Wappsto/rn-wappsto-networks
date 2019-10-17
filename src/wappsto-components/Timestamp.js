import React, {Component} from 'react';

export default class Timestamp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      refresh: 0,
    };
  }
  componentWillUnmount() {
    clearTimeout(this.timestampTimeout);
  }
  fromNow(timestamp) {
    clearTimeout(this.timestampTimeout);
    let current = Date.now();
    let previous = new Date(timestamp);
    previous = previous.getTime();

    let msPerMinute = 60 * 1000;
    let msPerHour = msPerMinute * 60;
    let msPerDay = msPerHour * 24;
    let msPerMonth = msPerDay * 30;
    let msPerYear = msPerDay * 365;

    let elapsed = current - previous;

    if (elapsed < msPerMinute) {
      this.timestampTimeout = setTimeout(() => {
        this.setState((props, state) => {
          return {
            refresh: state.refresh + 1,
          };
        });
      }, 1000);
      return Math.round(elapsed / 1000) + ' seconds ago';
    } else if (elapsed < msPerHour) {
      this.timestampTimeout = setTimeout(() => {
        this.setState((props, state) => {
          return {
            refresh: state.refresh + 1,
          };
        });
      }, 1000 * 60);
      return Math.round(elapsed / msPerMinute) + ' minutes ago';
    } else if (elapsed < msPerDay) {
      return Math.round(elapsed / msPerHour) + ' hours ago';
    } else if (elapsed < msPerMonth) {
      return Math.round(elapsed / msPerDay) + ' days ago';
    } else if (elapsed < msPerYear) {
      return Math.round(elapsed / msPerMonth) + ' months ago';
    } else {
      return Math.round(elapsed / msPerYear) + ' years ago';
    }
  }
}
