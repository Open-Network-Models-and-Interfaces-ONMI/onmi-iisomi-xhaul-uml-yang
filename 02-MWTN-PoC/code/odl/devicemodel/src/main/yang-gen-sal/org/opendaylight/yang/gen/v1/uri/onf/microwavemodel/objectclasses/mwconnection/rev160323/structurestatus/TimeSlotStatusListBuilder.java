package org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.structurestatus;
import org.opendaylight.yangtools.yang.binding.Augmentation;
import org.opendaylight.yangtools.yang.binding.AugmentationHolder;
import org.opendaylight.yangtools.yang.binding.DataObject;
import java.util.HashMap;
import org.opendaylight.yangtools.concepts.Builder;
import org.opendaylight.yang.gen.v1.uri.onf.coremodel.corefoundationmodule.statemodel.rev160305.OperationalState;
import java.util.Collections;
import java.util.Map;


/**
 * Class that builds {@link org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.structurestatus.TimeSlotStatusList} instances.
 *
 * @see org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.structurestatus.TimeSlotStatusList
 *
 */
public class TimeSlotStatusListBuilder implements Builder <org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.structurestatus.TimeSlotStatusList> {

    private TimeSlotStatusListKey _key;
    private OperationalState _operationalStatus;
    private java.lang.String _structureID;
    private java.lang.String _timeSlotID;

    Map<java.lang.Class<? extends Augmentation<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.structurestatus.TimeSlotStatusList>>, Augmentation<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.structurestatus.TimeSlotStatusList>> augmentation = Collections.emptyMap();

    public TimeSlotStatusListBuilder() {
    }
    public TimeSlotStatusListBuilder(org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.typedefinitions.rev160323.TimeSlotStatusType arg) {
        this._operationalStatus = arg.getOperationalStatus();
        this._structureID = arg.getStructureID();
        this._timeSlotID = arg.getTimeSlotID();
    }
    public TimeSlotStatusListBuilder(org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.typedefinitions.rev160323.TimeSlotIDType arg) {
        this._structureID = arg.getStructureID();
        this._timeSlotID = arg.getTimeSlotID();
    }

    public TimeSlotStatusListBuilder(TimeSlotStatusList base) {
        if (base.getKey() == null) {
            this._key = new TimeSlotStatusListKey(
                base.getStructureID(), 
                base.getTimeSlotID()
            );
            this._structureID = base.getStructureID();
            this._timeSlotID = base.getTimeSlotID();
        } else {
            this._key = base.getKey();
            this._structureID = _key.getStructureID();
            this._timeSlotID = _key.getTimeSlotID();
        }
        this._operationalStatus = base.getOperationalStatus();
        if (base instanceof TimeSlotStatusListImpl) {
            TimeSlotStatusListImpl impl = (TimeSlotStatusListImpl) base;
            if (!impl.augmentation.isEmpty()) {
                this.augmentation = new HashMap<>(impl.augmentation);
            }
        } else if (base instanceof AugmentationHolder) {
            @SuppressWarnings("unchecked")
            AugmentationHolder<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.structurestatus.TimeSlotStatusList> casted =(AugmentationHolder<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.structurestatus.TimeSlotStatusList>) base;
            if (!casted.augmentations().isEmpty()) {
                this.augmentation = new HashMap<>(casted.augmentations());
            }
        }
    }

    /**
     *Set fields from given grouping argument. Valid argument is instance of one of following types:
     * <ul>
     * <li>org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.typedefinitions.rev160323.TimeSlotStatusType</li>
     * <li>org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.typedefinitions.rev160323.TimeSlotIDType</li>
     * </ul>
     *
     * @param arg grouping object
     * @throws IllegalArgumentException if given argument is none of valid types
    */
    public void fieldsFrom(DataObject arg) {
        boolean isValidArg = false;
        if (arg instanceof org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.typedefinitions.rev160323.TimeSlotStatusType) {
            this._operationalStatus = ((org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.typedefinitions.rev160323.TimeSlotStatusType)arg).getOperationalStatus();
            isValidArg = true;
        }
        if (arg instanceof org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.typedefinitions.rev160323.TimeSlotIDType) {
            this._structureID = ((org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.typedefinitions.rev160323.TimeSlotIDType)arg).getStructureID();
            this._timeSlotID = ((org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.typedefinitions.rev160323.TimeSlotIDType)arg).getTimeSlotID();
            isValidArg = true;
        }
        if (!isValidArg) {
            throw new IllegalArgumentException(
              "expected one of: [org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.typedefinitions.rev160323.TimeSlotStatusType, org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.typedefinitions.rev160323.TimeSlotIDType] \n" +
              "but was: " + arg
            );
        }
    }

    public TimeSlotStatusListKey getKey() {
        return _key;
    }
    
    public OperationalState getOperationalStatus() {
        return _operationalStatus;
    }
    
    public java.lang.String getStructureID() {
        return _structureID;
    }
    
    public java.lang.String getTimeSlotID() {
        return _timeSlotID;
    }
    
    @SuppressWarnings("unchecked")
    public <E extends Augmentation<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.structurestatus.TimeSlotStatusList>> E getAugmentation(java.lang.Class<E> augmentationType) {
        if (augmentationType == null) {
            throw new IllegalArgumentException("Augmentation Type reference cannot be NULL!");
        }
        return (E) augmentation.get(augmentationType);
    }

    public TimeSlotStatusListBuilder setKey(TimeSlotStatusListKey value) {
        this._key = value;
        return this;
    }
    
    public TimeSlotStatusListBuilder setOperationalStatus(OperationalState value) {
        this._operationalStatus = value;
        return this;
    }
    
    public TimeSlotStatusListBuilder setStructureID(java.lang.String value) {
        this._structureID = value;
        return this;
    }
    
    public TimeSlotStatusListBuilder setTimeSlotID(java.lang.String value) {
        this._timeSlotID = value;
        return this;
    }
    
    public TimeSlotStatusListBuilder addAugmentation(java.lang.Class<? extends Augmentation<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.structurestatus.TimeSlotStatusList>> augmentationType, Augmentation<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.structurestatus.TimeSlotStatusList> augmentation) {
        if (augmentation == null) {
            return removeAugmentation(augmentationType);
        }
    
        if (!(this.augmentation instanceof HashMap)) {
            this.augmentation = new HashMap<>();
        }
    
        this.augmentation.put(augmentationType, augmentation);
        return this;
    }
    
    public TimeSlotStatusListBuilder removeAugmentation(java.lang.Class<? extends Augmentation<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.structurestatus.TimeSlotStatusList>> augmentationType) {
        if (this.augmentation instanceof HashMap) {
            this.augmentation.remove(augmentationType);
        }
        return this;
    }

    public TimeSlotStatusList build() {
        return new TimeSlotStatusListImpl(this);
    }

    private static final class TimeSlotStatusListImpl implements TimeSlotStatusList {

        public java.lang.Class<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.structurestatus.TimeSlotStatusList> getImplementedInterface() {
            return org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.structurestatus.TimeSlotStatusList.class;
        }

        private final TimeSlotStatusListKey _key;
        private final OperationalState _operationalStatus;
        private final java.lang.String _structureID;
        private final java.lang.String _timeSlotID;

        private Map<java.lang.Class<? extends Augmentation<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.structurestatus.TimeSlotStatusList>>, Augmentation<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.structurestatus.TimeSlotStatusList>> augmentation = Collections.emptyMap();

        private TimeSlotStatusListImpl(TimeSlotStatusListBuilder base) {
            if (base.getKey() == null) {
                this._key = new TimeSlotStatusListKey(
                    base.getStructureID(), 
                    base.getTimeSlotID()
                );
                this._structureID = base.getStructureID();
                this._timeSlotID = base.getTimeSlotID();
            } else {
                this._key = base.getKey();
                this._structureID = _key.getStructureID();
                this._timeSlotID = _key.getTimeSlotID();
            }
            this._operationalStatus = base.getOperationalStatus();
            switch (base.augmentation.size()) {
            case 0:
                this.augmentation = Collections.emptyMap();
                break;
            case 1:
                final Map.Entry<java.lang.Class<? extends Augmentation<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.structurestatus.TimeSlotStatusList>>, Augmentation<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.structurestatus.TimeSlotStatusList>> e = base.augmentation.entrySet().iterator().next();
                this.augmentation = Collections.<java.lang.Class<? extends Augmentation<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.structurestatus.TimeSlotStatusList>>, Augmentation<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.structurestatus.TimeSlotStatusList>>singletonMap(e.getKey(), e.getValue());
                break;
            default :
                this.augmentation = new HashMap<>(base.augmentation);
            }
        }

        @Override
        public TimeSlotStatusListKey getKey() {
            return _key;
        }
        
        @Override
        public OperationalState getOperationalStatus() {
            return _operationalStatus;
        }
        
        @Override
        public java.lang.String getStructureID() {
            return _structureID;
        }
        
        @Override
        public java.lang.String getTimeSlotID() {
            return _timeSlotID;
        }
        
        @SuppressWarnings("unchecked")
        @Override
        public <E extends Augmentation<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.structurestatus.TimeSlotStatusList>> E getAugmentation(java.lang.Class<E> augmentationType) {
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
            result = prime * result + ((_operationalStatus == null) ? 0 : _operationalStatus.hashCode());
            result = prime * result + ((_structureID == null) ? 0 : _structureID.hashCode());
            result = prime * result + ((_timeSlotID == null) ? 0 : _timeSlotID.hashCode());
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
            if (!org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.structurestatus.TimeSlotStatusList.class.equals(((DataObject)obj).getImplementedInterface())) {
                return false;
            }
            org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.structurestatus.TimeSlotStatusList other = (org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.structurestatus.TimeSlotStatusList)obj;
            if (_key == null) {
                if (other.getKey() != null) {
                    return false;
                }
            } else if(!_key.equals(other.getKey())) {
                return false;
            }
            if (_operationalStatus == null) {
                if (other.getOperationalStatus() != null) {
                    return false;
                }
            } else if(!_operationalStatus.equals(other.getOperationalStatus())) {
                return false;
            }
            if (_structureID == null) {
                if (other.getStructureID() != null) {
                    return false;
                }
            } else if(!_structureID.equals(other.getStructureID())) {
                return false;
            }
            if (_timeSlotID == null) {
                if (other.getTimeSlotID() != null) {
                    return false;
                }
            } else if(!_timeSlotID.equals(other.getTimeSlotID())) {
                return false;
            }
            if (getClass() == obj.getClass()) {
                // Simple case: we are comparing against self
                TimeSlotStatusListImpl otherImpl = (TimeSlotStatusListImpl) obj;
                if (augmentation == null) {
                    if (otherImpl.augmentation != null) {
                        return false;
                    }
                } else if(!augmentation.equals(otherImpl.augmentation)) {
                    return false;
                }
            } else {
                // Hard case: compare our augments with presence there...
                for (Map.Entry<java.lang.Class<? extends Augmentation<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.structurestatus.TimeSlotStatusList>>, Augmentation<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.structurestatus.TimeSlotStatusList>> e : augmentation.entrySet()) {
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
            java.lang.StringBuilder builder = new java.lang.StringBuilder ("TimeSlotStatusList [");
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
            if (_operationalStatus != null) {
                if (first) {
                    first = false;
                } else {
                    builder.append(", ");
                }
                builder.append("_operationalStatus=");
                builder.append(_operationalStatus);
             }
            if (_structureID != null) {
                if (first) {
                    first = false;
                } else {
                    builder.append(", ");
                }
                builder.append("_structureID=");
                builder.append(_structureID);
             }
            if (_timeSlotID != null) {
                if (first) {
                    first = false;
                } else {
                    builder.append(", ");
                }
                builder.append("_timeSlotID=");
                builder.append(_timeSlotID);
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
