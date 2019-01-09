import * as React from 'react';

import { withComponents, WithComponents } from '../utilities/withComponents';
import { withStyles, WithStyles, createStyles, Theme } from '@material-ui/core/styles';

import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import { MaterialTable, ColumnType } from '../components/material-table';

const styles = (theme: Theme) => createStyles({
  root: {
    width: '100%',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
});

class SampleData {
  _id: string;
  index: number;
  guid: string;
  isActive: boolean;
  balance: string;
  age: 33;
  firstName: string;
  lastName: string;
  company: string;
  email: string;
  registered: string;
  latitude: string;
  longitude: string;
}

// https://next.json-generator.com/NJ5Bv-v1I
const tableData = [
  {
    "_id": "5c0e18399919a5c43636fdf2",
    "index": 0,
    "guid": "48728d8e-8300-4d0f-b967-e2166d023066",
    "isActive": false,
    "balance": "$3,480.16",
    "age": 33,
    "firstName": "Brooke",
    "lastName": "Morris",
    "company": "ZORROMOP",
    "email": "brooke.morris@zorromop.de",
    "registered": "Sunday, February 11, 2018 2:55 PM",
    "latitude": "-69.109379",
    "longitude": "113.735639"
  },
  {
    "_id": "5c0e1839b61e3eeaf164259d",
    "index": 1,
    "guid": "28723570-1507-422e-b78c-924402371fb1",
    "isActive": false,
    "balance": "$1,305.01",
    "age": 28,
    "firstName": "Jolene",
    "lastName": "Everett",
    "company": "ZENCO",
    "email": "jolene.everett@zenco.de",
    "registered": "Saturday, December 8, 2018 5:17 PM",
    "latitude": "13.683025",
    "longitude": "85.101421"
  },
  {
    "_id": "5c0e1839e81f57913c5d2147",
    "index": 2,
    "guid": "e914dc5d-91a3-405d-ac48-aee6f0cd391a",
    "isActive": true,
    "balance": "$1,418.37",
    "age": 28,
    "firstName": "Elva",
    "lastName": "Travis",
    "company": "ZYTREK",
    "email": "elva.travis@zytrek.de",
    "registered": "Thursday, March 10, 2016 5:13 PM",
    "latitude": "53.75862",
    "longitude": "-67.784532"
  },
  {
    "_id": "5c0e1839bc9224a2b54c0f69",
    "index": 3,
    "guid": "88cbdce0-0bcc-4d16-83c3-3017690503c4",
    "isActive": true,
    "balance": "$1,709.60",
    "age": 21,
    "firstName": "Ellis",
    "lastName": "Mcpherson",
    "company": "DIGIPRINT",
    "email": "ellis.mcpherson@digiprint.de",
    "registered": "Sunday, December 21, 2014 5:25 AM",
    "latitude": "46.486149",
    "longitude": "-66.657067"
  },
  {
    "_id": "5c0e183951b51475db0f35d1",
    "index": 4,
    "guid": "c887ac86-7ba1-4eb6-9b47-e88a1bcb3713",
    "isActive": true,
    "balance": "$3,578.54",
    "age": 25,
    "firstName": "Marcia",
    "lastName": "Rocha",
    "company": "ZAPPIX",
    "email": "marcia.rocha@zappix.de",
    "registered": "Tuesday, June 16, 2015 11:21 AM",
    "latitude": "-39.905461",
    "longitude": "150.873895"
  },
  {
    "_id": "5c0e18398c5be8d362a578eb",
    "index": 5,
    "guid": "0d160697-9b5b-4941-9b5f-4ba3a7f97b49",
    "isActive": true,
    "balance": "$414.98",
    "age": 32,
    "firstName": "Lavonne",
    "lastName": "Wilkins",
    "company": "FARMAGE",
    "email": "lavonne.wilkins@farmage.de",
    "registered": "Monday, February 1, 2016 5:27 PM",
    "latitude": "-16.839256",
    "longitude": "-105.824746"
  },
  {
    "_id": "5c0e18399804086c836d7d56",
    "index": 6,
    "guid": "715a5f63-35b6-4903-a46e-ba584b005e64",
    "isActive": false,
    "balance": "$1,755.78",
    "age": 32,
    "firstName": "Wise",
    "lastName": "Berg",
    "company": "ZIZZLE",
    "email": "wise.berg@zizzle.de",
    "registered": "Saturday, March 28, 2015 1:40 AM",
    "latitude": "51.15269",
    "longitude": "65.795093"
  },
  {
    "_id": "5c0e18399c4d13538bcaf8c9",
    "index": 7,
    "guid": "7ee50269-23e8-499e-9a16-09f393d7600c",
    "isActive": false,
    "balance": "$342.52",
    "age": 27,
    "firstName": "Isabel",
    "lastName": "Battle",
    "company": "EZENTIA",
    "email": "isabel.battle@ezentia.de",
    "registered": "Thursday, June 7, 2018 12:16 AM",
    "latitude": "-53.318152",
    "longitude": "-153.516824"
  },
  {
    "_id": "5c0e18398d7fb9a4eceeffa2",
    "index": 8,
    "guid": "1e30c9ac-2297-4f16-83e6-9559b1ebe92c",
    "isActive": true,
    "balance": "$3,184.71",
    "age": 36,
    "firstName": "Lenora",
    "lastName": "Crawford",
    "company": "KIDGREASE",
    "email": "lenora.crawford@kidgrease.de",
    "registered": "Saturday, January 7, 2017 6:17 PM",
    "latitude": "-72.431496",
    "longitude": "9.413359"
  },
  {
    "_id": "5c0e18395837069ab6b79d00",
    "index": 9,
    "guid": "d04a02ed-5899-4729-a7e5-2d85b5d03973",
    "isActive": true,
    "balance": "$1,553.28",
    "age": 35,
    "firstName": "Sasha",
    "lastName": "Bridges",
    "company": "IDEALIS",
    "email": "sasha.bridges@idealis.de",
    "registered": "Sunday, February 4, 2018 7:02 PM",
    "latitude": "8.095691",
    "longitude": "-105.758195"
  },
  {
    "_id": "5c0e18390be19bf65acad180",
    "index": 10,
    "guid": "3a1a77e6-ef15-4598-8274-c68ac3bb922a",
    "isActive": false,
    "balance": "$3,587.96",
    "age": 20,
    "firstName": "Wilkins",
    "lastName": "Beasley",
    "company": "DIGIFAD",
    "email": "wilkins.beasley@digifad.de",
    "registered": "Monday, March 5, 2018 1:27 PM",
    "latitude": "-88.062704",
    "longitude": "149.95661"
  },
  {
    "_id": "5c0e1839ffbbad5c9954e49f",
    "index": 11,
    "guid": "97a56950-a08c-4e00-8002-ba2d5de4da5d",
    "isActive": false,
    "balance": "$1,997.80",
    "age": 31,
    "firstName": "Sullivan",
    "lastName": "Mcclain",
    "company": "EARTHMARK",
    "email": "sullivan.mcclain@earthmark.de",
    "registered": "Saturday, October 27, 2018 2:51 PM",
    "latitude": "-81.86349",
    "longitude": "-79.596991"
  },
  {
    "_id": "5c0e183914bd464d55e7325f",
    "index": 12,
    "guid": "294f6485-d0f9-4b25-b998-325ae90fa769",
    "isActive": true,
    "balance": "$1,405.46",
    "age": 24,
    "firstName": "Herminia",
    "lastName": "Fischer",
    "company": "ECOLIGHT",
    "email": "herminia.fischer@ecolight.de",
    "registered": "Thursday, January 16, 2014 4:48 PM",
    "latitude": "48.224363",
    "longitude": "11.08339"
  },
  {
    "_id": "5c0e183968ec2556d8f6566c",
    "index": 13,
    "guid": "16edfea4-7b37-4e54-868c-c369b413dd78",
    "isActive": false,
    "balance": "$3,440.67",
    "age": 39,
    "firstName": "Blanchard",
    "lastName": "Blackwell",
    "company": "GEOFORMA",
    "email": "blanchard.blackwell@geoforma.de",
    "registered": "Wednesday, July 30, 2014 4:07 AM",
    "latitude": "-52.169297",
    "longitude": "10.415879"
  },
  {
    "_id": "5c0e183939a0fc955f2d94da",
    "index": 14,
    "guid": "4ed454e2-dde1-4ab5-a434-4a82205ced2d",
    "isActive": true,
    "balance": "$1,883.27",
    "age": 35,
    "firstName": "Gayle",
    "lastName": "Little",
    "company": "AQUAZURE",
    "email": "gayle.little@aquazure.de",
    "registered": "Tuesday, December 12, 2017 5:08 PM",
    "latitude": "-58.473236",
    "longitude": "38.022269"
  },
  {
    "_id": "5c0e1839099f9221ccd968ac",
    "index": 15,
    "guid": "1d052fd4-7c54-45fb-b0db-7de1acc4262a",
    "isActive": false,
    "balance": "$2,601.94",
    "age": 31,
    "firstName": "Jocelyn",
    "lastName": "Richards",
    "company": "GINK",
    "email": "jocelyn.richards@gink.de",
    "registered": "Sunday, October 30, 2016 9:12 PM",
    "latitude": "-43.489676",
    "longitude": "2.557869"
  },
  {
    "_id": "5c0e183970f320f377321c3f",
    "index": 16,
    "guid": "45bca125-8831-48c3-b22b-29ae318e7096",
    "isActive": false,
    "balance": "$3,441.74",
    "age": 34,
    "firstName": "Berta",
    "lastName": "Valentine",
    "company": "ISOSPHERE",
    "email": "berta.valentine@isosphere.de",
    "registered": "Sunday, March 19, 2017 8:22 PM",
    "latitude": "-40.188039",
    "longitude": "-170.085092"
  },
  {
    "_id": "5c0e1839ab960bb0a9f4f392",
    "index": 17,
    "guid": "d7b5122a-94c9-423c-b799-1a8f8314b152",
    "isActive": false,
    "balance": "$56.39",
    "age": 21,
    "firstName": "Russell",
    "lastName": "Powers",
    "company": "TETAK",
    "email": "russell.powers@tetak.de",
    "registered": "Thursday, November 3, 2016 9:23 PM",
    "latitude": "-51.610519",
    "longitude": "-133.280363"
  },
  {
    "_id": "5c0e183998f0195404b9aaa4",
    "index": 18,
    "guid": "a043ba97-ea7e-48ce-bb15-18ee09fb393d",
    "isActive": true,
    "balance": "$1,503.57",
    "age": 37,
    "firstName": "Rosario",
    "lastName": "Brennan",
    "company": "VIAGRAND",
    "email": "rosario.brennan@viagrand.de",
    "registered": "Saturday, March 17, 2018 10:32 PM",
    "latitude": "-43.773365",
    "longitude": "47.58682"
  },
  {
    "_id": "5c0e1839bcb2a5cc567129ac",
    "index": 19,
    "guid": "de6d5d36-201e-4f87-9976-ed31f3160e42",
    "isActive": false,
    "balance": "$1,160.18",
    "age": 29,
    "firstName": "Anita",
    "lastName": "Hodges",
    "company": "TUBALUM",
    "email": "anita.hodges@tubalum.de",
    "registered": "Sunday, November 26, 2017 11:54 AM",
    "latitude": "7.080244",
    "longitude": "-9.970715"
  },
  {
    "_id": "5c0e18394b37e854a1ef371c",
    "index": 20,
    "guid": "9407113b-896a-4699-ac1b-363bc3c6f8ad",
    "isActive": false,
    "balance": "$34.81",
    "age": 31,
    "firstName": "Barrett",
    "lastName": "Weaver",
    "company": "DUOFLEX",
    "email": "barrett.weaver@duoflex.de",
    "registered": "Tuesday, November 3, 2015 9:31 AM",
    "latitude": "40.30558",
    "longitude": "-69.986664"
  },
  {
    "_id": "5c0e1839b5658f90e16a86e0",
    "index": 21,
    "guid": "81f894c4-c931-422d-a30e-593824d95bf9",
    "isActive": true,
    "balance": "$2,808.63",
    "age": 26,
    "firstName": "Baxter",
    "lastName": "Chase",
    "company": "BUNGA",
    "email": "baxter.chase@bunga.de",
    "registered": "Friday, October 28, 2016 7:10 AM",
    "latitude": "-49.05652",
    "longitude": "63.123535"
  },
  {
    "_id": "5c0e1839cb9462c9ecbb59af",
    "index": 22,
    "guid": "92e67862-4fdf-43af-a3ef-ef3edb8d6706",
    "isActive": true,
    "balance": "$3,552.71",
    "age": 29,
    "firstName": "Olga",
    "lastName": "Kemp",
    "company": "OHMNET",
    "email": "olga.kemp@ohmnet.de",
    "registered": "Saturday, March 26, 2016 11:51 AM",
    "latitude": "-17.450481",
    "longitude": "-13.945794"
  },
  {
    "_id": "5c0e18396f999c2b8ac731a9",
    "index": 23,
    "guid": "a682eaae-34f0-4973-b8a0-30972de0732b",
    "isActive": false,
    "balance": "$1,999.20",
    "age": 21,
    "firstName": "Ebony",
    "lastName": "Le",
    "company": "MULTRON",
    "email": "ebony.le@multron.de",
    "registered": "Friday, March 27, 2015 9:23 AM",
    "latitude": "-70.380014",
    "longitude": "173.20685"
  },
  {
    "_id": "5c0e18391cfb28263eb42db7",
    "index": 24,
    "guid": "f1cddb5f-0b89-453e-b0c9-8193a56cc610",
    "isActive": true,
    "balance": "$2,950.91",
    "age": 30,
    "firstName": "Norman",
    "lastName": "Price",
    "company": "COMVEX",
    "email": "norman.price@comvex.de",
    "registered": "Tuesday, August 21, 2018 11:17 PM",
    "latitude": "86.501469",
    "longitude": "159.545352"
  },
  {
    "_id": "5c0e18394a6be11128c7e5ca",
    "index": 25,
    "guid": "dadb738a-40fd-45b6-abac-023a803d95c2",
    "isActive": true,
    "balance": "$2,767.09",
    "age": 25,
    "firstName": "Sara",
    "lastName": "Ruiz",
    "company": "AUSTECH",
    "email": "sara.ruiz@austech.de",
    "registered": "Wednesday, June 20, 2018 6:34 AM",
    "latitude": "86.784904",
    "longitude": "-120.331325"
  },
  {
    "_id": "5c0e183974631549eda97cea",
    "index": 26,
    "guid": "b5c43ee5-14ed-4ab5-b3db-b31a8bb65ceb",
    "isActive": true,
    "balance": "$3,235.42",
    "age": 32,
    "firstName": "Holly",
    "lastName": "Santos",
    "company": "LOVEPAD",
    "email": "holly.santos@lovepad.de",
    "registered": "Thursday, November 22, 2018 9:26 PM",
    "latitude": "-19.640066",
    "longitude": "50.410992"
  },
  {
    "_id": "5c0e1839ab9b933881429d78",
    "index": 27,
    "guid": "94961092-65ca-41b9-bc69-3e40ce2cafc9",
    "isActive": true,
    "balance": "$2,106.34",
    "age": 39,
    "firstName": "Rachel",
    "lastName": "Douglas",
    "company": "DEMINIMUM",
    "email": "rachel.douglas@deminimum.de",
    "registered": "Sunday, April 9, 2017 3:55 AM",
    "latitude": "31.395281",
    "longitude": "-1.899514"
  },
  {
    "_id": "5c0e183937f743155859c5a9",
    "index": 28,
    "guid": "07d7ef18-bcef-483d-999e-0b3da4a7098b",
    "isActive": true,
    "balance": "$2,260.65",
    "age": 40,
    "firstName": "Reed",
    "lastName": "Workman",
    "company": "BUZZMAKER",
    "email": "reed.workman@buzzmaker.de",
    "registered": "Wednesday, May 28, 2014 3:44 PM",
    "latitude": "23.789646",
    "longitude": "106.938375"
  },
  {
    "_id": "5c0e1839f8f4b60beb28b7ed",
    "index": 29,
    "guid": "9b4952e5-aa0e-4919-9e17-7c357a297394",
    "isActive": false,
    "balance": "$702.99",
    "age": 27,
    "firstName": "Cochran",
    "lastName": "Ware",
    "company": "HIVEDOM",
    "email": "cochran.ware@hivedom.de",
    "registered": "Monday, October 16, 2017 5:51 AM",
    "latitude": "85.953108",
    "longitude": "124.590037"
  },
  {
    "_id": "5c0e1839342fbd54a88269df",
    "index": 30,
    "guid": "30937d5b-9514-4ebd-b628-2cfb5017fe41",
    "isActive": false,
    "balance": "$385.88",
    "age": 35,
    "firstName": "Cote",
    "lastName": "Hess",
    "company": "TERAPRENE",
    "email": "cote.hess@teraprene.de",
    "registered": "Thursday, March 15, 2018 4:42 PM",
    "latitude": "81.38211",
    "longitude": "64.516797"
  },
  {
    "_id": "5c0e18395b6dc85d73ce1fb3",
    "index": 31,
    "guid": "f34847da-7f96-4cd8-8d8a-b06c0eb0a8f2",
    "isActive": true,
    "balance": "$3,494.56",
    "age": 27,
    "firstName": "Daniels",
    "lastName": "Ayala",
    "company": "BESTO",
    "email": "daniels.ayala@besto.de",
    "registered": "Sunday, December 18, 2016 10:52 AM",
    "latitude": "47.704227",
    "longitude": "41.674767"
  },
  {
    "_id": "5c0e183974587cdccf30b13f",
    "index": 32,
    "guid": "fdbb6d83-0e47-4453-b8a7-b47f44e4164b",
    "isActive": false,
    "balance": "$2,087.38",
    "age": 26,
    "firstName": "Powers",
    "lastName": "Drake",
    "company": "GENESYNK",
    "email": "powers.drake@genesynk.de",
    "registered": "Saturday, September 29, 2018 12:24 AM",
    "latitude": "40.580432",
    "longitude": "110.940759"
  },
  {
    "_id": "5c0e18397b51245e971c58b8",
    "index": 33,
    "guid": "6adfe544-238b-4001-b2a6-f50ea3094da3",
    "isActive": true,
    "balance": "$3,566.22",
    "age": 34,
    "firstName": "Pacheco",
    "lastName": "Ramsey",
    "company": "ENVIRE",
    "email": "pacheco.ramsey@envire.de",
    "registered": "Friday, September 11, 2015 12:14 AM",
    "latitude": "-30.691235",
    "longitude": "69.343692"
  },
  {
    "_id": "5c0e18391ede9c0996fd09e7",
    "index": 34,
    "guid": "d190b32f-d33b-4c17-a18a-bb2f57e79ba7",
    "isActive": false,
    "balance": "$1,671.63",
    "age": 32,
    "firstName": "Mcintyre",
    "lastName": "Chan",
    "company": "ORBAXTER",
    "email": "mcintyre.chan@orbaxter.de",
    "registered": "Wednesday, May 7, 2014 7:11 PM",
    "latitude": "7.380435",
    "longitude": "70.955103"
  },
  {
    "_id": "5c0e1839fe48069c9c260fa9",
    "index": 35,
    "guid": "a41c064b-6bf4-4ba5-b229-9b657d286936",
    "isActive": false,
    "balance": "$24.02",
    "age": 27,
    "firstName": "Genevieve",
    "lastName": "Sparks",
    "company": "ZBOO",
    "email": "genevieve.sparks@zboo.de",
    "registered": "Saturday, December 16, 2017 2:51 PM",
    "latitude": "-63.406337",
    "longitude": "118.662621"
  },
  {
    "_id": "5c0e1839a7e8e76accf0803e",
    "index": 36,
    "guid": "3e71864d-4be5-418e-ace8-346c3d7a9c5f",
    "isActive": true,
    "balance": "$3,261.01",
    "age": 30,
    "firstName": "Powell",
    "lastName": "Patterson",
    "company": "GAZAK",
    "email": "powell.patterson@gazak.de",
    "registered": "Thursday, May 18, 2017 10:10 AM",
    "latitude": "-10.428548",
    "longitude": "64.979192"
  },
  {
    "_id": "5c0e183984b0320f1118a8b0",
    "index": 37,
    "guid": "ec5b292c-6efb-471b-9bf5-a47286e03515",
    "isActive": false,
    "balance": "$918.71",
    "age": 37,
    "firstName": "Tara",
    "lastName": "Mcmillan",
    "company": "GRAINSPOT",
    "email": "tara.mcmillan@grainspot.de",
    "registered": "Sunday, May 17, 2015 1:01 PM",
    "latitude": "-13.519031",
    "longitude": "67.931062"
  },
  {
    "_id": "5c0e183965875876835ccd79",
    "index": 38,
    "guid": "b7e97ffb-439a-4454-90af-7f5ebd565ebc",
    "isActive": true,
    "balance": "$574.99",
    "age": 28,
    "firstName": "Pennington",
    "lastName": "Gallegos",
    "company": "CEDWARD",
    "email": "pennington.gallegos@cedward.de",
    "registered": "Wednesday, September 26, 2018 6:01 AM",
    "latitude": "-63.693261",
    "longitude": "-38.352153"
  },
  {
    "_id": "5c0e183922505dd21be49009",
    "index": 39,
    "guid": "5187aa39-4357-462b-9508-3c537d26d70d",
    "isActive": false,
    "balance": "$2,447.08",
    "age": 26,
    "firstName": "Meagan",
    "lastName": "Irwin",
    "company": "SENTIA",
    "email": "meagan.irwin@sentia.de",
    "registered": "Saturday, April 2, 2016 4:39 PM",
    "latitude": "1.051313",
    "longitude": "-86.168315"
  },
  {
    "_id": "5c0e183900a9f7f896e5b3b1",
    "index": 40,
    "guid": "31889843-79e7-4636-9ca1-4eb5cbcb0ae3",
    "isActive": true,
    "balance": "$1,992.25",
    "age": 22,
    "firstName": "Kelly",
    "lastName": "Cobb",
    "company": "BOVIS",
    "email": "kelly.cobb@bovis.de",
    "registered": "Tuesday, August 9, 2016 5:36 PM",
    "latitude": "-85.547579",
    "longitude": "-89.794104"
  },
  {
    "_id": "5c0e18393b25b8552ff950e2",
    "index": 41,
    "guid": "0bf02edc-ca1b-4cfe-8356-b65881bdca11",
    "isActive": true,
    "balance": "$465.96",
    "age": 27,
    "firstName": "Angela",
    "lastName": "Booker",
    "company": "EQUICOM",
    "email": "angela.booker@equicom.de",
    "registered": "Thursday, July 30, 2015 1:39 AM",
    "latitude": "-9.345395",
    "longitude": "107.070665"
  },
  {
    "_id": "5c0e183955d747ebbe25437b",
    "index": 42,
    "guid": "6405e559-5849-4d12-ae4e-520f13b4dffe",
    "isActive": true,
    "balance": "$15.63",
    "age": 28,
    "firstName": "Carrie",
    "lastName": "Mclean",
    "company": "BOINK",
    "email": "carrie.mclean@boink.de",
    "registered": "Wednesday, February 1, 2017 1:50 PM",
    "latitude": "72.287519",
    "longitude": "-135.436286"
  },
  {
    "_id": "5c0e1839e9cfe1b28e31e7e6",
    "index": 43,
    "guid": "e49e7ca7-a6cc-4cdb-bebe-5a3b6ba931eb",
    "isActive": true,
    "balance": "$3,127.94",
    "age": 33,
    "firstName": "Callie",
    "lastName": "Cooley",
    "company": "MUSIX",
    "email": "callie.cooley@musix.de",
    "registered": "Wednesday, August 30, 2017 4:58 PM",
    "latitude": "-38.954739",
    "longitude": "-152.706424"
  },
  {
    "_id": "5c0e18391bafa0750ff4f280",
    "index": 44,
    "guid": "c245ffd3-4924-4dce-ae4a-f4cabf057b54",
    "isActive": false,
    "balance": "$1,320.36",
    "age": 35,
    "firstName": "Terry",
    "lastName": "Bennett",
    "company": "EXOTECHNO",
    "email": "terry.bennett@exotechno.de",
    "registered": "Friday, June 17, 2016 11:54 PM",
    "latitude": "-48.946183",
    "longitude": "32.53167"
  },
  {
    "_id": "5c0e1839e91b27fcce34b70f",
    "index": 45,
    "guid": "0860cb66-de4c-410e-8233-aeef5ee9d64e",
    "isActive": false,
    "balance": "$1,187.75",
    "age": 30,
    "firstName": "Phoebe",
    "lastName": "Bartlett",
    "company": "VORATAK",
    "email": "phoebe.bartlett@voratak.de",
    "registered": "Tuesday, July 25, 2017 2:57 AM",
    "latitude": "-63.208957",
    "longitude": "-91.209743"
  },
  {
    "_id": "5c0e183987e8a4e98415c8dd",
    "index": 46,
    "guid": "49219833-172c-4659-9192-d1116a5ca833",
    "isActive": false,
    "balance": "$3,225.24",
    "age": 38,
    "firstName": "Jordan",
    "lastName": "Evans",
    "company": "PHARMACON",
    "email": "jordan.evans@pharmacon.de",
    "registered": "Sunday, April 23, 2017 6:27 PM",
    "latitude": "-59.454678",
    "longitude": "67.251185"
  },
  {
    "_id": "5c0e183944979692cc1a3e48",
    "index": 47,
    "guid": "680c4d15-d539-4db9-8793-a2f6d3f354aa",
    "isActive": false,
    "balance": "$2,913.14",
    "age": 28,
    "firstName": "Goodman",
    "lastName": "Cain",
    "company": "CAXT",
    "email": "goodman.cain@caxt.de",
    "registered": "Tuesday, November 1, 2016 6:11 PM",
    "latitude": "-30.187547",
    "longitude": "-164.313273"
  },
  {
    "_id": "5c0e1839ef5312ac08e3cbc3",
    "index": 48,
    "guid": "85f5fa5d-b6b3-47c6-ad1b-faee10a4e1bd",
    "isActive": true,
    "balance": "$544.97",
    "age": 27,
    "firstName": "Aisha",
    "lastName": "Oliver",
    "company": "MINGA",
    "email": "aisha.oliver@minga.de",
    "registered": "Sunday, July 3, 2016 8:18 AM",
    "latitude": "-21.527536",
    "longitude": "141.029691"
  },
  {
    "_id": "5c0e1839c2e58f5da04f29fd",
    "index": 49,
    "guid": "e2ee9b25-5887-49a9-a1c6-17432154d266",
    "isActive": true,
    "balance": "$3,621.65",
    "age": 31,
    "firstName": "Erin",
    "lastName": "Lester",
    "company": "SLOFAST",
    "email": "erin.lester@slofast.de",
    "registered": "Saturday, February 20, 2016 5:13 AM",
    "latitude": "-30.080798",
    "longitude": "-1.291093"
  }
];

const components = {
  'counter': 'demoApp.counter'
};

const AboutComponent = (props: WithComponents<typeof components> & WithStyles<typeof styles> ) => {
  return (
    <div>
      <h2>About</h2>
      <ExpansionPanel>
        <ExpansionPanelSummary expandIcon={ <ExpandMoreIcon /> }>
          <Typography className={ props.classes.heading }>Client Side Table Demo</Typography>
        </ExpansionPanelSummary>
        <ExpansionPanelDetails>
          <MaterialTable rows={ tableData } columns={
            [
              { property: "index", type: ColumnType.text, title: "Index", width: "80px", disableFilter:true, disableSorting:true, disablePadding:true },
              { property: "firstName", type: ColumnType.text, title: "First Name" },
              { property: "lastName", type: ColumnType.text, title: "Last Name" },
              { property: "age", type: ColumnType.numeric, title: "Age", width: "60px" },
              { property: "email", type: ColumnType.text, title: "eMail" },
              { property: "actions", type: ColumnType.custom, title: "Actions", customControl: ({ rowData }) => (<div>Button</div>) },
            ]
          } idProperty={ "_id" } title={ "Customers 2018" } >
          </MaterialTable>
        </ExpansionPanelDetails>
      </ExpansionPanel>

    </div>
  )
};

export const About = withComponents(components)(withStyles(styles)(AboutComponent));
export default About;