import * as React from "react";
import { NavLink, RouteComponentProps } from 'react-router-dom';

import { Counter } from '../components/counter';
import { Counter as CounterApp } from '../components/appCounter';

const details = [
  { id: 1, name: "Max" },
  { id: 2, name: "Petra" },
  { id: 3, name: "Hugo" },
  { id: 4, name: "Claudia" },
  { id: 5, name: "Niemand" },
];

type DashboardProps = RouteComponentProps;

export const Dashboard = ( props: DashboardProps ) => (
  <div>
    <h1>Dashboard</h1>
    <Counter />
    <CounterApp />
    { 
      details.map( ( detail ) => {
        return (
          <div key={ detail.id }>
            <NavLink to={ `${ props.match.path }detail/${ detail.id }` } 
                     title={ detail.name }>{ detail.name }</NavLink>
          </div>
        );
      })
    }
  </div>
);
//           <a href={ `${props.match.path}/detail/${detail.id}` }> { detail.name }</a>

export default Dashboard;