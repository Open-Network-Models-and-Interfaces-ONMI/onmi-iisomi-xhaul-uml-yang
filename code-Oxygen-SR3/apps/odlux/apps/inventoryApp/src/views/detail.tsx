import * as React from "react";
import { withRouter, RouteComponentProps } from 'react-router-dom';

import Button from '@material-ui/core/Button';
import { WithStyles, withStyles, createStyles, Theme } from '@material-ui/core/styles'; // infra for styling

const styles = (theme: Theme) => createStyles({
  warnButton: {
    backgroundColor: theme.palette.primary.dark
  }
});

type DetailProps = RouteComponentProps<{ id: string }> & WithStyles<typeof styles>;

export const Detail = withStyles( styles )( withRouter( (props: DetailProps) => (
  <div>
    <h1>Detail {props.match.params.id}</h1>
    <p>This are the information about {props.staticContext}.</p>
    <Button color={"secondary"} variant={"contained"}>Start</Button>
    <Button className={ props.classes.warnButton } variant={"contained"}>Stop</Button>
  </div>
)));

export default Detail;