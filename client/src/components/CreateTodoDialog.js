import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";

function CreateTodoDialog(props) {
  const [state, setState] = useState({
    left: false,
  });
  const [open, setOpen] = useState(true);
  const [title, setTitle] = useState("");
  let task = { title: title };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleSubmit = (event) => {
    fetch("/postEvent", {
      method: "POST",
      body: JSON.stringify(task),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        response.json();
      })
      .then((error) => {
        console.log(error);
      });
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="form-dialog-title"
    >
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
        <TextField
          margin="dense"
          id="start"
          label="Start time"
          type="text"
          fullWidth
        />
        <TextField
          margin="dense"
          id="end"
          label="End time"
          type="text"
          fullWidth
        />
        <TextField
          margin="dense"
          id="category"
          label="Category"
          type="text"
          fullWidth
        />
        <TextField
          margin="dense"
          id="list"
          label="List"
          type="text"
          fullWidth
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button type="submit" color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
export default CreateTodoDialog;
