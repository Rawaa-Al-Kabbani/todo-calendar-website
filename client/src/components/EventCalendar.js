import React, { useState, useEffect, Fragment } from 'react';
import {withRouter} from "react-router-dom";
import { makeStyles } from '@material-ui/core/styles';
import categories from './categories';
import lists from './lists';

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';

import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';

import IconButton from '@material-ui/core/IconButton';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';

import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';

import TextField from '@material-ui/core/TextField';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import 'date-fns';
import Grid from '@material-ui/core/Grid';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from '@material-ui/pickers';

import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(12),
  },
  title: {
    textAlign: 'left',
    flexGrow: 1,
  },
  itemOfList: {
    textAlign: 'center',
  }
}));

function  EventCalendar(props) {
  const classes = useStyles();
  const [myTodos, setMyTodos] = useState([]);
  const [open, setOpen] = useState(false);
  const [todo, setTodo] = useState([]);
  const [openEdit, setOpenEdit] = useState(false);

  const [userList, setUserList] = useState([]);
  const [category, setCategory] = useState([]);
  const [title, setTitle] = useState('');
  const [selectedStartDate, setSelectedStartDate] = useState(new Date());
  const [selectedEndDate, setSelectedEndDate] = useState(new Date());
  const [tag, setTag] = useState('');
  const [list, setList] = useState('');
  const [todoid, setTodoId] = useState(0);

  const eventClick = (info) => {
    setOpen(true);

    const newEvent = {
      title: info.event.title,
      start: info.event.start,
      end: info.event.end,
      list: info.event._def.extendedProps.listid,
      list_text: info.event._def.extendedProps.list_text,
      tag_text: info.event._def.extendedProps.tag_text,
      tag: info.event._def.extendedProps.tagid,
      todoid: info.event._def.extendedProps.todoid,
    };

     setTodo(newEvent);
     setTitle(newEvent.title);
     setSelectedStartDate(info.event.start);
     setSelectedEndDate(info.event.end);
     setTag(newEvent.tag);
     setList(newEvent.list);
     setTodoId(newEvent.todoid);
  };

   const goToHomePage =()=> {
    props.history.push({
      pathname: '/'
    })
  }
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleStartDateChange = (date) => {
    setSelectedStartDate(date);
  };

  const handleEndDateChange = (date) => {
    setSelectedEndDate(date);
  };

  const handleSubmit = (event) => {
    const data = {
      title: title,
      start: selectedStartDate.toString(),
      end: selectedEndDate.toString(),
      tag: tag,
      list: list,
      todoid: todo.todoid,
    };
    fetch('/editEvent', {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        response.json();
        goToHomePage();
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const myLists = async() => {
    const json = await lists();
    setUserList(json);
  }
  const myCategories = async() => {
    const json = await categories();
    setCategory(json);

  }
  const getTodos = async () => {
    const response = await fetch('/getTodos', {
      method: 'GET',
      header: {
        'Content-Type': 'application/json',
      },
    });
    const json = await response.json();
    setMyTodos(json);
  };

  const handleMarkAsDone = (info) => {
    fetch('/postMarkAsDone', {
      method: 'POST',
      body: JSON.stringify(todo),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        window.location.reload();

      })
      .then((error) => {
        console.log(error);
      });
  };

  const handleDelete = (info) => {
    fetch('/postDelete', {
      method: 'POST',
      body: JSON.stringify(todo),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        window.location.reload();
      })
      .then((error) => {
        console.log(error);
      });
  };

const handleEditOpen = () => {
  setOpenEdit(true);
}
const handleEditClose = () => {
  setOpenEdit(false);
}
  useEffect(() => {
    const fetchData = async () => {
      await getTodos();
      await myCategories();
     await myLists();

    };
    fetchData();
  
  }, []);

  return (
    <Fragment>
      <FullCalendar
        defaultView={props.calendarView}
        events={myTodos}
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
        eventClick={eventClick}
      />
      <Dialog open={open} aria-labelledby="simple-dialog-title">
        <div>
          <AppBar position="static">
            <Toolbar>
              <IconButton
                edge="start"
                className={classes.menuButton}
                color="inherit"
                aria-label="menu"
              >
                <EditIcon onClick={handleEditOpen}/>
              </IconButton>
              <IconButton
                edge="start"
                className={classes.menuButton}
                color="inherit"
                aria-label="menu"
              >
                <DeleteIcon onClick={handleDelete} />
              </IconButton>
              <Button color="inherit" onClick={handleMarkAsDone}>
                Mark as done
              </Button>
            </Toolbar>
          </AppBar>
        </div>

        <DialogContent>
        <TextField
              autoFocus
              required
              margin="dense"
              id="title"
              label="Title"
              type="text"
              value={title}
         onChange={(event) => setTitle(event.target.value)}
              fullWidth
            />
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <Grid container justify="space-around">
                <KeyboardDatePicker
                  margin="normal"
                  id="date-picker-dialog"
                  label="Start Date"
                  format="MM/dd/yyyy"
                  value={selectedStartDate}
               onChange={handleStartDateChange}
                  KeyboardButtonProps={{
                    'aria-label': 'change date',
                  }}
                />
                <KeyboardTimePicker
                  margin="normal"
                  id="time-picker"
                  label="Start Time"
                  value={selectedStartDate}

                onChange={handleStartDateChange}
                  KeyboardButtonProps={{
                    'aria-label': 'change time',
                  }}
                />
              </Grid>
            </MuiPickersUtilsProvider>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
              <Grid container justify="space-around">
                <KeyboardDatePicker
                  margin="normal"
                  id="date-picker-dialog"
                  label="End Date"
                  format="MM/dd/yyyy"
                  value={selectedEndDate}

                onChange={handleEndDateChange}
                  KeyboardButtonProps={{
                    'aria-label': 'change date',
                  }}
                />
                <KeyboardTimePicker
                  margin="normal"
                  id="time-picker"
                  label="End Time"
                  value={selectedEndDate}

                 onChange={handleEndDateChange}
                  KeyboardButtonProps={{
                    'aria-label': 'change time',
                  }}
                />
              </Grid>
            </MuiPickersUtilsProvider>
            <FormControl className={classes.formControl}  >
              <InputLabel htmlFor="selected-list">{todo.list_text}</InputLabel>
            
              <Select native value={todo.list} onChange={(event) => setList(event.target.value)} >
                <option aria-label="None" value="" />
                {userList.map((text, index) => (
                  <option value={text.listid}>{text.list_text}</option>
                ))}
              </Select>
            </FormControl>
            <FormControl className={classes.formControl}>
              <InputLabel htmlFor="selected-category">{todo.tag_text}</InputLabel>
              
              <Select native value={todo.tag} onChange={(event) => setTag(event.target.value)} >
                <option aria-label="None" value="" />
                 {category.map((text, index) => (
                  <option value={text.tagid}>{text.tag_text}</option>
                ))}
              </Select>
            </FormControl>
        </DialogContent>
         <DialogActions >
            <Button onClick={handleClose} color="primary">
              Discard
            </Button>
            <Button type="submit" color="primary" onClick={(event) => handleSubmit(event)}>
              Save changes
            </Button>
          </DialogActions>
      </Dialog>
    </Fragment>
  );
}

export default withRouter(EventCalendar);
