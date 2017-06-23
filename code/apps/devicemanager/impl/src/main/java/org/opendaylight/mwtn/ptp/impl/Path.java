/**
 *
 */
package org.opendaylight.mwtn.ptp.impl;

import java.util.List;

/**
 * Path list with logical-termination-point list
 "path" : [{
  "path-id": "4d778388-41c8-11e7-a919-92ebcb67fe33",
  "path-name": "NE-10-ClockIdentity",
  "layer-protocol-name": "PTP",
  "directionality": "unidirectional",
  "logical-termination-point": [{
    "ltp-reference":"yep",
    "physical-port-reference": "shelf:1-slot:1-Card-port:5",
    "node-reference":"NE-10",
    "site-reference": "site-a",
    "site-name": "GUI-Label",
    "geo-location": {
       "longitude": "54.123456",
       "latitude": "13.123456"
    }]
  }]
 * @author herbert
 *
 */
public class Path {

    String pathId;
    String pathName;
    String layperProtocolName;
    String directionality;
    List<LogicalTerminationPoint> logicalTerminationPoints;

}
