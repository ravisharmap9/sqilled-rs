import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import { NavLink } from 'react-router-dom';

const styles = {
  logo: {
    width: 200,
    height: 50,
  },
  root: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    width: 600,
    textAlign: 'center',
  },
  notice: {
    color: 'red',
    margin: 'auto',
  },
};

const Unauthorized = ( props ) => {
  const { classes } = props;

  return (
    <div className={classes.root}>
      <Card className={classes.card}>
        <CardContent>
          <h2 className={classes.notice}>
            The page you are trying to access is unauthorized.
          </h2>
        </CardContent>
        <CardActions>
          <Button color="primary" size="small">
            <NavLink to="/">Back to home</NavLink>
          </Button>
        </CardActions>
      </Card>
    </div>
  );
};

Unauthorized.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles( styles )( Unauthorized );
