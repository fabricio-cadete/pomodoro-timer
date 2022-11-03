import React, { useState, useEffect, useRef } from "react";
import About from "../components/About";
import Alarm from "../components/Alarm";
import Navigation from "../components/Navigation";
import Timer from "../components/Timer";
import ModalSetting from "../components/ModalSetting";

export default function Home() {
  const [pomodoro, setPomodoro] = useState(25);
  const [shortBreak, setShortBreak] = useState(5);
  const [longBreak, setLongBreak] = useState(15);
  const [seconds, setSeconds] = useState(0);
  const [ticking, setTicking] = useState(false);
  const [consumedSeconds, setConsumedSeconds] = useState(0);
  const [stage, setStage] = useState(0);
  const [isTimeup, setIsTimeUp] = useState(false);
  const [openSetting, setOpenSetting] = useState(false);

  const alarmRef = useRef();
  const pomodoroRef = useRef();
  const shortBreakRef = useRef();
  const longBreakRef = useRef();

  const updateTimeDefaultValue = () => {
      setPomodoro(pomodoroRef.current.value);
      setShortBreak(shortBreakRef.current.value);
      setLongBreak(longBreakRef.current.value);
      setOpenSetting(false);
      setSeconds(0);
      setConsumedSeconds(0);
  };

  const switchStage = (index) => {
    const isYes = consumedSeconds && stage !== index ? confirm("Você tem certeza que quer cancelar a contagem atual?"): false;

    if (isYes) {
      reset();
      setStage(index);
    } else if (!consumedSeconds) {
      setStage(index);
    }

  };

  const getTickingTime = () => {
    const timeStage = {
      0: pomodoro,
      1: shortBreak,
      2: longBreak,
    };

    return timeStage[stage];
  };

  const updateMinute = () => {
    const updateStage = {
      0: setPomodoro,
      1: setShortBreak,
      2: setLongBreak,
    };

    return updateStage[stage];
  };

  const reset = () => {
    setConsumedSeconds(0);
    setTicking(false);
    setSeconds(0);
    setPomodoro(25);
    setShortBreak(5);
    setLongBreak(15);
  }

  const timeUp = () => {
    reset();
    setIsTimeUp(true);
    alarmRef.current.play();
  }

  const clockTicking = () => {
    const minutes = getTickingTime();
    const setMinutes = updateMinute();

    if (minutes === 0 && seconds === 0) {
      timeUp();
    } else if (seconds === 0) {
      setMinutes((minutes) => minutes - 1);
      setSeconds(59);
    } else {
      setSeconds((second) => second - 1);
    }
  };

  const muteAlarm = () => {
    alarmRef.current.pause();
    alarmRef.current.currentTime = 0;
  }

  const startTimer = () => {
    setIsTimeUp(false);
    muteAlarm();
    setTicking((ticking) => !ticking);
  }

  useEffect(() => {
    window.onbeforeunload = () => {
      return consumedSeconds ? "Show Warning" : null;
    }

    const timer = setInterval(() => {
      if (ticking) {
        setConsumedSeconds((value) => value + 1);
        clockTicking();
      }
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [seconds, pomodoro, shortBreak, longBreak, ticking]);

  return (
    <div className="bg-gray-900 min-h-screen font-inter">
      <div className="max-w-2xl min-h-screen mx-auto">
          <Navigation setOpenSetting={setOpenSetting} />
        <Timer
          stage={stage}
          switchStage={switchStage}
          getTickingTime={getTickingTime}
          seconds={seconds}
          ticking={ticking}
          startTimer={startTimer}
          muteAlarm={muteAlarm}
          isTimeUp={isTimeup}
          reset={reset}
        />
        <About />
        <Alarm ref={alarmRef} />
          <ModalSetting
              openSetting={openSetting}
              setOpenSetting={setOpenSetting}
              pomodoroRef={pomodoroRef}
              shortBreakRef={shortBreakRef}
              longBreakRef={longBreakRef}
              updateTimeDefaultValue={updateTimeDefaultValue}
          />
      </div>
    </div>
  );
}
