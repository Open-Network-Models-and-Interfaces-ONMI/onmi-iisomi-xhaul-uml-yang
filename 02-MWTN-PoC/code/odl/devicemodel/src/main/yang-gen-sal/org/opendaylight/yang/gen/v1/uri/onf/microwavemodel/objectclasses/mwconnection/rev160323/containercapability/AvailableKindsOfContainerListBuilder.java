package org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.containercapability;
import org.opendaylight.yangtools.yang.binding.Augmentation;
import org.opendaylight.yangtools.yang.binding.AugmentationHolder;
import org.opendaylight.yangtools.yang.binding.DataObject;
import java.util.HashMap;
import org.opendaylight.yangtools.concepts.Builder;
import java.math.BigInteger;
import java.util.List;
import org.opendaylight.yang.gen.v1.uri.onf.coremodel.corefoundationmodule.superclassesandcommonpackages.rev160305.UniversalId;
import java.util.Collections;
import com.google.common.collect.Range;
import java.util.Map;


/**
 * Class that builds {@link org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.containercapability.AvailableKindsOfContainerList} instances.
 *
 * @see org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.containercapability.AvailableKindsOfContainerList
 *
 */
public class AvailableKindsOfContainerListBuilder implements Builder <org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.containercapability.AvailableKindsOfContainerList> {

    private java.lang.String _containerName;
    private AvailableKindsOfContainerListKey _key;
    private BigInteger _numberOfTimeSlotsRequired;
    private UniversalId _uuid;
    private java.lang.Boolean _bundlingIsAvail;

    Map<java.lang.Class<? extends Augmentation<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.containercapability.AvailableKindsOfContainerList>>, Augmentation<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.containercapability.AvailableKindsOfContainerList>> augmentation = Collections.emptyMap();

    public AvailableKindsOfContainerListBuilder() {
    }
    public AvailableKindsOfContainerListBuilder(org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.typedefinitions.rev160323.ContainerType arg) {
        this._uuid = arg.getUuid();
        this._containerName = arg.getContainerName();
        this._numberOfTimeSlotsRequired = arg.getNumberOfTimeSlotsRequired();
        this._bundlingIsAvail = arg.isBundlingIsAvail();
    }

    public AvailableKindsOfContainerListBuilder(AvailableKindsOfContainerList base) {
        if (base.getKey() == null) {
            this._key = new AvailableKindsOfContainerListKey(
                base.getUuid()
            );
            this._uuid = base.getUuid();
        } else {
            this._key = base.getKey();
            this._uuid = _key.getUuid();
        }
        this._containerName = base.getContainerName();
        this._numberOfTimeSlotsRequired = base.getNumberOfTimeSlotsRequired();
        this._bundlingIsAvail = base.isBundlingIsAvail();
        if (base instanceof AvailableKindsOfContainerListImpl) {
            AvailableKindsOfContainerListImpl impl = (AvailableKindsOfContainerListImpl) base;
            if (!impl.augmentation.isEmpty()) {
                this.augmentation = new HashMap<>(impl.augmentation);
            }
        } else if (base instanceof AugmentationHolder) {
            @SuppressWarnings("unchecked")
            AugmentationHolder<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.containercapability.AvailableKindsOfContainerList> casted =(AugmentationHolder<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.containercapability.AvailableKindsOfContainerList>) base;
            if (!casted.augmentations().isEmpty()) {
                this.augmentation = new HashMap<>(casted.augmentations());
            }
        }
    }

    /**
     *Set fields from given grouping argument. Valid argument is instance of one of following types:
     * <ul>
     * <li>org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.typedefinitions.rev160323.ContainerType</li>
     * </ul>
     *
     * @param arg grouping object
     * @throws IllegalArgumentException if given argument is none of valid types
    */
    public void fieldsFrom(DataObject arg) {
        boolean isValidArg = false;
        if (arg instanceof org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.typedefinitions.rev160323.ContainerType) {
            this._uuid = ((org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.typedefinitions.rev160323.ContainerType)arg).getUuid();
            this._containerName = ((org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.typedefinitions.rev160323.ContainerType)arg).getContainerName();
            this._numberOfTimeSlotsRequired = ((org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.typedefinitions.rev160323.ContainerType)arg).getNumberOfTimeSlotsRequired();
            this._bundlingIsAvail = ((org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.typedefinitions.rev160323.ContainerType)arg).isBundlingIsAvail();
            isValidArg = true;
        }
        if (!isValidArg) {
            throw new IllegalArgumentException(
              "expected one of: [org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.typedefinitions.rev160323.ContainerType] \n" +
              "but was: " + arg
            );
        }
    }

    public java.lang.String getContainerName() {
        return _containerName;
    }
    
    public AvailableKindsOfContainerListKey getKey() {
        return _key;
    }
    
    public BigInteger getNumberOfTimeSlotsRequired() {
        return _numberOfTimeSlotsRequired;
    }
    
    public UniversalId getUuid() {
        return _uuid;
    }
    
    public java.lang.Boolean isBundlingIsAvail() {
        return _bundlingIsAvail;
    }
    
    @SuppressWarnings("unchecked")
    public <E extends Augmentation<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.containercapability.AvailableKindsOfContainerList>> E getAugmentation(java.lang.Class<E> augmentationType) {
        if (augmentationType == null) {
            throw new IllegalArgumentException("Augmentation Type reference cannot be NULL!");
        }
        return (E) augmentation.get(augmentationType);
    }

    public AvailableKindsOfContainerListBuilder setContainerName(java.lang.String value) {
        this._containerName = value;
        return this;
    }
    
    public AvailableKindsOfContainerListBuilder setKey(AvailableKindsOfContainerListKey value) {
        this._key = value;
        return this;
    }
    
    private static final com.google.common.collect.Range<java.math.BigInteger>[] CHECKNUMBEROFTIMESLOTSREQUIREDRANGE_RANGES;
    static {
        @SuppressWarnings("unchecked")
        final com.google.common.collect.Range<java.math.BigInteger>[] a = (com.google.common.collect.Range<java.math.BigInteger>[]) java.lang.reflect.Array.newInstance(com.google.common.collect.Range.class, 1);
        a[0] = com.google.common.collect.Range.closed(java.math.BigInteger.ZERO, new java.math.BigInteger("18446744073709551615"));
        CHECKNUMBEROFTIMESLOTSREQUIREDRANGE_RANGES = a;
    }
    private static void checkNumberOfTimeSlotsRequiredRange(final java.math.BigInteger value) {
        for (com.google.common.collect.Range<java.math.BigInteger> r : CHECKNUMBEROFTIMESLOTSREQUIREDRANGE_RANGES) {
            if (r.contains(value)) {
                return;
            }
        }
        throw new IllegalArgumentException(String.format("Invalid range: %s, expected: %s.", value, java.util.Arrays.asList(CHECKNUMBEROFTIMESLOTSREQUIREDRANGE_RANGES)));
    }
    
    public AvailableKindsOfContainerListBuilder setNumberOfTimeSlotsRequired(BigInteger value) {
        if (value != null) {
            checkNumberOfTimeSlotsRequiredRange(value);
        }
        this._numberOfTimeSlotsRequired = value;
        return this;
    }
    /**
     * @deprecated This method is slated for removal in a future release. See BUG-1485 for details.
     */
    @Deprecated
    public static List<Range<BigInteger>> _numberOfTimeSlotsRequired_range() {
        final List<Range<BigInteger>> ret = new java.util.ArrayList<>(1);
        ret.add(Range.closed(BigInteger.ZERO, new BigInteger("18446744073709551615")));
        return ret;
    }
    
    public AvailableKindsOfContainerListBuilder setUuid(UniversalId value) {
        if (value != null) {
        }
        this._uuid = value;
        return this;
    }
    
    public AvailableKindsOfContainerListBuilder setBundlingIsAvail(java.lang.Boolean value) {
        this._bundlingIsAvail = value;
        return this;
    }
    
    public AvailableKindsOfContainerListBuilder addAugmentation(java.lang.Class<? extends Augmentation<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.containercapability.AvailableKindsOfContainerList>> augmentationType, Augmentation<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.containercapability.AvailableKindsOfContainerList> augmentation) {
        if (augmentation == null) {
            return removeAugmentation(augmentationType);
        }
    
        if (!(this.augmentation instanceof HashMap)) {
            this.augmentation = new HashMap<>();
        }
    
        this.augmentation.put(augmentationType, augmentation);
        return this;
    }
    
    public AvailableKindsOfContainerListBuilder removeAugmentation(java.lang.Class<? extends Augmentation<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.containercapability.AvailableKindsOfContainerList>> augmentationType) {
        if (this.augmentation instanceof HashMap) {
            this.augmentation.remove(augmentationType);
        }
        return this;
    }

    public AvailableKindsOfContainerList build() {
        return new AvailableKindsOfContainerListImpl(this);
    }

    private static final class AvailableKindsOfContainerListImpl implements AvailableKindsOfContainerList {

        public java.lang.Class<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.containercapability.AvailableKindsOfContainerList> getImplementedInterface() {
            return org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.containercapability.AvailableKindsOfContainerList.class;
        }

        private final java.lang.String _containerName;
        private final AvailableKindsOfContainerListKey _key;
        private final BigInteger _numberOfTimeSlotsRequired;
        private final UniversalId _uuid;
        private final java.lang.Boolean _bundlingIsAvail;

        private Map<java.lang.Class<? extends Augmentation<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.containercapability.AvailableKindsOfContainerList>>, Augmentation<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.containercapability.AvailableKindsOfContainerList>> augmentation = Collections.emptyMap();

        private AvailableKindsOfContainerListImpl(AvailableKindsOfContainerListBuilder base) {
            if (base.getKey() == null) {
                this._key = new AvailableKindsOfContainerListKey(
                    base.getUuid()
                );
                this._uuid = base.getUuid();
            } else {
                this._key = base.getKey();
                this._uuid = _key.getUuid();
            }
            this._containerName = base.getContainerName();
            this._numberOfTimeSlotsRequired = base.getNumberOfTimeSlotsRequired();
            this._bundlingIsAvail = base.isBundlingIsAvail();
            switch (base.augmentation.size()) {
            case 0:
                this.augmentation = Collections.emptyMap();
                break;
            case 1:
                final Map.Entry<java.lang.Class<? extends Augmentation<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.containercapability.AvailableKindsOfContainerList>>, Augmentation<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.containercapability.AvailableKindsOfContainerList>> e = base.augmentation.entrySet().iterator().next();
                this.augmentation = Collections.<java.lang.Class<? extends Augmentation<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.containercapability.AvailableKindsOfContainerList>>, Augmentation<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.containercapability.AvailableKindsOfContainerList>>singletonMap(e.getKey(), e.getValue());
                break;
            default :
                this.augmentation = new HashMap<>(base.augmentation);
            }
        }

        @Override
        public java.lang.String getContainerName() {
            return _containerName;
        }
        
        @Override
        public AvailableKindsOfContainerListKey getKey() {
            return _key;
        }
        
        @Override
        public BigInteger getNumberOfTimeSlotsRequired() {
            return _numberOfTimeSlotsRequired;
        }
        
        @Override
        public UniversalId getUuid() {
            return _uuid;
        }
        
        @Override
        public java.lang.Boolean isBundlingIsAvail() {
            return _bundlingIsAvail;
        }
        
        @SuppressWarnings("unchecked")
        @Override
        public <E extends Augmentation<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.containercapability.AvailableKindsOfContainerList>> E getAugmentation(java.lang.Class<E> augmentationType) {
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
            result = prime * result + ((_containerName == null) ? 0 : _containerName.hashCode());
            result = prime * result + ((_key == null) ? 0 : _key.hashCode());
            result = prime * result + ((_numberOfTimeSlotsRequired == null) ? 0 : _numberOfTimeSlotsRequired.hashCode());
            result = prime * result + ((_uuid == null) ? 0 : _uuid.hashCode());
            result = prime * result + ((_bundlingIsAvail == null) ? 0 : _bundlingIsAvail.hashCode());
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
            if (!org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.containercapability.AvailableKindsOfContainerList.class.equals(((DataObject)obj).getImplementedInterface())) {
                return false;
            }
            org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.containercapability.AvailableKindsOfContainerList other = (org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.containercapability.AvailableKindsOfContainerList)obj;
            if (_containerName == null) {
                if (other.getContainerName() != null) {
                    return false;
                }
            } else if(!_containerName.equals(other.getContainerName())) {
                return false;
            }
            if (_key == null) {
                if (other.getKey() != null) {
                    return false;
                }
            } else if(!_key.equals(other.getKey())) {
                return false;
            }
            if (_numberOfTimeSlotsRequired == null) {
                if (other.getNumberOfTimeSlotsRequired() != null) {
                    return false;
                }
            } else if(!_numberOfTimeSlotsRequired.equals(other.getNumberOfTimeSlotsRequired())) {
                return false;
            }
            if (_uuid == null) {
                if (other.getUuid() != null) {
                    return false;
                }
            } else if(!_uuid.equals(other.getUuid())) {
                return false;
            }
            if (_bundlingIsAvail == null) {
                if (other.isBundlingIsAvail() != null) {
                    return false;
                }
            } else if(!_bundlingIsAvail.equals(other.isBundlingIsAvail())) {
                return false;
            }
            if (getClass() == obj.getClass()) {
                // Simple case: we are comparing against self
                AvailableKindsOfContainerListImpl otherImpl = (AvailableKindsOfContainerListImpl) obj;
                if (augmentation == null) {
                    if (otherImpl.augmentation != null) {
                        return false;
                    }
                } else if(!augmentation.equals(otherImpl.augmentation)) {
                    return false;
                }
            } else {
                // Hard case: compare our augments with presence there...
                for (Map.Entry<java.lang.Class<? extends Augmentation<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.containercapability.AvailableKindsOfContainerList>>, Augmentation<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.containercapability.AvailableKindsOfContainerList>> e : augmentation.entrySet()) {
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
            java.lang.StringBuilder builder = new java.lang.StringBuilder ("AvailableKindsOfContainerList [");
            boolean first = true;
        
            if (_containerName != null) {
                if (first) {
                    first = false;
                } else {
                    builder.append(", ");
                }
                builder.append("_containerName=");
                builder.append(_containerName);
             }
            if (_key != null) {
                if (first) {
                    first = false;
                } else {
                    builder.append(", ");
                }
                builder.append("_key=");
                builder.append(_key);
             }
            if (_numberOfTimeSlotsRequired != null) {
                if (first) {
                    first = false;
                } else {
                    builder.append(", ");
                }
                builder.append("_numberOfTimeSlotsRequired=");
                builder.append(_numberOfTimeSlotsRequired);
             }
            if (_uuid != null) {
                if (first) {
                    first = false;
                } else {
                    builder.append(", ");
                }
                builder.append("_uuid=");
                builder.append(_uuid);
             }
            if (_bundlingIsAvail != null) {
                if (first) {
                    first = false;
                } else {
                    builder.append(", ");
                }
                builder.append("_bundlingIsAvail=");
                builder.append(_bundlingIsAvail);
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
