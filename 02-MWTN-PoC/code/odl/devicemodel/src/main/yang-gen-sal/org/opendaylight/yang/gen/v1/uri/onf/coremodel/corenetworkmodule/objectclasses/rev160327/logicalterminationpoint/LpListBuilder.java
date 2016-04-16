package org.opendaylight.yang.gen.v1.uri.onf.coremodel.corenetworkmodule.objectclasses.rev160327.logicalterminationpoint;
import org.opendaylight.yangtools.yang.binding.AugmentationHolder;
import org.opendaylight.yang.gen.v1.uri.onf.coremodel.corefoundationmodule.superclassesandcommonpackages.rev160305.name.NameList;
import java.util.HashMap;
import org.opendaylight.yangtools.concepts.Builder;
import com.google.common.collect.Range;
import org.opendaylight.yangtools.yang.binding.Augmentation;
import org.opendaylight.yang.gen.v1.uri.onf.coremodel.corenetworkmodule.typedefinitions.rev160305.TerminationDirection;
import org.opendaylight.yangtools.yang.binding.DataObject;
import org.opendaylight.yang.gen.v1.uri.onf.coremodel.corenetworkmodule.typedefinitions.rev160305.LayerProtocolName;
import java.math.BigInteger;
import org.opendaylight.yang.gen.v1.uri.onf.coremodel.corefoundationmodule.superclassesandcommonpackages.rev160305.localclass.LocalIdList;
import java.util.List;
import org.opendaylight.yang.gen.v1.uri.onf.coremodel.corefoundationmodule.superclassesandcommonpackages.rev160305.UniversalId;
import java.util.Collections;
import java.util.Map;


/**
 * Class that builds {@link org.opendaylight.yang.gen.v1.uri.onf.coremodel.corenetworkmodule.objectclasses.rev160327.logicalterminationpoint.LpList} instances.
 *
 * @see org.opendaylight.yang.gen.v1.uri.onf.coremodel.corenetworkmodule.objectclasses.rev160327.logicalterminationpoint.LpList
 *
 */
public class LpListBuilder implements Builder <org.opendaylight.yang.gen.v1.uri.onf.coremodel.corenetworkmodule.objectclasses.rev160327.logicalterminationpoint.LpList> {

    private BigInteger _configuredClientCapacity;
    private LpListKey _key;
    private LayerProtocolName _layerProtocolName;
    private LocalIdList _localIdList;
    private TerminationDirection _lpDirection;
    private List<NameList> _nameList;
    private UniversalId _uuid;
    private java.lang.Boolean _terminationState;

    Map<java.lang.Class<? extends Augmentation<org.opendaylight.yang.gen.v1.uri.onf.coremodel.corenetworkmodule.objectclasses.rev160327.logicalterminationpoint.LpList>>, Augmentation<org.opendaylight.yang.gen.v1.uri.onf.coremodel.corenetworkmodule.objectclasses.rev160327.logicalterminationpoint.LpList>> augmentation = Collections.emptyMap();

    public LpListBuilder() {
    }
    public LpListBuilder(org.opendaylight.yang.gen.v1.uri.onf.coremodel.corenetworkmodule.objectclasses.rev160327.LayerProtocol arg) {
        this._layerProtocolName = arg.getLayerProtocolName();
        this._configuredClientCapacity = arg.getConfiguredClientCapacity();
        this._lpDirection = arg.getLpDirection();
        this._terminationState = arg.isTerminationState();
        this._uuid = arg.getUuid();
        this._localIdList = arg.getLocalIdList();
        this._nameList = arg.getNameList();
    }
    public LpListBuilder(org.opendaylight.yang.gen.v1.uri.onf.coremodel.corefoundationmodule.superclassesandcommonpackages.rev160305.LocalClass arg) {
        this._uuid = arg.getUuid();
        this._localIdList = arg.getLocalIdList();
        this._nameList = arg.getNameList();
    }
    public LpListBuilder(org.opendaylight.yang.gen.v1.uri.onf.coremodel.corefoundationmodule.superclassesandcommonpackages.rev160305.Name arg) {
        this._nameList = arg.getNameList();
    }

    public LpListBuilder(LpList base) {
        if (base.getKey() == null) {
            this._key = new LpListKey(
                base.getUuid()
            );
            this._uuid = base.getUuid();
        } else {
            this._key = base.getKey();
            this._uuid = _key.getUuid();
        }
        this._configuredClientCapacity = base.getConfiguredClientCapacity();
        this._layerProtocolName = base.getLayerProtocolName();
        this._localIdList = base.getLocalIdList();
        this._lpDirection = base.getLpDirection();
        this._nameList = base.getNameList();
        this._terminationState = base.isTerminationState();
        if (base instanceof LpListImpl) {
            LpListImpl impl = (LpListImpl) base;
            if (!impl.augmentation.isEmpty()) {
                this.augmentation = new HashMap<>(impl.augmentation);
            }
        } else if (base instanceof AugmentationHolder) {
            @SuppressWarnings("unchecked")
            AugmentationHolder<org.opendaylight.yang.gen.v1.uri.onf.coremodel.corenetworkmodule.objectclasses.rev160327.logicalterminationpoint.LpList> casted =(AugmentationHolder<org.opendaylight.yang.gen.v1.uri.onf.coremodel.corenetworkmodule.objectclasses.rev160327.logicalterminationpoint.LpList>) base;
            if (!casted.augmentations().isEmpty()) {
                this.augmentation = new HashMap<>(casted.augmentations());
            }
        }
    }

    /**
     *Set fields from given grouping argument. Valid argument is instance of one of following types:
     * <ul>
     * <li>org.opendaylight.yang.gen.v1.uri.onf.coremodel.corefoundationmodule.superclassesandcommonpackages.rev160305.LocalClass</li>
     * <li>org.opendaylight.yang.gen.v1.uri.onf.coremodel.corenetworkmodule.objectclasses.rev160327.LayerProtocol</li>
     * <li>org.opendaylight.yang.gen.v1.uri.onf.coremodel.corefoundationmodule.superclassesandcommonpackages.rev160305.Name</li>
     * </ul>
     *
     * @param arg grouping object
     * @throws IllegalArgumentException if given argument is none of valid types
    */
    public void fieldsFrom(DataObject arg) {
        boolean isValidArg = false;
        if (arg instanceof org.opendaylight.yang.gen.v1.uri.onf.coremodel.corefoundationmodule.superclassesandcommonpackages.rev160305.LocalClass) {
            this._uuid = ((org.opendaylight.yang.gen.v1.uri.onf.coremodel.corefoundationmodule.superclassesandcommonpackages.rev160305.LocalClass)arg).getUuid();
            this._localIdList = ((org.opendaylight.yang.gen.v1.uri.onf.coremodel.corefoundationmodule.superclassesandcommonpackages.rev160305.LocalClass)arg).getLocalIdList();
            isValidArg = true;
        }
        if (arg instanceof org.opendaylight.yang.gen.v1.uri.onf.coremodel.corenetworkmodule.objectclasses.rev160327.LayerProtocol) {
            this._layerProtocolName = ((org.opendaylight.yang.gen.v1.uri.onf.coremodel.corenetworkmodule.objectclasses.rev160327.LayerProtocol)arg).getLayerProtocolName();
            this._configuredClientCapacity = ((org.opendaylight.yang.gen.v1.uri.onf.coremodel.corenetworkmodule.objectclasses.rev160327.LayerProtocol)arg).getConfiguredClientCapacity();
            this._lpDirection = ((org.opendaylight.yang.gen.v1.uri.onf.coremodel.corenetworkmodule.objectclasses.rev160327.LayerProtocol)arg).getLpDirection();
            this._terminationState = ((org.opendaylight.yang.gen.v1.uri.onf.coremodel.corenetworkmodule.objectclasses.rev160327.LayerProtocol)arg).isTerminationState();
            isValidArg = true;
        }
        if (arg instanceof org.opendaylight.yang.gen.v1.uri.onf.coremodel.corefoundationmodule.superclassesandcommonpackages.rev160305.Name) {
            this._nameList = ((org.opendaylight.yang.gen.v1.uri.onf.coremodel.corefoundationmodule.superclassesandcommonpackages.rev160305.Name)arg).getNameList();
            isValidArg = true;
        }
        if (!isValidArg) {
            throw new IllegalArgumentException(
              "expected one of: [org.opendaylight.yang.gen.v1.uri.onf.coremodel.corefoundationmodule.superclassesandcommonpackages.rev160305.LocalClass, org.opendaylight.yang.gen.v1.uri.onf.coremodel.corenetworkmodule.objectclasses.rev160327.LayerProtocol, org.opendaylight.yang.gen.v1.uri.onf.coremodel.corefoundationmodule.superclassesandcommonpackages.rev160305.Name] \n" +
              "but was: " + arg
            );
        }
    }

    public BigInteger getConfiguredClientCapacity() {
        return _configuredClientCapacity;
    }
    
    public LpListKey getKey() {
        return _key;
    }
    
    public LayerProtocolName getLayerProtocolName() {
        return _layerProtocolName;
    }
    
    public LocalIdList getLocalIdList() {
        return _localIdList;
    }
    
    public TerminationDirection getLpDirection() {
        return _lpDirection;
    }
    
    public List<NameList> getNameList() {
        return _nameList;
    }
    
    public UniversalId getUuid() {
        return _uuid;
    }
    
    public java.lang.Boolean isTerminationState() {
        return _terminationState;
    }
    
    @SuppressWarnings("unchecked")
    public <E extends Augmentation<org.opendaylight.yang.gen.v1.uri.onf.coremodel.corenetworkmodule.objectclasses.rev160327.logicalterminationpoint.LpList>> E getAugmentation(java.lang.Class<E> augmentationType) {
        if (augmentationType == null) {
            throw new IllegalArgumentException("Augmentation Type reference cannot be NULL!");
        }
        return (E) augmentation.get(augmentationType);
    }

    private static final com.google.common.collect.Range<java.math.BigInteger>[] CHECKCONFIGUREDCLIENTCAPACITYRANGE_RANGES;
    static {
        @SuppressWarnings("unchecked")
        final com.google.common.collect.Range<java.math.BigInteger>[] a = (com.google.common.collect.Range<java.math.BigInteger>[]) java.lang.reflect.Array.newInstance(com.google.common.collect.Range.class, 1);
        a[0] = com.google.common.collect.Range.closed(java.math.BigInteger.ZERO, new java.math.BigInteger("18446744073709551615"));
        CHECKCONFIGUREDCLIENTCAPACITYRANGE_RANGES = a;
    }
    private static void checkConfiguredClientCapacityRange(final java.math.BigInteger value) {
        for (com.google.common.collect.Range<java.math.BigInteger> r : CHECKCONFIGUREDCLIENTCAPACITYRANGE_RANGES) {
            if (r.contains(value)) {
                return;
            }
        }
        throw new IllegalArgumentException(String.format("Invalid range: %s, expected: %s.", value, java.util.Arrays.asList(CHECKCONFIGUREDCLIENTCAPACITYRANGE_RANGES)));
    }
    
    public LpListBuilder setConfiguredClientCapacity(BigInteger value) {
        if (value != null) {
            checkConfiguredClientCapacityRange(value);
        }
        this._configuredClientCapacity = value;
        return this;
    }
    /**
     * @deprecated This method is slated for removal in a future release. See BUG-1485 for details.
     */
    @Deprecated
    public static List<Range<BigInteger>> _configuredClientCapacity_range() {
        final List<Range<BigInteger>> ret = new java.util.ArrayList<>(1);
        ret.add(Range.closed(BigInteger.ZERO, new BigInteger("18446744073709551615")));
        return ret;
    }
    
    public LpListBuilder setKey(LpListKey value) {
        this._key = value;
        return this;
    }
    
    public LpListBuilder setLayerProtocolName(LayerProtocolName value) {
        if (value != null) {
        }
        this._layerProtocolName = value;
        return this;
    }
    
    public LpListBuilder setLocalIdList(LocalIdList value) {
        this._localIdList = value;
        return this;
    }
    
    public LpListBuilder setLpDirection(TerminationDirection value) {
        this._lpDirection = value;
        return this;
    }
    
    public LpListBuilder setNameList(List<NameList> value) {
        this._nameList = value;
        return this;
    }
    
    public LpListBuilder setUuid(UniversalId value) {
        if (value != null) {
        }
        this._uuid = value;
        return this;
    }
    
    public LpListBuilder setTerminationState(java.lang.Boolean value) {
        this._terminationState = value;
        return this;
    }
    
    public LpListBuilder addAugmentation(java.lang.Class<? extends Augmentation<org.opendaylight.yang.gen.v1.uri.onf.coremodel.corenetworkmodule.objectclasses.rev160327.logicalterminationpoint.LpList>> augmentationType, Augmentation<org.opendaylight.yang.gen.v1.uri.onf.coremodel.corenetworkmodule.objectclasses.rev160327.logicalterminationpoint.LpList> augmentation) {
        if (augmentation == null) {
            return removeAugmentation(augmentationType);
        }
    
        if (!(this.augmentation instanceof HashMap)) {
            this.augmentation = new HashMap<>();
        }
    
        this.augmentation.put(augmentationType, augmentation);
        return this;
    }
    
    public LpListBuilder removeAugmentation(java.lang.Class<? extends Augmentation<org.opendaylight.yang.gen.v1.uri.onf.coremodel.corenetworkmodule.objectclasses.rev160327.logicalterminationpoint.LpList>> augmentationType) {
        if (this.augmentation instanceof HashMap) {
            this.augmentation.remove(augmentationType);
        }
        return this;
    }

    public LpList build() {
        return new LpListImpl(this);
    }

    private static final class LpListImpl implements LpList {

        public java.lang.Class<org.opendaylight.yang.gen.v1.uri.onf.coremodel.corenetworkmodule.objectclasses.rev160327.logicalterminationpoint.LpList> getImplementedInterface() {
            return org.opendaylight.yang.gen.v1.uri.onf.coremodel.corenetworkmodule.objectclasses.rev160327.logicalterminationpoint.LpList.class;
        }

        private final BigInteger _configuredClientCapacity;
        private final LpListKey _key;
        private final LayerProtocolName _layerProtocolName;
        private final LocalIdList _localIdList;
        private final TerminationDirection _lpDirection;
        private final List<NameList> _nameList;
        private final UniversalId _uuid;
        private final java.lang.Boolean _terminationState;

        private Map<java.lang.Class<? extends Augmentation<org.opendaylight.yang.gen.v1.uri.onf.coremodel.corenetworkmodule.objectclasses.rev160327.logicalterminationpoint.LpList>>, Augmentation<org.opendaylight.yang.gen.v1.uri.onf.coremodel.corenetworkmodule.objectclasses.rev160327.logicalterminationpoint.LpList>> augmentation = Collections.emptyMap();

        private LpListImpl(LpListBuilder base) {
            if (base.getKey() == null) {
                this._key = new LpListKey(
                    base.getUuid()
                );
                this._uuid = base.getUuid();
            } else {
                this._key = base.getKey();
                this._uuid = _key.getUuid();
            }
            this._configuredClientCapacity = base.getConfiguredClientCapacity();
            this._layerProtocolName = base.getLayerProtocolName();
            this._localIdList = base.getLocalIdList();
            this._lpDirection = base.getLpDirection();
            this._nameList = base.getNameList();
            this._terminationState = base.isTerminationState();
            switch (base.augmentation.size()) {
            case 0:
                this.augmentation = Collections.emptyMap();
                break;
            case 1:
                final Map.Entry<java.lang.Class<? extends Augmentation<org.opendaylight.yang.gen.v1.uri.onf.coremodel.corenetworkmodule.objectclasses.rev160327.logicalterminationpoint.LpList>>, Augmentation<org.opendaylight.yang.gen.v1.uri.onf.coremodel.corenetworkmodule.objectclasses.rev160327.logicalterminationpoint.LpList>> e = base.augmentation.entrySet().iterator().next();
                this.augmentation = Collections.<java.lang.Class<? extends Augmentation<org.opendaylight.yang.gen.v1.uri.onf.coremodel.corenetworkmodule.objectclasses.rev160327.logicalterminationpoint.LpList>>, Augmentation<org.opendaylight.yang.gen.v1.uri.onf.coremodel.corenetworkmodule.objectclasses.rev160327.logicalterminationpoint.LpList>>singletonMap(e.getKey(), e.getValue());
                break;
            default :
                this.augmentation = new HashMap<>(base.augmentation);
            }
        }

        @Override
        public BigInteger getConfiguredClientCapacity() {
            return _configuredClientCapacity;
        }
        
        @Override
        public LpListKey getKey() {
            return _key;
        }
        
        @Override
        public LayerProtocolName getLayerProtocolName() {
            return _layerProtocolName;
        }
        
        @Override
        public LocalIdList getLocalIdList() {
            return _localIdList;
        }
        
        @Override
        public TerminationDirection getLpDirection() {
            return _lpDirection;
        }
        
        @Override
        public List<NameList> getNameList() {
            return _nameList;
        }
        
        @Override
        public UniversalId getUuid() {
            return _uuid;
        }
        
        @Override
        public java.lang.Boolean isTerminationState() {
            return _terminationState;
        }
        
        @SuppressWarnings("unchecked")
        @Override
        public <E extends Augmentation<org.opendaylight.yang.gen.v1.uri.onf.coremodel.corenetworkmodule.objectclasses.rev160327.logicalterminationpoint.LpList>> E getAugmentation(java.lang.Class<E> augmentationType) {
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
            result = prime * result + ((_configuredClientCapacity == null) ? 0 : _configuredClientCapacity.hashCode());
            result = prime * result + ((_key == null) ? 0 : _key.hashCode());
            result = prime * result + ((_layerProtocolName == null) ? 0 : _layerProtocolName.hashCode());
            result = prime * result + ((_localIdList == null) ? 0 : _localIdList.hashCode());
            result = prime * result + ((_lpDirection == null) ? 0 : _lpDirection.hashCode());
            result = prime * result + ((_nameList == null) ? 0 : _nameList.hashCode());
            result = prime * result + ((_uuid == null) ? 0 : _uuid.hashCode());
            result = prime * result + ((_terminationState == null) ? 0 : _terminationState.hashCode());
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
            if (!org.opendaylight.yang.gen.v1.uri.onf.coremodel.corenetworkmodule.objectclasses.rev160327.logicalterminationpoint.LpList.class.equals(((DataObject)obj).getImplementedInterface())) {
                return false;
            }
            org.opendaylight.yang.gen.v1.uri.onf.coremodel.corenetworkmodule.objectclasses.rev160327.logicalterminationpoint.LpList other = (org.opendaylight.yang.gen.v1.uri.onf.coremodel.corenetworkmodule.objectclasses.rev160327.logicalterminationpoint.LpList)obj;
            if (_configuredClientCapacity == null) {
                if (other.getConfiguredClientCapacity() != null) {
                    return false;
                }
            } else if(!_configuredClientCapacity.equals(other.getConfiguredClientCapacity())) {
                return false;
            }
            if (_key == null) {
                if (other.getKey() != null) {
                    return false;
                }
            } else if(!_key.equals(other.getKey())) {
                return false;
            }
            if (_layerProtocolName == null) {
                if (other.getLayerProtocolName() != null) {
                    return false;
                }
            } else if(!_layerProtocolName.equals(other.getLayerProtocolName())) {
                return false;
            }
            if (_localIdList == null) {
                if (other.getLocalIdList() != null) {
                    return false;
                }
            } else if(!_localIdList.equals(other.getLocalIdList())) {
                return false;
            }
            if (_lpDirection == null) {
                if (other.getLpDirection() != null) {
                    return false;
                }
            } else if(!_lpDirection.equals(other.getLpDirection())) {
                return false;
            }
            if (_nameList == null) {
                if (other.getNameList() != null) {
                    return false;
                }
            } else if(!_nameList.equals(other.getNameList())) {
                return false;
            }
            if (_uuid == null) {
                if (other.getUuid() != null) {
                    return false;
                }
            } else if(!_uuid.equals(other.getUuid())) {
                return false;
            }
            if (_terminationState == null) {
                if (other.isTerminationState() != null) {
                    return false;
                }
            } else if(!_terminationState.equals(other.isTerminationState())) {
                return false;
            }
            if (getClass() == obj.getClass()) {
                // Simple case: we are comparing against self
                LpListImpl otherImpl = (LpListImpl) obj;
                if (augmentation == null) {
                    if (otherImpl.augmentation != null) {
                        return false;
                    }
                } else if(!augmentation.equals(otherImpl.augmentation)) {
                    return false;
                }
            } else {
                // Hard case: compare our augments with presence there...
                for (Map.Entry<java.lang.Class<? extends Augmentation<org.opendaylight.yang.gen.v1.uri.onf.coremodel.corenetworkmodule.objectclasses.rev160327.logicalterminationpoint.LpList>>, Augmentation<org.opendaylight.yang.gen.v1.uri.onf.coremodel.corenetworkmodule.objectclasses.rev160327.logicalterminationpoint.LpList>> e : augmentation.entrySet()) {
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
            java.lang.StringBuilder builder = new java.lang.StringBuilder ("LpList [");
            boolean first = true;
        
            if (_configuredClientCapacity != null) {
                if (first) {
                    first = false;
                } else {
                    builder.append(", ");
                }
                builder.append("_configuredClientCapacity=");
                builder.append(_configuredClientCapacity);
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
            if (_layerProtocolName != null) {
                if (first) {
                    first = false;
                } else {
                    builder.append(", ");
                }
                builder.append("_layerProtocolName=");
                builder.append(_layerProtocolName);
             }
            if (_localIdList != null) {
                if (first) {
                    first = false;
                } else {
                    builder.append(", ");
                }
                builder.append("_localIdList=");
                builder.append(_localIdList);
             }
            if (_lpDirection != null) {
                if (first) {
                    first = false;
                } else {
                    builder.append(", ");
                }
                builder.append("_lpDirection=");
                builder.append(_lpDirection);
             }
            if (_nameList != null) {
                if (first) {
                    first = false;
                } else {
                    builder.append(", ");
                }
                builder.append("_nameList=");
                builder.append(_nameList);
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
            if (_terminationState != null) {
                if (first) {
                    first = false;
                } else {
                    builder.append(", ");
                }
                builder.append("_terminationState=");
                builder.append(_terminationState);
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
