package org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323;
import org.opendaylight.yangtools.yang.binding.Augmentation;
import org.opendaylight.yangtools.yang.binding.AugmentationHolder;
import org.opendaylight.yangtools.yang.binding.DataObject;
import java.util.HashMap;
import org.opendaylight.yangtools.concepts.Builder;
import org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.mw_container_pac.ContainerCapability;
import org.opendaylight.yang.gen.v1.uri.onf.coremodel.corefoundationmodule.superclassesandcommonpackages.rev160305.UniversalId;
import java.util.Collections;
import org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.mw_container_pac.ContainerConfiguration;
import java.util.Map;


/**
 * Class that builds {@link org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.MWContainerPac} instances.
 *
 * @see org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.MWContainerPac
 *
 */
public class MWContainerPacBuilder implements Builder <org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.MWContainerPac> {

    private ContainerCapability _containerCapability;
    private ContainerConfiguration _containerConfiguration;
    private java.lang.String _containerStatus;
    private MWContainerPacKey _key;
    private UniversalId _layerProtocol;

    Map<java.lang.Class<? extends Augmentation<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.MWContainerPac>>, Augmentation<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.MWContainerPac>> augmentation = Collections.emptyMap();

    public MWContainerPacBuilder() {
    }

    public MWContainerPacBuilder(MWContainerPac base) {
        if (base.getKey() == null) {
            this._key = new MWContainerPacKey(
                base.getLayerProtocol()
            );
            this._layerProtocol = base.getLayerProtocol();
        } else {
            this._key = base.getKey();
            this._layerProtocol = _key.getLayerProtocol();
        }
        this._containerCapability = base.getContainerCapability();
        this._containerConfiguration = base.getContainerConfiguration();
        this._containerStatus = base.getContainerStatus();
        if (base instanceof MWContainerPacImpl) {
            MWContainerPacImpl impl = (MWContainerPacImpl) base;
            if (!impl.augmentation.isEmpty()) {
                this.augmentation = new HashMap<>(impl.augmentation);
            }
        } else if (base instanceof AugmentationHolder) {
            @SuppressWarnings("unchecked")
            AugmentationHolder<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.MWContainerPac> casted =(AugmentationHolder<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.MWContainerPac>) base;
            if (!casted.augmentations().isEmpty()) {
                this.augmentation = new HashMap<>(casted.augmentations());
            }
        }
    }


    public ContainerCapability getContainerCapability() {
        return _containerCapability;
    }
    
    public ContainerConfiguration getContainerConfiguration() {
        return _containerConfiguration;
    }
    
    public java.lang.String getContainerStatus() {
        return _containerStatus;
    }
    
    public MWContainerPacKey getKey() {
        return _key;
    }
    
    public UniversalId getLayerProtocol() {
        return _layerProtocol;
    }
    
    @SuppressWarnings("unchecked")
    public <E extends Augmentation<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.MWContainerPac>> E getAugmentation(java.lang.Class<E> augmentationType) {
        if (augmentationType == null) {
            throw new IllegalArgumentException("Augmentation Type reference cannot be NULL!");
        }
        return (E) augmentation.get(augmentationType);
    }

    public MWContainerPacBuilder setContainerCapability(ContainerCapability value) {
        this._containerCapability = value;
        return this;
    }
    
    public MWContainerPacBuilder setContainerConfiguration(ContainerConfiguration value) {
        this._containerConfiguration = value;
        return this;
    }
    
    public MWContainerPacBuilder setContainerStatus(java.lang.String value) {
        this._containerStatus = value;
        return this;
    }
    
    public MWContainerPacBuilder setKey(MWContainerPacKey value) {
        this._key = value;
        return this;
    }
    
    public MWContainerPacBuilder setLayerProtocol(UniversalId value) {
        if (value != null) {
        }
        this._layerProtocol = value;
        return this;
    }
    
    public MWContainerPacBuilder addAugmentation(java.lang.Class<? extends Augmentation<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.MWContainerPac>> augmentationType, Augmentation<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.MWContainerPac> augmentation) {
        if (augmentation == null) {
            return removeAugmentation(augmentationType);
        }
    
        if (!(this.augmentation instanceof HashMap)) {
            this.augmentation = new HashMap<>();
        }
    
        this.augmentation.put(augmentationType, augmentation);
        return this;
    }
    
    public MWContainerPacBuilder removeAugmentation(java.lang.Class<? extends Augmentation<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.MWContainerPac>> augmentationType) {
        if (this.augmentation instanceof HashMap) {
            this.augmentation.remove(augmentationType);
        }
        return this;
    }

    public MWContainerPac build() {
        return new MWContainerPacImpl(this);
    }

    private static final class MWContainerPacImpl implements MWContainerPac {

        public java.lang.Class<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.MWContainerPac> getImplementedInterface() {
            return org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.MWContainerPac.class;
        }

        private final ContainerCapability _containerCapability;
        private final ContainerConfiguration _containerConfiguration;
        private final java.lang.String _containerStatus;
        private final MWContainerPacKey _key;
        private final UniversalId _layerProtocol;

        private Map<java.lang.Class<? extends Augmentation<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.MWContainerPac>>, Augmentation<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.MWContainerPac>> augmentation = Collections.emptyMap();

        private MWContainerPacImpl(MWContainerPacBuilder base) {
            if (base.getKey() == null) {
                this._key = new MWContainerPacKey(
                    base.getLayerProtocol()
                );
                this._layerProtocol = base.getLayerProtocol();
            } else {
                this._key = base.getKey();
                this._layerProtocol = _key.getLayerProtocol();
            }
            this._containerCapability = base.getContainerCapability();
            this._containerConfiguration = base.getContainerConfiguration();
            this._containerStatus = base.getContainerStatus();
            switch (base.augmentation.size()) {
            case 0:
                this.augmentation = Collections.emptyMap();
                break;
            case 1:
                final Map.Entry<java.lang.Class<? extends Augmentation<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.MWContainerPac>>, Augmentation<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.MWContainerPac>> e = base.augmentation.entrySet().iterator().next();
                this.augmentation = Collections.<java.lang.Class<? extends Augmentation<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.MWContainerPac>>, Augmentation<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.MWContainerPac>>singletonMap(e.getKey(), e.getValue());
                break;
            default :
                this.augmentation = new HashMap<>(base.augmentation);
            }
        }

        @Override
        public ContainerCapability getContainerCapability() {
            return _containerCapability;
        }
        
        @Override
        public ContainerConfiguration getContainerConfiguration() {
            return _containerConfiguration;
        }
        
        @Override
        public java.lang.String getContainerStatus() {
            return _containerStatus;
        }
        
        @Override
        public MWContainerPacKey getKey() {
            return _key;
        }
        
        @Override
        public UniversalId getLayerProtocol() {
            return _layerProtocol;
        }
        
        @SuppressWarnings("unchecked")
        @Override
        public <E extends Augmentation<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.MWContainerPac>> E getAugmentation(java.lang.Class<E> augmentationType) {
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
            result = prime * result + ((_containerCapability == null) ? 0 : _containerCapability.hashCode());
            result = prime * result + ((_containerConfiguration == null) ? 0 : _containerConfiguration.hashCode());
            result = prime * result + ((_containerStatus == null) ? 0 : _containerStatus.hashCode());
            result = prime * result + ((_key == null) ? 0 : _key.hashCode());
            result = prime * result + ((_layerProtocol == null) ? 0 : _layerProtocol.hashCode());
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
            if (!org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.MWContainerPac.class.equals(((DataObject)obj).getImplementedInterface())) {
                return false;
            }
            org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.MWContainerPac other = (org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.MWContainerPac)obj;
            if (_containerCapability == null) {
                if (other.getContainerCapability() != null) {
                    return false;
                }
            } else if(!_containerCapability.equals(other.getContainerCapability())) {
                return false;
            }
            if (_containerConfiguration == null) {
                if (other.getContainerConfiguration() != null) {
                    return false;
                }
            } else if(!_containerConfiguration.equals(other.getContainerConfiguration())) {
                return false;
            }
            if (_containerStatus == null) {
                if (other.getContainerStatus() != null) {
                    return false;
                }
            } else if(!_containerStatus.equals(other.getContainerStatus())) {
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
            if (getClass() == obj.getClass()) {
                // Simple case: we are comparing against self
                MWContainerPacImpl otherImpl = (MWContainerPacImpl) obj;
                if (augmentation == null) {
                    if (otherImpl.augmentation != null) {
                        return false;
                    }
                } else if(!augmentation.equals(otherImpl.augmentation)) {
                    return false;
                }
            } else {
                // Hard case: compare our augments with presence there...
                for (Map.Entry<java.lang.Class<? extends Augmentation<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.MWContainerPac>>, Augmentation<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.MWContainerPac>> e : augmentation.entrySet()) {
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
            java.lang.StringBuilder builder = new java.lang.StringBuilder ("MWContainerPac [");
            boolean first = true;
        
            if (_containerCapability != null) {
                if (first) {
                    first = false;
                } else {
                    builder.append(", ");
                }
                builder.append("_containerCapability=");
                builder.append(_containerCapability);
             }
            if (_containerConfiguration != null) {
                if (first) {
                    first = false;
                } else {
                    builder.append(", ");
                }
                builder.append("_containerConfiguration=");
                builder.append(_containerConfiguration);
             }
            if (_containerStatus != null) {
                if (first) {
                    first = false;
                } else {
                    builder.append(", ");
                }
                builder.append("_containerStatus=");
                builder.append(_containerStatus);
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
