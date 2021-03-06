import React, { useState, useEffect, Fragment } from "react";
import { useParams } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import listPlugin from "@fullcalendar/list";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(12),
  },
  title: {
    textAlign: "left",
    flexGrow: 1,
  },
}));

function TasksForCategory(props) {
  const classes = useStyles();
  const [myTodos, setMyTodos] = useState([]);
  let { tagid } = useParams();
  const getTodosByTagid = async () => {
    const response = await fetch("/getTodosByTagid", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ tagid: tagid }),
    });
    const json = await response.json();
    setMyTodos(json);
  };
  useEffect(() => {
    const fetchData = async () => {
      await getTodosByTagid();
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

export default TasksForCategory;
