import * as React from 'react';
import { withRouter, RouteComponentProps } from 'react-router-dom';

import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import LockIcon from '@material-ui/icons/LockOutlined';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { withStyles, WithStyles, createStyles, Theme } from '@material-ui/core/styles';

import connect, { Connect } from '../flux/connect';
import authenticationService from '../services/authenticationService';

import { UpdateAuthentication } from '../actions/authentication';

const styles = (theme: Theme) => createStyles({
  layout: {
    width: 'auto',
    display: 'block', // Fix IE11 issue.
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
      width: 400,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  paper: {
    marginTop: theme.spacing.unit * 8,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: `${ theme.spacing.unit * 2 }px ${ theme.spacing.unit * 3 }px ${ theme.spacing.unit * 3 }px`,
  },
  avatar: {
    margin: theme.spacing.unit,
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE11 issue.
    marginTop: theme.spacing.unit,
  },
  submit: {
    marginTop: theme.spacing.unit * 3,
  },
});

type LoginProps = RouteComponentProps<{}> & WithStyles<typeof styles> & Connect ;

interface ILoginState {
  busy: boolean;
  email: string;
  password: string;
}


// todo: ggf. redirect to einbauen
class LoginComponent extends React.Component<LoginProps, ILoginState> {

  constructor(props: LoginProps) {
    super(props);

    this.state = {
      busy: false,
      email: '',
      password: ''
    };
  }

  render(): JSX.Element {
    const { classes } = this.props;
    return (
      <React.Fragment>
        <CssBaseline />
        <main className={ classes.layout }>
          <Paper className={ classes.paper }>
            <Avatar className={ classes.avatar }>
              <LockIcon />
            </Avatar>
            <Typography variant="caption">Sign in</Typography>
            <form className={ classes.form }>
              <FormControl margin="normal" required fullWidth>
                <InputLabel htmlFor="email">Email Address</InputLabel>
                <Input id="email" name="email" autoComplete="email" autoFocus
                  disabled={ this.state.busy }
                  value = {this.state.email }
                  onChange={ event => { this.setState({ email: event.target.value }) } }/>
              </FormControl>
              <FormControl margin="normal" required fullWidth>
                <InputLabel htmlFor="password">Password</InputLabel>
                <Input
                  name="password"
                  type="password"
                  id="password"
                  autoComplete="current-password"
                  disabled={ this.state.busy }
                  value={ this.state.password }
                  onChange={ event => { this.setState({ password: event.target.value }) } }
                />
              </FormControl>
              <FormControlLabel
                control={ <Checkbox value="remember" color="primary" /> }
                label="Remember me"
              />
              <Button
                type="submit"
                fullWidth
                variant="raised"
                color="primary"
                disabled = { this.state.busy }
                className={ classes.submit }
                onClick = { this.onSignIn }
              >
                Sign in
            </Button>
            </form>
          </Paper>
        </main>
      </React.Fragment>
    );
  }

  private onSignIn = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    this.setState({ busy: true });
    const token = await authenticationService.authenticateUser(this.state.email, this.state.password);
    this.props.dispatch(new UpdateAuthentication(token));
    this.setState({ busy: false });

    if (token) {
      this.props.history.replace("/");
    }

  }
}

export const Login = withStyles(styles)(withRouter(connect()(LoginComponent)));
export default Login;