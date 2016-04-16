package org.opendaylight.yang.gen.v1.uri.onf.coremodel.corenetworkmodule.typedefinitions.rev160305;
import org.opendaylight.yangtools.yang.binding.Augmentation;
import org.opendaylight.yangtools.yang.binding.AugmentationHolder;
import org.opendaylight.yangtools.yang.binding.DataObject;
import java.util.HashMap;
import org.opendaylight.yangtools.concepts.Builder;
import java.math.BigInteger;
import java.util.List;
import java.util.Collections;
import com.google.common.collect.Range;
import java.util.Map;


/**
 * Class that builds {@link org.opendaylight.yang.gen.v1.uri.onf.coremodel.corenetworkmodule.typedefinitions.rev160305.Q822NumSuppressedIntervalsPkg} instances.
 *
 * @see org.opendaylight.yang.gen.v1.uri.onf.coremodel.corenetworkmodule.typedefinitions.rev160305.Q822NumSuppressedIntervalsPkg
 *
 */
public class Q822NumSuppressedIntervalsPkgBuilder implements Builder <org.opendaylight.yang.gen.v1.uri.onf.coremodel.corenetworkmodule.typedefinitions.rev160305.Q822NumSuppressedIntervalsPkg> {

    private Q822NumSuppressedIntervalsPkgKey _key;
    private BigInteger _numSuppressedIntervals;

    Map<java.lang.Class<? extends Augmentation<org.opendaylight.yang.gen.v1.uri.onf.coremodel.corenetworkmodule.typedefinitions.rev160305.Q822NumSuppressedIntervalsPkg>>, Augmentation<org.opendaylight.yang.gen.v1.uri.onf.coremodel.corenetworkmodule.typedefinitions.rev160305.Q822NumSuppressedIntervalsPkg>> augmentation = Collections.emptyMap();

    public Q822NumSuppressedIntervalsPkgBuilder() {
    }

    public Q822NumSuppressedIntervalsPkgBuilder(Q822NumSuppressedIntervalsPkg base) {
        if (base.getKey() == null) {
            this._key = new Q822NumSuppressedIntervalsPkgKey(
                base.getNumSuppressedIntervals()
            );
            this._numSuppressedIntervals = base.getNumSuppressedIntervals();
        } else {
            this._key = base.getKey();
            this._numSuppressedIntervals = _key.getNumSuppressedIntervals();
        }
        if (base instanceof Q822NumSuppressedIntervalsPkgImpl) {
            Q822NumSuppressedIntervalsPkgImpl impl = (Q822NumSuppressedIntervalsPkgImpl) base;
            if (!impl.augmentation.isEmpty()) {
                this.augmentation = new HashMap<>(impl.augmentation);
            }
        } else if (base instanceof AugmentationHolder) {
            @SuppressWarnings("unchecked")
            AugmentationHolder<org.opendaylight.yang.gen.v1.uri.onf.coremodel.corenetworkmodule.typedefinitions.rev160305.Q822NumSuppressedIntervalsPkg> casted =(AugmentationHolder<org.opendaylight.yang.gen.v1.uri.onf.coremodel.corenetworkmodule.typedefinitions.rev160305.Q822NumSuppressedIntervalsPkg>) base;
            if (!casted.augmentations().isEmpty()) {
                this.augmentation = new HashMap<>(casted.augmentations());
            }
        }
    }


    public Q822NumSuppressedIntervalsPkgKey getKey() {
        return _key;
    }
    
    public BigInteger getNumSuppressedIntervals() {
        return _numSuppressedIntervals;
    }
    
    @SuppressWarnings("unchecked")
    public <E extends Augmentation<org.opendaylight.yang.gen.v1.uri.onf.coremodel.corenetworkmodule.typedefinitions.rev160305.Q822NumSuppressedIntervalsPkg>> E getAugmentation(java.lang.Class<E> augmentationType) {
        if (augmentationType == null) {
            throw new IllegalArgumentException("Augmentation Type reference cannot be NULL!");
        }
        return (E) augmentation.get(augmentationType);
    }

    public Q822NumSuppressedIntervalsPkgBuilder setKey(Q822NumSuppressedIntervalsPkgKey value) {
        this._key = value;
        return this;
    }
    
    private static final com.google.common.collect.Range<java.math.BigInteger>[] CHECKNUMSUPPRESSEDINTERVALSRANGE_RANGES;
    static {
        @SuppressWarnings("unchecked")
        final com.google.common.collect.Range<java.math.BigInteger>[] a = (com.google.common.collect.Range<java.math.BigInteger>[]) java.lang.reflect.Array.newInstance(com.google.common.collect.Range.class, 1);
        a[0] = com.google.common.collect.Range.closed(java.math.BigInteger.ZERO, new java.math.BigInteger("18446744073709551615"));
        CHECKNUMSUPPRESSEDINTERVALSRANGE_RANGES = a;
    }
    private static void checkNumSuppressedIntervalsRange(final java.math.BigInteger value) {
        for (com.google.common.collect.Range<java.math.BigInteger> r : CHECKNUMSUPPRESSEDINTERVALSRANGE_RANGES) {
            if (r.contains(value)) {
                return;
            }
        }
        throw new IllegalArgumentException(String.format("Invalid range: %s, expected: %s.", value, java.util.Arrays.asList(CHECKNUMSUPPRESSEDINTERVALSRANGE_RANGES)));
    }
    
    public Q822NumSuppressedIntervalsPkgBuilder setNumSuppressedIntervals(BigInteger value) {
        if (value != null) {
            checkNumSuppressedIntervalsRange(value);
        }
        this._numSuppressedIntervals = value;
        return this;
    }
    /**
     * @deprecated This method is slated for removal in a future release. See BUG-1485 for details.
     */
    @Deprecated
    public static List<Range<BigInteger>> _numSuppressedIntervals_range() {
        final List<Range<BigInteger>> ret = new java.util.ArrayList<>(1);
        ret.add(Range.closed(BigInteger.ZERO, new BigInteger("18446744073709551615")));
        return ret;
    }
    
    public Q822NumSuppressedIntervalsPkgBuilder addAugmentation(java.lang.Class<? extends Augmentation<org.opendaylight.yang.gen.v1.uri.onf.coremodel.corenetworkmodule.typedefinitions.rev160305.Q822NumSuppressedIntervalsPkg>> augmentationType, Augmentation<org.opendaylight.yang.gen.v1.uri.onf.coremodel.corenetworkmodule.typedefinitions.rev160305.Q822NumSuppressedIntervalsPkg> augmentation) {
        if (augmentation == null) {
            return removeAugmentation(augmentationType);
        }
    
        if (!(this.augmentation instanceof HashMap)) {
            this.augmentation = new HashMap<>();
        }
    
        this.augmentation.put(augmentationType, augmentation);
        return this;
    }
    
    public Q822NumSuppressedIntervalsPkgBuilder removeAugmentation(java.lang.Class<? extends Augmentation<org.opendaylight.yang.gen.v1.uri.onf.coremodel.corenetworkmodule.typedefinitions.rev160305.Q822NumSuppressedIntervalsPkg>> augmentationType) {
        if (this.augmentation instanceof HashMap) {
            this.augmentation.remove(augmentationType);
        }
        return this;
    }

    public Q822NumSuppressedIntervalsPkg build() {
        return new Q822NumSuppressedIntervalsPkgImpl(this);
    }

    private static final class Q822NumSuppressedIntervalsPkgImpl implements Q822NumSuppressedIntervalsPkg {

        public java.lang.Class<org.opendaylight.yang.gen.v1.uri.onf.coremodel.corenetworkmodule.typedefinitions.rev160305.Q822NumSuppressedIntervalsPkg> getImplementedInterface() {
            return org.opendaylight.yang.gen.v1.uri.onf.coremodel.corenetworkmodule.typedefinitions.rev160305.Q822NumSuppressedIntervalsPkg.class;
        }

        private final Q822NumSuppressedIntervalsPkgKey _key;
        private final BigInteger _numSuppressedIntervals;

        private Map<java.lang.Class<? extends Augmentation<org.opendaylight.yang.gen.v1.uri.onf.coremodel.corenetworkmodule.typedefinitions.rev160305.Q822NumSuppressedIntervalsPkg>>, Augmentation<org.opendaylight.yang.gen.v1.uri.onf.coremodel.corenetworkmodule.typedefinitions.rev160305.Q822NumSuppressedIntervalsPkg>> augmentation = Collections.emptyMap();

        private Q822NumSuppressedIntervalsPkgImpl(Q822NumSuppressedIntervalsPkgBuilder base) {
            if (base.getKey() == null) {
                this._key = new Q822NumSuppressedIntervalsPkgKey(
                    base.getNumSuppressedIntervals()
                );
                this._numSuppressedIntervals = base.getNumSuppressedIntervals();
            } else {
                this._key = base.getKey();
                this._numSuppressedIntervals = _key.getNumSuppressedIntervals();
            }
            switch (base.augmentation.size()) {
            case 0:
                this.augmentation = Collections.emptyMap();
                break;
            case 1:
                final Map.Entry<java.lang.Class<? extends Augmentation<org.opendaylight.yang.gen.v1.uri.onf.coremodel.corenetworkmodule.typedefinitions.rev160305.Q822NumSuppressedIntervalsPkg>>, Augmentation<org.opendaylight.yang.gen.v1.uri.onf.coremodel.corenetworkmodule.typedefinitions.rev160305.Q822NumSuppressedIntervalsPkg>> e = base.augmentation.entrySet().iterator().next();
                this.augmentation = Collections.<java.lang.Class<? extends Augmentation<org.opendaylight.yang.gen.v1.uri.onf.coremodel.corenetworkmodule.typedefinitions.rev160305.Q822NumSuppressedIntervalsPkg>>, Augmentation<org.opendaylight.yang.gen.v1.uri.onf.coremodel.corenetworkmodule.typedefinitions.rev160305.Q822NumSuppressedIntervalsPkg>>singletonMap(e.getKey(), e.getValue());
                break;
            default :
                this.augmentation = new HashMap<>(base.augmentation);
            }
        }

        @Override
        public Q822NumSuppressedIntervalsPkgKey getKey() {
            return _key;
        }
        
        @Override
        public BigInteger getNumSuppressedIntervals() {
            return _numSuppressedIntervals;
        }
        
        @SuppressWarnings("unchecked")
        @Override
        public <E extends Augmentation<org.opendaylight.yang.gen.v1.uri.onf.coremodel.corenetworkmodule.typedefinitions.rev160305.Q822NumSuppressedIntervalsPkg>> E getAugmentation(java.lang.Class<E> augmentationType) {
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
            result = prime * result + ((_key == null) ? 0 : _key.hashCode());
            result = prime * result + ((_numSuppressedIntervals == null) ? 0 : _numSuppressedIntervals.hashCode());
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
            if (!org.opendaylight.yang.gen.v1.uri.onf.coremodel.corenetworkmodule.typedefinitions.rev160305.Q822NumSuppressedIntervalsPkg.class.equals(((DataObject)obj).getImplementedInterface())) {
                return false;
            }
            org.opendaylight.yang.gen.v1.uri.onf.coremodel.corenetworkmodule.typedefinitions.rev160305.Q822NumSuppressedIntervalsPkg other = (org.opendaylight.yang.gen.v1.uri.onf.coremodel.corenetworkmodule.typedefinitions.rev160305.Q822NumSuppressedIntervalsPkg)obj;
            if (_key == null) {
                if (other.getKey() != null) {
                    return false;
                }
            } else if(!_key.equals(other.getKey())) {
                return false;
            }
            if (_numSuppressedIntervals == null) {
                if (other.getNumSuppressedIntervals() != null) {
                    return false;
                }
            } else if(!_numSuppressedIntervals.equals(other.getNumSuppressedIntervals())) {
                return false;
            }
            if (getClass() == obj.getClass()) {
                // Simple case: we are comparing against self
                Q822NumSuppressedIntervalsPkgImpl otherImpl = (Q822NumSuppressedIntervalsPkgImpl) obj;
                if (augmentation == null) {
                    if (otherImpl.augmentation != null) {
                        return false;
                    }
                } else if(!augmentation.equals(otherImpl.augmentation)) {
                    return false;
                }
            } else {
                // Hard case: compare our augments with presence there...
                for (Map.Entry<java.lang.Class<? extends Augmentation<org.opendaylight.yang.gen.v1.uri.onf.coremodel.corenetworkmodule.typedefinitions.rev160305.Q822NumSuppressedIntervalsPkg>>, Augmentation<org.opendaylight.yang.gen.v1.uri.onf.coremodel.corenetworkmodule.typedefinitions.rev160305.Q822NumSuppressedIntervalsPkg>> e : augmentation.entrySet()) {
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
            java.lang.StringBuilder builder = new java.lang.StringBuilder ("Q822NumSuppressedIntervalsPkg [");
            boolean first = true;
        
            if (_key != null) {
                if (first) {
                    first = false;
                } else {
                    builder.append(", ");
                }
                builder.append("_key=");
                builder.append(_key);
             }
            if (_numSuppressedIntervals != null) {
                if (first) {
                    first = false;
                } else {
                    builder.append(", ");
                }
                builder.append("_numSuppressedIntervals=");
                builder.append(_numSuppressedIntervals);
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
