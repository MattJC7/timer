import { React, useState, useRef } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faArrowUp, 
  faArrowDown, 
  faPlay, 
  faPause, 
  faArrowsRotate } from "@fortawesome/free-solid-svg-icons";
import "./styles.css"

export default function App () {

  const [defaultTime, setDefaultTime] = useState({
    break: 5,
    session: 25,
  })

  const timeRef = useRef();
  timeRef.current = defaultTime;

  const [timeRemaining, setTimeRemaining] = useState({
    sessionTime: defaultTime.session * 60,
    breakTime: defaultTime.break * 60
  })

  if(defaultTime.session < 1){
  setDefaultTime(prevState => ({
    ...prevState,
    session: 1
  }))
  }

  const stateRef = useRef();
  stateRef.current = timeRemaining;

  const [currentSession, setCurrentSession] = useState("Session")

  const sessionRef = useRef();
  sessionRef.current = currentSession

  const [intervalSetting, setIntervalSetting] = useState(null)

  let minutesRemainingSession = Math.floor(timeRemaining.sessionTime/60)
  let minutesRemainingDigitsSession = minutesRemainingSession > 9 ? minutesRemainingSession : "0" + minutesRemainingSession
  let secondsRemainingSession = timeRemaining.sessionTime % 60
  let secondsRemainingDigitsSession = secondsRemainingSession > 9 ? secondsRemainingSession : "0" + secondsRemainingSession

  let minutesRemainingBreak = Math.floor(timeRemaining.breakTime/60)
  let minutesRemainingDigitsBreak = minutesRemainingBreak > 9 ? minutesRemainingBreak : "0" + minutesRemainingBreak
  let secondsRemainingBreak = timeRemaining.breakTime % 60
  let secondsRemainingDigitsBreak = secondsRemainingBreak > 9 ? secondsRemainingBreak : "0" + secondsRemainingBreak


  function handleSettings (event) {
    const id = event.target.id

    if(timeRef.current.break > 1){
      if(id == "break-decrement"){
        setDefaultTime(prevState => ({
            ...prevState,
            break: prevState.break - 1
        }));
        setTimeRemaining(prevState => ({
          ...prevState,
          breakTime: prevState.breakTime - 60
        }))
      }}
      if(timeRef.current.session > 1){
        if(id == "session-decrement"){
          setDefaultTime(prevState => ({
            ...prevState,
            session: prevState.session - 1
          }))
          setTimeRemaining(prevState => ({
            ...prevState,
            sessionTime: prevState.sessionTime-60
          }))
      }
    }

    if(timeRef.current.break < 60){
      if(id == "break-increment"){
        setDefaultTime(prevState => ({
            ...prevState,
            break: prevState.break + 1
        }));
        setTimeRemaining(prevState => ({
          ...prevState,
          breakTime: prevState.breakTime + 60
        }))
      }}
    if(timeRef.current.session < 60){
      if(id == "session-increment"){
        setDefaultTime(prevState => ({
          ...prevState,
          session: prevState.session + 1
        }));
        setTimeRemaining(prevState => ({
          ...prevState,
          sessionTime: prevState.sessionTime + 60
        }))
      }
    }
  }

  function handleTimerStart () {

    if(!intervalSetting) {
      setIntervalSetting(setInterval(startTimer, 1000))
    }else {
      clearInterval(intervalSetting)
      setIntervalSetting(null)
    }

  }

  function startTimer () {

    if(stateRef.current.sessionTime > 0){
      setCurrentSession("Session")
      setTimeRemaining(prevState => ({
        ...prevState,
        sessionTime: prevState.sessionTime - 1
      }));

    }else { 
      setCurrentSession("Break");
      playSound();
    }

    if(sessionRef.current == "Break"){
      setTimeRemaining(prevState => ({
        ...prevState,
        breakTime: prevState.breakTime - 1
      }))
    }
    
    if (stateRef.current.breakTime == 0){
      playSound();
      setCurrentSession("Session");
      setTimeRemaining(prevState => ({
        ...prevState,
        sessionTime: defaultTime.session * 60,
        breakTime: defaultTime.break * 60
      }))
    }
  }


  function handleReset () {
      document.getElementById("beep").pause();
      document.getElementById("beep").load();
      setCurrentSession("Session")
      clearInterval(intervalSetting);
      setIntervalSetting(null);

      setDefaultTime(prevState => ({
        ...prevState,
        break: 5,
        session: 25
      }));

      setTimeRemaining(prevState => ({
        sessionTime: 25 * 60,
        breakTime: 5 * 60
      }))
  }
  
  function playSound () {
    document.getElementById("beep").play();
  }

  return (
    <div className="clock-wrapper">
      <h1>25 + 5 Clock</h1>

      <div className="clock-settings-wrapper">

          <div className="break-settings-wrapper">
            <h2 id="break-label">Break Length</h2>
            <div className="break-buttons-wrapper">
              <button onClick={handleSettings} id="break-decrement">
                <FontAwesomeIcon icon={faArrowDown} className="icons" />
              </button>
              <h3 id="break-length">{defaultTime.break}</h3>
              <button onClick={handleSettings} id="break-increment">
                <FontAwesomeIcon icon={faArrowUp} className="icons"/>
              </button>
            </div>
          </div>

          <div className="session-settings-wrapper">
            <h2 id="session-label">Session Length</h2>
            <div className="session-buttons-wrapper">
              <button onClick={handleSettings} id="session-decrement">
                <FontAwesomeIcon icon={faArrowDown} className="icons"/>
              </button>
              <h3 id="session-length">{defaultTime.session}</h3>
              <button onClick={handleSettings} id="session-increment">
                <FontAwesomeIcon icon={faArrowUp} className="icons"/>
              </button>
            </div>
          </div>
      </div>

      <div className="clock-body-wrapper">
        <h2 id="timer-label">{currentSession}</h2>
        <h3 id="time-left">
          {currentSession == "Session" ? 
          `${minutesRemainingDigitsSession}:${secondsRemainingDigitsSession}` : 
          `${minutesRemainingDigitsBreak}:${secondsRemainingDigitsBreak}`}
        </h3>
      </div>

      <div className="clock-buttons-wrapper">
        <div id="start_stop" onClick={handleTimerStart}>
          <FontAwesomeIcon icon={faPlay} />
          <FontAwesomeIcon icon={faPause} />
        </div>
        <div id="reset" onClick={handleReset}>
          <FontAwesomeIcon icon={faArrowsRotate} />
        </div>
      </div>
    </div>
  )
}