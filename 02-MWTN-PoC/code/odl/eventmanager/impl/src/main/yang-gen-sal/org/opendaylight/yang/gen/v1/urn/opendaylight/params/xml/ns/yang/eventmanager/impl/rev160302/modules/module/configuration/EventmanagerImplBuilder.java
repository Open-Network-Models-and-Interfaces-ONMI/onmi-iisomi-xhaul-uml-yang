package org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.eventmanager.impl.rev160302.modules.module.configuration;
import org.opendaylight.yangtools.yang.binding.Augmentation;
import org.opendaylight.yangtools.yang.binding.AugmentationHolder;
import org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.eventmanager.impl.rev160302.modules.module.configuration.eventmanager.impl.Broker;
import org.opendaylight.yangtools.yang.binding.DataObject;
import java.util.HashMap;
import org.opendaylight.yangtools.concepts.Builder;
import org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.eventmanager.impl.rev160302.modules.module.configuration.eventmanager.impl.NotificationService;
import java.util.Collections;
import java.util.Map;


/**
 * Class that builds {@link org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.eventmanager.impl.rev160302.modules.module.configuration.EventmanagerImpl} instances.
 *
 * @see org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.eventmanager.impl.rev160302.modules.module.configuration.EventmanagerImpl
 *
 */
public class EventmanagerImplBuilder implements Builder <org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.eventmanager.impl.rev160302.modules.module.configuration.EventmanagerImpl> {

    private Broker _broker;
    private NotificationService _notificationService;

    Map<java.lang.Class<? extends Augmentation<org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.eventmanager.impl.rev160302.modules.module.configuration.EventmanagerImpl>>, Augmentation<org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.eventmanager.impl.rev160302.modules.module.configuration.EventmanagerImpl>> augmentation = Collections.emptyMap();

    public EventmanagerImplBuilder() {
    }

    public EventmanagerImplBuilder(EventmanagerImpl base) {
        this._broker = base.getBroker();
        this._notificationService = base.getNotificationService();
        if (base instanceof EventmanagerImplImpl) {
            EventmanagerImplImpl impl = (EventmanagerImplImpl) base;
            if (!impl.augmentation.isEmpty()) {
                this.augmentation = new HashMap<>(impl.augmentation);
            }
        } else if (base instanceof AugmentationHolder) {
            @SuppressWarnings("unchecked")
            AugmentationHolder<org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.eventmanager.impl.rev160302.modules.module.configuration.EventmanagerImpl> casted =(AugmentationHolder<org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.eventmanager.impl.rev160302.modules.module.configuration.EventmanagerImpl>) base;
            if (!casted.augmentations().isEmpty()) {
                this.augmentation = new HashMap<>(casted.augmentations());
            }
        }
    }


    public Broker getBroker() {
        return _broker;
    }
    
    public NotificationService getNotificationService() {
        return _notificationService;
    }
    
    @SuppressWarnings("unchecked")
    public <E extends Augmentation<org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.eventmanager.impl.rev160302.modules.module.configuration.EventmanagerImpl>> E getAugmentation(java.lang.Class<E> augmentationType) {
        if (augmentationType == null) {
            throw new IllegalArgumentException("Augmentation Type reference cannot be NULL!");
        }
        return (E) augmentation.get(augmentationType);
    }

    public EventmanagerImplBuilder setBroker(Broker value) {
        this._broker = value;
        return this;
    }
    
    public EventmanagerImplBuilder setNotificationService(NotificationService value) {
        this._notificationService = value;
        return this;
    }
    
    public EventmanagerImplBuilder addAugmentation(java.lang.Class<? extends Augmentation<org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.eventmanager.impl.rev160302.modules.module.configuration.EventmanagerImpl>> augmentationType, Augmentation<org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.eventmanager.impl.rev160302.modules.module.configuration.EventmanagerImpl> augmentation) {
        if (augmentation == null) {
            return removeAugmentation(augmentationType);
        }
    
        if (!(this.augmentation instanceof HashMap)) {
            this.augmentation = new HashMap<>();
        }
    
        this.augmentation.put(augmentationType, augmentation);
        return this;
    }
    
    public EventmanagerImplBuilder removeAugmentation(java.lang.Class<? extends Augmentation<org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.eventmanager.impl.rev160302.modules.module.configuration.EventmanagerImpl>> augmentationType) {
        if (this.augmentation instanceof HashMap) {
            this.augmentation.remove(augmentationType);
        }
        return this;
    }

    public EventmanagerImpl build() {
        return new EventmanagerImplImpl(this);
    }

    private static final class EventmanagerImplImpl implements EventmanagerImpl {

        public java.lang.Class<org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.eventmanager.impl.rev160302.modules.module.configuration.EventmanagerImpl> getImplementedInterface() {
            return org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.eventmanager.impl.rev160302.modules.module.configuration.EventmanagerImpl.class;
        }

        private final Broker _broker;
        private final NotificationService _notificationService;

        private Map<java.lang.Class<? extends Augmentation<org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.eventmanager.impl.rev160302.modules.module.configuration.EventmanagerImpl>>, Augmentation<org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.eventmanager.impl.rev160302.modules.module.configuration.EventmanagerImpl>> augmentation = Collections.emptyMap();

        private EventmanagerImplImpl(EventmanagerImplBuilder base) {
            this._broker = base.getBroker();
            this._notificationService = base.getNotificationService();
            switch (base.augmentation.size()) {
            case 0:
                this.augmentation = Collections.emptyMap();
                break;
            case 1:
                final Map.Entry<java.lang.Class<? extends Augmentation<org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.eventmanager.impl.rev160302.modules.module.configuration.EventmanagerImpl>>, Augmentation<org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.eventmanager.impl.rev160302.modules.module.configuration.EventmanagerImpl>> e = base.augmentation.entrySet().iterator().next();
                this.augmentation = Collections.<java.lang.Class<? extends Augmentation<org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.eventmanager.impl.rev160302.modules.module.configuration.EventmanagerImpl>>, Augmentation<org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.eventmanager.impl.rev160302.modules.module.configuration.EventmanagerImpl>>singletonMap(e.getKey(), e.getValue());
                break;
            default :
                this.augmentation = new HashMap<>(base.augmentation);
            }
        }

        @Override
        public Broker getBroker() {
            return _broker;
        }
        
        @Override
        public NotificationService getNotificationService() {
            return _notificationService;
        }
        
        @SuppressWarnings("unchecked")
        @Override
        public <E extends Augmentation<org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.eventmanager.impl.rev160302.modules.module.configuration.EventmanagerImpl>> E getAugmentation(java.lang.Class<E> augmentationType) {
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
            result = prime * result + ((_broker == null) ? 0 : _broker.hashCode());
            result = prime * result + ((_notificationService == null) ? 0 : _notificationService.hashCode());
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
            if (!org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.eventmanager.impl.rev160302.modules.module.configuration.EventmanagerImpl.class.equals(((DataObject)obj).getImplementedInterface())) {
                return false;
            }
            org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.eventmanager.impl.rev160302.modules.module.configuration.EventmanagerImpl other = (org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.eventmanager.impl.rev160302.modules.module.configuration.EventmanagerImpl)obj;
            if (_broker == null) {
                if (other.getBroker() != null) {
                    return false;
                }
            } else if(!_broker.equals(other.getBroker())) {
                return false;
            }
            if (_notificationService == null) {
                if (other.getNotificationService() != null) {
                    return false;
                }
            } else if(!_notificationService.equals(other.getNotificationService())) {
                return false;
            }
            if (getClass() == obj.getClass()) {
                // Simple case: we are comparing against self
                EventmanagerImplImpl otherImpl = (EventmanagerImplImpl) obj;
                if (augmentation == null) {
                    if (otherImpl.augmentation != null) {
                        return false;
                    }
                } else if(!augmentation.equals(otherImpl.augmentation)) {
                    return false;
                }
            } else {
                // Hard case: compare our augments with presence there...
                for (Map.Entry<java.lang.Class<? extends Augmentation<org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.eventmanager.impl.rev160302.modules.module.configuration.EventmanagerImpl>>, Augmentation<org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.eventmanager.impl.rev160302.modules.module.configuration.EventmanagerImpl>> e : augmentation.entrySet()) {
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
            java.lang.StringBuilder builder = new java.lang.StringBuilder ("EventmanagerImpl [");
            boolean first = true;
        
            if (_broker != null) {
                if (first) {
                    first = false;
                } else {
                    builder.append(", ");
                }
                builder.append("_broker=");
                builder.append(_broker);
             }
            if (_notificationService != null) {
                if (first) {
                    first = false;
                } else {
                    builder.append(", ");
                }
                builder.append("_notificationService=");
                builder.append(_notificationService);
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
