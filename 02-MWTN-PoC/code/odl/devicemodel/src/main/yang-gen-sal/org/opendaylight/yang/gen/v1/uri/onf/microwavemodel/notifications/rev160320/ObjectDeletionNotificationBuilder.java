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
 * Class that builds {@link org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.notifications.rev160320.ObjectDeletionNotification} instances.
 *
 * @see org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.notifications.rev160320.ObjectDeletionNotification
 *
 */
public class ObjectDeletionNotificationBuilder implements Builder <org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.notifications.rev160320.ObjectDeletionNotification> {

    private BigInteger _counter;
    private UniversalId _objectId;
    private DateAndTime _timeStamp;

    Map<java.lang.Class<? extends Augmentation<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.notifications.rev160320.ObjectDeletionNotification>>, Augmentation<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.notifications.rev160320.ObjectDeletionNotification>> augmentation = Collections.emptyMap();

    public ObjectDeletionNotificationBuilder() {
    }

    public ObjectDeletionNotificationBuilder(ObjectDeletionNotification base) {
        this._counter = base.getCounter();
        this._objectId = base.getObjectId();
        this._timeStamp = base.getTimeStamp();
        if (base instanceof ObjectDeletionNotificationImpl) {
            ObjectDeletionNotificationImpl impl = (ObjectDeletionNotificationImpl) base;
            if (!impl.augmentation.isEmpty()) {
                this.augmentation = new HashMap<>(impl.augmentation);
            }
        } else if (base instanceof AugmentationHolder) {
            @SuppressWarnings("unchecked")
            AugmentationHolder<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.notifications.rev160320.ObjectDeletionNotification> casted =(AugmentationHolder<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.notifications.rev160320.ObjectDeletionNotification>) base;
            if (!casted.augmentations().isEmpty()) {
                this.augmentation = new HashMap<>(casted.augmentations());
            }
        }
    }


    public BigInteger getCounter() {
        return _counter;
    }
    
    public UniversalId getObjectId() {
        return _objectId;
    }
    
    public DateAndTime getTimeStamp() {
        return _timeStamp;
    }
    
    @SuppressWarnings("unchecked")
    public <E extends Augmentation<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.notifications.rev160320.ObjectDeletionNotification>> E getAugmentation(java.lang.Class<E> augmentationType) {
        if (augmentationType == null) {
            throw new IllegalArgumentException("Augmentation Type reference cannot be NULL!");
        }
        return (E) augmentation.get(augmentationType);
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
    
    public ObjectDeletionNotificationBuilder setCounter(BigInteger value) {
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
    
    public ObjectDeletionNotificationBuilder setObjectId(UniversalId value) {
        if (value != null) {
        }
        this._objectId = value;
        return this;
    }
    
    public ObjectDeletionNotificationBuilder setTimeStamp(DateAndTime value) {
        if (value != null) {
        }
        this._timeStamp = value;
        return this;
    }
    
    public ObjectDeletionNotificationBuilder addAugmentation(java.lang.Class<? extends Augmentation<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.notifications.rev160320.ObjectDeletionNotification>> augmentationType, Augmentation<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.notifications.rev160320.ObjectDeletionNotification> augmentation) {
        if (augmentation == null) {
            return removeAugmentation(augmentationType);
        }
    
        if (!(this.augmentation instanceof HashMap)) {
            this.augmentation = new HashMap<>();
        }
    
        this.augmentation.put(augmentationType, augmentation);
        return this;
    }
    
    public ObjectDeletionNotificationBuilder removeAugmentation(java.lang.Class<? extends Augmentation<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.notifications.rev160320.ObjectDeletionNotification>> augmentationType) {
        if (this.augmentation instanceof HashMap) {
            this.augmentation.remove(augmentationType);
        }
        return this;
    }

    public ObjectDeletionNotification build() {
        return new ObjectDeletionNotificationImpl(this);
    }

    private static final class ObjectDeletionNotificationImpl implements ObjectDeletionNotification {

        public java.lang.Class<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.notifications.rev160320.ObjectDeletionNotification> getImplementedInterface() {
            return org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.notifications.rev160320.ObjectDeletionNotification.class;
        }

        private final BigInteger _counter;
        private final UniversalId _objectId;
        private final DateAndTime _timeStamp;

        private Map<java.lang.Class<? extends Augmentation<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.notifications.rev160320.ObjectDeletionNotification>>, Augmentation<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.notifications.rev160320.ObjectDeletionNotification>> augmentation = Collections.emptyMap();

        private ObjectDeletionNotificationImpl(ObjectDeletionNotificationBuilder base) {
            this._counter = base.getCounter();
            this._objectId = base.getObjectId();
            this._timeStamp = base.getTimeStamp();
            switch (base.augmentation.size()) {
            case 0:
                this.augmentation = Collections.emptyMap();
                break;
            case 1:
                final Map.Entry<java.lang.Class<? extends Augmentation<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.notifications.rev160320.ObjectDeletionNotification>>, Augmentation<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.notifications.rev160320.ObjectDeletionNotification>> e = base.augmentation.entrySet().iterator().next();
                this.augmentation = Collections.<java.lang.Class<? extends Augmentation<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.notifications.rev160320.ObjectDeletionNotification>>, Augmentation<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.notifications.rev160320.ObjectDeletionNotification>>singletonMap(e.getKey(), e.getValue());
                break;
            default :
                this.augmentation = new HashMap<>(base.augmentation);
            }
        }

        @Override
        public BigInteger getCounter() {
            return _counter;
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
        public <E extends Augmentation<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.notifications.rev160320.ObjectDeletionNotification>> E getAugmentation(java.lang.Class<E> augmentationType) {
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
            result = prime * result + ((_counter == null) ? 0 : _counter.hashCode());
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
            if (!org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.notifications.rev160320.ObjectDeletionNotification.class.equals(((DataObject)obj).getImplementedInterface())) {
                return false;
            }
            org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.notifications.rev160320.ObjectDeletionNotification other = (org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.notifications.rev160320.ObjectDeletionNotification)obj;
            if (_counter == null) {
                if (other.getCounter() != null) {
                    return false;
                }
            } else if(!_counter.equals(other.getCounter())) {
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
                ObjectDeletionNotificationImpl otherImpl = (ObjectDeletionNotificationImpl) obj;
                if (augmentation == null) {
                    if (otherImpl.augmentation != null) {
                        return false;
                    }
                } else if(!augmentation.equals(otherImpl.augmentation)) {
                    return false;
                }
            } else {
                // Hard case: compare our augments with presence there...
                for (Map.Entry<java.lang.Class<? extends Augmentation<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.notifications.rev160320.ObjectDeletionNotification>>, Augmentation<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.notifications.rev160320.ObjectDeletionNotification>> e : augmentation.entrySet()) {
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
            java.lang.StringBuilder builder = new java.lang.StringBuilder ("ObjectDeletionNotification [");
            boolean first = true;
        
            if (_counter != null) {
                if (first) {
                    first = false;
                } else {
                    builder.append(", ");
                }
                builder.append("_counter=");
                builder.append(_counter);
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
