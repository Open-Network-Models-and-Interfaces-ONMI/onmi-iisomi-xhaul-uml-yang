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
 * Class that builds {@link org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.mw_airinterface_pac.AirInterfaceConfiguration} instances.
 *
 * @see org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.mw_airinterface_pac.AirInterfaceConfiguration
 *
 */
public class AirInterfaceConfigurationBuilder implements Builder <org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.mw_airinterface_pac.AirInterfaceConfiguration> {

    private java.lang.String _airInterfaceName;
    private BigInteger _modulationMax;
    private BigInteger _modulationMin;
    private java.lang.String _radioSignalId;
    private BigInteger _rxChannelBandwidth;
    private BigInteger _rxFrequency;
    private BigInteger _txChannelBandwidth;
    private BigInteger _txFrequency;
    private java.lang.Long _txPower;
    private java.lang.Boolean _adaptiveModulationIsOn;
    private java.lang.Boolean _powerIsOn;
    private java.lang.Boolean _transmitterIsOn;
    private java.lang.Boolean _xpicIsOn;

    Map<java.lang.Class<? extends Augmentation<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.mw_airinterface_pac.AirInterfaceConfiguration>>, Augmentation<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.mw_airinterface_pac.AirInterfaceConfiguration>> augmentation = Collections.emptyMap();

    public AirInterfaceConfigurationBuilder() {
    }
    public AirInterfaceConfigurationBuilder(org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.AirInterfaceConfiguration arg) {
        this._airInterfaceName = arg.getAirInterfaceName();
        this._radioSignalId = arg.getRadioSignalId();
        this._txFrequency = arg.getTxFrequency();
        this._rxFrequency = arg.getRxFrequency();
        this._txChannelBandwidth = arg.getTxChannelBandwidth();
        this._rxChannelBandwidth = arg.getRxChannelBandwidth();
        this._powerIsOn = arg.isPowerIsOn();
        this._transmitterIsOn = arg.isTransmitterIsOn();
        this._txPower = arg.getTxPower();
        this._adaptiveModulationIsOn = arg.isAdaptiveModulationIsOn();
        this._modulationMin = arg.getModulationMin();
        this._modulationMax = arg.getModulationMax();
        this._xpicIsOn = arg.isXpicIsOn();
    }

    public AirInterfaceConfigurationBuilder(AirInterfaceConfiguration base) {
        this._airInterfaceName = base.getAirInterfaceName();
        this._modulationMax = base.getModulationMax();
        this._modulationMin = base.getModulationMin();
        this._radioSignalId = base.getRadioSignalId();
        this._rxChannelBandwidth = base.getRxChannelBandwidth();
        this._rxFrequency = base.getRxFrequency();
        this._txChannelBandwidth = base.getTxChannelBandwidth();
        this._txFrequency = base.getTxFrequency();
        this._txPower = base.getTxPower();
        this._adaptiveModulationIsOn = base.isAdaptiveModulationIsOn();
        this._powerIsOn = base.isPowerIsOn();
        this._transmitterIsOn = base.isTransmitterIsOn();
        this._xpicIsOn = base.isXpicIsOn();
        if (base instanceof AirInterfaceConfigurationImpl) {
            AirInterfaceConfigurationImpl impl = (AirInterfaceConfigurationImpl) base;
            if (!impl.augmentation.isEmpty()) {
                this.augmentation = new HashMap<>(impl.augmentation);
            }
        } else if (base instanceof AugmentationHolder) {
            @SuppressWarnings("unchecked")
            AugmentationHolder<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.mw_airinterface_pac.AirInterfaceConfiguration> casted =(AugmentationHolder<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.mw_airinterface_pac.AirInterfaceConfiguration>) base;
            if (!casted.augmentations().isEmpty()) {
                this.augmentation = new HashMap<>(casted.augmentations());
            }
        }
    }

    /**
     *Set fields from given grouping argument. Valid argument is instance of one of following types:
     * <ul>
     * <li>org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.AirInterfaceConfiguration</li>
     * </ul>
     *
     * @param arg grouping object
     * @throws IllegalArgumentException if given argument is none of valid types
    */
    public void fieldsFrom(DataObject arg) {
        boolean isValidArg = false;
        if (arg instanceof org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.AirInterfaceConfiguration) {
            this._airInterfaceName = ((org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.AirInterfaceConfiguration)arg).getAirInterfaceName();
            this._radioSignalId = ((org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.AirInterfaceConfiguration)arg).getRadioSignalId();
            this._txFrequency = ((org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.AirInterfaceConfiguration)arg).getTxFrequency();
            this._rxFrequency = ((org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.AirInterfaceConfiguration)arg).getRxFrequency();
            this._txChannelBandwidth = ((org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.AirInterfaceConfiguration)arg).getTxChannelBandwidth();
            this._rxChannelBandwidth = ((org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.AirInterfaceConfiguration)arg).getRxChannelBandwidth();
            this._powerIsOn = ((org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.AirInterfaceConfiguration)arg).isPowerIsOn();
            this._transmitterIsOn = ((org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.AirInterfaceConfiguration)arg).isTransmitterIsOn();
            this._txPower = ((org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.AirInterfaceConfiguration)arg).getTxPower();
            this._adaptiveModulationIsOn = ((org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.AirInterfaceConfiguration)arg).isAdaptiveModulationIsOn();
            this._modulationMin = ((org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.AirInterfaceConfiguration)arg).getModulationMin();
            this._modulationMax = ((org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.AirInterfaceConfiguration)arg).getModulationMax();
            this._xpicIsOn = ((org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.AirInterfaceConfiguration)arg).isXpicIsOn();
            isValidArg = true;
        }
        if (!isValidArg) {
            throw new IllegalArgumentException(
              "expected one of: [org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.AirInterfaceConfiguration] \n" +
              "but was: " + arg
            );
        }
    }

    public java.lang.String getAirInterfaceName() {
        return _airInterfaceName;
    }
    
    public BigInteger getModulationMax() {
        return _modulationMax;
    }
    
    public BigInteger getModulationMin() {
        return _modulationMin;
    }
    
    public java.lang.String getRadioSignalId() {
        return _radioSignalId;
    }
    
    public BigInteger getRxChannelBandwidth() {
        return _rxChannelBandwidth;
    }
    
    public BigInteger getRxFrequency() {
        return _rxFrequency;
    }
    
    public BigInteger getTxChannelBandwidth() {
        return _txChannelBandwidth;
    }
    
    public BigInteger getTxFrequency() {
        return _txFrequency;
    }
    
    public java.lang.Long getTxPower() {
        return _txPower;
    }
    
    public java.lang.Boolean isAdaptiveModulationIsOn() {
        return _adaptiveModulationIsOn;
    }
    
    public java.lang.Boolean isPowerIsOn() {
        return _powerIsOn;
    }
    
    public java.lang.Boolean isTransmitterIsOn() {
        return _transmitterIsOn;
    }
    
    public java.lang.Boolean isXpicIsOn() {
        return _xpicIsOn;
    }
    
    @SuppressWarnings("unchecked")
    public <E extends Augmentation<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.mw_airinterface_pac.AirInterfaceConfiguration>> E getAugmentation(java.lang.Class<E> augmentationType) {
        if (augmentationType == null) {
            throw new IllegalArgumentException("Augmentation Type reference cannot be NULL!");
        }
        return (E) augmentation.get(augmentationType);
    }

    public AirInterfaceConfigurationBuilder setAirInterfaceName(java.lang.String value) {
        this._airInterfaceName = value;
        return this;
    }
    
    private static final com.google.common.collect.Range<java.math.BigInteger>[] CHECKMODULATIONMAXRANGE_RANGES;
    static {
        @SuppressWarnings("unchecked")
        final com.google.common.collect.Range<java.math.BigInteger>[] a = (com.google.common.collect.Range<java.math.BigInteger>[]) java.lang.reflect.Array.newInstance(com.google.common.collect.Range.class, 1);
        a[0] = com.google.common.collect.Range.closed(java.math.BigInteger.ZERO, new java.math.BigInteger("18446744073709551615"));
        CHECKMODULATIONMAXRANGE_RANGES = a;
    }
    private static void checkModulationMaxRange(final java.math.BigInteger value) {
        for (com.google.common.collect.Range<java.math.BigInteger> r : CHECKMODULATIONMAXRANGE_RANGES) {
            if (r.contains(value)) {
                return;
            }
        }
        throw new IllegalArgumentException(String.format("Invalid range: %s, expected: %s.", value, java.util.Arrays.asList(CHECKMODULATIONMAXRANGE_RANGES)));
    }
    
    public AirInterfaceConfigurationBuilder setModulationMax(BigInteger value) {
        if (value != null) {
            checkModulationMaxRange(value);
        }
        this._modulationMax = value;
        return this;
    }
    /**
     * @deprecated This method is slated for removal in a future release. See BUG-1485 for details.
     */
    @Deprecated
    public static List<Range<BigInteger>> _modulationMax_range() {
        final List<Range<BigInteger>> ret = new java.util.ArrayList<>(1);
        ret.add(Range.closed(BigInteger.ZERO, new BigInteger("18446744073709551615")));
        return ret;
    }
    
    private static final com.google.common.collect.Range<java.math.BigInteger>[] CHECKMODULATIONMINRANGE_RANGES;
    static {
        @SuppressWarnings("unchecked")
        final com.google.common.collect.Range<java.math.BigInteger>[] a = (com.google.common.collect.Range<java.math.BigInteger>[]) java.lang.reflect.Array.newInstance(com.google.common.collect.Range.class, 1);
        a[0] = com.google.common.collect.Range.closed(java.math.BigInteger.ZERO, new java.math.BigInteger("18446744073709551615"));
        CHECKMODULATIONMINRANGE_RANGES = a;
    }
    private static void checkModulationMinRange(final java.math.BigInteger value) {
        for (com.google.common.collect.Range<java.math.BigInteger> r : CHECKMODULATIONMINRANGE_RANGES) {
            if (r.contains(value)) {
                return;
            }
        }
        throw new IllegalArgumentException(String.format("Invalid range: %s, expected: %s.", value, java.util.Arrays.asList(CHECKMODULATIONMINRANGE_RANGES)));
    }
    
    public AirInterfaceConfigurationBuilder setModulationMin(BigInteger value) {
        if (value != null) {
            checkModulationMinRange(value);
        }
        this._modulationMin = value;
        return this;
    }
    /**
     * @deprecated This method is slated for removal in a future release. See BUG-1485 for details.
     */
    @Deprecated
    public static List<Range<BigInteger>> _modulationMin_range() {
        final List<Range<BigInteger>> ret = new java.util.ArrayList<>(1);
        ret.add(Range.closed(BigInteger.ZERO, new BigInteger("18446744073709551615")));
        return ret;
    }
    
    public AirInterfaceConfigurationBuilder setRadioSignalId(java.lang.String value) {
        this._radioSignalId = value;
        return this;
    }
    
    private static final com.google.common.collect.Range<java.math.BigInteger>[] CHECKRXCHANNELBANDWIDTHRANGE_RANGES;
    static {
        @SuppressWarnings("unchecked")
        final com.google.common.collect.Range<java.math.BigInteger>[] a = (com.google.common.collect.Range<java.math.BigInteger>[]) java.lang.reflect.Array.newInstance(com.google.common.collect.Range.class, 1);
        a[0] = com.google.common.collect.Range.closed(java.math.BigInteger.ZERO, new java.math.BigInteger("18446744073709551615"));
        CHECKRXCHANNELBANDWIDTHRANGE_RANGES = a;
    }
    private static void checkRxChannelBandwidthRange(final java.math.BigInteger value) {
        for (com.google.common.collect.Range<java.math.BigInteger> r : CHECKRXCHANNELBANDWIDTHRANGE_RANGES) {
            if (r.contains(value)) {
                return;
            }
        }
        throw new IllegalArgumentException(String.format("Invalid range: %s, expected: %s.", value, java.util.Arrays.asList(CHECKRXCHANNELBANDWIDTHRANGE_RANGES)));
    }
    
    public AirInterfaceConfigurationBuilder setRxChannelBandwidth(BigInteger value) {
        if (value != null) {
            checkRxChannelBandwidthRange(value);
        }
        this._rxChannelBandwidth = value;
        return this;
    }
    /**
     * @deprecated This method is slated for removal in a future release. See BUG-1485 for details.
     */
    @Deprecated
    public static List<Range<BigInteger>> _rxChannelBandwidth_range() {
        final List<Range<BigInteger>> ret = new java.util.ArrayList<>(1);
        ret.add(Range.closed(BigInteger.ZERO, new BigInteger("18446744073709551615")));
        return ret;
    }
    
    private static final com.google.common.collect.Range<java.math.BigInteger>[] CHECKRXFREQUENCYRANGE_RANGES;
    static {
        @SuppressWarnings("unchecked")
        final com.google.common.collect.Range<java.math.BigInteger>[] a = (com.google.common.collect.Range<java.math.BigInteger>[]) java.lang.reflect.Array.newInstance(com.google.common.collect.Range.class, 1);
        a[0] = com.google.common.collect.Range.closed(java.math.BigInteger.ZERO, new java.math.BigInteger("18446744073709551615"));
        CHECKRXFREQUENCYRANGE_RANGES = a;
    }
    private static void checkRxFrequencyRange(final java.math.BigInteger value) {
        for (com.google.common.collect.Range<java.math.BigInteger> r : CHECKRXFREQUENCYRANGE_RANGES) {
            if (r.contains(value)) {
                return;
            }
        }
        throw new IllegalArgumentException(String.format("Invalid range: %s, expected: %s.", value, java.util.Arrays.asList(CHECKRXFREQUENCYRANGE_RANGES)));
    }
    
    public AirInterfaceConfigurationBuilder setRxFrequency(BigInteger value) {
        if (value != null) {
            checkRxFrequencyRange(value);
        }
        this._rxFrequency = value;
        return this;
    }
    /**
     * @deprecated This method is slated for removal in a future release. See BUG-1485 for details.
     */
    @Deprecated
    public static List<Range<BigInteger>> _rxFrequency_range() {
        final List<Range<BigInteger>> ret = new java.util.ArrayList<>(1);
        ret.add(Range.closed(BigInteger.ZERO, new BigInteger("18446744073709551615")));
        return ret;
    }
    
    private static final com.google.common.collect.Range<java.math.BigInteger>[] CHECKTXCHANNELBANDWIDTHRANGE_RANGES;
    static {
        @SuppressWarnings("unchecked")
        final com.google.common.collect.Range<java.math.BigInteger>[] a = (com.google.common.collect.Range<java.math.BigInteger>[]) java.lang.reflect.Array.newInstance(com.google.common.collect.Range.class, 1);
        a[0] = com.google.common.collect.Range.closed(java.math.BigInteger.ZERO, new java.math.BigInteger("18446744073709551615"));
        CHECKTXCHANNELBANDWIDTHRANGE_RANGES = a;
    }
    private static void checkTxChannelBandwidthRange(final java.math.BigInteger value) {
        for (com.google.common.collect.Range<java.math.BigInteger> r : CHECKTXCHANNELBANDWIDTHRANGE_RANGES) {
            if (r.contains(value)) {
                return;
            }
        }
        throw new IllegalArgumentException(String.format("Invalid range: %s, expected: %s.", value, java.util.Arrays.asList(CHECKTXCHANNELBANDWIDTHRANGE_RANGES)));
    }
    
    public AirInterfaceConfigurationBuilder setTxChannelBandwidth(BigInteger value) {
        if (value != null) {
            checkTxChannelBandwidthRange(value);
        }
        this._txChannelBandwidth = value;
        return this;
    }
    /**
     * @deprecated This method is slated for removal in a future release. See BUG-1485 for details.
     */
    @Deprecated
    public static List<Range<BigInteger>> _txChannelBandwidth_range() {
        final List<Range<BigInteger>> ret = new java.util.ArrayList<>(1);
        ret.add(Range.closed(BigInteger.ZERO, new BigInteger("18446744073709551615")));
        return ret;
    }
    
    private static final com.google.common.collect.Range<java.math.BigInteger>[] CHECKTXFREQUENCYRANGE_RANGES;
    static {
        @SuppressWarnings("unchecked")
        final com.google.common.collect.Range<java.math.BigInteger>[] a = (com.google.common.collect.Range<java.math.BigInteger>[]) java.lang.reflect.Array.newInstance(com.google.common.collect.Range.class, 1);
        a[0] = com.google.common.collect.Range.closed(java.math.BigInteger.ZERO, new java.math.BigInteger("18446744073709551615"));
        CHECKTXFREQUENCYRANGE_RANGES = a;
    }
    private static void checkTxFrequencyRange(final java.math.BigInteger value) {
        for (com.google.common.collect.Range<java.math.BigInteger> r : CHECKTXFREQUENCYRANGE_RANGES) {
            if (r.contains(value)) {
                return;
            }
        }
        throw new IllegalArgumentException(String.format("Invalid range: %s, expected: %s.", value, java.util.Arrays.asList(CHECKTXFREQUENCYRANGE_RANGES)));
    }
    
    public AirInterfaceConfigurationBuilder setTxFrequency(BigInteger value) {
        if (value != null) {
            checkTxFrequencyRange(value);
        }
        this._txFrequency = value;
        return this;
    }
    /**
     * @deprecated This method is slated for removal in a future release. See BUG-1485 for details.
     */
    @Deprecated
    public static List<Range<BigInteger>> _txFrequency_range() {
        final List<Range<BigInteger>> ret = new java.util.ArrayList<>(1);
        ret.add(Range.closed(BigInteger.ZERO, new BigInteger("18446744073709551615")));
        return ret;
    }
    
    public AirInterfaceConfigurationBuilder setTxPower(java.lang.Long value) {
        this._txPower = value;
        return this;
    }
    
    public AirInterfaceConfigurationBuilder setAdaptiveModulationIsOn(java.lang.Boolean value) {
        this._adaptiveModulationIsOn = value;
        return this;
    }
    
    public AirInterfaceConfigurationBuilder setPowerIsOn(java.lang.Boolean value) {
        this._powerIsOn = value;
        return this;
    }
    
    public AirInterfaceConfigurationBuilder setTransmitterIsOn(java.lang.Boolean value) {
        this._transmitterIsOn = value;
        return this;
    }
    
    public AirInterfaceConfigurationBuilder setXpicIsOn(java.lang.Boolean value) {
        this._xpicIsOn = value;
        return this;
    }
    
    public AirInterfaceConfigurationBuilder addAugmentation(java.lang.Class<? extends Augmentation<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.mw_airinterface_pac.AirInterfaceConfiguration>> augmentationType, Augmentation<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.mw_airinterface_pac.AirInterfaceConfiguration> augmentation) {
        if (augmentation == null) {
            return removeAugmentation(augmentationType);
        }
    
        if (!(this.augmentation instanceof HashMap)) {
            this.augmentation = new HashMap<>();
        }
    
        this.augmentation.put(augmentationType, augmentation);
        return this;
    }
    
    public AirInterfaceConfigurationBuilder removeAugmentation(java.lang.Class<? extends Augmentation<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.mw_airinterface_pac.AirInterfaceConfiguration>> augmentationType) {
        if (this.augmentation instanceof HashMap) {
            this.augmentation.remove(augmentationType);
        }
        return this;
    }

    public AirInterfaceConfiguration build() {
        return new AirInterfaceConfigurationImpl(this);
    }

    private static final class AirInterfaceConfigurationImpl implements AirInterfaceConfiguration {

        public java.lang.Class<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.mw_airinterface_pac.AirInterfaceConfiguration> getImplementedInterface() {
            return org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.mw_airinterface_pac.AirInterfaceConfiguration.class;
        }

        private final java.lang.String _airInterfaceName;
        private final BigInteger _modulationMax;
        private final BigInteger _modulationMin;
        private final java.lang.String _radioSignalId;
        private final BigInteger _rxChannelBandwidth;
        private final BigInteger _rxFrequency;
        private final BigInteger _txChannelBandwidth;
        private final BigInteger _txFrequency;
        private final java.lang.Long _txPower;
        private final java.lang.Boolean _adaptiveModulationIsOn;
        private final java.lang.Boolean _powerIsOn;
        private final java.lang.Boolean _transmitterIsOn;
        private final java.lang.Boolean _xpicIsOn;

        private Map<java.lang.Class<? extends Augmentation<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.mw_airinterface_pac.AirInterfaceConfiguration>>, Augmentation<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.mw_airinterface_pac.AirInterfaceConfiguration>> augmentation = Collections.emptyMap();

        private AirInterfaceConfigurationImpl(AirInterfaceConfigurationBuilder base) {
            this._airInterfaceName = base.getAirInterfaceName();
            this._modulationMax = base.getModulationMax();
            this._modulationMin = base.getModulationMin();
            this._radioSignalId = base.getRadioSignalId();
            this._rxChannelBandwidth = base.getRxChannelBandwidth();
            this._rxFrequency = base.getRxFrequency();
            this._txChannelBandwidth = base.getTxChannelBandwidth();
            this._txFrequency = base.getTxFrequency();
            this._txPower = base.getTxPower();
            this._adaptiveModulationIsOn = base.isAdaptiveModulationIsOn();
            this._powerIsOn = base.isPowerIsOn();
            this._transmitterIsOn = base.isTransmitterIsOn();
            this._xpicIsOn = base.isXpicIsOn();
            switch (base.augmentation.size()) {
            case 0:
                this.augmentation = Collections.emptyMap();
                break;
            case 1:
                final Map.Entry<java.lang.Class<? extends Augmentation<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.mw_airinterface_pac.AirInterfaceConfiguration>>, Augmentation<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.mw_airinterface_pac.AirInterfaceConfiguration>> e = base.augmentation.entrySet().iterator().next();
                this.augmentation = Collections.<java.lang.Class<? extends Augmentation<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.mw_airinterface_pac.AirInterfaceConfiguration>>, Augmentation<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.mw_airinterface_pac.AirInterfaceConfiguration>>singletonMap(e.getKey(), e.getValue());
                break;
            default :
                this.augmentation = new HashMap<>(base.augmentation);
            }
        }

        @Override
        public java.lang.String getAirInterfaceName() {
            return _airInterfaceName;
        }
        
        @Override
        public BigInteger getModulationMax() {
            return _modulationMax;
        }
        
        @Override
        public BigInteger getModulationMin() {
            return _modulationMin;
        }
        
        @Override
        public java.lang.String getRadioSignalId() {
            return _radioSignalId;
        }
        
        @Override
        public BigInteger getRxChannelBandwidth() {
            return _rxChannelBandwidth;
        }
        
        @Override
        public BigInteger getRxFrequency() {
            return _rxFrequency;
        }
        
        @Override
        public BigInteger getTxChannelBandwidth() {
            return _txChannelBandwidth;
        }
        
        @Override
        public BigInteger getTxFrequency() {
            return _txFrequency;
        }
        
        @Override
        public java.lang.Long getTxPower() {
            return _txPower;
        }
        
        @Override
        public java.lang.Boolean isAdaptiveModulationIsOn() {
            return _adaptiveModulationIsOn;
        }
        
        @Override
        public java.lang.Boolean isPowerIsOn() {
            return _powerIsOn;
        }
        
        @Override
        public java.lang.Boolean isTransmitterIsOn() {
            return _transmitterIsOn;
        }
        
        @Override
        public java.lang.Boolean isXpicIsOn() {
            return _xpicIsOn;
        }
        
        @SuppressWarnings("unchecked")
        @Override
        public <E extends Augmentation<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.mw_airinterface_pac.AirInterfaceConfiguration>> E getAugmentation(java.lang.Class<E> augmentationType) {
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
            result = prime * result + ((_airInterfaceName == null) ? 0 : _airInterfaceName.hashCode());
            result = prime * result + ((_modulationMax == null) ? 0 : _modulationMax.hashCode());
            result = prime * result + ((_modulationMin == null) ? 0 : _modulationMin.hashCode());
            result = prime * result + ((_radioSignalId == null) ? 0 : _radioSignalId.hashCode());
            result = prime * result + ((_rxChannelBandwidth == null) ? 0 : _rxChannelBandwidth.hashCode());
            result = prime * result + ((_rxFrequency == null) ? 0 : _rxFrequency.hashCode());
            result = prime * result + ((_txChannelBandwidth == null) ? 0 : _txChannelBandwidth.hashCode());
            result = prime * result + ((_txFrequency == null) ? 0 : _txFrequency.hashCode());
            result = prime * result + ((_txPower == null) ? 0 : _txPower.hashCode());
            result = prime * result + ((_adaptiveModulationIsOn == null) ? 0 : _adaptiveModulationIsOn.hashCode());
            result = prime * result + ((_powerIsOn == null) ? 0 : _powerIsOn.hashCode());
            result = prime * result + ((_transmitterIsOn == null) ? 0 : _transmitterIsOn.hashCode());
            result = prime * result + ((_xpicIsOn == null) ? 0 : _xpicIsOn.hashCode());
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
            if (!org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.mw_airinterface_pac.AirInterfaceConfiguration.class.equals(((DataObject)obj).getImplementedInterface())) {
                return false;
            }
            org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.mw_airinterface_pac.AirInterfaceConfiguration other = (org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.mw_airinterface_pac.AirInterfaceConfiguration)obj;
            if (_airInterfaceName == null) {
                if (other.getAirInterfaceName() != null) {
                    return false;
                }
            } else if(!_airInterfaceName.equals(other.getAirInterfaceName())) {
                return false;
            }
            if (_modulationMax == null) {
                if (other.getModulationMax() != null) {
                    return false;
                }
            } else if(!_modulationMax.equals(other.getModulationMax())) {
                return false;
            }
            if (_modulationMin == null) {
                if (other.getModulationMin() != null) {
                    return false;
                }
            } else if(!_modulationMin.equals(other.getModulationMin())) {
                return false;
            }
            if (_radioSignalId == null) {
                if (other.getRadioSignalId() != null) {
                    return false;
                }
            } else if(!_radioSignalId.equals(other.getRadioSignalId())) {
                return false;
            }
            if (_rxChannelBandwidth == null) {
                if (other.getRxChannelBandwidth() != null) {
                    return false;
                }
            } else if(!_rxChannelBandwidth.equals(other.getRxChannelBandwidth())) {
                return false;
            }
            if (_rxFrequency == null) {
                if (other.getRxFrequency() != null) {
                    return false;
                }
            } else if(!_rxFrequency.equals(other.getRxFrequency())) {
                return false;
            }
            if (_txChannelBandwidth == null) {
                if (other.getTxChannelBandwidth() != null) {
                    return false;
                }
            } else if(!_txChannelBandwidth.equals(other.getTxChannelBandwidth())) {
                return false;
            }
            if (_txFrequency == null) {
                if (other.getTxFrequency() != null) {
                    return false;
                }
            } else if(!_txFrequency.equals(other.getTxFrequency())) {
                return false;
            }
            if (_txPower == null) {
                if (other.getTxPower() != null) {
                    return false;
                }
            } else if(!_txPower.equals(other.getTxPower())) {
                return false;
            }
            if (_adaptiveModulationIsOn == null) {
                if (other.isAdaptiveModulationIsOn() != null) {
                    return false;
                }
            } else if(!_adaptiveModulationIsOn.equals(other.isAdaptiveModulationIsOn())) {
                return false;
            }
            if (_powerIsOn == null) {
                if (other.isPowerIsOn() != null) {
                    return false;
                }
            } else if(!_powerIsOn.equals(other.isPowerIsOn())) {
                return false;
            }
            if (_transmitterIsOn == null) {
                if (other.isTransmitterIsOn() != null) {
                    return false;
                }
            } else if(!_transmitterIsOn.equals(other.isTransmitterIsOn())) {
                return false;
            }
            if (_xpicIsOn == null) {
                if (other.isXpicIsOn() != null) {
                    return false;
                }
            } else if(!_xpicIsOn.equals(other.isXpicIsOn())) {
                return false;
            }
            if (getClass() == obj.getClass()) {
                // Simple case: we are comparing against self
                AirInterfaceConfigurationImpl otherImpl = (AirInterfaceConfigurationImpl) obj;
                if (augmentation == null) {
                    if (otherImpl.augmentation != null) {
                        return false;
                    }
                } else if(!augmentation.equals(otherImpl.augmentation)) {
                    return false;
                }
            } else {
                // Hard case: compare our augments with presence there...
                for (Map.Entry<java.lang.Class<? extends Augmentation<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.mw_airinterface_pac.AirInterfaceConfiguration>>, Augmentation<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.mw_airinterface_pac.AirInterfaceConfiguration>> e : augmentation.entrySet()) {
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
            java.lang.StringBuilder builder = new java.lang.StringBuilder ("AirInterfaceConfiguration [");
            boolean first = true;
        
            if (_airInterfaceName != null) {
                if (first) {
                    first = false;
                } else {
                    builder.append(", ");
                }
                builder.append("_airInterfaceName=");
                builder.append(_airInterfaceName);
             }
            if (_modulationMax != null) {
                if (first) {
                    first = false;
                } else {
                    builder.append(", ");
                }
                builder.append("_modulationMax=");
                builder.append(_modulationMax);
             }
            if (_modulationMin != null) {
                if (first) {
                    first = false;
                } else {
                    builder.append(", ");
                }
                builder.append("_modulationMin=");
                builder.append(_modulationMin);
             }
            if (_radioSignalId != null) {
                if (first) {
                    first = false;
                } else {
                    builder.append(", ");
                }
                builder.append("_radioSignalId=");
                builder.append(_radioSignalId);
             }
            if (_rxChannelBandwidth != null) {
                if (first) {
                    first = false;
                } else {
                    builder.append(", ");
                }
                builder.append("_rxChannelBandwidth=");
                builder.append(_rxChannelBandwidth);
             }
            if (_rxFrequency != null) {
                if (first) {
                    first = false;
                } else {
                    builder.append(", ");
                }
                builder.append("_rxFrequency=");
                builder.append(_rxFrequency);
             }
            if (_txChannelBandwidth != null) {
                if (first) {
                    first = false;
                } else {
                    builder.append(", ");
                }
                builder.append("_txChannelBandwidth=");
                builder.append(_txChannelBandwidth);
             }
            if (_txFrequency != null) {
                if (first) {
                    first = false;
                } else {
                    builder.append(", ");
                }
                builder.append("_txFrequency=");
                builder.append(_txFrequency);
             }
            if (_txPower != null) {
                if (first) {
                    first = false;
                } else {
                    builder.append(", ");
                }
                builder.append("_txPower=");
                builder.append(_txPower);
             }
            if (_adaptiveModulationIsOn != null) {
                if (first) {
                    first = false;
                } else {
                    builder.append(", ");
                }
                builder.append("_adaptiveModulationIsOn=");
                builder.append(_adaptiveModulationIsOn);
             }
            if (_powerIsOn != null) {
                if (first) {
                    first = false;
                } else {
                    builder.append(", ");
                }
                builder.append("_powerIsOn=");
                builder.append(_powerIsOn);
             }
            if (_transmitterIsOn != null) {
                if (first) {
                    first = false;
                } else {
                    builder.append(", ");
                }
                builder.append("_transmitterIsOn=");
                builder.append(_transmitterIsOn);
             }
            if (_xpicIsOn != null) {
                if (first) {
                    first = false;
                } else {
                    builder.append(", ");
                }
                builder.append("_xpicIsOn=");
                builder.append(_xpicIsOn);
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
