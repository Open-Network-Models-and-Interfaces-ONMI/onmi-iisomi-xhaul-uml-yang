package org.opendaylight.yang.gen.v1.uri.onf.coremodel.corenetworkmodule.typedefinitions.rev160305;
import org.opendaylight.yangtools.yang.binding.Augmentation;
import org.opendaylight.yangtools.yang.binding.AugmentationHolder;
import org.opendaylight.yangtools.yang.binding.DataObject;
import java.util.HashMap;
import org.opendaylight.yangtools.concepts.Builder;
import java.util.Collections;
import java.util.Map;


/**
 * Class that builds {@link org.opendaylight.yang.gen.v1.uri.onf.coremodel.corenetworkmodule.typedefinitions.rev160305.Q822ObservedManagedObjectPkg} instances.
 *
 * @see org.opendaylight.yang.gen.v1.uri.onf.coremodel.corenetworkmodule.typedefinitions.rev160305.Q822ObservedManagedObjectPkg
 *
 */
public class Q822ObservedManagedObjectPkgBuilder implements Builder <org.opendaylight.yang.gen.v1.uri.onf.coremodel.corenetworkmodule.typedefinitions.rev160305.Q822ObservedManagedObjectPkg> {

    private Q822ObservedManagedObjectPkgKey _key;
    private java.lang.String _observedObjectClass;
    private java.lang.String _observedObjectInstance;

    Map<java.lang.Class<? extends Augmentation<org.opendaylight.yang.gen.v1.uri.onf.coremodel.corenetworkmodule.typedefinitions.rev160305.Q822ObservedManagedObjectPkg>>, Augmentation<org.opendaylight.yang.gen.v1.uri.onf.coremodel.corenetworkmodule.typedefinitions.rev160305.Q822ObservedManagedObjectPkg>> augmentation = Collections.emptyMap();

    public Q822ObservedManagedObjectPkgBuilder() {
    }

    public Q822ObservedManagedObjectPkgBuilder(Q822ObservedManagedObjectPkg base) {
        if (base.getKey() == null) {
            this._key = new Q822ObservedManagedObjectPkgKey(
                base.getObservedObjectClass()
            );
            this._observedObjectClass = base.getObservedObjectClass();
        } else {
            this._key = base.getKey();
            this._observedObjectClass = _key.getObservedObjectClass();
        }
        this._observedObjectInstance = base.getObservedObjectInstance();
        if (base instanceof Q822ObservedManagedObjectPkgImpl) {
            Q822ObservedManagedObjectPkgImpl impl = (Q822ObservedManagedObjectPkgImpl) base;
            if (!impl.augmentation.isEmpty()) {
                this.augmentation = new HashMap<>(impl.augmentation);
            }
        } else if (base instanceof AugmentationHolder) {
            @SuppressWarnings("unchecked")
            AugmentationHolder<org.opendaylight.yang.gen.v1.uri.onf.coremodel.corenetworkmodule.typedefinitions.rev160305.Q822ObservedManagedObjectPkg> casted =(AugmentationHolder<org.opendaylight.yang.gen.v1.uri.onf.coremodel.corenetworkmodule.typedefinitions.rev160305.Q822ObservedManagedObjectPkg>) base;
            if (!casted.augmentations().isEmpty()) {
                this.augmentation = new HashMap<>(casted.augmentations());
            }
        }
    }


    public Q822ObservedManagedObjectPkgKey getKey() {
        return _key;
    }
    
    public java.lang.String getObservedObjectClass() {
        return _observedObjectClass;
    }
    
    public java.lang.String getObservedObjectInstance() {
        return _observedObjectInstance;
    }
    
    @SuppressWarnings("unchecked")
    public <E extends Augmentation<org.opendaylight.yang.gen.v1.uri.onf.coremodel.corenetworkmodule.typedefinitions.rev160305.Q822ObservedManagedObjectPkg>> E getAugmentation(java.lang.Class<E> augmentationType) {
        if (augmentationType == null) {
            throw new IllegalArgumentException("Augmentation Type reference cannot be NULL!");
        }
        return (E) augmentation.get(augmentationType);
    }

    public Q822ObservedManagedObjectPkgBuilder setKey(Q822ObservedManagedObjectPkgKey value) {
        this._key = value;
        return this;
    }
    
    public Q822ObservedManagedObjectPkgBuilder setObservedObjectClass(java.lang.String value) {
        this._observedObjectClass = value;
        return this;
    }
    
    public Q822ObservedManagedObjectPkgBuilder setObservedObjectInstance(java.lang.String value) {
        this._observedObjectInstance = value;
        return this;
    }
    
    public Q822ObservedManagedObjectPkgBuilder addAugmentation(java.lang.Class<? extends Augmentation<org.opendaylight.yang.gen.v1.uri.onf.coremodel.corenetworkmodule.typedefinitions.rev160305.Q822ObservedManagedObjectPkg>> augmentationType, Augmentation<org.opendaylight.yang.gen.v1.uri.onf.coremodel.corenetworkmodule.typedefinitions.rev160305.Q822ObservedManagedObjectPkg> augmentation) {
        if (augmentation == null) {
            return removeAugmentation(augmentationType);
        }
    
        if (!(this.augmentation instanceof HashMap)) {
            this.augmentation = new HashMap<>();
        }
    
        this.augmentation.put(augmentationType, augmentation);
        return this;
    }
    
    public Q822ObservedManagedObjectPkgBuilder removeAugmentation(java.lang.Class<? extends Augmentation<org.opendaylight.yang.gen.v1.uri.onf.coremodel.corenetworkmodule.typedefinitions.rev160305.Q822ObservedManagedObjectPkg>> augmentationType) {
        if (this.augmentation instanceof HashMap) {
            this.augmentation.remove(augmentationType);
        }
        return this;
    }

    public Q822ObservedManagedObjectPkg build() {
        return new Q822ObservedManagedObjectPkgImpl(this);
    }

    private static final class Q822ObservedManagedObjectPkgImpl implements Q822ObservedManagedObjectPkg {

        public java.lang.Class<org.opendaylight.yang.gen.v1.uri.onf.coremodel.corenetworkmodule.typedefinitions.rev160305.Q822ObservedManagedObjectPkg> getImplementedInterface() {
            return org.opendaylight.yang.gen.v1.uri.onf.coremodel.corenetworkmodule.typedefinitions.rev160305.Q822ObservedManagedObjectPkg.class;
        }

        private final Q822ObservedManagedObjectPkgKey _key;
        private final java.lang.String _observedObjectClass;
        private final java.lang.String _observedObjectInstance;

        private Map<java.lang.Class<? extends Augmentation<org.opendaylight.yang.gen.v1.uri.onf.coremodel.corenetworkmodule.typedefinitions.rev160305.Q822ObservedManagedObjectPkg>>, Augmentation<org.opendaylight.yang.gen.v1.uri.onf.coremodel.corenetworkmodule.typedefinitions.rev160305.Q822ObservedManagedObjectPkg>> augmentation = Collections.emptyMap();

        private Q822ObservedManagedObjectPkgImpl(Q822ObservedManagedObjectPkgBuilder base) {
            if (base.getKey() == null) {
                this._key = new Q822ObservedManagedObjectPkgKey(
                    base.getObservedObjectClass()
                );
                this._observedObjectClass = base.getObservedObjectClass();
            } else {
                this._key = base.getKey();
                this._observedObjectClass = _key.getObservedObjectClass();
            }
            this._observedObjectInstance = base.getObservedObjectInstance();
            switch (base.augmentation.size()) {
            case 0:
                this.augmentation = Collections.emptyMap();
                break;
            case 1:
                final Map.Entry<java.lang.Class<? extends Augmentation<org.opendaylight.yang.gen.v1.uri.onf.coremodel.corenetworkmodule.typedefinitions.rev160305.Q822ObservedManagedObjectPkg>>, Augmentation<org.opendaylight.yang.gen.v1.uri.onf.coremodel.corenetworkmodule.typedefinitions.rev160305.Q822ObservedManagedObjectPkg>> e = base.augmentation.entrySet().iterator().next();
                this.augmentation = Collections.<java.lang.Class<? extends Augmentation<org.opendaylight.yang.gen.v1.uri.onf.coremodel.corenetworkmodule.typedefinitions.rev160305.Q822ObservedManagedObjectPkg>>, Augmentation<org.opendaylight.yang.gen.v1.uri.onf.coremodel.corenetworkmodule.typedefinitions.rev160305.Q822ObservedManagedObjectPkg>>singletonMap(e.getKey(), e.getValue());
                break;
            default :
                this.augmentation = new HashMap<>(base.augmentation);
            }
        }

        @Override
        public Q822ObservedManagedObjectPkgKey getKey() {
            return _key;
        }
        
        @Override
        public java.lang.String getObservedObjectClass() {
            return _observedObjectClass;
        }
        
        @Override
        public java.lang.String getObservedObjectInstance() {
            return _observedObjectInstance;
        }
        
        @SuppressWarnings("unchecked")
        @Override
        public <E extends Augmentation<org.opendaylight.yang.gen.v1.uri.onf.coremodel.corenetworkmodule.typedefinitions.rev160305.Q822ObservedManagedObjectPkg>> E getAugmentation(java.lang.Class<E> augmentationType) {
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
            result = prime * result + ((_observedObjectClass == null) ? 0 : _observedObjectClass.hashCode());
            result = prime * result + ((_observedObjectInstance == null) ? 0 : _observedObjectInstance.hashCode());
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
            if (!org.opendaylight.yang.gen.v1.uri.onf.coremodel.corenetworkmodule.typedefinitions.rev160305.Q822ObservedManagedObjectPkg.class.equals(((DataObject)obj).getImplementedInterface())) {
                return false;
            }
            org.opendaylight.yang.gen.v1.uri.onf.coremodel.corenetworkmodule.typedefinitions.rev160305.Q822ObservedManagedObjectPkg other = (org.opendaylight.yang.gen.v1.uri.onf.coremodel.corenetworkmodule.typedefinitions.rev160305.Q822ObservedManagedObjectPkg)obj;
            if (_key == null) {
                if (other.getKey() != null) {
                    return false;
                }
            } else if(!_key.equals(other.getKey())) {
                return false;
            }
            if (_observedObjectClass == null) {
                if (other.getObservedObjectClass() != null) {
                    return false;
                }
            } else if(!_observedObjectClass.equals(other.getObservedObjectClass())) {
                return false;
            }
            if (_observedObjectInstance == null) {
                if (other.getObservedObjectInstance() != null) {
                    return false;
                }
            } else if(!_observedObjectInstance.equals(other.getObservedObjectInstance())) {
                return false;
            }
            if (getClass() == obj.getClass()) {
                // Simple case: we are comparing against self
                Q822ObservedManagedObjectPkgImpl otherImpl = (Q822ObservedManagedObjectPkgImpl) obj;
                if (augmentation == null) {
                    if (otherImpl.augmentation != null) {
                        return false;
                    }
                } else if(!augmentation.equals(otherImpl.augmentation)) {
                    return false;
                }
            } else {
                // Hard case: compare our augments with presence there...
                for (Map.Entry<java.lang.Class<? extends Augmentation<org.opendaylight.yang.gen.v1.uri.onf.coremodel.corenetworkmodule.typedefinitions.rev160305.Q822ObservedManagedObjectPkg>>, Augmentation<org.opendaylight.yang.gen.v1.uri.onf.coremodel.corenetworkmodule.typedefinitions.rev160305.Q822ObservedManagedObjectPkg>> e : augmentation.entrySet()) {
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
            java.lang.StringBuilder builder = new java.lang.StringBuilder ("Q822ObservedManagedObjectPkg [");
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
            if (_observedObjectClass != null) {
                if (first) {
                    first = false;
                } else {
                    builder.append(", ");
                }
                builder.append("_observedObjectClass=");
                builder.append(_observedObjectClass);
             }
            if (_observedObjectInstance != null) {
                if (first) {
                    first = false;
                } else {
                    builder.append(", ");
                }
                builder.append("_observedObjectInstance=");
                builder.append(_observedObjectInstance);
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
