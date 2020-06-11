import React, { useEffect, useState } from "react";
import { withRouter } from "react-router-dom";
import Sidebar from "./Sidebar";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import MoreIcon from "@material-ui/icons/MoreVert";
import isLoggedIn from "../isLoggedIn";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    textAlign: "left",
    flexGrow: 1,
  },
}));

function Navbar(props) {
  const classes = useStyles();
  const logOut = () => {
    props.history.push({
      pathname: "/logout",
    });
  };
  const handleSignup = () => {
    props.history.push({
      pathname: "/signup",
    });
  };
  const handleSignin = () => {
    props.history.push({
      pathname: "/signin",
    });
  };
  if (!props.loggedIn) {
    return (
      <div className={classes.root}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" className={classes.title}>
              Calendar
            </Typography>
            <Button color="inherit" onClick={handleSignin}>
              Login
            </Button>
            <Button color="inherit" onClick={handleSignup}>
              Signup
            </Button>
          </Toolbar>
        </AppBar>
      </div>
    );
  }
  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="menu"
          >
            <Sidebar />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            {props.userName + "'s Todo List"}
          </Typography>

          <Button color="inherit" onClick={logOut}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>
    </div>
  );
}

export default withRouter(Navbar);
