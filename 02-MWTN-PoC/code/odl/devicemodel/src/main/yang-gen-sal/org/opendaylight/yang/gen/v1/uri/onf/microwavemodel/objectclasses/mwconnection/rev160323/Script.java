package org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323;
import org.opendaylight.yangtools.yang.binding.DataObject;
import org.opendaylight.yangtools.yang.common.QName;
import java.math.BigInteger;


/**
 * &lt;p&gt;This class represents the following YANG schema fragment defined in module &lt;b&gt;MicrowaveModel-ObjectClasses-MwConnection&lt;/b&gt;
 * &lt;br&gt;(Source path: &lt;i&gt;META-INF/yang/MicrowaveModel-ObjectClasses-MwConnection.yang&lt;/i&gt;):
 * &lt;pre&gt;
 * grouping Script {
 *     leaf scriptID {
 *         type string;
 *     }
 *     leaf channelBandwidth {
 *         type uint64;
 *     }
 *     leaf modulationScheme {
 *         type uint64;
 *     }
 *     leaf txPowerMin {
 *         type int64;
 *     }
 *     leaf txPowerMax {
 *         type int64;
 *     }
 *     leaf xpicIsAvail {
 *         type boolean;
 *     }
 * }
 * &lt;/pre&gt;
 * The schema path to identify an instance is
 * &lt;i&gt;MicrowaveModel-ObjectClasses-MwConnection/Script&lt;/i&gt;
 *
 */
public interface Script
    extends
    DataObject
{



    public static final QName QNAME = org.opendaylight.yangtools.yang.common.QName.cachedReference(org.opendaylight.yangtools.yang.common.QName.create("uri:onf:MicrowaveModel-ObjectClasses-MwConnection","2016-03-23","Script"));

    /**
     * Indentifies the script for internal reference.
     *
     */
    java.lang.String getScriptID();
    
    /**
     * Bandwidth of the transmit channel. The value shall be expressed explicitly 
     * (means in kHz) not as a reference to an international agreement. The values 
     * shall be chosen from the following _list: 3.500, 7.000, 14.000, 27.500, 28.000, 
     * 29.000, 29.650, 30.000, 40.000, 50.000, 55.000, 56.000, 59.300, 60.000, 80.000, 
     * 100.000, 112.000, 120.000, 150.000, 200.000, 250.000, 500.000, 750.000, 
     * 1.000.000, 1.250.000, 1.500.000, 1.750.000, 2.000.000
     *
     */
    BigInteger getChannelBandwidth();
    
    /**
     * Modulation scheme, which is base to the other characteristics described in the 
     * same instance of Script.The modulation scheme shall be described by the number 
     * of symbols (e.g. BPSK-&gt;'2' or 256QAM-&gt;'256').
     *
     */
    BigInteger getModulationScheme();
    
    /**
     * Value of the minimum transmit power the modem can operate in dBm.
     *
     */
    java.lang.Long getTxPowerMin();
    
    /**
     * Value of the maximum transmit power the modem can operate in dBm.
     *
     */
    java.lang.Long getTxPowerMax();
    
    /**
     * In case the Air Interface Port is capable of XPIC, this field shall contain an 
     * '1'.
     *
     */
    java.lang.Boolean isXpicIsAvail();

}

