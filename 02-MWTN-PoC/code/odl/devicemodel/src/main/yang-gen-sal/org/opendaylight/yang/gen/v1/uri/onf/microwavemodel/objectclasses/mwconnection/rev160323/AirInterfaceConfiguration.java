package org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323;
import org.opendaylight.yangtools.yang.binding.DataObject;
import org.opendaylight.yangtools.yang.common.QName;
import java.math.BigInteger;


/**
 * &lt;p&gt;This class represents the following YANG schema fragment defined in module &lt;b&gt;MicrowaveModel-ObjectClasses-MwConnection&lt;/b&gt;
 * &lt;br&gt;(Source path: &lt;i&gt;META-INF/yang/MicrowaveModel-ObjectClasses-MwConnection.yang&lt;/i&gt;):
 * &lt;pre&gt;
 * grouping AirInterfaceConfiguration {
 *     leaf airInterfaceName {
 *         type string;
 *     }
 *     leaf radioSignalId {
 *         type string;
 *     }
 *     leaf txFrequency {
 *         type uint64;
 *     }
 *     leaf rxFrequency {
 *         type uint64;
 *     }
 *     leaf txChannelBandwidth {
 *         type uint64;
 *     }
 *     leaf rxChannelBandwidth {
 *         type uint64;
 *     }
 *     leaf powerIsOn {
 *         type boolean;
 *     }
 *     leaf transmitterIsOn {
 *         type boolean;
 *     }
 *     leaf txPower {
 *         type int64;
 *     }
 *     leaf adaptiveModulationIsOn {
 *         type boolean;
 *     }
 *     leaf modulationMin {
 *         type uint64;
 *     }
 *     leaf modulationMax {
 *         type uint64;
 *     }
 *     leaf xpicIsOn {
 *         type boolean;
 *     }
 * }
 * &lt;/pre&gt;
 * The schema path to identify an instance is
 * &lt;i&gt;MicrowaveModel-ObjectClasses-MwConnection/AirInterfaceConfiguration&lt;/i&gt;
 *
 */
public interface AirInterfaceConfiguration
    extends
    DataObject
{



    public static final QName QNAME = org.opendaylight.yangtools.yang.common.QName.cachedReference(org.opendaylight.yangtools.yang.common.QName.create("uri:onf:MicrowaveModel-ObjectClasses-MwConnection","2016-03-23","AirInterfaceConfiguration"));

    /**
     * Operator specific microwave link ID (often used for coding area, type of element
     * and sequential number).
     *
     */
    java.lang.String getAirInterfaceName();
    
    /**
     * The radioSignalId is transmitted on the air interface so the remote site of the 
     * link synchronizes on the correct transmitter.The local radio MUST NOT 
     * synchronize on a radio signal with a different radioSignalId.The link ID is 
     * neither an ID necessary to span the model nor an ID referencing external data. 
     * It is just some sort of name of the link transmitted so the correct remote site 
     * can be identified in an interference situation.The value zero might be used to 
     * make the microwave to disable the link ID check.
     *
     */
    java.lang.String getRadioSignalId();
    
    /**
     * Center frequency of the transmit channel.The values to be configured have to 
     * exactly match the values listed in the international agreement referenced in 
     * channelPlanID.In case of automated selection of the transmit frequency this 
     * field shall describe the lowest center frequency selectable.
     *
     */
    BigInteger getTxFrequency();
    
    /**
     * Center frequency of the receive channel.
     *
     */
    BigInteger getRxFrequency();
    
    /**
     * Bandwidth of the transmit channel. The value shall be expressed explicitly 
     * (means in kHz) not as a reference to an international agreement. The values 
     * shall be chosen from the following _list: 3.500, 7.000, 14.000, 27.500, 28.000, 
     * 29.000, 29.650, 30.000, 40.000, 50.000, 55.000, 56.000, 59.300, 60.000, 80.000, 
     * 100.000, 112.000, 120.000, 150.000, 200.000, 250.000, 500.000, 750.000, 
     * 1.000.000, 1.250.000, 1.500.000, 1.750.000, 2.000.000
     *
     */
    BigInteger getTxChannelBandwidth();
    
    /**
     * Bandwidth of the receive channel. The value shall be expressed explicitly (means
     * in kHz) not as a reference to an international agreement. The values shall be 
     * chosen from the following _list: 3.500, 7.000, 14.000, 27.500, 28.000, 29.000, 
     * 29.650, 30.000, 40.000, 50.000, 55.000, 56.000, 59.300, 60.000, 80.000, 100.000,
     * 112.000, 120.000, 150.000, 200.000, 250.000, 500.000, 750.000, 1.000.000, 
     * 1.250.000, 1.500.000, 1.750.000, 2.000.000
     *
     */
    BigInteger getRxChannelBandwidth();
    
    /**
     * Power ON. Activation of the entire radio in a split mount configuration shall be
     * expressed as an '1'.
     *
     */
    java.lang.Boolean isPowerIsOn();
    
    /**
     * Transmit Power. Activation of the transmitter inside the radio shall be 
     * expressed as an '1'.
     *
     */
    java.lang.Boolean isTransmitterIsOn();
    
    /**
     * Transmit power to be configured on the microwave link. Signed Byte is 
     * required.The actually operated transmit power might be lower depending on 
     * adaptive modulation and ATPC.
     *
     */
    java.lang.Long getTxPower();
    
    /**
     * Adaptive Modulation. Activation of adaptive modulation shall be expressed as an 
     * '1'.
     *
     */
    java.lang.Boolean isAdaptiveModulationIsOn();
    
    /**
     * Minimum modulation to be configured (in case adaptive modulation is not used, 
     * this value represents also the fixed modulation).The modulation scheme shall be 
     * described by the number of symbols (e.g. BPSK-&gt;'2' or 
     * 256QAM-&gt;'256').Allowed values are defined in 
     * AirInterface::Script::modulationScheme (all instances of the device).
     *
     */
    BigInteger getModulationMin();
    
    /**
     * Maximum modulation to be configured. The value of this field is only relevant, 
     * if Adaptive Modulation has been activated.The modulation scheme shall be 
     * described by the number of symbols (e.g. BPSK-&gt;'2' or 
     * 256QAM-&gt;'256').Allowed values are defined in 
     * AirInterface::Script::modulationScheme (all instances of the device).
     *
     */
    BigInteger getModulationMax();
    
    /**
     * XPIC. Activation of Cross Polarization Interference Cancellation shall be 
     * expressed as an '1'.
     *
     */
    java.lang.Boolean isXpicIsOn();

}

