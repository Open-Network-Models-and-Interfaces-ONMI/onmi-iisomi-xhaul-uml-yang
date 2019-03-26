import * as React from "react";
import { NavLink, RouteComponentProps } from 'react-router-dom';
import { MaterialTable, DataCallback } from '../../../../framework/src/components/material-table';

import { Result, Inventory } from '../models/inventory';

type DashboardProps = RouteComponentProps;

const url = `${ window.location.origin}/database/sdnevents/inventoryequipment/_search`;

const fetchData: DataCallback = async (page, rowsPerPage, orderBy, order, filter) => { 
  const from = rowsPerPage && page != null && !isNaN(+page)
    ? (+page) * rowsPerPage
    : null;

  const filterKeys = filter && Object.keys(filter) || [];
  
  const query = {
    ...filterKeys.length > 0 ? {
      query: {
        bool: {
          must: filterKeys.reduce((acc, cur) => {
            if (acc && filter && filter[cur]) {
              acc.push({ [filter[cur].indexOf("*") > -1 || filter[cur].indexOf("?") > -1 ? "wildcard" : "prefix"]: { [cur]: filter[cur] } });
            }
            return acc;
          }, [] as any[])
        }
      }
    }: { "query": { "match_all": {} } },
    ...rowsPerPage ? { "size": rowsPerPage } : {} ,
    ...from ? { "from": from } : {},
    ...orderBy && order ? { "sort": [{ [orderBy]: order }] } : {},
  };
  
  const result = await fetch(url, {
    method: "POST",       // *GET, POST, PUT, DELETE, etc.
    mode: "no-cors",      // no-cors, cors, *same-origin
    cache: "no-cache",    // *default, no-cache, reload, force-cache, only-if-cached
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      // "Content-Type": "application/x-www-form-urlencoded",
    },
    body: JSON.stringify(query), // body data type must match "Content-Type" header
  });

  if (result.ok) {
    const queryResult: Result<Inventory> = await result.json();
    const data = {
      page: Math.min(page || 0, queryResult.hits.total || 0 / (rowsPerPage || 1)), rowCount: queryResult.hits.total, rows: queryResult && queryResult.hits && queryResult.hits.hits && queryResult.hits.hits.map(h => (
      { ...h._source, _id: h._id }
      )) || []
    };
    return data;
  }

  return { page: 0, rowCount: 0, rows: [] };
};

export const Dashboard = ( props: DashboardProps ) => (
  <div>
    <MaterialTable onRequestData={ fetchData } columns={ [
      { property: "uuid", title: "Name" },
      { property: "parentUuid", title: "Parent" },
      { property: "mountpoint", title: "Mountpoint" },
      { property: "manufacturerIdentifier", title: "Manufacturer" },
      { property: "serial", title: "Serial" },
      { property: "typeName", title: "Type" },      
    ]} title="Inventory" idProperty="_id" >

    </MaterialTable>
  </div>
);

export default Dashboard;