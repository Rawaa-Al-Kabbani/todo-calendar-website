import React, { useState, useEffect, Fragment } from "react";
import { useParams } from "react-router-dom";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";

function TasksForList(props) {
  const [myTodos, setMyTodos] = useState([]);
  let { listid } = useParams();
  const getTodosByListId = async () => {
    const response = await fetch("/getTodosByListId", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ listid: listid }),
    });
    const json = await response.json();
    setMyTodos(json);
  };
  useEffect(() => {
    const fetchData = async () => {
      await getTodosByListId();
    };
    fetchData();
  }, []);

  return (
    <Fragment>
      <FullCalendar
        defaultView={props.calendarView}
        events={myTodos}
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
      />
    </Fragment>
  );
}

export default TasksForList;
