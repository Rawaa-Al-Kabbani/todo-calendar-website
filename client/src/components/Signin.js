import React, { useState } from 'react';
import {withRouter} from "react-router-dom";

import { Card, CardContent, Button } from '@material-ui/core';
import { ValidatorForm, TextValidator } from 'react-material-ui-form-validator';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
      width: '100%',
    },
  },
  title: {
    margin: '25px',
    fontSize: '25px',
  },
  submitButton: {
    margin: '40px',
    backgroundColor: '#005b96',
    color: 'white',
    '&:hover': {
      backgroundColor: '#FFFFFF',
      color: '#000',
      border: '1px solid #03396c',
    },
  },
  error: {
    marginTop: 20,
    color: 'red',
  },
  card: {
    marginTop: '10vh',
    width: '30%',
    marginLeft: 'auto',
    marginRight: 'auto',
  },
}));
function Signin(props) {
  const classes = useStyles();
  const [values, setValues] = useState({
    email: '',
    password: '',
  });

  const handleOnChange = (event) => {
    const { id, value } = event.target;
    const newValues = { ...values, [id]: value };
    setValues(newValues);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    fetch('/postUser', {
      method: 'POST',
      body: JSON.stringify(values),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        return response.json();
      }).then((json) => {
        if (json.loggedIn) {
          props.history.push({
            pathname: "/"
          });
        }
      })
      .then((error) => {
        console.log(error);
      });
  };

  return (
    <Card className={classes.card}>
      <CardContent
        style={{
          width: '70%',
          marginLeft: '15%',
          marginTop: '5%',
        }}
      >
        <ValidatorForm className={classes.root} onSubmit={handleSubmit}>
          <h2>Sign in</h2>
          <TextValidator
            variant="outlined"
            label="Email"
            onChange={handleOnChange}
            name="email"
            id="email"
            value={values.email}
            validators={['required', 'isEmail']}
            errorMessages={['this field is required', 'email is not valid']}
          />
          <br />
          <TextValidator
            variant="outlined"
            label="Password"
            onChange={handleOnChange}
            name="password"
            id="password"
            value={values.password}
            validators={['required']}
            errorMessages={['this field is required']}
          />
          <br />
          <Button type="submit" variant="filled outlined" className={classes.submitButton}>
            Sign in
          </Button>
        </ValidatorForm>
      </CardContent>
    </Card>
  );
}

export default withRouter(Signin);
