import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import styles from './styles.css';

const Footer = (props) => {

  return (
    <div>
      <div className="copy-row">
        <p>&#169; Copyright all reserved CFO Connect</p>
      </div>
    </div>
  );
};

export default withStyles(styles)(Footer);
