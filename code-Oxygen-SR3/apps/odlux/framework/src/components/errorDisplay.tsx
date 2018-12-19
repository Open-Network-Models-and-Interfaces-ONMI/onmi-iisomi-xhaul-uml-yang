import * as React from 'react';
import { withStyles, WithStyles, createStyles, Theme } from '@material-ui/core/styles';

import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

import { ClearErrorInfoAction, RemoveErrorInfoAction } from '../actions/errorActions';

import connect, { Connect } from '../flux/connect';

const styles = (theme: Theme) => createStyles({
  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  paper: {
    width: theme.spacing.unit * 50,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing.unit * 4,
  },
  card: {
    minWidth: 275,
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    marginBottom: 16,
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
});

type ErrorDisplayProps = WithStyles<typeof styles> & Connect;

// function getModalStyle() {
//   const top = 50 + rand();
//   const left = 50 + rand();

//   return {
//     top: `${ top }%`,
//     left: `${ left }%`,
//     transform: `translate(-${ top }%, -${ left }%)`,
//   };
// }

/**
 * Represents a compnent for formaing and displaying errors.
 */
class ErrorDisplayComponent extends React.Component<ErrorDisplayProps> {
  render(): JSX.Element {
    const { classes, state } = this.props;
    const errorInfo = state.framework.applicationState.errors.length && state.framework.applicationState.errors[state.framework.applicationState.errors.length - 1];
    return (
      <Modal className={ classes.modal }
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
        open={ state.framework.applicationState.errors && state.framework.applicationState.errors.length > 0 }
        onClose={ () => this.props.dispatch(new ClearErrorInfoAction()) }
      >
        { errorInfo &&
          <div className={ classes.paper }>
            <Card className={ classes.card }>
              <CardContent>
                <Typography className={ classes.title } color="textSecondary">
                  Something went wrong.
                </Typography>
                <Typography variant="headline" component="h2">
                { errorInfo.error && errorInfo.error.toString() }
                </Typography>
                <Typography className={ classes.pos } color="textSecondary">
                { errorInfo.message && errorInfo.message .toString() }
                </Typography>
                <Typography component="p">
                { errorInfo.info && errorInfo.info.componentStack && errorInfo.info.componentStack.split('\n').map(line => {
                  return [line, <br />];
                }) }
                { errorInfo.info && errorInfo.info.extra && errorInfo.info.extra.split('\n').map(line => {
                  return [line, <br />];
                }) }
                </Typography>
              </CardContent>
              <CardActions>
              <Button size="small" onClick={ () => this.props.dispatch(new RemoveErrorInfoAction(errorInfo)) } >Close</Button>
              </CardActions> 
            </Card>
          </div> || null
        }
      </Modal>
    );
  }
}

export const ErrorDisplay = withStyles(styles)(connect()(ErrorDisplayComponent));
export default ErrorDisplay;