package org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.mw_airinterface_pac;
import org.opendaylight.yangtools.yang.binding.Augmentation;
import org.opendaylight.yangtools.yang.binding.AugmentationHolder;
import org.opendaylight.yangtools.yang.binding.DataObject;
import java.util.HashMap;
import org.opendaylight.yangtools.concepts.Builder;
import java.math.BigInteger;
import org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.airinterfacecapability.ScriptList;
import java.util.List;
import java.util.Collections;
import com.google.common.collect.Range;
import java.util.Map;


/**
 * Class that builds {@link org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.mw_airinterface_pac.AirInterfaceCapabilityList} instances.
 *
 * @see org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.mw_airinterface_pac.AirInterfaceCapabilityList
 *
 */
public class AirInterfaceCapabilityListBuilder implements Builder <org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.mw_airinterface_pac.AirInterfaceCapabilityList> {

    private java.lang.String _airInterfaceID;
    private AirInterfaceCapabilityListKey _key;
    private BigInteger _rxFrequencyMax;
    private BigInteger _rxFrequencyMin;
    private List<ScriptList> _scriptList;
    private java.lang.String _supportedChannelPlans;
    private BigInteger _txFrequencyMax;
    private BigInteger _txFrequencyMin;
    private java.lang.String _typeOfEquipment;
    private java.lang.Boolean _adaptiveModulationIsAvail;

    Map<java.lang.Class<? extends Augmentation<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.mw_airinterface_pac.AirInterfaceCapabilityList>>, Augmentation<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.mw_airinterface_pac.AirInterfaceCapabilityList>> augmentation = Collections.emptyMap();

    public AirInterfaceCapabilityListBuilder() {
    }
    public AirInterfaceCapabilityListBuilder(org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.AirInterfaceCapability arg) {
        this._airInterfaceID = arg.getAirInterfaceID();
        this._typeOfEquipment = arg.getTypeOfEquipment();
        this._supportedChannelPlans = arg.getSupportedChannelPlans();
        this._txFrequencyMin = arg.getTxFrequencyMin();
        this._txFrequencyMax = arg.getTxFrequencyMax();
        this._rxFrequencyMin = arg.getRxFrequencyMin();
        this._rxFrequencyMax = arg.getRxFrequencyMax();
        this._adaptiveModulationIsAvail = arg.isAdaptiveModulationIsAvail();
        this._scriptList = arg.getScriptList();
    }

    public AirInterfaceCapabilityListBuilder(AirInterfaceCapabilityList base) {
        if (base.getKey() == null) {
            this._key = new AirInterfaceCapabilityListKey(
                base.getAirInterfaceID()
            );
            this._airInterfaceID = base.getAirInterfaceID();
        } else {
            this._key = base.getKey();
            this._airInterfaceID = _key.getAirInterfaceID();
        }
        this._rxFrequencyMax = base.getRxFrequencyMax();
        this._rxFrequencyMin = base.getRxFrequencyMin();
        this._scriptList = base.getScriptList();
        this._supportedChannelPlans = base.getSupportedChannelPlans();
        this._txFrequencyMax = base.getTxFrequencyMax();
        this._txFrequencyMin = base.getTxFrequencyMin();
        this._typeOfEquipment = base.getTypeOfEquipment();
        this._adaptiveModulationIsAvail = base.isAdaptiveModulationIsAvail();
        if (base instanceof AirInterfaceCapabilityListImpl) {
            AirInterfaceCapabilityListImpl impl = (AirInterfaceCapabilityListImpl) base;
            if (!impl.augmentation.isEmpty()) {
                this.augmentation = new HashMap<>(impl.augmentation);
            }
        } else if (base instanceof AugmentationHolder) {
            @SuppressWarnings("unchecked")
            AugmentationHolder<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.mw_airinterface_pac.AirInterfaceCapabilityList> casted =(AugmentationHolder<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.mw_airinterface_pac.AirInterfaceCapabilityList>) base;
            if (!casted.augmentations().isEmpty()) {
                this.augmentation = new HashMap<>(casted.augmentations());
            }
        }
    }

    /**
     *Set fields from given grouping argument. Valid argument is instance of one of following types:
     * <ul>
     * <li>org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.AirInterfaceCapability</li>
     * </ul>
     *
     * @param arg grouping object
     * @throws IllegalArgumentException if given argument is none of valid types
    */
    public void fieldsFrom(DataObject arg) {
        boolean isValidArg = false;
        if (arg instanceof org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.AirInterfaceCapability) {
            this._airInterfaceID = ((org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.AirInterfaceCapability)arg).getAirInterfaceID();
            this._typeOfEquipment = ((org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.AirInterfaceCapability)arg).getTypeOfEquipment();
            this._supportedChannelPlans = ((org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.AirInterfaceCapability)arg).getSupportedChannelPlans();
            this._txFrequencyMin = ((org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.AirInterfaceCapability)arg).getTxFrequencyMin();
            this._txFrequencyMax = ((org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.AirInterfaceCapability)arg).getTxFrequencyMax();
            this._rxFrequencyMin = ((org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.AirInterfaceCapability)arg).getRxFrequencyMin();
            this._rxFrequencyMax = ((org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.AirInterfaceCapability)arg).getRxFrequencyMax();
            this._adaptiveModulationIsAvail = ((org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.AirInterfaceCapability)arg).isAdaptiveModulationIsAvail();
            this._scriptList = ((org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.AirInterfaceCapability)arg).getScriptList();
            isValidArg = true;
        }
        if (!isValidArg) {
            throw new IllegalArgumentException(
              "expected one of: [org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.AirInterfaceCapability] \n" +
              "but was: " + arg
            );
        }
    }

    public java.lang.String getAirInterfaceID() {
        return _airInterfaceID;
    }
    
    public AirInterfaceCapabilityListKey getKey() {
        return _key;
    }
    
    public BigInteger getRxFrequencyMax() {
        return _rxFrequencyMax;
    }
    
    public BigInteger getRxFrequencyMin() {
        return _rxFrequencyMin;
    }
    
    public List<ScriptList> getScriptList() {
        return _scriptList;
    }
    
    public java.lang.String getSupportedChannelPlans() {
        return _supportedChannelPlans;
    }
    
    public BigInteger getTxFrequencyMax() {
        return _txFrequencyMax;
    }
    
    public BigInteger getTxFrequencyMin() {
        return _txFrequencyMin;
    }
    
    public java.lang.String getTypeOfEquipment() {
        return _typeOfEquipment;
    }
    
    public java.lang.Boolean isAdaptiveModulationIsAvail() {
        return _adaptiveModulationIsAvail;
    }
    
    @SuppressWarnings("unchecked")
    public <E extends Augmentation<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.mw_airinterface_pac.AirInterfaceCapabilityList>> E getAugmentation(java.lang.Class<E> augmentationType) {
        if (augmentationType == null) {
            throw new IllegalArgumentException("Augmentation Type reference cannot be NULL!");
        }
        return (E) augmentation.get(augmentationType);
    }

    public AirInterfaceCapabilityListBuilder setAirInterfaceID(java.lang.String value) {
        this._airInterfaceID = value;
        return this;
    }
    
    public AirInterfaceCapabilityListBuilder setKey(AirInterfaceCapabilityListKey value) {
        this._key = value;
        return this;
    }
    
    private static final com.google.common.collect.Range<java.math.BigInteger>[] CHECKRXFREQUENCYMAXRANGE_RANGES;
    static {
        @SuppressWarnings("unchecked")
        final com.google.common.collect.Range<java.math.BigInteger>[] a = (com.google.common.collect.Range<java.math.BigInteger>[]) java.lang.reflect.Array.newInstance(com.google.common.collect.Range.class, 1);
        a[0] = com.google.common.collect.Range.closed(java.math.BigInteger.ZERO, new java.math.BigInteger("18446744073709551615"));
        CHECKRXFREQUENCYMAXRANGE_RANGES = a;
    }
    private static void checkRxFrequencyMaxRange(final java.math.BigInteger value) {
        for (com.google.common.collect.Range<java.math.BigInteger> r : CHECKRXFREQUENCYMAXRANGE_RANGES) {
            if (r.contains(value)) {
                return;
            }
        }
        throw new IllegalArgumentException(String.format("Invalid range: %s, expected: %s.", value, java.util.Arrays.asList(CHECKRXFREQUENCYMAXRANGE_RANGES)));
    }
    
    public AirInterfaceCapabilityListBuilder setRxFrequencyMax(BigInteger value) {
        if (value != null) {
            checkRxFrequencyMaxRange(value);
        }
        this._rxFrequencyMax = value;
        return this;
    }
    /**
     * @deprecated This method is slated for removal in a future release. See BUG-1485 for details.
     */
    @Deprecated
    public static List<Range<BigInteger>> _rxFrequencyMax_range() {
        final List<Range<BigInteger>> ret = new java.util.ArrayList<>(1);
        ret.add(Range.closed(BigInteger.ZERO, new BigInteger("18446744073709551615")));
        return ret;
    }
    
    private static final com.google.common.collect.Range<java.math.BigInteger>[] CHECKRXFREQUENCYMINRANGE_RANGES;
    static {
        @SuppressWarnings("unchecked")
        final com.google.common.collect.Range<java.math.BigInteger>[] a = (com.google.common.collect.Range<java.math.BigInteger>[]) java.lang.reflect.Array.newInstance(com.google.common.collect.Range.class, 1);
        a[0] = com.google.common.collect.Range.closed(java.math.BigInteger.ZERO, new java.math.BigInteger("18446744073709551615"));
        CHECKRXFREQUENCYMINRANGE_RANGES = a;
    }
    private static void checkRxFrequencyMinRange(final java.math.BigInteger value) {
        for (com.google.common.collect.Range<java.math.BigInteger> r : CHECKRXFREQUENCYMINRANGE_RANGES) {
            if (r.contains(value)) {
                return;
            }
        }
        throw new IllegalArgumentException(String.format("Invalid range: %s, expected: %s.", value, java.util.Arrays.asList(CHECKRXFREQUENCYMINRANGE_RANGES)));
    }
    
    public AirInterfaceCapabilityListBuilder setRxFrequencyMin(BigInteger value) {
        if (value != null) {
            checkRxFrequencyMinRange(value);
        }
        this._rxFrequencyMin = value;
        return this;
    }
    /**
     * @deprecated This method is slated for removal in a future release. See BUG-1485 for details.
     */
    @Deprecated
    public static List<Range<BigInteger>> _rxFrequencyMin_range() {
        final List<Range<BigInteger>> ret = new java.util.ArrayList<>(1);
        ret.add(Range.closed(BigInteger.ZERO, new BigInteger("18446744073709551615")));
        return ret;
    }
    
    public AirInterfaceCapabilityListBuilder setScriptList(List<ScriptList> value) {
        this._scriptList = value;
        return this;
    }
    
    public AirInterfaceCapabilityListBuilder setSupportedChannelPlans(java.lang.String value) {
        this._supportedChannelPlans = value;
        return this;
    }
    
    private static final com.google.common.collect.Range<java.math.BigInteger>[] CHECKTXFREQUENCYMAXRANGE_RANGES;
    static {
        @SuppressWarnings("unchecked")
        final com.google.common.collect.Range<java.math.BigInteger>[] a = (com.google.common.collect.Range<java.math.BigInteger>[]) java.lang.reflect.Array.newInstance(com.google.common.collect.Range.class, 1);
        a[0] = com.google.common.collect.Range.closed(java.math.BigInteger.ZERO, new java.math.BigInteger("18446744073709551615"));
        CHECKTXFREQUENCYMAXRANGE_RANGES = a;
    }
    private static void checkTxFrequencyMaxRange(final java.math.BigInteger value) {
        for (com.google.common.collect.Range<java.math.BigInteger> r : CHECKTXFREQUENCYMAXRANGE_RANGES) {
            if (r.contains(value)) {
                return;
            }
        }
        throw new IllegalArgumentException(String.format("Invalid range: %s, expected: %s.", value, java.util.Arrays.asList(CHECKTXFREQUENCYMAXRANGE_RANGES)));
    }
    
    public AirInterfaceCapabilityListBuilder setTxFrequencyMax(BigInteger value) {
        if (value != null) {
            checkTxFrequencyMaxRange(value);
        }
        this._txFrequencyMax = value;
        return this;
    }
    /**
     * @deprecated This method is slated for removal in a future release. See BUG-1485 for details.
     */
    @Deprecated
    public static List<Range<BigInteger>> _txFrequencyMax_range() {
        final List<Range<BigInteger>> ret = new java.util.ArrayList<>(1);
        ret.add(Range.closed(BigInteger.ZERO, new BigInteger("18446744073709551615")));
        return ret;
    }
    
    private static final com.google.common.collect.Range<java.math.BigInteger>[] CHECKTXFREQUENCYMINRANGE_RANGES;
    static {
        @SuppressWarnings("unchecked")
        final com.google.common.collect.Range<java.math.BigInteger>[] a = (com.google.common.collect.Range<java.math.BigInteger>[]) java.lang.reflect.Array.newInstance(com.google.common.collect.Range.class, 1);
        a[0] = com.google.common.collect.Range.closed(java.math.BigInteger.ZERO, new java.math.BigInteger("18446744073709551615"));
        CHECKTXFREQUENCYMINRANGE_RANGES = a;
    }
    private static void checkTxFrequencyMinRange(final java.math.BigInteger value) {
        for (com.google.common.collect.Range<java.math.BigInteger> r : CHECKTXFREQUENCYMINRANGE_RANGES) {
            if (r.contains(value)) {
                return;
            }
        }
        throw new IllegalArgumentException(String.format("Invalid range: %s, expected: %s.", value, java.util.Arrays.asList(CHECKTXFREQUENCYMINRANGE_RANGES)));
    }
    
    public AirInterfaceCapabilityListBuilder setTxFrequencyMin(BigInteger value) {
        if (value != null) {
            checkTxFrequencyMinRange(value);
        }
        this._txFrequencyMin = value;
        return this;
    }
    /**
     * @deprecated This method is slated for removal in a future release. See BUG-1485 for details.
     */
    @Deprecated
    public static List<Range<BigInteger>> _txFrequencyMin_range() {
        final List<Range<BigInteger>> ret = new java.util.ArrayList<>(1);
        ret.add(Range.closed(BigInteger.ZERO, new BigInteger("18446744073709551615")));
        return ret;
    }
    
    public AirInterfaceCapabilityListBuilder setTypeOfEquipment(java.lang.String value) {
        this._typeOfEquipment = value;
        return this;
    }
    
    public AirInterfaceCapabilityListBuilder setAdaptiveModulationIsAvail(java.lang.Boolean value) {
        this._adaptiveModulationIsAvail = value;
        return this;
    }
    
    public AirInterfaceCapabilityListBuilder addAugmentation(java.lang.Class<? extends Augmentation<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.mw_airinterface_pac.AirInterfaceCapabilityList>> augmentationType, Augmentation<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.mw_airinterface_pac.AirInterfaceCapabilityList> augmentation) {
        if (augmentation == null) {
            return removeAugmentation(augmentationType);
        }
    
        if (!(this.augmentation instanceof HashMap)) {
            this.augmentation = new HashMap<>();
        }
    
        this.augmentation.put(augmentationType, augmentation);
        return this;
    }
    
    public AirInterfaceCapabilityListBuilder removeAugmentation(java.lang.Class<? extends Augmentation<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.mw_airinterface_pac.AirInterfaceCapabilityList>> augmentationType) {
        if (this.augmentation instanceof HashMap) {
            this.augmentation.remove(augmentationType);
        }
        return this;
    }

    public AirInterfaceCapabilityList build() {
        return new AirInterfaceCapabilityListImpl(this);
    }

    private static final class AirInterfaceCapabilityListImpl implements AirInterfaceCapabilityList {

        public java.lang.Class<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.mw_airinterface_pac.AirInterfaceCapabilityList> getImplementedInterface() {
            return org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.mw_airinterface_pac.AirInterfaceCapabilityList.class;
        }

        private final java.lang.String _airInterfaceID;
        private final AirInterfaceCapabilityListKey _key;
        private final BigInteger _rxFrequencyMax;
        private final BigInteger _rxFrequencyMin;
        private final List<ScriptList> _scriptList;
        private final java.lang.String _supportedChannelPlans;
        private final BigInteger _txFrequencyMax;
        private final BigInteger _txFrequencyMin;
        private final java.lang.String _typeOfEquipment;
        private final java.lang.Boolean _adaptiveModulationIsAvail;

        private Map<java.lang.Class<? extends Augmentation<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.mw_airinterface_pac.AirInterfaceCapabilityList>>, Augmentation<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.mw_airinterface_pac.AirInterfaceCapabilityList>> augmentation = Collections.emptyMap();

        private AirInterfaceCapabilityListImpl(AirInterfaceCapabilityListBuilder base) {
            if (base.getKey() == null) {
                this._key = new AirInterfaceCapabilityListKey(
                    base.getAirInterfaceID()
                );
                this._airInterfaceID = base.getAirInterfaceID();
            } else {
                this._key = base.getKey();
                this._airInterfaceID = _key.getAirInterfaceID();
            }
            this._rxFrequencyMax = base.getRxFrequencyMax();
            this._rxFrequencyMin = base.getRxFrequencyMin();
            this._scriptList = base.getScriptList();
            this._supportedChannelPlans = base.getSupportedChannelPlans();
            this._txFrequencyMax = base.getTxFrequencyMax();
            this._txFrequencyMin = base.getTxFrequencyMin();
            this._typeOfEquipment = base.getTypeOfEquipment();
            this._adaptiveModulationIsAvail = base.isAdaptiveModulationIsAvail();
            switch (base.augmentation.size()) {
            case 0:
                this.augmentation = Collections.emptyMap();
                break;
            case 1:
                final Map.Entry<java.lang.Class<? extends Augmentation<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.mw_airinterface_pac.AirInterfaceCapabilityList>>, Augmentation<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.mw_airinterface_pac.AirInterfaceCapabilityList>> e = base.augmentation.entrySet().iterator().next();
                this.augmentation = Collections.<java.lang.Class<? extends Augmentation<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.mw_airinterface_pac.AirInterfaceCapabilityList>>, Augmentation<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.mw_airinterface_pac.AirInterfaceCapabilityList>>singletonMap(e.getKey(), e.getValue());
                break;
            default :
                this.augmentation = new HashMap<>(base.augmentation);
            }
        }

        @Override
        public java.lang.String getAirInterfaceID() {
            return _airInterfaceID;
        }
        
        @Override
        public AirInterfaceCapabilityListKey getKey() {
            return _key;
        }
        
        @Override
        public BigInteger getRxFrequencyMax() {
            return _rxFrequencyMax;
        }
        
        @Override
        public BigInteger getRxFrequencyMin() {
            return _rxFrequencyMin;
        }
        
        @Override
        public List<ScriptList> getScriptList() {
            return _scriptList;
        }
        
        @Override
        public java.lang.String getSupportedChannelPlans() {
            return _supportedChannelPlans;
        }
        
        @Override
        public BigInteger getTxFrequencyMax() {
            return _txFrequencyMax;
        }
        
        @Override
        public BigInteger getTxFrequencyMin() {
            return _txFrequencyMin;
        }
        
        @Override
        public java.lang.String getTypeOfEquipment() {
            return _typeOfEquipment;
        }
        
        @Override
        public java.lang.Boolean isAdaptiveModulationIsAvail() {
            return _adaptiveModulationIsAvail;
        }
        
        @SuppressWarnings("unchecked")
        @Override
        public <E extends Augmentation<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.mw_airinterface_pac.AirInterfaceCapabilityList>> E getAugmentation(java.lang.Class<E> augmentationType) {
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
            result = prime * result + ((_airInterfaceID == null) ? 0 : _airInterfaceID.hashCode());
            result = prime * result + ((_key == null) ? 0 : _key.hashCode());
            result = prime * result + ((_rxFrequencyMax == null) ? 0 : _rxFrequencyMax.hashCode());
            result = prime * result + ((_rxFrequencyMin == null) ? 0 : _rxFrequencyMin.hashCode());
            result = prime * result + ((_scriptList == null) ? 0 : _scriptList.hashCode());
            result = prime * result + ((_supportedChannelPlans == null) ? 0 : _supportedChannelPlans.hashCode());
            result = prime * result + ((_txFrequencyMax == null) ? 0 : _txFrequencyMax.hashCode());
            result = prime * result + ((_txFrequencyMin == null) ? 0 : _txFrequencyMin.hashCode());
            result = prime * result + ((_typeOfEquipment == null) ? 0 : _typeOfEquipment.hashCode());
            result = prime * result + ((_adaptiveModulationIsAvail == null) ? 0 : _adaptiveModulationIsAvail.hashCode());
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
            if (!org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.mw_airinterface_pac.AirInterfaceCapabilityList.class.equals(((DataObject)obj).getImplementedInterface())) {
                return false;
            }
            org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.mw_airinterface_pac.AirInterfaceCapabilityList other = (org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.mw_airinterface_pac.AirInterfaceCapabilityList)obj;
            if (_airInterfaceID == null) {
                if (other.getAirInterfaceID() != null) {
                    return false;
                }
            } else if(!_airInterfaceID.equals(other.getAirInterfaceID())) {
                return false;
            }
            if (_key == null) {
                if (other.getKey() != null) {
                    return false;
                }
            } else if(!_key.equals(other.getKey())) {
                return false;
            }
            if (_rxFrequencyMax == null) {
                if (other.getRxFrequencyMax() != null) {
                    return false;
                }
            } else if(!_rxFrequencyMax.equals(other.getRxFrequencyMax())) {
                return false;
            }
            if (_rxFrequencyMin == null) {
                if (other.getRxFrequencyMin() != null) {
                    return false;
                }
            } else if(!_rxFrequencyMin.equals(other.getRxFrequencyMin())) {
                return false;
            }
            if (_scriptList == null) {
                if (other.getScriptList() != null) {
                    return false;
                }
            } else if(!_scriptList.equals(other.getScriptList())) {
                return false;
            }
            if (_supportedChannelPlans == null) {
                if (other.getSupportedChannelPlans() != null) {
                    return false;
                }
            } else if(!_supportedChannelPlans.equals(other.getSupportedChannelPlans())) {
                return false;
            }
            if (_txFrequencyMax == null) {
                if (other.getTxFrequencyMax() != null) {
                    return false;
                }
            } else if(!_txFrequencyMax.equals(other.getTxFrequencyMax())) {
                return false;
            }
            if (_txFrequencyMin == null) {
                if (other.getTxFrequencyMin() != null) {
                    return false;
                }
            } else if(!_txFrequencyMin.equals(other.getTxFrequencyMin())) {
                return false;
            }
            if (_typeOfEquipment == null) {
                if (other.getTypeOfEquipment() != null) {
                    return false;
                }
            } else if(!_typeOfEquipment.equals(other.getTypeOfEquipment())) {
                return false;
            }
            if (_adaptiveModulationIsAvail == null) {
                if (other.isAdaptiveModulationIsAvail() != null) {
                    return false;
                }
            } else if(!_adaptiveModulationIsAvail.equals(other.isAdaptiveModulationIsAvail())) {
                return false;
            }
            if (getClass() == obj.getClass()) {
                // Simple case: we are comparing against self
                AirInterfaceCapabilityListImpl otherImpl = (AirInterfaceCapabilityListImpl) obj;
                if (augmentation == null) {
                    if (otherImpl.augmentation != null) {
                        return false;
                    }
                } else if(!augmentation.equals(otherImpl.augmentation)) {
                    return false;
                }
            } else {
                // Hard case: compare our augments with presence there...
                for (Map.Entry<java.lang.Class<? extends Augmentation<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.mw_airinterface_pac.AirInterfaceCapabilityList>>, Augmentation<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.mw_airinterface_pac.AirInterfaceCapabilityList>> e : augmentation.entrySet()) {
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
            java.lang.StringBuilder builder = new java.lang.StringBuilder ("AirInterfaceCapabilityList [");
            boolean first = true;
        
            if (_airInterfaceID != null) {
                if (first) {
                    first = false;
                } else {
                    builder.append(", ");
                }
                builder.append("_airInterfaceID=");
                builder.append(_airInterfaceID);
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
            if (_rxFrequencyMax != null) {
                if (first) {
                    first = false;
                } else {
                    builder.append(", ");
                }
                builder.append("_rxFrequencyMax=");
                builder.append(_rxFrequencyMax);
             }
            if (_rxFrequencyMin != null) {
                if (first) {
                    first = false;
                } else {
                    builder.append(", ");
                }
                builder.append("_rxFrequencyMin=");
                builder.append(_rxFrequencyMin);
             }
            if (_scriptList != null) {
                if (first) {
                    first = false;
                } else {
                    builder.append(", ");
                }
                builder.append("_scriptList=");
                builder.append(_scriptList);
             }
            if (_supportedChannelPlans != null) {
                if (first) {
                    first = false;
                } else {
                    builder.append(", ");
                }
                builder.append("_supportedChannelPlans=");
                builder.append(_supportedChannelPlans);
             }
            if (_txFrequencyMax != null) {
                if (first) {
                    first = false;
                } else {
                    builder.append(", ");
                }
                builder.append("_txFrequencyMax=");
                builder.append(_txFrequencyMax);
             }
            if (_txFrequencyMin != null) {
                if (first) {
                    first = false;
                } else {
                    builder.append(", ");
                }
                builder.append("_txFrequencyMin=");
                builder.append(_txFrequencyMin);
             }
            if (_typeOfEquipment != null) {
                if (first) {
                    first = false;
                } else {
                    builder.append(", ");
                }
                builder.append("_typeOfEquipment=");
                builder.append(_typeOfEquipment);
             }
            if (_adaptiveModulationIsAvail != null) {
                if (first) {
                    first = false;
                } else {
                    builder.append(", ");
                }
                builder.append("_adaptiveModulationIsAvail=");
                builder.append(_adaptiveModulationIsAvail);
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
