package org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.notifications.rev160320;
import org.opendaylight.yangtools.yang.binding.Augmentation;
import org.opendaylight.yangtools.yang.binding.AugmentationHolder;
import org.opendaylight.yangtools.yang.binding.DataObject;
import java.util.HashMap;
import org.opendaylight.yangtools.concepts.Builder;
import java.math.BigInteger;
import org.opendaylight.yang.gen.v1.uri.onf.coremodel.corefoundationmodule.typedefinitions.rev160305.DateAndTime;
import java.util.List;
import org.opendaylight.yang.gen.v1.uri.onf.coremodel.corefoundationmodule.superclassesandcommonpackages.rev160305.UniversalId;
import java.util.Collections;
import com.google.common.collect.Range;
import java.util.Map;


/**
 * Class that builds {@link org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.notifications.rev160320.AttributeValueChangedNotification} instances.
 *
 * @see org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.notifications.rev160320.AttributeValueChangedNotification
 *
 */
public class AttributeValueChangedNotificationBuilder implements Builder <org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.notifications.rev160320.AttributeValueChangedNotification> {

    private java.lang.String _attributeName;
    private BigInteger _counter;
    private java.lang.String _newValue;
    private UniversalId _objectId;
    private DateAndTime _timeStamp;

    Map<java.lang.Class<? extends Augmentation<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.notifications.rev160320.AttributeValueChangedNotification>>, Augmentation<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.notifications.rev160320.AttributeValueChangedNotification>> augmentation = Collections.emptyMap();

    public AttributeValueChangedNotificationBuilder() {
    }

    public AttributeValueChangedNotificationBuilder(AttributeValueChangedNotification base) {
        this._attributeName = base.getAttributeName();
        this._counter = base.getCounter();
        this._newValue = base.getNewValue();
        this._objectId = base.getObjectId();
        this._timeStamp = base.getTimeStamp();
        if (base instanceof AttributeValueChangedNotificationImpl) {
            AttributeValueChangedNotificationImpl impl = (AttributeValueChangedNotificationImpl) base;
            if (!impl.augmentation.isEmpty()) {
                this.augmentation = new HashMap<>(impl.augmentation);
            }
        } else if (base instanceof AugmentationHolder) {
            @SuppressWarnings("unchecked")
            AugmentationHolder<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.notifications.rev160320.AttributeValueChangedNotification> casted =(AugmentationHolder<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.notifications.rev160320.AttributeValueChangedNotification>) base;
            if (!casted.augmentations().isEmpty()) {
                this.augmentation = new HashMap<>(casted.augmentations());
            }
        }
    }


    public java.lang.String getAttributeName() {
        return _attributeName;
    }
    
    public BigInteger getCounter() {
        return _counter;
    }
    
    public java.lang.String getNewValue() {
        return _newValue;
    }
    
    public UniversalId getObjectId() {
        return _objectId;
    }
    
    public DateAndTime getTimeStamp() {
        return _timeStamp;
    }
    
    @SuppressWarnings("unchecked")
    public <E extends Augmentation<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.notifications.rev160320.AttributeValueChangedNotification>> E getAugmentation(java.lang.Class<E> augmentationType) {
        if (augmentationType == null) {
            throw new IllegalArgumentException("Augmentation Type reference cannot be NULL!");
        }
        return (E) augmentation.get(augmentationType);
    }

    public AttributeValueChangedNotificationBuilder setAttributeName(java.lang.String value) {
        this._attributeName = value;
        return this;
    }
    
    private static final com.google.common.collect.Range<java.math.BigInteger>[] CHECKCOUNTERRANGE_RANGES;
    static {
        @SuppressWarnings("unchecked")
        final com.google.common.collect.Range<java.math.BigInteger>[] a = (com.google.common.collect.Range<java.math.BigInteger>[]) java.lang.reflect.Array.newInstance(com.google.common.collect.Range.class, 1);
        a[0] = com.google.common.collect.Range.closed(java.math.BigInteger.ZERO, new java.math.BigInteger("18446744073709551615"));
        CHECKCOUNTERRANGE_RANGES = a;
    }
    private static void checkCounterRange(final java.math.BigInteger value) {
        for (com.google.common.collect.Range<java.math.BigInteger> r : CHECKCOUNTERRANGE_RANGES) {
            if (r.contains(value)) {
                return;
            }
        }
        throw new IllegalArgumentException(String.format("Invalid range: %s, expected: %s.", value, java.util.Arrays.asList(CHECKCOUNTERRANGE_RANGES)));
    }
    
    public AttributeValueChangedNotificationBuilder setCounter(BigInteger value) {
        if (value != null) {
            checkCounterRange(value);
        }
        this._counter = value;
        return this;
    }
    /**
     * @deprecated This method is slated for removal in a future release. See BUG-1485 for details.
     */
    @Deprecated
    public static List<Range<BigInteger>> _counter_range() {
        final List<Range<BigInteger>> ret = new java.util.ArrayList<>(1);
        ret.add(Range.closed(BigInteger.ZERO, new BigInteger("18446744073709551615")));
        return ret;
    }
    
    public AttributeValueChangedNotificationBuilder setNewValue(java.lang.String value) {
        this._newValue = value;
        return this;
    }
    
    public AttributeValueChangedNotificationBuilder setObjectId(UniversalId value) {
        if (value != null) {
        }
        this._objectId = value;
        return this;
    }
    
    public AttributeValueChangedNotificationBuilder setTimeStamp(DateAndTime value) {
        if (value != null) {
        }
        this._timeStamp = value;
        return this;
    }
    
    public AttributeValueChangedNotificationBuilder addAugmentation(java.lang.Class<? extends Augmentation<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.notifications.rev160320.AttributeValueChangedNotification>> augmentationType, Augmentation<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.notifications.rev160320.AttributeValueChangedNotification> augmentation) {
        if (augmentation == null) {
            return removeAugmentation(augmentationType);
        }
    
        if (!(this.augmentation instanceof HashMap)) {
            this.augmentation = new HashMap<>();
        }
    
        this.augmentation.put(augmentationType, augmentation);
        return this;
    }
    
    public AttributeValueChangedNotificationBuilder removeAugmentation(java.lang.Class<? extends Augmentation<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.notifications.rev160320.AttributeValueChangedNotification>> augmentationType) {
        if (this.augmentation instanceof HashMap) {
            this.augmentation.remove(augmentationType);
        }
        return this;
    }

    public AttributeValueChangedNotification build() {
        return new AttributeValueChangedNotificationImpl(this);
    }

    private static final class AttributeValueChangedNotificationImpl implements AttributeValueChangedNotification {

        public java.lang.Class<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.notifications.rev160320.AttributeValueChangedNotification> getImplementedInterface() {
            return org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.notifications.rev160320.AttributeValueChangedNotification.class;
        }

        private final java.lang.String _attributeName;
        private final BigInteger _counter;
        private final java.lang.String _newValue;
        private final UniversalId _objectId;
        private final DateAndTime _timeStamp;

        private Map<java.lang.Class<? extends Augmentation<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.notifications.rev160320.AttributeValueChangedNotification>>, Augmentation<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.notifications.rev160320.AttributeValueChangedNotification>> augmentation = Collections.emptyMap();

        private AttributeValueChangedNotificationImpl(AttributeValueChangedNotificationBuilder base) {
            this._attributeName = base.getAttributeName();
            this._counter = base.getCounter();
            this._newValue = base.getNewValue();
            this._objectId = base.getObjectId();
            this._timeStamp = base.getTimeStamp();
            switch (base.augmentation.size()) {
            case 0:
                this.augmentation = Collections.emptyMap();
                break;
            case 1:
                final Map.Entry<java.lang.Class<? extends Augmentation<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.notifications.rev160320.AttributeValueChangedNotification>>, Augmentation<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.notifications.rev160320.AttributeValueChangedNotification>> e = base.augmentation.entrySet().iterator().next();
                this.augmentation = Collections.<java.lang.Class<? extends Augmentation<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.notifications.rev160320.AttributeValueChangedNotification>>, Augmentation<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.notifications.rev160320.AttributeValueChangedNotification>>singletonMap(e.getKey(), e.getValue());
                break;
            default :
                this.augmentation = new HashMap<>(base.augmentation);
            }
        }

        @Override
        public java.lang.String getAttributeName() {
            return _attributeName;
        }
        
        @Override
        public BigInteger getCounter() {
            return _counter;
        }
        
        @Override
        public java.lang.String getNewValue() {
            return _newValue;
        }
        
        @Override
        public UniversalId getObjectId() {
            return _objectId;
        }
        
        @Override
        public DateAndTime getTimeStamp() {
            return _timeStamp;
        }
        
        @SuppressWarnings("unchecked")
        @Override
        public <E extends Augmentation<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.notifications.rev160320.AttributeValueChangedNotification>> E getAugmentation(java.lang.Class<E> augmentationType) {
            if (augmentationType == null) {
                throw new IllegalArgumentException("Augmentation Type reference cannot be NULL!");
            }
            return (E) augmentation.get(augmentationType);
        }

        private int hash = 0;
        private volatile boolean hashValid = false;
        
        @Override
        public int hashCode() {
            if (hashValid) {
                return hash;
            }
        
            final int prime = 31;
            int result = 1;
            result = prime * result + ((_attributeName == null) ? 0 : _attributeName.hashCode());
            result = prime * result + ((_counter == null) ? 0 : _counter.hashCode());
            result = prime * result + ((_newValue == null) ? 0 : _newValue.hashCode());
            result = prime * result + ((_objectId == null) ? 0 : _objectId.hashCode());
            result = prime * result + ((_timeStamp == null) ? 0 : _timeStamp.hashCode());
            result = prime * result + ((augmentation == null) ? 0 : augmentation.hashCode());
        
            hash = result;
            hashValid = true;
            return result;
        }

        @Override
        public boolean equals(java.lang.Object obj) {
            if (this == obj) {
                return true;
            }
            if (!(obj instanceof DataObject)) {
                return false;
            }
            if (!org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.notifications.rev160320.AttributeValueChangedNotification.class.equals(((DataObject)obj).getImplementedInterface())) {
                return false;
            }
            org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.notifications.rev160320.AttributeValueChangedNotification other = (org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.notifications.rev160320.AttributeValueChangedNotification)obj;
            if (_attributeName == null) {
                if (other.getAttributeName() != null) {
                    return false;
                }
            } else if(!_attributeName.equals(other.getAttributeName())) {
                return false;
            }
            if (_counter == null) {
                if (other.getCounter() != null) {
                    return false;
                }
            } else if(!_counter.equals(other.getCounter())) {
                return false;
            }
            if (_newValue == null) {
                if (other.getNewValue() != null) {
                    return false;
                }
            } else if(!_newValue.equals(other.getNewValue())) {
                return false;
            }
            if (_objectId == null) {
                if (other.getObjectId() != null) {
                    return false;
                }
            } else if(!_objectId.equals(other.getObjectId())) {
                return false;
            }
            if (_timeStamp == null) {
                if (other.getTimeStamp() != null) {
                    return false;
                }
            } else if(!_timeStamp.equals(other.getTimeStamp())) {
                return false;
            }
            if (getClass() == obj.getClass()) {
                // Simple case: we are comparing against self
                AttributeValueChangedNotificationImpl otherImpl = (AttributeValueChangedNotificationImpl) obj;
                if (augmentation == null) {
                    if (otherImpl.augmentation != null) {
                        return false;
                    }
                } else if(!augmentation.equals(otherImpl.augmentation)) {
                    return false;
                }
            } else {
                // Hard case: compare our augments with presence there...
                for (Map.Entry<java.lang.Class<? extends Augmentation<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.notifications.rev160320.AttributeValueChangedNotification>>, Augmentation<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.notifications.rev160320.AttributeValueChangedNotification>> e : augmentation.entrySet()) {
                    if (!e.getValue().equals(other.getAugmentation(e.getKey()))) {
                        return false;
                    }
                }
                // .. and give the other one the chance to do the same
                if (!obj.equals(this)) {
                    return false;
                }
            }
            return true;
        }

        @Override
        public java.lang.String toString() {
            java.lang.StringBuilder builder = new java.lang.StringBuilder ("AttributeValueChangedNotification [");
            boolean first = true;
        
            if (_attributeName != null) {
                if (first) {
                    first = false;
                } else {
                    builder.append(", ");
                }
                builder.append("_attributeName=");
                builder.append(_attributeName);
             }
            if (_counter != null) {
                if (first) {
                    first = false;
                } else {
                    builder.append(", ");
                }
                builder.append("_counter=");
                builder.append(_counter);
             }
            if (_newValue != null) {
                if (first) {
                    first = false;
                } else {
                    builder.append(", ");
                }
                builder.append("_newValue=");
                builder.append(_newValue);
             }
            if (_objectId != null) {
                if (first) {
                    first = false;
                } else {
                    builder.append(", ");
                }
                builder.append("_objectId=");
                builder.append(_objectId);
             }
            if (_timeStamp != null) {
                if (first) {
                    first = false;
                } else {
                    builder.append(", ");
                }
                builder.append("_timeStamp=");
                builder.append(_timeStamp);
             }
            if (first) {
                first = false;
            } else {
                builder.append(", ");
            }
            builder.append("augmentation=");
            builder.append(augmentation.values());
            return builder.append(']').toString();
        }
    }

}
