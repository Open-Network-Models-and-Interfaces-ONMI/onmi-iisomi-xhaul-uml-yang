package org.opendaylight.yang.gen.v1.uri.onf.coremodel.corenetworkmodule.objectclasses.rev160327;
import org.opendaylight.yangtools.yang.binding.AugmentationHolder;
import org.opendaylight.yang.gen.v1.uri.onf.coremodel.corefoundationmodule.superclassesandcommonpackages.rev160305.name.NameList;
import org.opendaylight.yang.gen.v1.uri.onf.coremodel.corefoundationmodule.statemodel.rev160305.AdministrativeControl;
import org.opendaylight.yang.gen.v1.uri.onf.coremodel.corenetworkmodule.objectclasses.rev160327.networkelement.LtpRefList;
import java.util.HashMap;
import org.opendaylight.yangtools.concepts.Builder;
import org.opendaylight.yang.gen.v1.uri.onf.coremodel.corefoundationmodule.statemodel.rev160305.AdministrativeState;
import org.opendaylight.yang.gen.v1.uri.onf.coremodel.corefoundationmodule.statemodel.rev160305.LifecycleState;
import org.opendaylight.yangtools.yang.binding.Augmentation;
import org.opendaylight.yangtools.yang.binding.DataObject;
import org.opendaylight.yang.gen.v1.uri.onf.coremodel.corefoundationmodule.statemodel.rev160305.OperationalState;
import java.util.List;
import org.opendaylight.yang.gen.v1.uri.onf.coremodel.corefoundationmodule.superclassesandcommonpackages.rev160305.globalclass.LocalIdList;
import org.opendaylight.yang.gen.v1.uri.onf.coremodel.corefoundationmodule.superclassesandcommonpackages.rev160305.UniversalId;
import java.util.Collections;
import java.util.Map;


/**
 * Class that builds {@link org.opendaylight.yang.gen.v1.uri.onf.coremodel.corenetworkmodule.objectclasses.rev160327.NetworkElement} instances.
 *
 * @see org.opendaylight.yang.gen.v1.uri.onf.coremodel.corenetworkmodule.objectclasses.rev160327.NetworkElement
 *
 */
public class NetworkElementBuilder implements Builder <org.opendaylight.yang.gen.v1.uri.onf.coremodel.corenetworkmodule.objectclasses.rev160327.NetworkElement> {

    private AdministrativeControl _administrativeControl;
    private AdministrativeState _adminsatratveState;
    private NetworkElementKey _key;
    private LifecycleState _lifecycleState;
    private List<LocalIdList> _localIdList;
    private List<LtpRefList> _ltpRefList;
    private List<NameList> _nameList;
    private OperationalState _operationalState;
    private UniversalId _uuid;

    Map<java.lang.Class<? extends Augmentation<org.opendaylight.yang.gen.v1.uri.onf.coremodel.corenetworkmodule.objectclasses.rev160327.NetworkElement>>, Augmentation<org.opendaylight.yang.gen.v1.uri.onf.coremodel.corenetworkmodule.objectclasses.rev160327.NetworkElement>> augmentation = Collections.emptyMap();

    public NetworkElementBuilder() {
    }
    public NetworkElementBuilder(org.opendaylight.yang.gen.v1.uri.onf.coremodel.corefoundationmodule.superclassesandcommonpackages.rev160305.GlobalClass arg) {
        this._localIdList = arg.getLocalIdList();
        this._uuid = arg.getUuid();
        this._operationalState = arg.getOperationalState();
        this._administrativeControl = arg.getAdministrativeControl();
        this._adminsatratveState = arg.getAdminsatratveState();
        this._lifecycleState = arg.getLifecycleState();
        this._nameList = arg.getNameList();
    }
    public NetworkElementBuilder(org.opendaylight.yang.gen.v1.uri.onf.coremodel.corefoundationmodule.statemodel.rev160305.StatePac arg) {
        this._operationalState = arg.getOperationalState();
        this._administrativeControl = arg.getAdministrativeControl();
        this._adminsatratveState = arg.getAdminsatratveState();
        this._lifecycleState = arg.getLifecycleState();
    }
    public NetworkElementBuilder(org.opendaylight.yang.gen.v1.uri.onf.coremodel.corefoundationmodule.superclassesandcommonpackages.rev160305.Name arg) {
        this._nameList = arg.getNameList();
    }

    public NetworkElementBuilder(NetworkElement base) {
        if (base.getKey() == null) {
            this._key = new NetworkElementKey(
                base.getUuid()
            );
            this._uuid = base.getUuid();
        } else {
            this._key = base.getKey();
            this._uuid = _key.getUuid();
        }
        this._administrativeControl = base.getAdministrativeControl();
        this._adminsatratveState = base.getAdminsatratveState();
        this._lifecycleState = base.getLifecycleState();
        this._localIdList = base.getLocalIdList();
        this._ltpRefList = base.getLtpRefList();
        this._nameList = base.getNameList();
        this._operationalState = base.getOperationalState();
        if (base instanceof NetworkElementImpl) {
            NetworkElementImpl impl = (NetworkElementImpl) base;
            if (!impl.augmentation.isEmpty()) {
                this.augmentation = new HashMap<>(impl.augmentation);
            }
        } else if (base instanceof AugmentationHolder) {
            @SuppressWarnings("unchecked")
            AugmentationHolder<org.opendaylight.yang.gen.v1.uri.onf.coremodel.corenetworkmodule.objectclasses.rev160327.NetworkElement> casted =(AugmentationHolder<org.opendaylight.yang.gen.v1.uri.onf.coremodel.corenetworkmodule.objectclasses.rev160327.NetworkElement>) base;
            if (!casted.augmentations().isEmpty()) {
                this.augmentation = new HashMap<>(casted.augmentations());
            }
        }
    }

    /**
     *Set fields from given grouping argument. Valid argument is instance of one of following types:
     * <ul>
     * <li>org.opendaylight.yang.gen.v1.uri.onf.coremodel.corefoundationmodule.statemodel.rev160305.StatePac</li>
     * <li>org.opendaylight.yang.gen.v1.uri.onf.coremodel.corefoundationmodule.superclassesandcommonpackages.rev160305.GlobalClass</li>
     * <li>org.opendaylight.yang.gen.v1.uri.onf.coremodel.corefoundationmodule.superclassesandcommonpackages.rev160305.Name</li>
     * </ul>
     *
     * @param arg grouping object
     * @throws IllegalArgumentException if given argument is none of valid types
    */
    public void fieldsFrom(DataObject arg) {
        boolean isValidArg = false;
        if (arg instanceof org.opendaylight.yang.gen.v1.uri.onf.coremodel.corefoundationmodule.statemodel.rev160305.StatePac) {
            this._operationalState = ((org.opendaylight.yang.gen.v1.uri.onf.coremodel.corefoundationmodule.statemodel.rev160305.StatePac)arg).getOperationalState();
            this._administrativeControl = ((org.opendaylight.yang.gen.v1.uri.onf.coremodel.corefoundationmodule.statemodel.rev160305.StatePac)arg).getAdministrativeControl();
            this._adminsatratveState = ((org.opendaylight.yang.gen.v1.uri.onf.coremodel.corefoundationmodule.statemodel.rev160305.StatePac)arg).getAdminsatratveState();
            this._lifecycleState = ((org.opendaylight.yang.gen.v1.uri.onf.coremodel.corefoundationmodule.statemodel.rev160305.StatePac)arg).getLifecycleState();
            isValidArg = true;
        }
        if (arg instanceof org.opendaylight.yang.gen.v1.uri.onf.coremodel.corefoundationmodule.superclassesandcommonpackages.rev160305.GlobalClass) {
            this._localIdList = ((org.opendaylight.yang.gen.v1.uri.onf.coremodel.corefoundationmodule.superclassesandcommonpackages.rev160305.GlobalClass)arg).getLocalIdList();
            this._uuid = ((org.opendaylight.yang.gen.v1.uri.onf.coremodel.corefoundationmodule.superclassesandcommonpackages.rev160305.GlobalClass)arg).getUuid();
            isValidArg = true;
        }
        if (arg instanceof org.opendaylight.yang.gen.v1.uri.onf.coremodel.corefoundationmodule.superclassesandcommonpackages.rev160305.Name) {
            this._nameList = ((org.opendaylight.yang.gen.v1.uri.onf.coremodel.corefoundationmodule.superclassesandcommonpackages.rev160305.Name)arg).getNameList();
            isValidArg = true;
        }
        if (!isValidArg) {
            throw new IllegalArgumentException(
              "expected one of: [org.opendaylight.yang.gen.v1.uri.onf.coremodel.corefoundationmodule.statemodel.rev160305.StatePac, org.opendaylight.yang.gen.v1.uri.onf.coremodel.corefoundationmodule.superclassesandcommonpackages.rev160305.GlobalClass, org.opendaylight.yang.gen.v1.uri.onf.coremodel.corefoundationmodule.superclassesandcommonpackages.rev160305.Name] \n" +
              "but was: " + arg
            );
        }
    }

    public AdministrativeControl getAdministrativeControl() {
        return _administrativeControl;
    }
    
    public AdministrativeState getAdminsatratveState() {
        return _adminsatratveState;
    }
    
    public NetworkElementKey getKey() {
        return _key;
    }
    
    public LifecycleState getLifecycleState() {
        return _lifecycleState;
    }
    
    public List<LocalIdList> getLocalIdList() {
        return _localIdList;
    }
    
    public List<LtpRefList> getLtpRefList() {
        return _ltpRefList;
    }
    
    public List<NameList> getNameList() {
        return _nameList;
    }
    
    public OperationalState getOperationalState() {
        return _operationalState;
    }
    
    public UniversalId getUuid() {
        return _uuid;
    }
    
    @SuppressWarnings("unchecked")
    public <E extends Augmentation<org.opendaylight.yang.gen.v1.uri.onf.coremodel.corenetworkmodule.objectclasses.rev160327.NetworkElement>> E getAugmentation(java.lang.Class<E> augmentationType) {
        if (augmentationType == null) {
            throw new IllegalArgumentException("Augmentation Type reference cannot be NULL!");
        }
        return (E) augmentation.get(augmentationType);
    }

    public NetworkElementBuilder setAdministrativeControl(AdministrativeControl value) {
        this._administrativeControl = value;
        return this;
    }
    
    public NetworkElementBuilder setAdminsatratveState(AdministrativeState value) {
        this._adminsatratveState = value;
        return this;
    }
    
    public NetworkElementBuilder setKey(NetworkElementKey value) {
        this._key = value;
        return this;
    }
    
    public NetworkElementBuilder setLifecycleState(LifecycleState value) {
        this._lifecycleState = value;
        return this;
    }
    
    public NetworkElementBuilder setLocalIdList(List<LocalIdList> value) {
        this._localIdList = value;
        return this;
    }
    
    public NetworkElementBuilder setLtpRefList(List<LtpRefList> value) {
        this._ltpRefList = value;
        return this;
    }
    
    public NetworkElementBuilder setNameList(List<NameList> value) {
        this._nameList = value;
        return this;
    }
    
    public NetworkElementBuilder setOperationalState(OperationalState value) {
        this._operationalState = value;
        return this;
    }
    
    public NetworkElementBuilder setUuid(UniversalId value) {
        if (value != null) {
        }
        this._uuid = value;
        return this;
    }
    
    public NetworkElementBuilder addAugmentation(java.lang.Class<? extends Augmentation<org.opendaylight.yang.gen.v1.uri.onf.coremodel.corenetworkmodule.objectclasses.rev160327.NetworkElement>> augmentationType, Augmentation<org.opendaylight.yang.gen.v1.uri.onf.coremodel.corenetworkmodule.objectclasses.rev160327.NetworkElement> augmentation) {
        if (augmentation == null) {
            return removeAugmentation(augmentationType);
        }
    
        if (!(this.augmentation instanceof HashMap)) {
            this.augmentation = new HashMap<>();
        }
    
        this.augmentation.put(augmentationType, augmentation);
        return this;
    }
    
    public NetworkElementBuilder removeAugmentation(java.lang.Class<? extends Augmentation<org.opendaylight.yang.gen.v1.uri.onf.coremodel.corenetworkmodule.objectclasses.rev160327.NetworkElement>> augmentationType) {
        if (this.augmentation instanceof HashMap) {
            this.augmentation.remove(augmentationType);
        }
        return this;
    }

    public NetworkElement build() {
        return new NetworkElementImpl(this);
    }

    private static final class NetworkElementImpl implements NetworkElement {

        public java.lang.Class<org.opendaylight.yang.gen.v1.uri.onf.coremodel.corenetworkmodule.objectclasses.rev160327.NetworkElement> getImplementedInterface() {
            return org.opendaylight.yang.gen.v1.uri.onf.coremodel.corenetworkmodule.objectclasses.rev160327.NetworkElement.class;
        }

        private final AdministrativeControl _administrativeControl;
        private final AdministrativeState _adminsatratveState;
        private final NetworkElementKey _key;
        private final LifecycleState _lifecycleState;
        private final List<LocalIdList> _localIdList;
        private final List<LtpRefList> _ltpRefList;
        private final List<NameList> _nameList;
        private final OperationalState _operationalState;
        private final UniversalId _uuid;

        private Map<java.lang.Class<? extends Augmentation<org.opendaylight.yang.gen.v1.uri.onf.coremodel.corenetworkmodule.objectclasses.rev160327.NetworkElement>>, Augmentation<org.opendaylight.yang.gen.v1.uri.onf.coremodel.corenetworkmodule.objectclasses.rev160327.NetworkElement>> augmentation = Collections.emptyMap();

        private NetworkElementImpl(NetworkElementBuilder base) {
            if (base.getKey() == null) {
                this._key = new NetworkElementKey(
                    base.getUuid()
                );
                this._uuid = base.getUuid();
            } else {
                this._key = base.getKey();
                this._uuid = _key.getUuid();
            }
            this._administrativeControl = base.getAdministrativeControl();
            this._adminsatratveState = base.getAdminsatratveState();
            this._lifecycleState = base.getLifecycleState();
            this._localIdList = base.getLocalIdList();
            this._ltpRefList = base.getLtpRefList();
            this._nameList = base.getNameList();
            this._operationalState = base.getOperationalState();
            switch (base.augmentation.size()) {
            case 0:
                this.augmentation = Collections.emptyMap();
                break;
            case 1:
                final Map.Entry<java.lang.Class<? extends Augmentation<org.opendaylight.yang.gen.v1.uri.onf.coremodel.corenetworkmodule.objectclasses.rev160327.NetworkElement>>, Augmentation<org.opendaylight.yang.gen.v1.uri.onf.coremodel.corenetworkmodule.objectclasses.rev160327.NetworkElement>> e = base.augmentation.entrySet().iterator().next();
                this.augmentation = Collections.<java.lang.Class<? extends Augmentation<org.opendaylight.yang.gen.v1.uri.onf.coremodel.corenetworkmodule.objectclasses.rev160327.NetworkElement>>, Augmentation<org.opendaylight.yang.gen.v1.uri.onf.coremodel.corenetworkmodule.objectclasses.rev160327.NetworkElement>>singletonMap(e.getKey(), e.getValue());
                break;
            default :
                this.augmentation = new HashMap<>(base.augmentation);
            }
        }

        @Override
        public AdministrativeControl getAdministrativeControl() {
            return _administrativeControl;
        }
        
        @Override
        public AdministrativeState getAdminsatratveState() {
            return _adminsatratveState;
        }
        
        @Override
        public NetworkElementKey getKey() {
            return _key;
        }
        
        @Override
        public LifecycleState getLifecycleState() {
            return _lifecycleState;
        }
        
        @Override
        public List<LocalIdList> getLocalIdList() {
            return _localIdList;
        }
        
        @Override
        public List<LtpRefList> getLtpRefList() {
            return _ltpRefList;
        }
        
        @Override
        public List<NameList> getNameList() {
            return _nameList;
        }
        
        @Override
        public OperationalState getOperationalState() {
            return _operationalState;
        }
        
        @Override
        public UniversalId getUuid() {
            return _uuid;
        }
        
        @SuppressWarnings("unchecked")
        @Override
        public <E extends Augmentation<org.opendaylight.yang.gen.v1.uri.onf.coremodel.corenetworkmodule.objectclasses.rev160327.NetworkElement>> E getAugmentation(java.lang.Class<E> augmentationType) {
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
            result = prime * result + ((_administrativeControl == null) ? 0 : _administrativeControl.hashCode());
            result = prime * result + ((_adminsatratveState == null) ? 0 : _adminsatratveState.hashCode());
            result = prime * result + ((_key == null) ? 0 : _key.hashCode());
            result = prime * result + ((_lifecycleState == null) ? 0 : _lifecycleState.hashCode());
            result = prime * result + ((_localIdList == null) ? 0 : _localIdList.hashCode());
            result = prime * result + ((_ltpRefList == null) ? 0 : _ltpRefList.hashCode());
            result = prime * result + ((_nameList == null) ? 0 : _nameList.hashCode());
            result = prime * result + ((_operationalState == null) ? 0 : _operationalState.hashCode());
            result = prime * result + ((_uuid == null) ? 0 : _uuid.hashCode());
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
            if (!org.opendaylight.yang.gen.v1.uri.onf.coremodel.corenetworkmodule.objectclasses.rev160327.NetworkElement.class.equals(((DataObject)obj).getImplementedInterface())) {
                return false;
            }
            org.opendaylight.yang.gen.v1.uri.onf.coremodel.corenetworkmodule.objectclasses.rev160327.NetworkElement other = (org.opendaylight.yang.gen.v1.uri.onf.coremodel.corenetworkmodule.objectclasses.rev160327.NetworkElement)obj;
            if (_administrativeControl == null) {
                if (other.getAdministrativeControl() != null) {
                    return false;
                }
            } else if(!_administrativeControl.equals(other.getAdministrativeControl())) {
                return false;
            }
            if (_adminsatratveState == null) {
                if (other.getAdminsatratveState() != null) {
                    return false;
                }
            } else if(!_adminsatratveState.equals(other.getAdminsatratveState())) {
                return false;
            }
            if (_key == null) {
                if (other.getKey() != null) {
                    return false;
                }
            } else if(!_key.equals(other.getKey())) {
                return false;
            }
            if (_lifecycleState == null) {
                if (other.getLifecycleState() != null) {
                    return false;
                }
            } else if(!_lifecycleState.equals(other.getLifecycleState())) {
                return false;
            }
            if (_localIdList == null) {
                if (other.getLocalIdList() != null) {
                    return false;
                }
            } else if(!_localIdList.equals(other.getLocalIdList())) {
                return false;
            }
            if (_ltpRefList == null) {
                if (other.getLtpRefList() != null) {
                    return false;
                }
            } else if(!_ltpRefList.equals(other.getLtpRefList())) {
                return false;
            }
            if (_nameList == null) {
                if (other.getNameList() != null) {
                    return false;
                }
            } else if(!_nameList.equals(other.getNameList())) {
                return false;
            }
            if (_operationalState == null) {
                if (other.getOperationalState() != null) {
                    return false;
                }
            } else if(!_operationalState.equals(other.getOperationalState())) {
                return false;
            }
            if (_uuid == null) {
                if (other.getUuid() != null) {
                    return false;
                }
            } else if(!_uuid.equals(other.getUuid())) {
                return false;
            }
            if (getClass() == obj.getClass()) {
                // Simple case: we are comparing against self
                NetworkElementImpl otherImpl = (NetworkElementImpl) obj;
                if (augmentation == null) {
                    if (otherImpl.augmentation != null) {
                        return false;
                    }
                } else if(!augmentation.equals(otherImpl.augmentation)) {
                    return false;
                }
            } else {
                // Hard case: compare our augments with presence there...
                for (Map.Entry<java.lang.Class<? extends Augmentation<org.opendaylight.yang.gen.v1.uri.onf.coremodel.corenetworkmodule.objectclasses.rev160327.NetworkElement>>, Augmentation<org.opendaylight.yang.gen.v1.uri.onf.coremodel.corenetworkmodule.objectclasses.rev160327.NetworkElement>> e : augmentation.entrySet()) {
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
            java.lang.StringBuilder builder = new java.lang.StringBuilder ("NetworkElement [");
            boolean first = true;
        
            if (_administrativeControl != null) {
                if (first) {
                    first = false;
                } else {
                    builder.append(", ");
                }
                builder.append("_administrativeControl=");
                builder.append(_administrativeControl);
             }
            if (_adminsatratveState != null) {
                if (first) {
                    first = false;
                } else {
                    builder.append(", ");
                }
                builder.append("_adminsatratveState=");
                builder.append(_adminsatratveState);
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
            if (_lifecycleState != null) {
                if (first) {
                    first = false;
                } else {
                    builder.append(", ");
                }
                builder.append("_lifecycleState=");
                builder.append(_lifecycleState);
             }
            if (_localIdList != null) {
                if (first) {
                    first = false;
                } else {
                    builder.append(", ");
                }
                builder.append("_localIdList=");
                builder.append(_localIdList);
             }
            if (_ltpRefList != null) {
                if (first) {
                    first = false;
                } else {
                    builder.append(", ");
                }
                builder.append("_ltpRefList=");
                builder.append(_ltpRefList);
             }
            if (_nameList != null) {
                if (first) {
                    first = false;
                } else {
                    builder.append(", ");
                }
                builder.append("_nameList=");
                builder.append(_nameList);
             }
            if (_operationalState != null) {
                if (first) {
                    first = false;
                } else {
                    builder.append(", ");
                }
                builder.append("_operationalState=");
                builder.append(_operationalState);
             }
            if (_uuid != null) {
                if (first) {
                    first = false;
                } else {
                    builder.append(", ");
                }
                builder.append("_uuid=");
                builder.append(_uuid);
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
