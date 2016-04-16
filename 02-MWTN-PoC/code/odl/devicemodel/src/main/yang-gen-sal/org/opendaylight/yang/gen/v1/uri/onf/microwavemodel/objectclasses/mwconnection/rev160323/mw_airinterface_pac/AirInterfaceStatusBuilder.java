package org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.mw_airinterface_pac;
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
 * Class that builds {@link org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.mw_airinterface_pac.AirInterfaceStatus} instances.
 *
 * @see org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.mw_airinterface_pac.AirInterfaceStatus
 *
 */
public class AirInterfaceStatusBuilder implements Builder <org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.mw_airinterface_pac.AirInterfaceStatus> {

    private BigInteger _rxFrequencyCur;
    private java.lang.Long _rxLevelCur;
    private java.lang.Long _snrCur;
    private BigInteger _txFrequencyCur;
    private java.lang.Long _txLevelCur;
    private java.lang.Boolean _linkIsUp;
    private java.lang.Boolean _xpicIsUp;

    Map<java.lang.Class<? extends Augmentation<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.mw_airinterface_pac.AirInterfaceStatus>>, Augmentation<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.mw_airinterface_pac.AirInterfaceStatus>> augmentation = Collections.emptyMap();

    public AirInterfaceStatusBuilder() {
    }
    public AirInterfaceStatusBuilder(org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.AirInterfaceStatus arg) {
        this._txFrequencyCur = arg.getTxFrequencyCur();
        this._rxFrequencyCur = arg.getRxFrequencyCur();
        this._txLevelCur = arg.getTxLevelCur();
        this._rxLevelCur = arg.getRxLevelCur();
        this._snrCur = arg.getSnrCur();
        this._linkIsUp = arg.isLinkIsUp();
        this._xpicIsUp = arg.isXpicIsUp();
    }

    public AirInterfaceStatusBuilder(AirInterfaceStatus base) {
        this._rxFrequencyCur = base.getRxFrequencyCur();
        this._rxLevelCur = base.getRxLevelCur();
        this._snrCur = base.getSnrCur();
        this._txFrequencyCur = base.getTxFrequencyCur();
        this._txLevelCur = base.getTxLevelCur();
        this._linkIsUp = base.isLinkIsUp();
        this._xpicIsUp = base.isXpicIsUp();
        if (base instanceof AirInterfaceStatusImpl) {
            AirInterfaceStatusImpl impl = (AirInterfaceStatusImpl) base;
            if (!impl.augmentation.isEmpty()) {
                this.augmentation = new HashMap<>(impl.augmentation);
            }
        } else if (base instanceof AugmentationHolder) {
            @SuppressWarnings("unchecked")
            AugmentationHolder<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.mw_airinterface_pac.AirInterfaceStatus> casted =(AugmentationHolder<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.mw_airinterface_pac.AirInterfaceStatus>) base;
            if (!casted.augmentations().isEmpty()) {
                this.augmentation = new HashMap<>(casted.augmentations());
            }
        }
    }

    /**
     *Set fields from given grouping argument. Valid argument is instance of one of following types:
     * <ul>
     * <li>org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.AirInterfaceStatus</li>
     * </ul>
     *
     * @param arg grouping object
     * @throws IllegalArgumentException if given argument is none of valid types
    */
    public void fieldsFrom(DataObject arg) {
        boolean isValidArg = false;
        if (arg instanceof org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.AirInterfaceStatus) {
            this._txFrequencyCur = ((org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.AirInterfaceStatus)arg).getTxFrequencyCur();
            this._rxFrequencyCur = ((org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.AirInterfaceStatus)arg).getRxFrequencyCur();
            this._txLevelCur = ((org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.AirInterfaceStatus)arg).getTxLevelCur();
            this._rxLevelCur = ((org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.AirInterfaceStatus)arg).getRxLevelCur();
            this._snrCur = ((org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.AirInterfaceStatus)arg).getSnrCur();
            this._linkIsUp = ((org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.AirInterfaceStatus)arg).isLinkIsUp();
            this._xpicIsUp = ((org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.AirInterfaceStatus)arg).isXpicIsUp();
            isValidArg = true;
        }
        if (!isValidArg) {
            throw new IllegalArgumentException(
              "expected one of: [org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.AirInterfaceStatus] \n" +
              "but was: " + arg
            );
        }
    }

    public BigInteger getRxFrequencyCur() {
        return _rxFrequencyCur;
    }
    
    public java.lang.Long getRxLevelCur() {
        return _rxLevelCur;
    }
    
    public java.lang.Long getSnrCur() {
        return _snrCur;
    }
    
    public BigInteger getTxFrequencyCur() {
        return _txFrequencyCur;
    }
    
    public java.lang.Long getTxLevelCur() {
        return _txLevelCur;
    }
    
    public java.lang.Boolean isLinkIsUp() {
        return _linkIsUp;
    }
    
    public java.lang.Boolean isXpicIsUp() {
        return _xpicIsUp;
    }
    
    @SuppressWarnings("unchecked")
    public <E extends Augmentation<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.mw_airinterface_pac.AirInterfaceStatus>> E getAugmentation(java.lang.Class<E> augmentationType) {
        if (augmentationType == null) {
            throw new IllegalArgumentException("Augmentation Type reference cannot be NULL!");
        }
        return (E) augmentation.get(augmentationType);
    }

    private static final com.google.common.collect.Range<java.math.BigInteger>[] CHECKRXFREQUENCYCURRANGE_RANGES;
    static {
        @SuppressWarnings("unchecked")
        final com.google.common.collect.Range<java.math.BigInteger>[] a = (com.google.common.collect.Range<java.math.BigInteger>[]) java.lang.reflect.Array.newInstance(com.google.common.collect.Range.class, 1);
        a[0] = com.google.common.collect.Range.closed(java.math.BigInteger.ZERO, new java.math.BigInteger("18446744073709551615"));
        CHECKRXFREQUENCYCURRANGE_RANGES = a;
    }
    private static void checkRxFrequencyCurRange(final java.math.BigInteger value) {
        for (com.google.common.collect.Range<java.math.BigInteger> r : CHECKRXFREQUENCYCURRANGE_RANGES) {
            if (r.contains(value)) {
                return;
            }
        }
        throw new IllegalArgumentException(String.format("Invalid range: %s, expected: %s.", value, java.util.Arrays.asList(CHECKRXFREQUENCYCURRANGE_RANGES)));
    }
    
    public AirInterfaceStatusBuilder setRxFrequencyCur(BigInteger value) {
        if (value != null) {
            checkRxFrequencyCurRange(value);
        }
        this._rxFrequencyCur = value;
        return this;
    }
    /**
     * @deprecated This method is slated for removal in a future release. See BUG-1485 for details.
     */
    @Deprecated
    public static List<Range<BigInteger>> _rxFrequencyCur_range() {
        final List<Range<BigInteger>> ret = new java.util.ArrayList<>(1);
        ret.add(Range.closed(BigInteger.ZERO, new BigInteger("18446744073709551615")));
        return ret;
    }
    
    public AirInterfaceStatusBuilder setRxLevelCur(java.lang.Long value) {
        this._rxLevelCur = value;
        return this;
    }
    
    public AirInterfaceStatusBuilder setSnrCur(java.lang.Long value) {
        this._snrCur = value;
        return this;
    }
    
    private static final com.google.common.collect.Range<java.math.BigInteger>[] CHECKTXFREQUENCYCURRANGE_RANGES;
    static {
        @SuppressWarnings("unchecked")
        final com.google.common.collect.Range<java.math.BigInteger>[] a = (com.google.common.collect.Range<java.math.BigInteger>[]) java.lang.reflect.Array.newInstance(com.google.common.collect.Range.class, 1);
        a[0] = com.google.common.collect.Range.closed(java.math.BigInteger.ZERO, new java.math.BigInteger("18446744073709551615"));
        CHECKTXFREQUENCYCURRANGE_RANGES = a;
    }
    private static void checkTxFrequencyCurRange(final java.math.BigInteger value) {
        for (com.google.common.collect.Range<java.math.BigInteger> r : CHECKTXFREQUENCYCURRANGE_RANGES) {
            if (r.contains(value)) {
                return;
            }
        }
        throw new IllegalArgumentException(String.format("Invalid range: %s, expected: %s.", value, java.util.Arrays.asList(CHECKTXFREQUENCYCURRANGE_RANGES)));
    }
    
    public AirInterfaceStatusBuilder setTxFrequencyCur(BigInteger value) {
        if (value != null) {
            checkTxFrequencyCurRange(value);
        }
        this._txFrequencyCur = value;
        return this;
    }
    /**
     * @deprecated This method is slated for removal in a future release. See BUG-1485 for details.
     */
    @Deprecated
    public static List<Range<BigInteger>> _txFrequencyCur_range() {
        final List<Range<BigInteger>> ret = new java.util.ArrayList<>(1);
        ret.add(Range.closed(BigInteger.ZERO, new BigInteger("18446744073709551615")));
        return ret;
    }
    
    public AirInterfaceStatusBuilder setTxLevelCur(java.lang.Long value) {
        this._txLevelCur = value;
        return this;
    }
    
    public AirInterfaceStatusBuilder setLinkIsUp(java.lang.Boolean value) {
        this._linkIsUp = value;
        return this;
    }
    
    public AirInterfaceStatusBuilder setXpicIsUp(java.lang.Boolean value) {
        this._xpicIsUp = value;
        return this;
    }
    
    public AirInterfaceStatusBuilder addAugmentation(java.lang.Class<? extends Augmentation<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.mw_airinterface_pac.AirInterfaceStatus>> augmentationType, Augmentation<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.mw_airinterface_pac.AirInterfaceStatus> augmentation) {
        if (augmentation == null) {
            return removeAugmentation(augmentationType);
        }
    
        if (!(this.augmentation instanceof HashMap)) {
            this.augmentation = new HashMap<>();
        }
    
        this.augmentation.put(augmentationType, augmentation);
        return this;
    }
    
    public AirInterfaceStatusBuilder removeAugmentation(java.lang.Class<? extends Augmentation<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.mw_airinterface_pac.AirInterfaceStatus>> augmentationType) {
        if (this.augmentation instanceof HashMap) {
            this.augmentation.remove(augmentationType);
        }
        return this;
    }

    public AirInterfaceStatus build() {
        return new AirInterfaceStatusImpl(this);
    }

    private static final class AirInterfaceStatusImpl implements AirInterfaceStatus {

        public java.lang.Class<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.mw_airinterface_pac.AirInterfaceStatus> getImplementedInterface() {
            return org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.mw_airinterface_pac.AirInterfaceStatus.class;
        }

        private final BigInteger _rxFrequencyCur;
        private final java.lang.Long _rxLevelCur;
        private final java.lang.Long _snrCur;
        private final BigInteger _txFrequencyCur;
        private final java.lang.Long _txLevelCur;
        private final java.lang.Boolean _linkIsUp;
        private final java.lang.Boolean _xpicIsUp;

        private Map<java.lang.Class<? extends Augmentation<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.mw_airinterface_pac.AirInterfaceStatus>>, Augmentation<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.mw_airinterface_pac.AirInterfaceStatus>> augmentation = Collections.emptyMap();

        private AirInterfaceStatusImpl(AirInterfaceStatusBuilder base) {
            this._rxFrequencyCur = base.getRxFrequencyCur();
            this._rxLevelCur = base.getRxLevelCur();
            this._snrCur = base.getSnrCur();
            this._txFrequencyCur = base.getTxFrequencyCur();
            this._txLevelCur = base.getTxLevelCur();
            this._linkIsUp = base.isLinkIsUp();
            this._xpicIsUp = base.isXpicIsUp();
            switch (base.augmentation.size()) {
            case 0:
                this.augmentation = Collections.emptyMap();
                break;
            case 1:
                final Map.Entry<java.lang.Class<? extends Augmentation<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.mw_airinterface_pac.AirInterfaceStatus>>, Augmentation<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.mw_airinterface_pac.AirInterfaceStatus>> e = base.augmentation.entrySet().iterator().next();
                this.augmentation = Collections.<java.lang.Class<? extends Augmentation<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.mw_airinterface_pac.AirInterfaceStatus>>, Augmentation<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.mw_airinterface_pac.AirInterfaceStatus>>singletonMap(e.getKey(), e.getValue());
                break;
            default :
                this.augmentation = new HashMap<>(base.augmentation);
            }
        }

        @Override
        public BigInteger getRxFrequencyCur() {
            return _rxFrequencyCur;
        }
        
        @Override
        public java.lang.Long getRxLevelCur() {
            return _rxLevelCur;
        }
        
        @Override
        public java.lang.Long getSnrCur() {
            return _snrCur;
        }
        
        @Override
        public BigInteger getTxFrequencyCur() {
            return _txFrequencyCur;
        }
        
        @Override
        public java.lang.Long getTxLevelCur() {
            return _txLevelCur;
        }
        
        @Override
        public java.lang.Boolean isLinkIsUp() {
            return _linkIsUp;
        }
        
        @Override
        public java.lang.Boolean isXpicIsUp() {
            return _xpicIsUp;
        }
        
        @SuppressWarnings("unchecked")
        @Override
        public <E extends Augmentation<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.mw_airinterface_pac.AirInterfaceStatus>> E getAugmentation(java.lang.Class<E> augmentationType) {
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
            result = prime * result + ((_rxFrequencyCur == null) ? 0 : _rxFrequencyCur.hashCode());
            result = prime * result + ((_rxLevelCur == null) ? 0 : _rxLevelCur.hashCode());
            result = prime * result + ((_snrCur == null) ? 0 : _snrCur.hashCode());
            result = prime * result + ((_txFrequencyCur == null) ? 0 : _txFrequencyCur.hashCode());
            result = prime * result + ((_txLevelCur == null) ? 0 : _txLevelCur.hashCode());
            result = prime * result + ((_linkIsUp == null) ? 0 : _linkIsUp.hashCode());
            result = prime * result + ((_xpicIsUp == null) ? 0 : _xpicIsUp.hashCode());
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
            if (!org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.mw_airinterface_pac.AirInterfaceStatus.class.equals(((DataObject)obj).getImplementedInterface())) {
                return false;
            }
            org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.mw_airinterface_pac.AirInterfaceStatus other = (org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.mw_airinterface_pac.AirInterfaceStatus)obj;
            if (_rxFrequencyCur == null) {
                if (other.getRxFrequencyCur() != null) {
                    return false;
                }
            } else if(!_rxFrequencyCur.equals(other.getRxFrequencyCur())) {
                return false;
            }
            if (_rxLevelCur == null) {
                if (other.getRxLevelCur() != null) {
                    return false;
                }
            } else if(!_rxLevelCur.equals(other.getRxLevelCur())) {
                return false;
            }
            if (_snrCur == null) {
                if (other.getSnrCur() != null) {
                    return false;
                }
            } else if(!_snrCur.equals(other.getSnrCur())) {
                return false;
            }
            if (_txFrequencyCur == null) {
                if (other.getTxFrequencyCur() != null) {
                    return false;
                }
            } else if(!_txFrequencyCur.equals(other.getTxFrequencyCur())) {
                return false;
            }
            if (_txLevelCur == null) {
                if (other.getTxLevelCur() != null) {
                    return false;
                }
            } else if(!_txLevelCur.equals(other.getTxLevelCur())) {
                return false;
            }
            if (_linkIsUp == null) {
                if (other.isLinkIsUp() != null) {
                    return false;
                }
            } else if(!_linkIsUp.equals(other.isLinkIsUp())) {
                return false;
            }
            if (_xpicIsUp == null) {
                if (other.isXpicIsUp() != null) {
                    return false;
                }
            } else if(!_xpicIsUp.equals(other.isXpicIsUp())) {
                return false;
            }
            if (getClass() == obj.getClass()) {
                // Simple case: we are comparing against self
                AirInterfaceStatusImpl otherImpl = (AirInterfaceStatusImpl) obj;
                if (augmentation == null) {
                    if (otherImpl.augmentation != null) {
                        return false;
                    }
                } else if(!augmentation.equals(otherImpl.augmentation)) {
                    return false;
                }
            } else {
                // Hard case: compare our augments with presence there...
                for (Map.Entry<java.lang.Class<? extends Augmentation<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.mw_airinterface_pac.AirInterfaceStatus>>, Augmentation<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.mw_airinterface_pac.AirInterfaceStatus>> e : augmentation.entrySet()) {
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
            java.lang.StringBuilder builder = new java.lang.StringBuilder ("AirInterfaceStatus [");
            boolean first = true;
        
            if (_rxFrequencyCur != null) {
                if (first) {
                    first = false;
                } else {
                    builder.append(", ");
                }
                builder.append("_rxFrequencyCur=");
                builder.append(_rxFrequencyCur);
             }
            if (_rxLevelCur != null) {
                if (first) {
                    first = false;
                } else {
                    builder.append(", ");
                }
                builder.append("_rxLevelCur=");
                builder.append(_rxLevelCur);
             }
            if (_snrCur != null) {
                if (first) {
                    first = false;
                } else {
                    builder.append(", ");
                }
                builder.append("_snrCur=");
                builder.append(_snrCur);
             }
            if (_txFrequencyCur != null) {
                if (first) {
                    first = false;
                } else {
                    builder.append(", ");
                }
                builder.append("_txFrequencyCur=");
                builder.append(_txFrequencyCur);
             }
            if (_txLevelCur != null) {
                if (first) {
                    first = false;
                } else {
                    builder.append(", ");
                }
                builder.append("_txLevelCur=");
                builder.append(_txLevelCur);
             }
            if (_linkIsUp != null) {
                if (first) {
                    first = false;
                } else {
                    builder.append(", ");
                }
                builder.append("_linkIsUp=");
                builder.append(_linkIsUp);
             }
            if (_xpicIsUp != null) {
                if (first) {
                    first = false;
                } else {
                    builder.append(", ");
                }
                builder.append("_xpicIsUp=");
                builder.append(_xpicIsUp);
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
