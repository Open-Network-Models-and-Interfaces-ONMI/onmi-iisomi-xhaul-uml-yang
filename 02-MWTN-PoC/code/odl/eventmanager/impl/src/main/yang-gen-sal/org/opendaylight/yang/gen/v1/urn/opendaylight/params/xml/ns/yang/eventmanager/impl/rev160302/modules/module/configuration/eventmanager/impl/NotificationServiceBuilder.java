package org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.eventmanager.impl.rev160302.modules.module.configuration.eventmanager.impl;
import org.opendaylight.yangtools.yang.binding.Augmentation;
import org.opendaylight.yangtools.yang.binding.AugmentationHolder;
import org.opendaylight.yangtools.yang.binding.DataObject;
import java.util.HashMap;
import org.opendaylight.yangtools.concepts.Builder;
import java.util.Collections;
import java.util.Map;


/**
 * Class that builds {@link org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.eventmanager.impl.rev160302.modules.module.configuration.eventmanager.impl.NotificationService} instances.
 *
 * @see org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.eventmanager.impl.rev160302.modules.module.configuration.eventmanager.impl.NotificationService
 *
 */
public class NotificationServiceBuilder implements Builder <org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.eventmanager.impl.rev160302.modules.module.configuration.eventmanager.impl.NotificationService> {

    private java.lang.Object _name;
    private java.lang.Class<? extends org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.controller.config.rev130405.ServiceType> _type;

    Map<java.lang.Class<? extends Augmentation<org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.eventmanager.impl.rev160302.modules.module.configuration.eventmanager.impl.NotificationService>>, Augmentation<org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.eventmanager.impl.rev160302.modules.module.configuration.eventmanager.impl.NotificationService>> augmentation = Collections.emptyMap();

    public NotificationServiceBuilder() {
    }
    public NotificationServiceBuilder(org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.controller.config.rev130405.ServiceRef arg) {
        this._type = arg.getType();
        this._name = arg.getName();
    }

    public NotificationServiceBuilder(NotificationService base) {
        this._name = base.getName();
        this._type = base.getType();
        if (base instanceof NotificationServiceImpl) {
            NotificationServiceImpl impl = (NotificationServiceImpl) base;
            if (!impl.augmentation.isEmpty()) {
                this.augmentation = new HashMap<>(impl.augmentation);
            }
        } else if (base instanceof AugmentationHolder) {
            @SuppressWarnings("unchecked")
            AugmentationHolder<org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.eventmanager.impl.rev160302.modules.module.configuration.eventmanager.impl.NotificationService> casted =(AugmentationHolder<org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.eventmanager.impl.rev160302.modules.module.configuration.eventmanager.impl.NotificationService>) base;
            if (!casted.augmentations().isEmpty()) {
                this.augmentation = new HashMap<>(casted.augmentations());
            }
        }
    }

    /**
     *Set fields from given grouping argument. Valid argument is instance of one of following types:
     * <ul>
     * <li>org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.controller.config.rev130405.ServiceRef</li>
     * </ul>
     *
     * @param arg grouping object
     * @throws IllegalArgumentException if given argument is none of valid types
    */
    public void fieldsFrom(DataObject arg) {
        boolean isValidArg = false;
        if (arg instanceof org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.controller.config.rev130405.ServiceRef) {
            this._type = ((org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.controller.config.rev130405.ServiceRef)arg).getType();
            this._name = ((org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.controller.config.rev130405.ServiceRef)arg).getName();
            isValidArg = true;
        }
        if (!isValidArg) {
            throw new IllegalArgumentException(
              "expected one of: [org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.controller.config.rev130405.ServiceRef] \n" +
              "but was: " + arg
            );
        }
    }

    public java.lang.Object getName() {
        return _name;
    }
    
    public java.lang.Class<? extends org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.controller.config.rev130405.ServiceType> getType() {
        return _type;
    }
    
    @SuppressWarnings("unchecked")
    public <E extends Augmentation<org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.eventmanager.impl.rev160302.modules.module.configuration.eventmanager.impl.NotificationService>> E getAugmentation(java.lang.Class<E> augmentationType) {
        if (augmentationType == null) {
            throw new IllegalArgumentException("Augmentation Type reference cannot be NULL!");
        }
        return (E) augmentation.get(augmentationType);
    }

    public NotificationServiceBuilder setName(java.lang.Object value) {
        this._name = value;
        return this;
    }
    
    public NotificationServiceBuilder setType(java.lang.Class<? extends org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.controller.config.rev130405.ServiceType> value) {
        this._type = value;
        return this;
    }
    
    public NotificationServiceBuilder addAugmentation(java.lang.Class<? extends Augmentation<org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.eventmanager.impl.rev160302.modules.module.configuration.eventmanager.impl.NotificationService>> augmentationType, Augmentation<org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.eventmanager.impl.rev160302.modules.module.configuration.eventmanager.impl.NotificationService> augmentation) {
        if (augmentation == null) {
            return removeAugmentation(augmentationType);
        }
    
        if (!(this.augmentation instanceof HashMap)) {
            this.augmentation = new HashMap<>();
        }
    
        this.augmentation.put(augmentationType, augmentation);
        return this;
    }
    
    public NotificationServiceBuilder removeAugmentation(java.lang.Class<? extends Augmentation<org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.eventmanager.impl.rev160302.modules.module.configuration.eventmanager.impl.NotificationService>> augmentationType) {
        if (this.augmentation instanceof HashMap) {
            this.augmentation.remove(augmentationType);
        }
        return this;
    }

    public NotificationService build() {
        return new NotificationServiceImpl(this);
    }

    private static final class NotificationServiceImpl implements NotificationService {

        public java.lang.Class<org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.eventmanager.impl.rev160302.modules.module.configuration.eventmanager.impl.NotificationService> getImplementedInterface() {
            return org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.eventmanager.impl.rev160302.modules.module.configuration.eventmanager.impl.NotificationService.class;
        }

        private final java.lang.Object _name;
        private final java.lang.Class<? extends org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.controller.config.rev130405.ServiceType> _type;

        private Map<java.lang.Class<? extends Augmentation<org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.eventmanager.impl.rev160302.modules.module.configuration.eventmanager.impl.NotificationService>>, Augmentation<org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.eventmanager.impl.rev160302.modules.module.configuration.eventmanager.impl.NotificationService>> augmentation = Collections.emptyMap();

        private NotificationServiceImpl(NotificationServiceBuilder base) {
            this._name = base.getName();
            this._type = base.getType();
            switch (base.augmentation.size()) {
            case 0:
                this.augmentation = Collections.emptyMap();
                break;
            case 1:
                final Map.Entry<java.lang.Class<? extends Augmentation<org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.eventmanager.impl.rev160302.modules.module.configuration.eventmanager.impl.NotificationService>>, Augmentation<org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.eventmanager.impl.rev160302.modules.module.configuration.eventmanager.impl.NotificationService>> e = base.augmentation.entrySet().iterator().next();
                this.augmentation = Collections.<java.lang.Class<? extends Augmentation<org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.eventmanager.impl.rev160302.modules.module.configuration.eventmanager.impl.NotificationService>>, Augmentation<org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.eventmanager.impl.rev160302.modules.module.configuration.eventmanager.impl.NotificationService>>singletonMap(e.getKey(), e.getValue());
                break;
            default :
                this.augmentation = new HashMap<>(base.augmentation);
            }
        }

        @Override
        public java.lang.Object getName() {
            return _name;
        }
        
        @Override
        public java.lang.Class<? extends org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.controller.config.rev130405.ServiceType> getType() {
            return _type;
        }
        
        @SuppressWarnings("unchecked")
        @Override
        public <E extends Augmentation<org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.eventmanager.impl.rev160302.modules.module.configuration.eventmanager.impl.NotificationService>> E getAugmentation(java.lang.Class<E> augmentationType) {
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
            result = prime * result + ((_name == null) ? 0 : _name.hashCode());
            result = prime * result + ((_type == null) ? 0 : _type.hashCode());
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
            if (!org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.eventmanager.impl.rev160302.modules.module.configuration.eventmanager.impl.NotificationService.class.equals(((DataObject)obj).getImplementedInterface())) {
                return false;
            }
            org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.eventmanager.impl.rev160302.modules.module.configuration.eventmanager.impl.NotificationService other = (org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.eventmanager.impl.rev160302.modules.module.configuration.eventmanager.impl.NotificationService)obj;
            if (_name == null) {
                if (other.getName() != null) {
                    return false;
                }
            } else if(!_name.equals(other.getName())) {
                return false;
            }
            if (_type == null) {
                if (other.getType() != null) {
                    return false;
                }
            } else if(!_type.equals(other.getType())) {
                return false;
            }
            if (getClass() == obj.getClass()) {
                // Simple case: we are comparing against self
                NotificationServiceImpl otherImpl = (NotificationServiceImpl) obj;
                if (augmentation == null) {
                    if (otherImpl.augmentation != null) {
                        return false;
                    }
                } else if(!augmentation.equals(otherImpl.augmentation)) {
                    return false;
                }
            } else {
                // Hard case: compare our augments with presence there...
                for (Map.Entry<java.lang.Class<? extends Augmentation<org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.eventmanager.impl.rev160302.modules.module.configuration.eventmanager.impl.NotificationService>>, Augmentation<org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.eventmanager.impl.rev160302.modules.module.configuration.eventmanager.impl.NotificationService>> e : augmentation.entrySet()) {
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
            java.lang.StringBuilder builder = new java.lang.StringBuilder ("NotificationService [");
            boolean first = true;
        
            if (_name != null) {
                if (first) {
                    first = false;
                } else {
                    builder.append(", ");
                }
                builder.append("_name=");
                builder.append(_name);
             }
            if (_type != null) {
                if (first) {
                    first = false;
                } else {
                    builder.append(", ");
                }
                builder.append("_type=");
                builder.append(_type);
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
