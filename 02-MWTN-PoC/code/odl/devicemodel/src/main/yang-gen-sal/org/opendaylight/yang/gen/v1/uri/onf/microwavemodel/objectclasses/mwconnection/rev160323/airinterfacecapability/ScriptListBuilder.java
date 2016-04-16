package org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.airinterfacecapability;
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
 * Class that builds {@link org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.airinterfacecapability.ScriptList} instances.
 *
 * @see org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.airinterfacecapability.ScriptList
 *
 */
public class ScriptListBuilder implements Builder <org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.airinterfacecapability.ScriptList> {

    private BigInteger _channelBandwidth;
    private ScriptListKey _key;
    private BigInteger _modulationScheme;
    private java.lang.String _scriptID;
    private java.lang.Long _txPowerMax;
    private java.lang.Long _txPowerMin;
    private java.lang.Boolean _xpicIsAvail;

    Map<java.lang.Class<? extends Augmentation<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.airinterfacecapability.ScriptList>>, Augmentation<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.airinterfacecapability.ScriptList>> augmentation = Collections.emptyMap();

    public ScriptListBuilder() {
    }
    public ScriptListBuilder(org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.Script arg) {
        this._scriptID = arg.getScriptID();
        this._channelBandwidth = arg.getChannelBandwidth();
        this._modulationScheme = arg.getModulationScheme();
        this._txPowerMin = arg.getTxPowerMin();
        this._txPowerMax = arg.getTxPowerMax();
        this._xpicIsAvail = arg.isXpicIsAvail();
    }

    public ScriptListBuilder(ScriptList base) {
        if (base.getKey() == null) {
            this._key = new ScriptListKey(
                base.getScriptID()
            );
            this._scriptID = base.getScriptID();
        } else {
            this._key = base.getKey();
            this._scriptID = _key.getScriptID();
        }
        this._channelBandwidth = base.getChannelBandwidth();
        this._modulationScheme = base.getModulationScheme();
        this._txPowerMax = base.getTxPowerMax();
        this._txPowerMin = base.getTxPowerMin();
        this._xpicIsAvail = base.isXpicIsAvail();
        if (base instanceof ScriptListImpl) {
            ScriptListImpl impl = (ScriptListImpl) base;
            if (!impl.augmentation.isEmpty()) {
                this.augmentation = new HashMap<>(impl.augmentation);
            }
        } else if (base instanceof AugmentationHolder) {
            @SuppressWarnings("unchecked")
            AugmentationHolder<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.airinterfacecapability.ScriptList> casted =(AugmentationHolder<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.airinterfacecapability.ScriptList>) base;
            if (!casted.augmentations().isEmpty()) {
                this.augmentation = new HashMap<>(casted.augmentations());
            }
        }
    }

    /**
     *Set fields from given grouping argument. Valid argument is instance of one of following types:
     * <ul>
     * <li>org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.Script</li>
     * </ul>
     *
     * @param arg grouping object
     * @throws IllegalArgumentException if given argument is none of valid types
    */
    public void fieldsFrom(DataObject arg) {
        boolean isValidArg = false;
        if (arg instanceof org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.Script) {
            this._scriptID = ((org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.Script)arg).getScriptID();
            this._channelBandwidth = ((org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.Script)arg).getChannelBandwidth();
            this._modulationScheme = ((org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.Script)arg).getModulationScheme();
            this._txPowerMin = ((org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.Script)arg).getTxPowerMin();
            this._txPowerMax = ((org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.Script)arg).getTxPowerMax();
            this._xpicIsAvail = ((org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.Script)arg).isXpicIsAvail();
            isValidArg = true;
        }
        if (!isValidArg) {
            throw new IllegalArgumentException(
              "expected one of: [org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.Script] \n" +
              "but was: " + arg
            );
        }
    }

    public BigInteger getChannelBandwidth() {
        return _channelBandwidth;
    }
    
    public ScriptListKey getKey() {
        return _key;
    }
    
    public BigInteger getModulationScheme() {
        return _modulationScheme;
    }
    
    public java.lang.String getScriptID() {
        return _scriptID;
    }
    
    public java.lang.Long getTxPowerMax() {
        return _txPowerMax;
    }
    
    public java.lang.Long getTxPowerMin() {
        return _txPowerMin;
    }
    
    public java.lang.Boolean isXpicIsAvail() {
        return _xpicIsAvail;
    }
    
    @SuppressWarnings("unchecked")
    public <E extends Augmentation<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.airinterfacecapability.ScriptList>> E getAugmentation(java.lang.Class<E> augmentationType) {
        if (augmentationType == null) {
            throw new IllegalArgumentException("Augmentation Type reference cannot be NULL!");
        }
        return (E) augmentation.get(augmentationType);
    }

    private static final com.google.common.collect.Range<java.math.BigInteger>[] CHECKCHANNELBANDWIDTHRANGE_RANGES;
    static {
        @SuppressWarnings("unchecked")
        final com.google.common.collect.Range<java.math.BigInteger>[] a = (com.google.common.collect.Range<java.math.BigInteger>[]) java.lang.reflect.Array.newInstance(com.google.common.collect.Range.class, 1);
        a[0] = com.google.common.collect.Range.closed(java.math.BigInteger.ZERO, new java.math.BigInteger("18446744073709551615"));
        CHECKCHANNELBANDWIDTHRANGE_RANGES = a;
    }
    private static void checkChannelBandwidthRange(final java.math.BigInteger value) {
        for (com.google.common.collect.Range<java.math.BigInteger> r : CHECKCHANNELBANDWIDTHRANGE_RANGES) {
            if (r.contains(value)) {
                return;
            }
        }
        throw new IllegalArgumentException(String.format("Invalid range: %s, expected: %s.", value, java.util.Arrays.asList(CHECKCHANNELBANDWIDTHRANGE_RANGES)));
    }
    
    public ScriptListBuilder setChannelBandwidth(BigInteger value) {
        if (value != null) {
            checkChannelBandwidthRange(value);
        }
        this._channelBandwidth = value;
        return this;
    }
    /**
     * @deprecated This method is slated for removal in a future release. See BUG-1485 for details.
     */
    @Deprecated
    public static List<Range<BigInteger>> _channelBandwidth_range() {
        final List<Range<BigInteger>> ret = new java.util.ArrayList<>(1);
        ret.add(Range.closed(BigInteger.ZERO, new BigInteger("18446744073709551615")));
        return ret;
    }
    
    public ScriptListBuilder setKey(ScriptListKey value) {
        this._key = value;
        return this;
    }
    
    private static final com.google.common.collect.Range<java.math.BigInteger>[] CHECKMODULATIONSCHEMERANGE_RANGES;
    static {
        @SuppressWarnings("unchecked")
        final com.google.common.collect.Range<java.math.BigInteger>[] a = (com.google.common.collect.Range<java.math.BigInteger>[]) java.lang.reflect.Array.newInstance(com.google.common.collect.Range.class, 1);
        a[0] = com.google.common.collect.Range.closed(java.math.BigInteger.ZERO, new java.math.BigInteger("18446744073709551615"));
        CHECKMODULATIONSCHEMERANGE_RANGES = a;
    }
    private static void checkModulationSchemeRange(final java.math.BigInteger value) {
        for (com.google.common.collect.Range<java.math.BigInteger> r : CHECKMODULATIONSCHEMERANGE_RANGES) {
            if (r.contains(value)) {
                return;
            }
        }
        throw new IllegalArgumentException(String.format("Invalid range: %s, expected: %s.", value, java.util.Arrays.asList(CHECKMODULATIONSCHEMERANGE_RANGES)));
    }
    
    public ScriptListBuilder setModulationScheme(BigInteger value) {
        if (value != null) {
            checkModulationSchemeRange(value);
        }
        this._modulationScheme = value;
        return this;
    }
    /**
     * @deprecated This method is slated for removal in a future release. See BUG-1485 for details.
     */
    @Deprecated
    public static List<Range<BigInteger>> _modulationScheme_range() {
        final List<Range<BigInteger>> ret = new java.util.ArrayList<>(1);
        ret.add(Range.closed(BigInteger.ZERO, new BigInteger("18446744073709551615")));
        return ret;
    }
    
    public ScriptListBuilder setScriptID(java.lang.String value) {
        this._scriptID = value;
        return this;
    }
    
    public ScriptListBuilder setTxPowerMax(java.lang.Long value) {
        this._txPowerMax = value;
        return this;
    }
    
    public ScriptListBuilder setTxPowerMin(java.lang.Long value) {
        this._txPowerMin = value;
        return this;
    }
    
    public ScriptListBuilder setXpicIsAvail(java.lang.Boolean value) {
        this._xpicIsAvail = value;
        return this;
    }
    
    public ScriptListBuilder addAugmentation(java.lang.Class<? extends Augmentation<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.airinterfacecapability.ScriptList>> augmentationType, Augmentation<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.airinterfacecapability.ScriptList> augmentation) {
        if (augmentation == null) {
            return removeAugmentation(augmentationType);
        }
    
        if (!(this.augmentation instanceof HashMap)) {
            this.augmentation = new HashMap<>();
        }
    
        this.augmentation.put(augmentationType, augmentation);
        return this;
    }
    
    public ScriptListBuilder removeAugmentation(java.lang.Class<? extends Augmentation<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.airinterfacecapability.ScriptList>> augmentationType) {
        if (this.augmentation instanceof HashMap) {
            this.augmentation.remove(augmentationType);
        }
        return this;
    }

    public ScriptList build() {
        return new ScriptListImpl(this);
    }

    private static final class ScriptListImpl implements ScriptList {

        public java.lang.Class<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.airinterfacecapability.ScriptList> getImplementedInterface() {
            return org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.airinterfacecapability.ScriptList.class;
        }

        private final BigInteger _channelBandwidth;
        private final ScriptListKey _key;
        private final BigInteger _modulationScheme;
        private final java.lang.String _scriptID;
        private final java.lang.Long _txPowerMax;
        private final java.lang.Long _txPowerMin;
        private final java.lang.Boolean _xpicIsAvail;

        private Map<java.lang.Class<? extends Augmentation<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.airinterfacecapability.ScriptList>>, Augmentation<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.airinterfacecapability.ScriptList>> augmentation = Collections.emptyMap();

        private ScriptListImpl(ScriptListBuilder base) {
            if (base.getKey() == null) {
                this._key = new ScriptListKey(
                    base.getScriptID()
                );
                this._scriptID = base.getScriptID();
            } else {
                this._key = base.getKey();
                this._scriptID = _key.getScriptID();
            }
            this._channelBandwidth = base.getChannelBandwidth();
            this._modulationScheme = base.getModulationScheme();
            this._txPowerMax = base.getTxPowerMax();
            this._txPowerMin = base.getTxPowerMin();
            this._xpicIsAvail = base.isXpicIsAvail();
            switch (base.augmentation.size()) {
            case 0:
                this.augmentation = Collections.emptyMap();
                break;
            case 1:
                final Map.Entry<java.lang.Class<? extends Augmentation<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.airinterfacecapability.ScriptList>>, Augmentation<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.airinterfacecapability.ScriptList>> e = base.augmentation.entrySet().iterator().next();
                this.augmentation = Collections.<java.lang.Class<? extends Augmentation<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.airinterfacecapability.ScriptList>>, Augmentation<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.airinterfacecapability.ScriptList>>singletonMap(e.getKey(), e.getValue());
                break;
            default :
                this.augmentation = new HashMap<>(base.augmentation);
            }
        }

        @Override
        public BigInteger getChannelBandwidth() {
            return _channelBandwidth;
        }
        
        @Override
        public ScriptListKey getKey() {
            return _key;
        }
        
        @Override
        public BigInteger getModulationScheme() {
            return _modulationScheme;
        }
        
        @Override
        public java.lang.String getScriptID() {
            return _scriptID;
        }
        
        @Override
        public java.lang.Long getTxPowerMax() {
            return _txPowerMax;
        }
        
        @Override
        public java.lang.Long getTxPowerMin() {
            return _txPowerMin;
        }
        
        @Override
        public java.lang.Boolean isXpicIsAvail() {
            return _xpicIsAvail;
        }
        
        @SuppressWarnings("unchecked")
        @Override
        public <E extends Augmentation<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.airinterfacecapability.ScriptList>> E getAugmentation(java.lang.Class<E> augmentationType) {
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
            result = prime * result + ((_channelBandwidth == null) ? 0 : _channelBandwidth.hashCode());
            result = prime * result + ((_key == null) ? 0 : _key.hashCode());
            result = prime * result + ((_modulationScheme == null) ? 0 : _modulationScheme.hashCode());
            result = prime * result + ((_scriptID == null) ? 0 : _scriptID.hashCode());
            result = prime * result + ((_txPowerMax == null) ? 0 : _txPowerMax.hashCode());
            result = prime * result + ((_txPowerMin == null) ? 0 : _txPowerMin.hashCode());
            result = prime * result + ((_xpicIsAvail == null) ? 0 : _xpicIsAvail.hashCode());
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
            if (!org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.airinterfacecapability.ScriptList.class.equals(((DataObject)obj).getImplementedInterface())) {
                return false;
            }
            org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.airinterfacecapability.ScriptList other = (org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.airinterfacecapability.ScriptList)obj;
            if (_channelBandwidth == null) {
                if (other.getChannelBandwidth() != null) {
                    return false;
                }
            } else if(!_channelBandwidth.equals(other.getChannelBandwidth())) {
                return false;
            }
            if (_key == null) {
                if (other.getKey() != null) {
                    return false;
                }
            } else if(!_key.equals(other.getKey())) {
                return false;
            }
            if (_modulationScheme == null) {
                if (other.getModulationScheme() != null) {
                    return false;
                }
            } else if(!_modulationScheme.equals(other.getModulationScheme())) {
                return false;
            }
            if (_scriptID == null) {
                if (other.getScriptID() != null) {
                    return false;
                }
            } else if(!_scriptID.equals(other.getScriptID())) {
                return false;
            }
            if (_txPowerMax == null) {
                if (other.getTxPowerMax() != null) {
                    return false;
                }
            } else if(!_txPowerMax.equals(other.getTxPowerMax())) {
                return false;
            }
            if (_txPowerMin == null) {
                if (other.getTxPowerMin() != null) {
                    return false;
                }
            } else if(!_txPowerMin.equals(other.getTxPowerMin())) {
                return false;
            }
            if (_xpicIsAvail == null) {
                if (other.isXpicIsAvail() != null) {
                    return false;
                }
            } else if(!_xpicIsAvail.equals(other.isXpicIsAvail())) {
                return false;
            }
            if (getClass() == obj.getClass()) {
                // Simple case: we are comparing against self
                ScriptListImpl otherImpl = (ScriptListImpl) obj;
                if (augmentation == null) {
                    if (otherImpl.augmentation != null) {
                        return false;
                    }
                } else if(!augmentation.equals(otherImpl.augmentation)) {
                    return false;
                }
            } else {
                // Hard case: compare our augments with presence there...
                for (Map.Entry<java.lang.Class<? extends Augmentation<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.airinterfacecapability.ScriptList>>, Augmentation<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.airinterfacecapability.ScriptList>> e : augmentation.entrySet()) {
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
            java.lang.StringBuilder builder = new java.lang.StringBuilder ("ScriptList [");
            boolean first = true;
        
            if (_channelBandwidth != null) {
                if (first) {
                    first = false;
                } else {
                    builder.append(", ");
                }
                builder.append("_channelBandwidth=");
                builder.append(_channelBandwidth);
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
            if (_modulationScheme != null) {
                if (first) {
                    first = false;
                } else {
                    builder.append(", ");
                }
                builder.append("_modulationScheme=");
                builder.append(_modulationScheme);
             }
            if (_scriptID != null) {
                if (first) {
                    first = false;
                } else {
                    builder.append(", ");
                }
                builder.append("_scriptID=");
                builder.append(_scriptID);
             }
            if (_txPowerMax != null) {
                if (first) {
                    first = false;
                } else {
                    builder.append(", ");
                }
                builder.append("_txPowerMax=");
                builder.append(_txPowerMax);
             }
            if (_txPowerMin != null) {
                if (first) {
                    first = false;
                } else {
                    builder.append(", ");
                }
                builder.append("_txPowerMin=");
                builder.append(_txPowerMin);
             }
            if (_xpicIsAvail != null) {
                if (first) {
                    first = false;
                } else {
                    builder.append(", ");
                }
                builder.append("_xpicIsAvail=");
                builder.append(_xpicIsAvail);
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
