import React, { Fragment, useState, useEffect } from 'react';
import categories from './categories';
import lists from './lists';
import { withRouter } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import MenuIcon from '@material-ui/icons/Menu';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Icon from '@mdi/react';
import { mdiGrid } from '@mdi/js';
import { mdiReorderVertical } from '@mdi/js';
import { mdiViewDay } from '@mdi/js';
import { mdiViewAgendaOutline } from '@mdi/js';
import { mdiPlusCircleOutline } from '@mdi/js';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
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
    marginRight: theme.spacing(2),
  },
  title: {
    textAlign: 'left',
    flexGrow: 1,
  },
  formControl: {
    margin: theme.spacing(1),
    marginLeft: '20%',
    width: '60%',
  },
  selectEmpty: {
    marginTop: theme.spacing(4),
  },
}));

function Sidebar(props) {
  const classes = useStyles();
  const [state, setState] = useState({
    left: false,
  });
  const add = 'Add Event';
  const schedule = 'Schedule';
  const day = 'Day';
  const week = 'Week';
  const month = 'Month';
  const [userList, setUserList] = useState([]);
  const [category, setCategory] = useState([]);
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [selectedStartDate, setSelectedStartDate] = useState(new Date());
  const [selectedEndDate, setSelectedEndDate] = useState(new Date());
  const [tag, setTag] = useState('');
  const [list, setList] = useState('');

  const handleClose = () => {
    setOpen(false);
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleStartDateChange = (date) => {
    setSelectedStartDate(date);
  };

  const handleEndDateChange = (date) => {
    setSelectedEndDate(date);
  };

  const handleSubmit = (event) => {
     const task = {
       title: title,
       start: selectedStartDate.toString(),
       end: selectedEndDate.toString(),
       tag: tag,
       list: list,
    };
    fetch('/postEvent', {
      method: 'POST',
      body: JSON.stringify(task),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        response.json();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleClickList = () => {
    props.history.push({
      pathname: '/schedule',
    });
  };

  const handleTasksForList = (listid) => {
    props.history.push({
      pathname: '/scheduleforlist/' + listid,
    });
  };

  const handleTodosForCategory = (tagid) => {
    props.history.push({
      pathname: '/scheduleforcategory/' + tagid,
    });
  };
  const handleClickDay = () => {
    props.history.push({
      pathname: '/day',
    });
  };
  const handleClickWeek = () => {
    props.history.push({
      pathname: '/week',
    });
  };

  const handleClickMonth = () => {
    props.history.push({
      pathname: '/month',
    });
  };

  const toggleDrawer = (side, open) => (event) => {
    if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setState({ ...state, [side]: open });
  };
  const sideList = (side) => (
    <div
      className={classes.list}
      role="presentation"
    >
      <List>
        <ListItem button key={add} onClick={handleClickOpen}>
          <ListItemIcon>
            <Icon path={mdiPlusCircleOutline} size={1} horizontal vertical color="red" />
          </ListItemIcon>
          <ListItemText primary={add} />
        </ListItem>
        <Dialog open={open} aria-labelledby="form-dialog-title">
          <DialogTitle id="form-dialog-title">Add Title and Time</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              required
              margin="dense"
              id="title"
              label="Title"
              type="text"
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
            <FormControl className={classes.formControl}>
              <InputLabel htmlFor="selected-list">List</InputLabel>
              <Select native value={list} onChange={(event) => setList(event.target.value)}>
                <option aria-label="None" value="" />
                {userList.map((text, index) => (
                  <option value={text.listid}>{text.list_text}</option>
                ))}
              </Select>
            </FormControl>
            <FormControl className={classes.formControl}>
              <InputLabel htmlFor="selected-category">Category</InputLabel>
              <Select native value={tag} onChange={(event) => setTag(event.target.value)}>
                <option aria-label="None" value="" />
                {category.map((text, index) => (
                  <option value={text.tagid}>{text.tag_text}</option>
                ))}
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions onClick={toggleDrawer(side, false)} onKeyDown={toggleDrawer(side, false)}>
            <Button onClick={handleClose} color="primary">
              Cancel
            </Button>
            <Button type="submit" color="primary" onClick={handleSubmit}>
              Save
            </Button>
          </DialogActions>
        </Dialog>
        <ListItem button key={schedule} onClick={handleClickList}>
          <ListItemIcon>
            <Icon path={mdiViewAgendaOutline} size={1} horizontal vertical color="gray" />
          </ListItemIcon>
          <ListItemText primary={schedule} />
        </ListItem>
        <ListItem button key={day} onClick={handleClickDay}>
          <ListItemIcon>
            <Icon path={mdiViewDay} size={1} horizontal vertical color="gray" />
          </ListItemIcon>
          <ListItemText primary={day} />
        </ListItem>
        <ListItem button key={week} onClick={handleClickWeek}>
          <ListItemIcon>
            <Icon path={mdiReorderVertical} size={1} horizontal vertical color="gray" />
          </ListItemIcon>
          <ListItemText primary={week} />
        </ListItem>
        <ListItem button key={month} onClick={handleClickMonth}>
          <ListItemIcon>
            <Icon path={mdiGrid} size={1} horizontal vertical color="gray" />
          </ListItemIcon>
          <ListItemText primary={month} />
        </ListItem>
      </List>
      <Divider />
      <div>Lists</div>
      <List>
        {userList.map((text, index) => (
          <ListItem
            button
            key={text.listid}
            onClick={() => {
              handleTasksForList(text.listid);
            }}
          >
            <ListItemIcon>
              <Icon path={mdiViewAgendaOutline} size={1} horizontal vertical color="gray" />
            </ListItemIcon>
            <ListItemText primary={text.list_text} />
          </ListItem>
        ))}
      </List>
      <Divider />
      <div>Categories</div>
      <List>
        {category.map((text, index) => (
          <ListItem
            button
            key={text.tag_text}
            onClick={() => {
              handleTodosForCategory(text.tagid);
            }}
          >
            <ListItemIcon>
              <Icon path={mdiViewAgendaOutline} size={1} horizontal vertical color="gray" />
            </ListItemIcon>
            <ListItemText primary={text.tag_text} />
          </ListItem>
        ))}
      </List>
    </div>
  );
  const getListsByUser = async () => {
    const json = await lists();
   setUserList(json);
    
  };
  const fetchCategories = async () => {
  const json = await categories();
    setCategory(json);
  };
  useEffect(() => {
    const fetchLists = async () => {
      await getListsByUser();
      await fetchCategories();
    };
    fetchLists();
  }, []);

  return (
    <Fragment>
      <MenuIcon onClick={toggleDrawer('left', true)} />
      <SwipeableDrawer
        open={state.left}
        onClose={toggleDrawer('left', false)}
        onOpen={toggleDrawer('left', true)}
      >
        {sideList('left')}
      </SwipeableDrawer>
    </Fragment>
  );
}

export default withRouter(Sidebar);
