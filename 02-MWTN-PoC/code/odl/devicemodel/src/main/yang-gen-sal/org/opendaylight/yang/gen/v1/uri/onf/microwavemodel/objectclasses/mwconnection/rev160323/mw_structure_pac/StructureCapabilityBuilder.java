package org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.mw_structure_pac;
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
 * Class that builds {@link org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.mw_structure_pac.StructureCapability} instances.
 *
 * @see org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.mw_structure_pac.StructureCapability
 *
 */
public class StructureCapabilityBuilder implements Builder <org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.mw_structure_pac.StructureCapability> {

    private java.lang.String _structureID;
    private BigInteger _timeSlotCapacity;
    private BigInteger _totalNumberOfTimeSlots;

    Map<java.lang.Class<? extends Augmentation<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.mw_structure_pac.StructureCapability>>, Augmentation<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.mw_structure_pac.StructureCapability>> augmentation = Collections.emptyMap();

    public StructureCapabilityBuilder() {
    }
    public StructureCapabilityBuilder(org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.StructureCapability arg) {
        this._structureID = arg.getStructureID();
        this._totalNumberOfTimeSlots = arg.getTotalNumberOfTimeSlots();
        this._timeSlotCapacity = arg.getTimeSlotCapacity();
    }

    public StructureCapabilityBuilder(StructureCapability base) {
        this._structureID = base.getStructureID();
        this._timeSlotCapacity = base.getTimeSlotCapacity();
        this._totalNumberOfTimeSlots = base.getTotalNumberOfTimeSlots();
        if (base instanceof StructureCapabilityImpl) {
            StructureCapabilityImpl impl = (StructureCapabilityImpl) base;
            if (!impl.augmentation.isEmpty()) {
                this.augmentation = new HashMap<>(impl.augmentation);
            }
        } else if (base instanceof AugmentationHolder) {
            @SuppressWarnings("unchecked")
            AugmentationHolder<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.mw_structure_pac.StructureCapability> casted =(AugmentationHolder<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.mw_structure_pac.StructureCapability>) base;
            if (!casted.augmentations().isEmpty()) {
                this.augmentation = new HashMap<>(casted.augmentations());
            }
        }
    }

    /**
     *Set fields from given grouping argument. Valid argument is instance of one of following types:
     * <ul>
     * <li>org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.StructureCapability</li>
     * </ul>
     *
     * @param arg grouping object
     * @throws IllegalArgumentException if given argument is none of valid types
    */
    public void fieldsFrom(DataObject arg) {
        boolean isValidArg = false;
        if (arg instanceof org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.StructureCapability) {
            this._structureID = ((org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.StructureCapability)arg).getStructureID();
            this._totalNumberOfTimeSlots = ((org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.StructureCapability)arg).getTotalNumberOfTimeSlots();
            this._timeSlotCapacity = ((org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.StructureCapability)arg).getTimeSlotCapacity();
            isValidArg = true;
        }
        if (!isValidArg) {
            throw new IllegalArgumentException(
              "expected one of: [org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.StructureCapability] \n" +
              "but was: " + arg
            );
        }
    }

    public java.lang.String getStructureID() {
        return _structureID;
    }
    
    public BigInteger getTimeSlotCapacity() {
        return _timeSlotCapacity;
    }
    
    public BigInteger getTotalNumberOfTimeSlots() {
        return _totalNumberOfTimeSlots;
    }
    
    @SuppressWarnings("unchecked")
    public <E extends Augmentation<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.mw_structure_pac.StructureCapability>> E getAugmentation(java.lang.Class<E> augmentationType) {
        if (augmentationType == null) {
            throw new IllegalArgumentException("Augmentation Type reference cannot be NULL!");
        }
        return (E) augmentation.get(augmentationType);
    }

    public StructureCapabilityBuilder setStructureID(java.lang.String value) {
        this._structureID = value;
        return this;
    }
    
    private static final com.google.common.collect.Range<java.math.BigInteger>[] CHECKTIMESLOTCAPACITYRANGE_RANGES;
    static {
        @SuppressWarnings("unchecked")
        final com.google.common.collect.Range<java.math.BigInteger>[] a = (com.google.common.collect.Range<java.math.BigInteger>[]) java.lang.reflect.Array.newInstance(com.google.common.collect.Range.class, 1);
        a[0] = com.google.common.collect.Range.closed(java.math.BigInteger.ZERO, new java.math.BigInteger("18446744073709551615"));
        CHECKTIMESLOTCAPACITYRANGE_RANGES = a;
    }
    private static void checkTimeSlotCapacityRange(final java.math.BigInteger value) {
        for (com.google.common.collect.Range<java.math.BigInteger> r : CHECKTIMESLOTCAPACITYRANGE_RANGES) {
            if (r.contains(value)) {
                return;
            }
        }
        throw new IllegalArgumentException(String.format("Invalid range: %s, expected: %s.", value, java.util.Arrays.asList(CHECKTIMESLOTCAPACITYRANGE_RANGES)));
    }
    
    public StructureCapabilityBuilder setTimeSlotCapacity(BigInteger value) {
        if (value != null) {
            checkTimeSlotCapacityRange(value);
        }
        this._timeSlotCapacity = value;
        return this;
    }
    /**
     * @deprecated This method is slated for removal in a future release. See BUG-1485 for details.
     */
    @Deprecated
    public static List<Range<BigInteger>> _timeSlotCapacity_range() {
        final List<Range<BigInteger>> ret = new java.util.ArrayList<>(1);
        ret.add(Range.closed(BigInteger.ZERO, new BigInteger("18446744073709551615")));
        return ret;
    }
    
    private static final com.google.common.collect.Range<java.math.BigInteger>[] CHECKTOTALNUMBEROFTIMESLOTSRANGE_RANGES;
    static {
        @SuppressWarnings("unchecked")
        final com.google.common.collect.Range<java.math.BigInteger>[] a = (com.google.common.collect.Range<java.math.BigInteger>[]) java.lang.reflect.Array.newInstance(com.google.common.collect.Range.class, 1);
        a[0] = com.google.common.collect.Range.closed(java.math.BigInteger.ZERO, new java.math.BigInteger("18446744073709551615"));
        CHECKTOTALNUMBEROFTIMESLOTSRANGE_RANGES = a;
    }
    private static void checkTotalNumberOfTimeSlotsRange(final java.math.BigInteger value) {
        for (com.google.common.collect.Range<java.math.BigInteger> r : CHECKTOTALNUMBEROFTIMESLOTSRANGE_RANGES) {
            if (r.contains(value)) {
                return;
            }
        }
        throw new IllegalArgumentException(String.format("Invalid range: %s, expected: %s.", value, java.util.Arrays.asList(CHECKTOTALNUMBEROFTIMESLOTSRANGE_RANGES)));
    }
    
    public StructureCapabilityBuilder setTotalNumberOfTimeSlots(BigInteger value) {
        if (value != null) {
            checkTotalNumberOfTimeSlotsRange(value);
        }
        this._totalNumberOfTimeSlots = value;
        return this;
    }
    /**
     * @deprecated This method is slated for removal in a future release. See BUG-1485 for details.
     */
    @Deprecated
    public static List<Range<BigInteger>> _totalNumberOfTimeSlots_range() {
        final List<Range<BigInteger>> ret = new java.util.ArrayList<>(1);
        ret.add(Range.closed(BigInteger.ZERO, new BigInteger("18446744073709551615")));
        return ret;
    }
    
    public StructureCapabilityBuilder addAugmentation(java.lang.Class<? extends Augmentation<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.mw_structure_pac.StructureCapability>> augmentationType, Augmentation<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.mw_structure_pac.StructureCapability> augmentation) {
        if (augmentation == null) {
            return removeAugmentation(augmentationType);
        }
    
        if (!(this.augmentation instanceof HashMap)) {
            this.augmentation = new HashMap<>();
        }
    
        this.augmentation.put(augmentationType, augmentation);
        return this;
    }
    
    public StructureCapabilityBuilder removeAugmentation(java.lang.Class<? extends Augmentation<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.mw_structure_pac.StructureCapability>> augmentationType) {
        if (this.augmentation instanceof HashMap) {
            this.augmentation.remove(augmentationType);
        }
        return this;
    }

    public StructureCapability build() {
        return new StructureCapabilityImpl(this);
    }

    private static final class StructureCapabilityImpl implements StructureCapability {

        public java.lang.Class<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.mw_structure_pac.StructureCapability> getImplementedInterface() {
            return org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.mw_structure_pac.StructureCapability.class;
        }

        private final java.lang.String _structureID;
        private final BigInteger _timeSlotCapacity;
        private final BigInteger _totalNumberOfTimeSlots;

        private Map<java.lang.Class<? extends Augmentation<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.mw_structure_pac.StructureCapability>>, Augmentation<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.mw_structure_pac.StructureCapability>> augmentation = Collections.emptyMap();

        private StructureCapabilityImpl(StructureCapabilityBuilder base) {
            this._structureID = base.getStructureID();
            this._timeSlotCapacity = base.getTimeSlotCapacity();
            this._totalNumberOfTimeSlots = base.getTotalNumberOfTimeSlots();
            switch (base.augmentation.size()) {
            case 0:
                this.augmentation = Collections.emptyMap();
                break;
            case 1:
                final Map.Entry<java.lang.Class<? extends Augmentation<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.mw_structure_pac.StructureCapability>>, Augmentation<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.mw_structure_pac.StructureCapability>> e = base.augmentation.entrySet().iterator().next();
                this.augmentation = Collections.<java.lang.Class<? extends Augmentation<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.mw_structure_pac.StructureCapability>>, Augmentation<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.mw_structure_pac.StructureCapability>>singletonMap(e.getKey(), e.getValue());
                break;
            default :
                this.augmentation = new HashMap<>(base.augmentation);
            }
        }

        @Override
        public java.lang.String getStructureID() {
            return _structureID;
        }
        
        @Override
        public BigInteger getTimeSlotCapacity() {
            return _timeSlotCapacity;
        }
        
        @Override
        public BigInteger getTotalNumberOfTimeSlots() {
            return _totalNumberOfTimeSlots;
        }
        
        @SuppressWarnings("unchecked")
        @Override
        public <E extends Augmentation<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.mw_structure_pac.StructureCapability>> E getAugmentation(java.lang.Class<E> augmentationType) {
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
            result = prime * result + ((_structureID == null) ? 0 : _structureID.hashCode());
            result = prime * result + ((_timeSlotCapacity == null) ? 0 : _timeSlotCapacity.hashCode());
            result = prime * result + ((_totalNumberOfTimeSlots == null) ? 0 : _totalNumberOfTimeSlots.hashCode());
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
            if (!org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.mw_structure_pac.StructureCapability.class.equals(((DataObject)obj).getImplementedInterface())) {
                return false;
            }
            org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.mw_structure_pac.StructureCapability other = (org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.mw_structure_pac.StructureCapability)obj;
            if (_structureID == null) {
                if (other.getStructureID() != null) {
                    return false;
                }
            } else if(!_structureID.equals(other.getStructureID())) {
                return false;
            }
            if (_timeSlotCapacity == null) {
                if (other.getTimeSlotCapacity() != null) {
                    return false;
                }
            } else if(!_timeSlotCapacity.equals(other.getTimeSlotCapacity())) {
                return false;
            }
            if (_totalNumberOfTimeSlots == null) {
                if (other.getTotalNumberOfTimeSlots() != null) {
                    return false;
                }
            } else if(!_totalNumberOfTimeSlots.equals(other.getTotalNumberOfTimeSlots())) {
                return false;
            }
            if (getClass() == obj.getClass()) {
                // Simple case: we are comparing against self
                StructureCapabilityImpl otherImpl = (StructureCapabilityImpl) obj;
                if (augmentation == null) {
                    if (otherImpl.augmentation != null) {
                        return false;
                    }
                } else if(!augmentation.equals(otherImpl.augmentation)) {
                    return false;
                }
            } else {
                // Hard case: compare our augments with presence there...
                for (Map.Entry<java.lang.Class<? extends Augmentation<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.mw_structure_pac.StructureCapability>>, Augmentation<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.mw_structure_pac.StructureCapability>> e : augmentation.entrySet()) {
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
            java.lang.StringBuilder builder = new java.lang.StringBuilder ("StructureCapability [");
            boolean first = true;
        
            if (_structureID != null) {
                if (first) {
                    first = false;
                } else {
                    builder.append(", ");
                }
                builder.append("_structureID=");
                builder.append(_structureID);
             }
            if (_timeSlotCapacity != null) {
                if (first) {
                    first = false;
                } else {
                    builder.append(", ");
                }
                builder.append("_timeSlotCapacity=");
                builder.append(_timeSlotCapacity);
             }
            if (_totalNumberOfTimeSlots != null) {
                if (first) {
                    first = false;
                } else {
                    builder.append(", ");
                }
                builder.append("_totalNumberOfTimeSlots=");
                builder.append(_totalNumberOfTimeSlots);
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
