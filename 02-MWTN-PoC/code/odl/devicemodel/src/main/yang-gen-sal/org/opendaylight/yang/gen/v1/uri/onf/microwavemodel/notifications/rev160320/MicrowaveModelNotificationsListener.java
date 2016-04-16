package org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.notifications.rev160320;
import org.opendaylight.yangtools.yang.binding.NotificationListener;


/**
 * Interface for receiving the following YANG notifications defined in module &lt;b&gt;MicrowaveModel-Notifications&lt;/b&gt;
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
 * notification ObjectCreationNotification {
 *     leaf counter {
 *         type uint64;
 *     }
 *     leaf timeStamp {
 *         type DateAndTime;
 *     }
 *     leaf objectId {
 *         type UniversalId;
 *     }
 *     status CURRENT;
 * }
 * notification ObjectDeletionNotification {
 *     leaf counter {
 *         type uint64;
 *     }
 *     leaf timeStamp {
 *         type DateAndTime;
 *     }
 *     leaf objectId {
 *         type UniversalId;
 *     }
 *     status CURRENT;
 * }
 * notification ProblemNotification {
 *     leaf counter {
 *         type uint64;
 *     }
 *     leaf timeStamp {
 *         type DateAndTime;
 *     }
 *     leaf objectID {
 *         type UniversalId;
 *     }
 *     leaf problem {
 *         type string;
 *     }
 *     leaf severity {
 *         type severityType;
 *     }
 *     status CURRENT;
 * }
 * &lt;/pre&gt;
 *
 */
public interface MicrowaveModelNotificationsListener
    extends
    NotificationListener
{




    void onAttributeValueChangedNotification(AttributeValueChangedNotification notification);
    
    void onObjectCreationNotification(ObjectCreationNotification notification);
    
    void onObjectDeletionNotification(ObjectDeletionNotification notification);
    
    void onProblemNotification(ProblemNotification notification);

}

