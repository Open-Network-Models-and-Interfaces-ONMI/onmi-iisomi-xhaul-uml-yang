package org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323;
import org.opendaylight.yangtools.yang.binding.DataObject;
import org.opendaylight.yangtools.yang.common.QName;
import java.math.BigInteger;


/**
 * &lt;p&gt;This class represents the following YANG schema fragment defined in module &lt;b&gt;MicrowaveModel-ObjectClasses-MwConnection&lt;/b&gt;
 * &lt;br&gt;(Source path: &lt;i&gt;META-INF/yang/MicrowaveModel-ObjectClasses-MwConnection.yang&lt;/i&gt;):
 * &lt;pre&gt;
 * grouping AirInterfaceStatus {
 *     leaf txFrequencyCur {
 *         type uint64;
 *     }
 *     leaf rxFrequencyCur {
 *         type uint64;
 *     }
 *     leaf txLevelCur {
 *         type int64;
 *     }
 *     leaf rxLevelCur {
 *         type int64;
 *     }
 *     leaf snrCur {
 *         type int64;
 *     }
 *     leaf linkIsUp {
 *         type boolean;
 *     }
 *     leaf xpicIsUp {
 *         type boolean;
 *     }
 * }
 * &lt;/pre&gt;
 * The schema path to identify an instance is
 * &lt;i&gt;MicrowaveModel-ObjectClasses-MwConnection/AirInterfaceStatus&lt;/i&gt;
 *
 */
public interface AirInterfaceStatus
    extends
    DataObject
{



    public static final QName QNAME = org.opendaylight.yangtools.yang.common.QName.cachedReference(org.opendaylight.yangtools.yang.common.QName.create("uri:onf:MicrowaveModel-ObjectClasses-MwConnection","2016-03-23","AirInterfaceStatus"));

    /**
     * Center frequency of the currently operated transmit channel.
     *
     */
    BigInteger getTxFrequencyCur();
    
    /**
     * Center frequency of the currently operated receive channel.
     *
     */
    BigInteger getRxFrequencyCur();
    
    /**
     * Current transmit level. Signed Byte is required.
     *
     */
    java.lang.Long getTxLevelCur();
    
    /**
     * Current receive level. Signed Byte is required.
     *
     */
    java.lang.Long getRxLevelCur();
    
    /**
     * Currently measured signal to noise ratio.
     *
     */
    java.lang.Long getSnrCur();
    
    /**
     * If connection is established to the remote site with the same linkID, this shall
     * be expressed as an '1'.
     *
     */
    java.lang.Boolean isLinkIsUp();
    
    /**
     * If XPIC is currently actually working (not just configured), this shall be 
     * expressed as an '1'.
     *
     */
    java.lang.Boolean isXpicIsUp();

}

