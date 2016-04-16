package org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323;
import org.opendaylight.yangtools.yang.binding.AugmentationHolder;
import org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.mw_airinterface_pac.AirInterfaceStatus;
import java.util.HashMap;
import org.opendaylight.yangtools.concepts.Builder;
import org.opendaylight.yangtools.yang.binding.Augmentation;
import org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.mw_airinterface_pac.AirInterfaceCapabilityList;
import org.opendaylight.yangtools.yang.binding.DataObject;
import org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.mw_airinterface_pac.AirInterfaceCurrentProblemList;
import org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.mw_airinterface_pac.AirInterfaceConfiguration;
import java.util.List;
import org.opendaylight.yang.gen.v1.uri.onf.coremodel.corefoundationmodule.superclassesandcommonpackages.rev160305.UniversalId;
import java.util.Collections;
import java.util.Map;


/**
 * Class that builds {@link org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.MWAirInterfacePac} instances.
 *
 * @see org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.MWAirInterfacePac
 *
 */
public class MWAirInterfacePacBuilder implements Builder <org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.MWAirInterfacePac> {

    private List<AirInterfaceCapabilityList> _airInterfaceCapabilityList;
    private AirInterfaceConfiguration _airInterfaceConfiguration;
    private AirInterfaceCurrentProblemList _airInterfaceCurrentProblemList;
    private AirInterfaceStatus _airInterfaceStatus;
    private MWAirInterfacePacKey _key;
    private UniversalId _layerProtocol;

    Map<java.lang.Class<? extends Augmentation<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.MWAirInterfacePac>>, Augmentation<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.MWAirInterfacePac>> augmentation = Collections.emptyMap();

    public MWAirInterfacePacBuilder() {
    }

    public MWAirInterfacePacBuilder(MWAirInterfacePac base) {
        if (base.getKey() == null) {
            this._key = new MWAirInterfacePacKey(
                base.getLayerProtocol()
            );
            this._layerProtocol = base.getLayerProtocol();
        } else {
            this._key = base.getKey();
            this._layerProtocol = _key.getLayerProtocol();
        }
        this._airInterfaceCapabilityList = base.getAirInterfaceCapabilityList();
        this._airInterfaceConfiguration = base.getAirInterfaceConfiguration();
        this._airInterfaceCurrentProblemList = base.getAirInterfaceCurrentProblemList();
        this._airInterfaceStatus = base.getAirInterfaceStatus();
        if (base instanceof MWAirInterfacePacImpl) {
            MWAirInterfacePacImpl impl = (MWAirInterfacePacImpl) base;
            if (!impl.augmentation.isEmpty()) {
                this.augmentation = new HashMap<>(impl.augmentation);
            }
        } else if (base instanceof AugmentationHolder) {
            @SuppressWarnings("unchecked")
            AugmentationHolder<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.MWAirInterfacePac> casted =(AugmentationHolder<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.MWAirInterfacePac>) base;
            if (!casted.augmentations().isEmpty()) {
                this.augmentation = new HashMap<>(casted.augmentations());
            }
        }
    }


    public List<AirInterfaceCapabilityList> getAirInterfaceCapabilityList() {
        return _airInterfaceCapabilityList;
    }
    
    public AirInterfaceConfiguration getAirInterfaceConfiguration() {
        return _airInterfaceConfiguration;
    }
    
    public AirInterfaceCurrentProblemList getAirInterfaceCurrentProblemList() {
        return _airInterfaceCurrentProblemList;
    }
    
    public AirInterfaceStatus getAirInterfaceStatus() {
        return _airInterfaceStatus;
    }
    
    public MWAirInterfacePacKey getKey() {
        return _key;
    }
    
    public UniversalId getLayerProtocol() {
        return _layerProtocol;
    }
    
    @SuppressWarnings("unchecked")
    public <E extends Augmentation<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.MWAirInterfacePac>> E getAugmentation(java.lang.Class<E> augmentationType) {
        if (augmentationType == null) {
            throw new IllegalArgumentException("Augmentation Type reference cannot be NULL!");
        }
        return (E) augmentation.get(augmentationType);
    }

    public MWAirInterfacePacBuilder setAirInterfaceCapabilityList(List<AirInterfaceCapabilityList> value) {
        this._airInterfaceCapabilityList = value;
        return this;
    }
    
    public MWAirInterfacePacBuilder setAirInterfaceConfiguration(AirInterfaceConfiguration value) {
        this._airInterfaceConfiguration = value;
        return this;
    }
    
    public MWAirInterfacePacBuilder setAirInterfaceCurrentProblemList(AirInterfaceCurrentProblemList value) {
        this._airInterfaceCurrentProblemList = value;
        return this;
    }
    
    public MWAirInterfacePacBuilder setAirInterfaceStatus(AirInterfaceStatus value) {
        this._airInterfaceStatus = value;
        return this;
    }
    
    public MWAirInterfacePacBuilder setKey(MWAirInterfacePacKey value) {
        this._key = value;
        return this;
    }
    
    public MWAirInterfacePacBuilder setLayerProtocol(UniversalId value) {
        if (value != null) {
        }
        this._layerProtocol = value;
        return this;
    }
    
    public MWAirInterfacePacBuilder addAugmentation(java.lang.Class<? extends Augmentation<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.MWAirInterfacePac>> augmentationType, Augmentation<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.MWAirInterfacePac> augmentation) {
        if (augmentation == null) {
            return removeAugmentation(augmentationType);
        }
    
        if (!(this.augmentation instanceof HashMap)) {
            this.augmentation = new HashMap<>();
        }
    
        this.augmentation.put(augmentationType, augmentation);
        return this;
    }
    
    public MWAirInterfacePacBuilder removeAugmentation(java.lang.Class<? extends Augmentation<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.MWAirInterfacePac>> augmentationType) {
        if (this.augmentation instanceof HashMap) {
            this.augmentation.remove(augmentationType);
        }
        return this;
    }

    public MWAirInterfacePac build() {
        return new MWAirInterfacePacImpl(this);
    }

    private static final class MWAirInterfacePacImpl implements MWAirInterfacePac {

        public java.lang.Class<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.MWAirInterfacePac> getImplementedInterface() {
            return org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.MWAirInterfacePac.class;
        }

        private final List<AirInterfaceCapabilityList> _airInterfaceCapabilityList;
        private final AirInterfaceConfiguration _airInterfaceConfiguration;
        private final AirInterfaceCurrentProblemList _airInterfaceCurrentProblemList;
        private final AirInterfaceStatus _airInterfaceStatus;
        private final MWAirInterfacePacKey _key;
        private final UniversalId _layerProtocol;

        private Map<java.lang.Class<? extends Augmentation<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.MWAirInterfacePac>>, Augmentation<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.MWAirInterfacePac>> augmentation = Collections.emptyMap();

        private MWAirInterfacePacImpl(MWAirInterfacePacBuilder base) {
            if (base.getKey() == null) {
                this._key = new MWAirInterfacePacKey(
                    base.getLayerProtocol()
                );
                this._layerProtocol = base.getLayerProtocol();
            } else {
                this._key = base.getKey();
                this._layerProtocol = _key.getLayerProtocol();
            }
            this._airInterfaceCapabilityList = base.getAirInterfaceCapabilityList();
            this._airInterfaceConfiguration = base.getAirInterfaceConfiguration();
            this._airInterfaceCurrentProblemList = base.getAirInterfaceCurrentProblemList();
            this._airInterfaceStatus = base.getAirInterfaceStatus();
            switch (base.augmentation.size()) {
            case 0:
                this.augmentation = Collections.emptyMap();
                break;
            case 1:
                final Map.Entry<java.lang.Class<? extends Augmentation<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.MWAirInterfacePac>>, Augmentation<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.MWAirInterfacePac>> e = base.augmentation.entrySet().iterator().next();
                this.augmentation = Collections.<java.lang.Class<? extends Augmentation<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.MWAirInterfacePac>>, Augmentation<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.MWAirInterfacePac>>singletonMap(e.getKey(), e.getValue());
                break;
            default :
                this.augmentation = new HashMap<>(base.augmentation);
            }
        }

        @Override
        public List<AirInterfaceCapabilityList> getAirInterfaceCapabilityList() {
            return _airInterfaceCapabilityList;
        }
        
        @Override
        public AirInterfaceConfiguration getAirInterfaceConfiguration() {
            return _airInterfaceConfiguration;
        }
        
        @Override
        public AirInterfaceCurrentProblemList getAirInterfaceCurrentProblemList() {
            return _airInterfaceCurrentProblemList;
        }
        
        @Override
        public AirInterfaceStatus getAirInterfaceStatus() {
            return _airInterfaceStatus;
        }
        
        @Override
        public MWAirInterfacePacKey getKey() {
            return _key;
        }
        
        @Override
        public UniversalId getLayerProtocol() {
            return _layerProtocol;
        }
        
        @SuppressWarnings("unchecked")
        @Override
        public <E extends Augmentation<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.MWAirInterfacePac>> E getAugmentation(java.lang.Class<E> augmentationType) {
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
            result = prime * result + ((_airInterfaceCapabilityList == null) ? 0 : _airInterfaceCapabilityList.hashCode());
            result = prime * result + ((_airInterfaceConfiguration == null) ? 0 : _airInterfaceConfiguration.hashCode());
            result = prime * result + ((_airInterfaceCurrentProblemList == null) ? 0 : _airInterfaceCurrentProblemList.hashCode());
            result = prime * result + ((_airInterfaceStatus == null) ? 0 : _airInterfaceStatus.hashCode());
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
            if (!org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.MWAirInterfacePac.class.equals(((DataObject)obj).getImplementedInterface())) {
                return false;
            }
            org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.MWAirInterfacePac other = (org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.MWAirInterfacePac)obj;
            if (_airInterfaceCapabilityList == null) {
                if (other.getAirInterfaceCapabilityList() != null) {
                    return false;
                }
            } else if(!_airInterfaceCapabilityList.equals(other.getAirInterfaceCapabilityList())) {
                return false;
            }
            if (_airInterfaceConfiguration == null) {
                if (other.getAirInterfaceConfiguration() != null) {
                    return false;
                }
            } else if(!_airInterfaceConfiguration.equals(other.getAirInterfaceConfiguration())) {
                return false;
            }
            if (_airInterfaceCurrentProblemList == null) {
                if (other.getAirInterfaceCurrentProblemList() != null) {
                    return false;
                }
            } else if(!_airInterfaceCurrentProblemList.equals(other.getAirInterfaceCurrentProblemList())) {
                return false;
            }
            if (_airInterfaceStatus == null) {
                if (other.getAirInterfaceStatus() != null) {
                    return false;
                }
            } else if(!_airInterfaceStatus.equals(other.getAirInterfaceStatus())) {
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
                MWAirInterfacePacImpl otherImpl = (MWAirInterfacePacImpl) obj;
                if (augmentation == null) {
                    if (otherImpl.augmentation != null) {
                        return false;
                    }
                } else if(!augmentation.equals(otherImpl.augmentation)) {
                    return false;
                }
            } else {
                // Hard case: compare our augments with presence there...
                for (Map.Entry<java.lang.Class<? extends Augmentation<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.MWAirInterfacePac>>, Augmentation<org.opendaylight.yang.gen.v1.uri.onf.microwavemodel.objectclasses.mwconnection.rev160323.MWAirInterfacePac>> e : augmentation.entrySet()) {
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
            java.lang.StringBuilder builder = new java.lang.StringBuilder ("MWAirInterfacePac [");
            boolean first = true;
        
            if (_airInterfaceCapabilityList != null) {
                if (first) {
                    first = false;
                } else {
                    builder.append(", ");
                }
                builder.append("_airInterfaceCapabilityList=");
                builder.append(_airInterfaceCapabilityList);
             }
            if (_airInterfaceConfiguration != null) {
                if (first) {
                    first = false;
                } else {
                    builder.append(", ");
                }
                builder.append("_airInterfaceConfiguration=");
                builder.append(_airInterfaceConfiguration);
             }
            if (_airInterfaceCurrentProblemList != null) {
                if (first) {
                    first = false;
                } else {
                    builder.append(", ");
                }
                builder.append("_airInterfaceCurrentProblemList=");
                builder.append(_airInterfaceCurrentProblemList);
             }
            if (_airInterfaceStatus != null) {
                if (first) {
                    first = false;
                } else {
                    builder.append(", ");
                }
                builder.append("_airInterfaceStatus=");
                builder.append(_airInterfaceStatus);
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
