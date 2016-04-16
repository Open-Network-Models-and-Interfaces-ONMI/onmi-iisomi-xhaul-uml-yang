package org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.ethernet.rev160320.eth_connectionterminationpointbidirectional_pac;
import org.opendaylight.yangtools.yang.binding.Augmentation;
import org.opendaylight.yangtools.yang.binding.AugmentationHolder;
import org.opendaylight.yangtools.yang.binding.DataObject;
import java.util.HashMap;
import org.opendaylight.yangtools.concepts.Builder;
import org.opendaylight.yang.gen.v1.uri.onf.coremodel.corefoundationmodule.superclassesandcommonpackages.rev160305.UniversalId;
import java.util.Collections;
import java.util.Map;


/**
 * Class that builds {@link org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.ethernet.rev160320.eth_connectionterminationpointbidirectional_pac.LldpAlternative} instances.
 *
 * @see org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.ethernet.rev160320.eth_connectionterminationpointbidirectional_pac.LldpAlternative
 *
 */
public class LldpAlternativeBuilder implements Builder <org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.ethernet.rev160320.eth_connectionterminationpointbidirectional_pac.LldpAlternative> {

    private UniversalId _lldpV2RemPortId;
    private java.lang.String _lldpV2RemSysName;

    Map<java.lang.Class<? extends Augmentation<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.ethernet.rev160320.eth_connectionterminationpointbidirectional_pac.LldpAlternative>>, Augmentation<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.ethernet.rev160320.eth_connectionterminationpointbidirectional_pac.LldpAlternative>> augmentation = Collections.emptyMap();

    public LldpAlternativeBuilder() {
    }
    public LldpAlternativeBuilder(org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.ethernet.rev160320.LldpV2Rem arg) {
        this._lldpV2RemSysName = arg.getLldpV2RemSysName();
        this._lldpV2RemPortId = arg.getLldpV2RemPortId();
    }

    public LldpAlternativeBuilder(LldpAlternative base) {
        this._lldpV2RemPortId = base.getLldpV2RemPortId();
        this._lldpV2RemSysName = base.getLldpV2RemSysName();
        if (base instanceof LldpAlternativeImpl) {
            LldpAlternativeImpl impl = (LldpAlternativeImpl) base;
            if (!impl.augmentation.isEmpty()) {
                this.augmentation = new HashMap<>(impl.augmentation);
            }
        } else if (base instanceof AugmentationHolder) {
            @SuppressWarnings("unchecked")
            AugmentationHolder<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.ethernet.rev160320.eth_connectionterminationpointbidirectional_pac.LldpAlternative> casted =(AugmentationHolder<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.ethernet.rev160320.eth_connectionterminationpointbidirectional_pac.LldpAlternative>) base;
            if (!casted.augmentations().isEmpty()) {
                this.augmentation = new HashMap<>(casted.augmentations());
            }
        }
    }

    /**
     *Set fields from given grouping argument. Valid argument is instance of one of following types:
     * <ul>
     * <li>org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.ethernet.rev160320.LldpV2Rem</li>
     * </ul>
     *
     * @param arg grouping object
     * @throws IllegalArgumentException if given argument is none of valid types
    */
    public void fieldsFrom(DataObject arg) {
        boolean isValidArg = false;
        if (arg instanceof org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.ethernet.rev160320.LldpV2Rem) {
            this._lldpV2RemSysName = ((org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.ethernet.rev160320.LldpV2Rem)arg).getLldpV2RemSysName();
            this._lldpV2RemPortId = ((org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.ethernet.rev160320.LldpV2Rem)arg).getLldpV2RemPortId();
            isValidArg = true;
        }
        if (!isValidArg) {
            throw new IllegalArgumentException(
              "expected one of: [org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.ethernet.rev160320.LldpV2Rem] \n" +
              "but was: " + arg
            );
        }
    }

    public UniversalId getLldpV2RemPortId() {
        return _lldpV2RemPortId;
    }
    
    public java.lang.String getLldpV2RemSysName() {
        return _lldpV2RemSysName;
    }
    
    @SuppressWarnings("unchecked")
    public <E extends Augmentation<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.ethernet.rev160320.eth_connectionterminationpointbidirectional_pac.LldpAlternative>> E getAugmentation(java.lang.Class<E> augmentationType) {
        if (augmentationType == null) {
            throw new IllegalArgumentException("Augmentation Type reference cannot be NULL!");
        }
        return (E) augmentation.get(augmentationType);
    }

    public LldpAlternativeBuilder setLldpV2RemPortId(UniversalId value) {
        if (value != null) {
        }
        this._lldpV2RemPortId = value;
        return this;
    }
    
    public LldpAlternativeBuilder setLldpV2RemSysName(java.lang.String value) {
        this._lldpV2RemSysName = value;
        return this;
    }
    
    public LldpAlternativeBuilder addAugmentation(java.lang.Class<? extends Augmentation<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.ethernet.rev160320.eth_connectionterminationpointbidirectional_pac.LldpAlternative>> augmentationType, Augmentation<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.ethernet.rev160320.eth_connectionterminationpointbidirectional_pac.LldpAlternative> augmentation) {
        if (augmentation == null) {
            return removeAugmentation(augmentationType);
        }
    
        if (!(this.augmentation instanceof HashMap)) {
            this.augmentation = new HashMap<>();
        }
    
        this.augmentation.put(augmentationType, augmentation);
        return this;
    }
    
    public LldpAlternativeBuilder removeAugmentation(java.lang.Class<? extends Augmentation<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.ethernet.rev160320.eth_connectionterminationpointbidirectional_pac.LldpAlternative>> augmentationType) {
        if (this.augmentation instanceof HashMap) {
            this.augmentation.remove(augmentationType);
        }
        return this;
    }

    public LldpAlternative build() {
        return new LldpAlternativeImpl(this);
    }

    private static final class LldpAlternativeImpl implements LldpAlternative {

        public java.lang.Class<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.ethernet.rev160320.eth_connectionterminationpointbidirectional_pac.LldpAlternative> getImplementedInterface() {
            return org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.ethernet.rev160320.eth_connectionterminationpointbidirectional_pac.LldpAlternative.class;
        }

        private final UniversalId _lldpV2RemPortId;
        private final java.lang.String _lldpV2RemSysName;

        private Map<java.lang.Class<? extends Augmentation<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.ethernet.rev160320.eth_connectionterminationpointbidirectional_pac.LldpAlternative>>, Augmentation<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.ethernet.rev160320.eth_connectionterminationpointbidirectional_pac.LldpAlternative>> augmentation = Collections.emptyMap();

        private LldpAlternativeImpl(LldpAlternativeBuilder base) {
            this._lldpV2RemPortId = base.getLldpV2RemPortId();
            this._lldpV2RemSysName = base.getLldpV2RemSysName();
            switch (base.augmentation.size()) {
            case 0:
                this.augmentation = Collections.emptyMap();
                break;
            case 1:
                final Map.Entry<java.lang.Class<? extends Augmentation<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.ethernet.rev160320.eth_connectionterminationpointbidirectional_pac.LldpAlternative>>, Augmentation<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.ethernet.rev160320.eth_connectionterminationpointbidirectional_pac.LldpAlternative>> e = base.augmentation.entrySet().iterator().next();
                this.augmentation = Collections.<java.lang.Class<? extends Augmentation<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.ethernet.rev160320.eth_connectionterminationpointbidirectional_pac.LldpAlternative>>, Augmentation<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.ethernet.rev160320.eth_connectionterminationpointbidirectional_pac.LldpAlternative>>singletonMap(e.getKey(), e.getValue());
                break;
            default :
                this.augmentation = new HashMap<>(base.augmentation);
            }
        }

        @Override
        public UniversalId getLldpV2RemPortId() {
            return _lldpV2RemPortId;
        }
        
        @Override
        public java.lang.String getLldpV2RemSysName() {
            return _lldpV2RemSysName;
        }
        
        @SuppressWarnings("unchecked")
        @Override
        public <E extends Augmentation<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.ethernet.rev160320.eth_connectionterminationpointbidirectional_pac.LldpAlternative>> E getAugmentation(java.lang.Class<E> augmentationType) {
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
            result = prime * result + ((_lldpV2RemPortId == null) ? 0 : _lldpV2RemPortId.hashCode());
            result = prime * result + ((_lldpV2RemSysName == null) ? 0 : _lldpV2RemSysName.hashCode());
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
            if (!org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.ethernet.rev160320.eth_connectionterminationpointbidirectional_pac.LldpAlternative.class.equals(((DataObject)obj).getImplementedInterface())) {
                return false;
            }
            org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.ethernet.rev160320.eth_connectionterminationpointbidirectional_pac.LldpAlternative other = (org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.ethernet.rev160320.eth_connectionterminationpointbidirectional_pac.LldpAlternative)obj;
            if (_lldpV2RemPortId == null) {
                if (other.getLldpV2RemPortId() != null) {
                    return false;
                }
            } else if(!_lldpV2RemPortId.equals(other.getLldpV2RemPortId())) {
                return false;
            }
            if (_lldpV2RemSysName == null) {
                if (other.getLldpV2RemSysName() != null) {
                    return false;
                }
            } else if(!_lldpV2RemSysName.equals(other.getLldpV2RemSysName())) {
                return false;
            }
            if (getClass() == obj.getClass()) {
                // Simple case: we are comparing against self
                LldpAlternativeImpl otherImpl = (LldpAlternativeImpl) obj;
                if (augmentation == null) {
                    if (otherImpl.augmentation != null) {
                        return false;
                    }
                } else if(!augmentation.equals(otherImpl.augmentation)) {
                    return false;
                }
            } else {
                // Hard case: compare our augments with presence there...
                for (Map.Entry<java.lang.Class<? extends Augmentation<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.ethernet.rev160320.eth_connectionterminationpointbidirectional_pac.LldpAlternative>>, Augmentation<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.ethernet.rev160320.eth_connectionterminationpointbidirectional_pac.LldpAlternative>> e : augmentation.entrySet()) {
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
            java.lang.StringBuilder builder = new java.lang.StringBuilder ("LldpAlternative [");
            boolean first = true;
        
            if (_lldpV2RemPortId != null) {
                if (first) {
                    first = false;
                } else {
                    builder.append(", ");
                }
                builder.append("_lldpV2RemPortId=");
                builder.append(_lldpV2RemPortId);
             }
            if (_lldpV2RemSysName != null) {
                if (first) {
                    first = false;
                } else {
                    builder.append(", ");
                }
                builder.append("_lldpV2RemSysName=");
                builder.append(_lldpV2RemSysName);
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
