package org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323;
import org.opendaylight.yangtools.yang.binding.Augmentation;
import org.opendaylight.yangtools.yang.binding.AugmentationHolder;
import org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.mw_structure_pac.StructureConfiguration;
import org.opendaylight.yangtools.yang.binding.DataObject;
import java.util.HashMap;
import org.opendaylight.yangtools.concepts.Builder;
import org.opendaylight.yang.gen.v1.uri.onf.coremodel.corefoundationmodule.superclassesandcommonpackages.rev160305.UniversalId;
import org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.mw_structure_pac.StructureStatus;
import java.util.Collections;
import java.util.Map;
import org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.mw_structure_pac.StructureCapability;


/**
 * Class that builds {@link org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.MWStructurePac} instances.
 *
 * @see org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.MWStructurePac
 *
 */
public class MWStructurePacBuilder implements Builder <org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.MWStructurePac> {

    private MWStructurePacKey _key;
    private UniversalId _layerProtocol;
    private StructureCapability _structureCapability;
    private StructureConfiguration _structureConfiguration;
    private StructureStatus _structureStatus;

    Map<java.lang.Class<? extends Augmentation<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.MWStructurePac>>, Augmentation<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.MWStructurePac>> augmentation = Collections.emptyMap();

    public MWStructurePacBuilder() {
    }

    public MWStructurePacBuilder(MWStructurePac base) {
        if (base.getKey() == null) {
            this._key = new MWStructurePacKey(
                base.getLayerProtocol()
            );
            this._layerProtocol = base.getLayerProtocol();
        } else {
            this._key = base.getKey();
            this._layerProtocol = _key.getLayerProtocol();
        }
        this._structureCapability = base.getStructureCapability();
        this._structureConfiguration = base.getStructureConfiguration();
        this._structureStatus = base.getStructureStatus();
        if (base instanceof MWStructurePacImpl) {
            MWStructurePacImpl impl = (MWStructurePacImpl) base;
            if (!impl.augmentation.isEmpty()) {
                this.augmentation = new HashMap<>(impl.augmentation);
            }
        } else if (base instanceof AugmentationHolder) {
            @SuppressWarnings("unchecked")
            AugmentationHolder<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.MWStructurePac> casted =(AugmentationHolder<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.MWStructurePac>) base;
            if (!casted.augmentations().isEmpty()) {
                this.augmentation = new HashMap<>(casted.augmentations());
            }
        }
    }


    public MWStructurePacKey getKey() {
        return _key;
    }
    
    public UniversalId getLayerProtocol() {
        return _layerProtocol;
    }
    
    public StructureCapability getStructureCapability() {
        return _structureCapability;
    }
    
    public StructureConfiguration getStructureConfiguration() {
        return _structureConfiguration;
    }
    
    public StructureStatus getStructureStatus() {
        return _structureStatus;
    }
    
    @SuppressWarnings("unchecked")
    public <E extends Augmentation<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.MWStructurePac>> E getAugmentation(java.lang.Class<E> augmentationType) {
        if (augmentationType == null) {
            throw new IllegalArgumentException("Augmentation Type reference cannot be NULL!");
        }
        return (E) augmentation.get(augmentationType);
    }

    public MWStructurePacBuilder setKey(MWStructurePacKey value) {
        this._key = value;
        return this;
    }
    
    public MWStructurePacBuilder setLayerProtocol(UniversalId value) {
        if (value != null) {
        }
        this._layerProtocol = value;
        return this;
    }
    
    public MWStructurePacBuilder setStructureCapability(StructureCapability value) {
        this._structureCapability = value;
        return this;
    }
    
    public MWStructurePacBuilder setStructureConfiguration(StructureConfiguration value) {
        this._structureConfiguration = value;
        return this;
    }
    
    public MWStructurePacBuilder setStructureStatus(StructureStatus value) {
        this._structureStatus = value;
        return this;
    }
    
    public MWStructurePacBuilder addAugmentation(java.lang.Class<? extends Augmentation<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.MWStructurePac>> augmentationType, Augmentation<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.MWStructurePac> augmentation) {
        if (augmentation == null) {
            return removeAugmentation(augmentationType);
        }
    
        if (!(this.augmentation instanceof HashMap)) {
            this.augmentation = new HashMap<>();
        }
    
        this.augmentation.put(augmentationType, augmentation);
        return this;
    }
    
    public MWStructurePacBuilder removeAugmentation(java.lang.Class<? extends Augmentation<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.MWStructurePac>> augmentationType) {
        if (this.augmentation instanceof HashMap) {
            this.augmentation.remove(augmentationType);
        }
        return this;
    }

    public MWStructurePac build() {
        return new MWStructurePacImpl(this);
    }

    private static final class MWStructurePacImpl implements MWStructurePac {

        public java.lang.Class<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.MWStructurePac> getImplementedInterface() {
            return org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.MWStructurePac.class;
        }

        private final MWStructurePacKey _key;
        private final UniversalId _layerProtocol;
        private final StructureCapability _structureCapability;
        private final StructureConfiguration _structureConfiguration;
        private final StructureStatus _structureStatus;

        private Map<java.lang.Class<? extends Augmentation<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.MWStructurePac>>, Augmentation<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.MWStructurePac>> augmentation = Collections.emptyMap();

        private MWStructurePacImpl(MWStructurePacBuilder base) {
            if (base.getKey() == null) {
                this._key = new MWStructurePacKey(
                    base.getLayerProtocol()
                );
                this._layerProtocol = base.getLayerProtocol();
            } else {
                this._key = base.getKey();
                this._layerProtocol = _key.getLayerProtocol();
            }
            this._structureCapability = base.getStructureCapability();
            this._structureConfiguration = base.getStructureConfiguration();
            this._structureStatus = base.getStructureStatus();
            switch (base.augmentation.size()) {
            case 0:
                this.augmentation = Collections.emptyMap();
                break;
            case 1:
                final Map.Entry<java.lang.Class<? extends Augmentation<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.MWStructurePac>>, Augmentation<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.MWStructurePac>> e = base.augmentation.entrySet().iterator().next();
                this.augmentation = Collections.<java.lang.Class<? extends Augmentation<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.MWStructurePac>>, Augmentation<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.MWStructurePac>>singletonMap(e.getKey(), e.getValue());
                break;
            default :
                this.augmentation = new HashMap<>(base.augmentation);
            }
        }

        @Override
        public MWStructurePacKey getKey() {
            return _key;
        }
        
        @Override
        public UniversalId getLayerProtocol() {
            return _layerProtocol;
        }
        
        @Override
        public StructureCapability getStructureCapability() {
            return _structureCapability;
        }
        
        @Override
        public StructureConfiguration getStructureConfiguration() {
            return _structureConfiguration;
        }
        
        @Override
        public StructureStatus getStructureStatus() {
            return _structureStatus;
        }
        
        @SuppressWarnings("unchecked")
        @Override
        public <E extends Augmentation<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.MWStructurePac>> E getAugmentation(java.lang.Class<E> augmentationType) {
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
            result = prime * result + ((_layerProtocol == null) ? 0 : _layerProtocol.hashCode());
            result = prime * result + ((_structureCapability == null) ? 0 : _structureCapability.hashCode());
            result = prime * result + ((_structureConfiguration == null) ? 0 : _structureConfiguration.hashCode());
            result = prime * result + ((_structureStatus == null) ? 0 : _structureStatus.hashCode());
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
            if (!org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.MWStructurePac.class.equals(((DataObject)obj).getImplementedInterface())) {
                return false;
            }
            org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.MWStructurePac other = (org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.MWStructurePac)obj;
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
            if (_structureCapability == null) {
                if (other.getStructureCapability() != null) {
                    return false;
                }
            } else if(!_structureCapability.equals(other.getStructureCapability())) {
                return false;
            }
            if (_structureConfiguration == null) {
                if (other.getStructureConfiguration() != null) {
                    return false;
                }
            } else if(!_structureConfiguration.equals(other.getStructureConfiguration())) {
                return false;
            }
            if (_structureStatus == null) {
                if (other.getStructureStatus() != null) {
                    return false;
                }
            } else if(!_structureStatus.equals(other.getStructureStatus())) {
                return false;
            }
            if (getClass() == obj.getClass()) {
                // Simple case: we are comparing against self
                MWStructurePacImpl otherImpl = (MWStructurePacImpl) obj;
                if (augmentation == null) {
                    if (otherImpl.augmentation != null) {
                        return false;
                    }
                } else if(!augmentation.equals(otherImpl.augmentation)) {
                    return false;
                }
            } else {
                // Hard case: compare our augments with presence there...
                for (Map.Entry<java.lang.Class<? extends Augmentation<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.MWStructurePac>>, Augmentation<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.MWStructurePac>> e : augmentation.entrySet()) {
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
            java.lang.StringBuilder builder = new java.lang.StringBuilder ("MWStructurePac [");
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
            if (_layerProtocol != null) {
                if (first) {
                    first = false;
                } else {
                    builder.append(", ");
                }
                builder.append("_layerProtocol=");
                builder.append(_layerProtocol);
             }
            if (_structureCapability != null) {
                if (first) {
                    first = false;
                } else {
                    builder.append(", ");
                }
                builder.append("_structureCapability=");
                builder.append(_structureCapability);
             }
            if (_structureConfiguration != null) {
                if (first) {
                    first = false;
                } else {
                    builder.append(", ");
                }
                builder.append("_structureConfiguration=");
                builder.append(_structureConfiguration);
             }
            if (_structureStatus != null) {
                if (first) {
                    first = false;
                } else {
                    builder.append(", ");
                }
                builder.append("_structureStatus=");
                builder.append(_structureStatus);
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
