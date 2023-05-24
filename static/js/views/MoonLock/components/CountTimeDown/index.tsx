/* eslint-disable */
import moment from "moment";
import React, { useState, useEffect } from "react";

/*
endTime: 目标时间，格式为时间戳
endTimeUp: 倒计时结束的回调
*/
interface IProps {
  endTime: any;
  endTimeUp?: () => void;
}

const CountTimeDown = (props: IProps) => {
  let { endTime } = props;
  endTime = moment(endTime).format("YYYY-MM-DD HH:mm:ss")
  const { endTimeUp } = props;
  const [day, setDay] = useState<string | number>(0);
  const [hour, setHour] = useState<string | number>(0);
  const [minute, setMinute] = useState<string | number>(0);
  const [second, setSecond] = useState<string | number>(0);

  useEffect(() => {
    const isIPhone = new RegExp("\\biPhone\\b|\\biPod\\b", "i").test(
      window.navigator.userAgent
    );
    if (isIPhone) {
      endTime = endTime.replace(/-/g, "/");
    }
  }, []);

  useEffect(() => {
    let sysSecond = new Date(endTime).getTime() - new Date().getTime();
    const timerId = setInterval(() => {
      //防止倒计时出现负数
      if (sysSecond > 1000) {
        sysSecond -= 1000;
        const day = Math.floor(sysSecond / 1000 / 3600 / 24);
        const hour = Math.floor((sysSecond / 1000 / 3600) % 24);
        const minute = Math.floor((sysSecond / 1000 / 60) % 60);
        const second = Math.floor((sysSecond / 1000) % 60);
        setDay(day);
        setHour(hour < 10 ? `0${hour}` : hour);
        setMinute(minute < 10 ? `0${minute}` : minute);
        setSecond(second < 10 ? `0${second}` : second);
      } else {
        clearInterval(timerId);
        //倒计时结束时触发方法
        setDay('00');
        setHour('00');
        setMinute('00');
        setSecond('00');
        if (endTimeUp) endTimeUp();
      }
    }, 1000);
    return () => {
      //返回一个回调函数用来清除定时器
      clearInterval(timerId);
    };
  }, [endTime]);

  return (
    <>
      {!day && !hour && !minute && !second ? null : (
        <span className="count-down">
          <span className="red">{day}</span>
          <span className="time">:</span>
          <span className="red">{hour}</span>
          <span className="time">:</span>
          <span className="red">{minute}</span>
          <span className="time">:</span>
          <span className="red">{second}</span>
          <span className="time"></span>
        </span>
      )}
    </>
  );
};
export default CountTimeDown;
