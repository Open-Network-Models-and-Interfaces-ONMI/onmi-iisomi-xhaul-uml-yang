package org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.ethernet.rev160320;
import org.opendaylight.yangtools.yang.binding.AugmentationHolder;
import java.util.HashMap;
import org.opendaylight.yangtools.concepts.Builder;
import org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.ethernet.rev160320.eth_connectionterminationpointbidirectional_pac.LldpAlternative;
import com.google.common.collect.Range;
import org.opendaylight.yangtools.yang.binding.Augmentation;
import org.opendaylight.yangtools.yang.binding.DataObject;
import java.math.BigInteger;
import java.util.List;
import org.opendaylight.yang.gen.v1.uri.onf.coremodel.corefoundationmodule.superclassesandcommonpackages.rev160305.UniversalId;
import java.util.Collections;
import java.util.Map;


/**
 * Class that builds {@link org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.ethernet.rev160320.ETHConnectionTerminationPointBidirectionalPac} instances.
 *
 * @see org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.ethernet.rev160320.ETHConnectionTerminationPointBidirectionalPac
 *
 */
public class ETHConnectionTerminationPointBidirectionalPacBuilder implements Builder <org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.ethernet.rev160320.ETHConnectionTerminationPointBidirectionalPac> {

    private BigInteger _currentClientCapacity;
    private ETHConnectionTerminationPointBidirectionalPacKey _key;
    private UniversalId _layerProtocol;
    private LldpAlternative _lldpAlternative;
    private BigInteger _vlanId;

    Map<java.lang.Class<? extends Augmentation<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.ethernet.rev160320.ETHConnectionTerminationPointBidirectionalPac>>, Augmentation<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.ethernet.rev160320.ETHConnectionTerminationPointBidirectionalPac>> augmentation = Collections.emptyMap();

    public ETHConnectionTerminationPointBidirectionalPacBuilder() {
    }

    public ETHConnectionTerminationPointBidirectionalPacBuilder(ETHConnectionTerminationPointBidirectionalPac base) {
        if (base.getKey() == null) {
            this._key = new ETHConnectionTerminationPointBidirectionalPacKey(
                base.getLayerProtocol()
            );
            this._layerProtocol = base.getLayerProtocol();
        } else {
            this._key = base.getKey();
            this._layerProtocol = _key.getLayerProtocol();
        }
        this._currentClientCapacity = base.getCurrentClientCapacity();
        this._lldpAlternative = base.getLldpAlternative();
        this._vlanId = base.getVlanId();
        if (base instanceof ETHConnectionTerminationPointBidirectionalPacImpl) {
            ETHConnectionTerminationPointBidirectionalPacImpl impl = (ETHConnectionTerminationPointBidirectionalPacImpl) base;
            if (!impl.augmentation.isEmpty()) {
                this.augmentation = new HashMap<>(impl.augmentation);
            }
        } else if (base instanceof AugmentationHolder) {
            @SuppressWarnings("unchecked")
            AugmentationHolder<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.ethernet.rev160320.ETHConnectionTerminationPointBidirectionalPac> casted =(AugmentationHolder<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.ethernet.rev160320.ETHConnectionTerminationPointBidirectionalPac>) base;
            if (!casted.augmentations().isEmpty()) {
                this.augmentation = new HashMap<>(casted.augmentations());
            }
        }
    }


    public BigInteger getCurrentClientCapacity() {
        return _currentClientCapacity;
    }
    
    public ETHConnectionTerminationPointBidirectionalPacKey getKey() {
        return _key;
    }
    
    public UniversalId getLayerProtocol() {
        return _layerProtocol;
    }
    
    public LldpAlternative getLldpAlternative() {
        return _lldpAlternative;
    }
    
    public BigInteger getVlanId() {
        return _vlanId;
    }
    
    @SuppressWarnings("unchecked")
    public <E extends Augmentation<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.ethernet.rev160320.ETHConnectionTerminationPointBidirectionalPac>> E getAugmentation(java.lang.Class<E> augmentationType) {
        if (augmentationType == null) {
            throw new IllegalArgumentException("Augmentation Type reference cannot be NULL!");
        }
        return (E) augmentation.get(augmentationType);
    }

    private static final com.google.common.collect.Range<java.math.BigInteger>[] CHECKCURRENTCLIENTCAPACITYRANGE_RANGES;
    static {
        @SuppressWarnings("unchecked")
        final com.google.common.collect.Range<java.math.BigInteger>[] a = (com.google.common.collect.Range<java.math.BigInteger>[]) java.lang.reflect.Array.newInstance(com.google.common.collect.Range.class, 1);
        a[0] = com.google.common.collect.Range.closed(java.math.BigInteger.ZERO, new java.math.BigInteger("18446744073709551615"));
        CHECKCURRENTCLIENTCAPACITYRANGE_RANGES = a;
    }
    private static void checkCurrentClientCapacityRange(final java.math.BigInteger value) {
        for (com.google.common.collect.Range<java.math.BigInteger> r : CHECKCURRENTCLIENTCAPACITYRANGE_RANGES) {
            if (r.contains(value)) {
                return;
            }
        }
        throw new IllegalArgumentException(String.format("Invalid range: %s, expected: %s.", value, java.util.Arrays.asList(CHECKCURRENTCLIENTCAPACITYRANGE_RANGES)));
    }
    
    public ETHConnectionTerminationPointBidirectionalPacBuilder setCurrentClientCapacity(BigInteger value) {
        if (value != null) {
            checkCurrentClientCapacityRange(value);
        }
        this._currentClientCapacity = value;
        return this;
    }
    /**
     * @deprecated This method is slated for removal in a future release. See BUG-1485 for details.
     */
    @Deprecated
    public static List<Range<BigInteger>> _currentClientCapacity_range() {
        final List<Range<BigInteger>> ret = new java.util.ArrayList<>(1);
        ret.add(Range.closed(BigInteger.ZERO, new BigInteger("18446744073709551615")));
        return ret;
    }
    
    public ETHConnectionTerminationPointBidirectionalPacBuilder setKey(ETHConnectionTerminationPointBidirectionalPacKey value) {
        this._key = value;
        return this;
    }
    
    public ETHConnectionTerminationPointBidirectionalPacBuilder setLayerProtocol(UniversalId value) {
        if (value != null) {
        }
        this._layerProtocol = value;
        return this;
    }
    
    public ETHConnectionTerminationPointBidirectionalPacBuilder setLldpAlternative(LldpAlternative value) {
        this._lldpAlternative = value;
        return this;
    }
    
    private static final com.google.common.collect.Range<java.math.BigInteger>[] CHECKVLANIDRANGE_RANGES;
    static {
        @SuppressWarnings("unchecked")
        final com.google.common.collect.Range<java.math.BigInteger>[] a = (com.google.common.collect.Range<java.math.BigInteger>[]) java.lang.reflect.Array.newInstance(com.google.common.collect.Range.class, 1);
        a[0] = com.google.common.collect.Range.closed(java.math.BigInteger.ZERO, new java.math.BigInteger("18446744073709551615"));
        CHECKVLANIDRANGE_RANGES = a;
    }
    private static void checkVlanIdRange(final java.math.BigInteger value) {
        for (com.google.common.collect.Range<java.math.BigInteger> r : CHECKVLANIDRANGE_RANGES) {
            if (r.contains(value)) {
                return;
            }
        }
        throw new IllegalArgumentException(String.format("Invalid range: %s, expected: %s.", value, java.util.Arrays.asList(CHECKVLANIDRANGE_RANGES)));
    }
    
    public ETHConnectionTerminationPointBidirectionalPacBuilder setVlanId(BigInteger value) {
        if (value != null) {
            checkVlanIdRange(value);
        }
        this._vlanId = value;
        return this;
    }
    /**
     * @deprecated This method is slated for removal in a future release. See BUG-1485 for details.
     */
    @Deprecated
    public static List<Range<BigInteger>> _vlanId_range() {
        final List<Range<BigInteger>> ret = new java.util.ArrayList<>(1);
        ret.add(Range.closed(BigInteger.ZERO, new BigInteger("18446744073709551615")));
        return ret;
    }
    
    public ETHConnectionTerminationPointBidirectionalPacBuilder addAugmentation(java.lang.Class<? extends Augmentation<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.ethernet.rev160320.ETHConnectionTerminationPointBidirectionalPac>> augmentationType, Augmentation<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.ethernet.rev160320.ETHConnectionTerminationPointBidirectionalPac> augmentation) {
        if (augmentation == null) {
            return removeAugmentation(augmentationType);
        }
    
        if (!(this.augmentation instanceof HashMap)) {
            this.augmentation = new HashMap<>();
        }
    
        this.augmentation.put(augmentationType, augmentation);
        return this;
    }
    
    public ETHConnectionTerminationPointBidirectionalPacBuilder removeAugmentation(java.lang.Class<? extends Augmentation<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.ethernet.rev160320.ETHConnectionTerminationPointBidirectionalPac>> augmentationType) {
        if (this.augmentation instanceof HashMap) {
            this.augmentation.remove(augmentationType);
        }
        return this;
    }

    public ETHConnectionTerminationPointBidirectionalPac build() {
        return new ETHConnectionTerminationPointBidirectionalPacImpl(this);
    }

    private static final class ETHConnectionTerminationPointBidirectionalPacImpl implements ETHConnectionTerminationPointBidirectionalPac {

        public java.lang.Class<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.ethernet.rev160320.ETHConnectionTerminationPointBidirectionalPac> getImplementedInterface() {
            return org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.ethernet.rev160320.ETHConnectionTerminationPointBidirectionalPac.class;
        }

        private final BigInteger _currentClientCapacity;
        private final ETHConnectionTerminationPointBidirectionalPacKey _key;
        private final UniversalId _layerProtocol;
        private final LldpAlternative _lldpAlternative;
        private final BigInteger _vlanId;

        private Map<java.lang.Class<? extends Augmentation<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.ethernet.rev160320.ETHConnectionTerminationPointBidirectionalPac>>, Augmentation<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.ethernet.rev160320.ETHConnectionTerminationPointBidirectionalPac>> augmentation = Collections.emptyMap();

        private ETHConnectionTerminationPointBidirectionalPacImpl(ETHConnectionTerminationPointBidirectionalPacBuilder base) {
            if (base.getKey() == null) {
                this._key = new ETHConnectionTerminationPointBidirectionalPacKey(
                    base.getLayerProtocol()
                );
                this._layerProtocol = base.getLayerProtocol();
            } else {
                this._key = base.getKey();
                this._layerProtocol = _key.getLayerProtocol();
            }
            this._currentClientCapacity = base.getCurrentClientCapacity();
            this._lldpAlternative = base.getLldpAlternative();
            this._vlanId = base.getVlanId();
            switch (base.augmentation.size()) {
            case 0:
                this.augmentation = Collections.emptyMap();
                break;
            case 1:
                final Map.Entry<java.lang.Class<? extends Augmentation<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.ethernet.rev160320.ETHConnectionTerminationPointBidirectionalPac>>, Augmentation<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.ethernet.rev160320.ETHConnectionTerminationPointBidirectionalPac>> e = base.augmentation.entrySet().iterator().next();
                this.augmentation = Collections.<java.lang.Class<? extends Augmentation<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.ethernet.rev160320.ETHConnectionTerminationPointBidirectionalPac>>, Augmentation<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.ethernet.rev160320.ETHConnectionTerminationPointBidirectionalPac>>singletonMap(e.getKey(), e.getValue());
                break;
            default :
                this.augmentation = new HashMap<>(base.augmentation);
            }
        }

        @Override
        public BigInteger getCurrentClientCapacity() {
            return _currentClientCapacity;
        }
        
        @Override
        public ETHConnectionTerminationPointBidirectionalPacKey getKey() {
            return _key;
        }
        
        @Override
        public UniversalId getLayerProtocol() {
            return _layerProtocol;
        }
        
        @Override
        public LldpAlternative getLldpAlternative() {
            return _lldpAlternative;
        }
        
        @Override
        public BigInteger getVlanId() {
            return _vlanId;
        }
        
        @SuppressWarnings("unchecked")
        @Override
        public <E extends Augmentation<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.ethernet.rev160320.ETHConnectionTerminationPointBidirectionalPac>> E getAugmentation(java.lang.Class<E> augmentationType) {
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
            result = prime * result + ((_currentClientCapacity == null) ? 0 : _currentClientCapacity.hashCode());
            result = prime * result + ((_key == null) ? 0 : _key.hashCode());
            result = prime * result + ((_layerProtocol == null) ? 0 : _layerProtocol.hashCode());
            result = prime * result + ((_lldpAlternative == null) ? 0 : _lldpAlternative.hashCode());
            result = prime * result + ((_vlanId == null) ? 0 : _vlanId.hashCode());
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
            if (!org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.ethernet.rev160320.ETHConnectionTerminationPointBidirectionalPac.class.equals(((DataObject)obj).getImplementedInterface())) {
                return false;
            }
            org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.ethernet.rev160320.ETHConnectionTerminationPointBidirectionalPac other = (org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.ethernet.rev160320.ETHConnectionTerminationPointBidirectionalPac)obj;
            if (_currentClientCapacity == null) {
                if (other.getCurrentClientCapacity() != null) {
                    return false;
                }
            } else if(!_currentClientCapacity.equals(other.getCurrentClientCapacity())) {
                return false;
            }
            if (_key == null) {
                if (other.getKey() != null) {
                    return false;
                }
            } else if(!_key.equals(other.getKey())) {
                return false;
            }
            if (_layerProtocol == null) {
                if (other.getLayerProtocol() != null) {
                    return false;
                }
            } else if(!_layerProtocol.equals(other.getLayerProtocol())) {
                return false;
            }
            if (_lldpAlternative == null) {
                if (other.getLldpAlternative() != null) {
                    return false;
                }
            } else if(!_lldpAlternative.equals(other.getLldpAlternative())) {
                return false;
            }
            if (_vlanId == null) {
                if (other.getVlanId() != null) {
                    return false;
                }
            } else if(!_vlanId.equals(other.getVlanId())) {
                return false;
            }
            if (getClass() == obj.getClass()) {
                // Simple case: we are comparing against self
                ETHConnectionTerminationPointBidirectionalPacImpl otherImpl = (ETHConnectionTerminationPointBidirectionalPacImpl) obj;
                if (augmentation == null) {
                    if (otherImpl.augmentation != null) {
                        return false;
                    }
                } else if(!augmentation.equals(otherImpl.augmentation)) {
                    return false;
                }
            } else {
                // Hard case: compare our augments with presence there...
                for (Map.Entry<java.lang.Class<? extends Augmentation<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.ethernet.rev160320.ETHConnectionTerminationPointBidirectionalPac>>, Augmentation<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.ethernet.rev160320.ETHConnectionTerminationPointBidirectionalPac>> e : augmentation.entrySet()) {
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
            java.lang.StringBuilder builder = new java.lang.StringBuilder ("ETHConnectionTerminationPointBidirectionalPac [");
            boolean first = true;
        
            if (_currentClientCapacity != null) {
                if (first) {
                    first = false;
                } else {
                    builder.append(", ");
                }
                builder.append("_currentClientCapacity=");
                builder.append(_currentClientCapacity);
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
            if (_layerProtocol != null) {
                if (first) {
                    first = false;
                } else {
                    builder.append(", ");
                }
                builder.append("_layerProtocol=");
                builder.append(_layerProtocol);
             }
            if (_lldpAlternative != null) {
                if (first) {
                    first = false;
                } else {
                    builder.append(", ");
                }
                builder.append("_lldpAlternative=");
                builder.append(_lldpAlternative);
             }
            if (_vlanId != null) {
                if (first) {
                    first = false;
                } else {
                    builder.append(", ");
                }
                builder.append("_vlanId=");
                builder.append(_vlanId);
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
