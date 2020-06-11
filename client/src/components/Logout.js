import React, {useEffect} from 'react'
import {withRouter} from 'react-router-dom'

function Logout (props){
  const goToHomePage =()=> {
    props.history.push({
      pathname: '/'
    })
  }
  useEffect(()  => {
    fetch('/signout', {
      method: 'POST',
      
    }).then((response) => {
        goToHomePage();
      })
      .catch((error) => {
        console.log(error);
      });
  });
  return null ;
}
export default withRouter(Logout);