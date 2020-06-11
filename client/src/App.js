import React, { useEffect, useState } from "react";
import { Router, Route, Switch, Redirect } from "react-router-dom";

import "./App.css";
import Navbar from "./components/Navbar";
import EventCalendar from "./components/EventCalendar";
import createHistory from "history/createBrowserHistory";
import Signin from "./components/Signin";
import Signup from "./components/Signup";

import TasksForList from "./components/TasksForList";
import TasksForCategory from "./components/TasksForCategory";
import isLoggedIn from "./isLoggedIn";
import Logout from "./components/Logout";

const history = createHistory({ forceRefresh: true });

function PrivateRoute({ component, loggedIn, ...rest }) {
  return (
    <Route
      {...rest}
      render={() => {
        if (loggedIn === true) {
          return component;
        } else if (loggedIn === false) {
          return <Redirect to="/signin" />;
        }
        return null;
      }}
    ></Route>
  );
}

function App() {
  const calendarView = [
    "dayGridMonth",
    "listYear",
    "timeGridDay",
    "timeGridWeek",
  ];
  const [loggedIn, setLoggedIn] = useState(null);
  const [userName, setuserName] = useState("");

  useEffect(() => {
    const updateLoggedIn = async () => {
      const result = await isLoggedIn();
      setLoggedIn(result.isLoggedIn);
      setuserName(result.username);
    };
    updateLoggedIn();
  }, []);

  return (
    <div className="App">
      <Router history={history}>
        <Navbar loggedIn={loggedIn} userName={userName} />
        <Switch>
          <PrivateRoute
            exact
            path="/"
            loggedIn={loggedIn}
            component={<EventCalendar calendarView={calendarView[0]} />}
          ></PrivateRoute>
          <PrivateRoute
            exact
            path="/schedule"
            loggedIn={loggedIn}
            component={<EventCalendar calendarView={calendarView[1]} />}
          ></PrivateRoute>
          <PrivateRoute
            exact
            path="/day"
            loggedIn={loggedIn}
            component={<EventCalendar calendarView={calendarView[2]} />}
          ></PrivateRoute>
          <PrivateRoute
            exact
            path="/week"
            loggedIn={loggedIn}
            component={<EventCalendar calendarView={calendarView[3]} />}
          ></PrivateRoute>
          <PrivateRoute
            exact
            path="/month"
            loggedIn={loggedIn}
            component={<EventCalendar calendarView={calendarView[0]} />}
          ></PrivateRoute>
          <Route exact path="/signin">
            <Signin />
          </Route>
          <Route exact path="/signup">
            <Signup />
          </Route>
          <PrivateRoute
            exact
            path="/scheduleforlist/:listid"
            loggedIn={loggedIn}
            component={<TasksForList calendarView={calendarView[1]} />}
          ></PrivateRoute>
          <PrivateRoute
            exact
            path="/scheduleforcategory/:tagid"
            loggedIn={loggedIn}
            component={<TasksForCategory calendarView={calendarView[1]} />}
          ></PrivateRoute>
          <PrivateRoute
            exact
            path="/logout"
            loggedIn={loggedIn}
            component={<Logout />}
          ></PrivateRoute>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
