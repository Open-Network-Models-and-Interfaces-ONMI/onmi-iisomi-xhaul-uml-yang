package org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.notifications.rev160320;
import org.opendaylight.yangtools.yang.binding.DataObject;
import org.opendaylight.yangtools.yang.common.QName;
import java.math.BigInteger;
import org.opendaylight.yang.gen.v1.uri.onf.coremodel.corefoundationmodule.typedefinitions.rev160305.DateAndTime;
import org.opendaylight.yang.gen.v1.uri.onf.coremodel.corefoundationmodule.superclassesandcommonpackages.rev160305.UniversalId;
import org.opendaylight.yangtools.yang.binding.Augmentable;
import org.opendaylight.yangtools.yang.binding.Notification;


/**
 * &lt;p&gt;This class represents the following YANG schema fragment defined in module &lt;b&gt;MicrowaveModel-Notifications&lt;/b&gt;
 * &lt;br&gt;(Source path: &lt;i&gt;META-INF/yang/MicrowaveModel-Notifications.yang&lt;/i&gt;):
 * &lt;pre&gt;
 * notification AttributeValueChangedNotification {
 *     leaf counter {
 *         type uint64;
 *     }
 *     leaf timeStamp {
 *         type DateAndTime;
 *     }
 *     leaf objectId {
 *         type UniversalId;
 *     }
 *     leaf attributeName {
 *         type string;
 *     }
 *     leaf newValue {
 *         type string;
 *     }
 *     status CURRENT;
 * }
 * &lt;/pre&gt;
 * The schema path to identify an instance is
 * &lt;i&gt;MicrowaveModel-Notifications/AttributeValueChangedNotification&lt;/i&gt;
 *
 * &lt;p&gt;To create instances of this class use {@link org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.notifications.rev160320.AttributeValueChangedNotificationBuilder}.
 * @see org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.notifications.rev160320.AttributeValueChangedNotificationBuilder
 *
 */
public interface AttributeValueChangedNotification
    extends
    DataObject,
    Augmentable<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.notifications.rev160320.AttributeValueChangedNotification>,
    Notification
{



    public static final QName QNAME = org.opendaylight.yangtools.yang.common.QName.cachedReference(org.opendaylight.yangtools.yang.common.QName.create("uri:onf:MicrowaveModel-Notifications","2016-03-20","AttributeValueChangedNotification"));

    BigInteger getCounter();
    
    DateAndTime getTimeStamp();
    
    UniversalId getObjectId();
    
    java.lang.String getAttributeName();
    
    /**
     * Attribute value converted to a sring (xml, json, ...)
     *
     */
    java.lang.String getNewValue();

}

