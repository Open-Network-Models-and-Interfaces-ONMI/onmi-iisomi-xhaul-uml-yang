/**
 *
 */
package org.opendaylight.mwtn.base.internalTypes;

import org.opendaylight.mwtn.base.netconf.NetconfTimeStamp;
import org.opendaylight.yang.gen.v1.urn.onf.params.xml.ns.yang.core.model.rev170320.DateAndTime;

/**
 * Converts time stamps into internal format according to ONF1.2 and ISO 8601.
 * @author herbert
 *
 */
public class InternalDateAndTime {

    public static InternalDateAndTime TESTPATTERN = new InternalDateAndTime("2017-01-01T00:00:00.0Z");

    String internalDateAndTime;

    /**
     * Static builder ONF1.2
     * @param time in ONF1.2 yang format
     * @return  InternalDateAndTime
     */
    public static InternalDateAndTime valueOf(DateAndTime time) {
        return new InternalDateAndTime(time);
    }

    /**
     * Static builder ONF1.0
     * @param time in ONF1.0 yang format
     * @return  InternalDateAndTime
     */

    public static InternalDateAndTime valueOf(org.opendaylight.yang.gen.v1.urn.ietf.params.xml.ns.yang.ietf.yang.types.rev130715.DateAndTime time) {
        return new InternalDateAndTime(time);
    }

    /**
     * @return     Getter with String representation
     */
    public String getValue() {
        return internalDateAndTime;
    }

    /*----------------------------------------------------------------
     * Private constructors and functions
     */

    /**
     * Convert ONF 1.2 DateAndTime to String
     * @param time as input
     */
    private InternalDateAndTime(DateAndTime time) {
        internalDateAndTime = NetconfTimeStamp.getTimeStampFromNetconf(time.getValue());
    }

    /**
     * Convert ONF 1.2 DateAndTime to String
     * @param time as input
     */
    private InternalDateAndTime(org.opendaylight.yang.gen.v1.urn.ietf.params.xml.ns.yang.ietf.yang.types.rev130715.DateAndTime time) {
        internalDateAndTime = NetconfTimeStamp.getTimeStampFromNetconf(time.getValue());
    }

    /**
     * Setup static TEST
     * @param internalDateAndTime
     */
    private InternalDateAndTime(String internalDateAndTime) {
        this.internalDateAndTime = internalDateAndTime;
    }



}
