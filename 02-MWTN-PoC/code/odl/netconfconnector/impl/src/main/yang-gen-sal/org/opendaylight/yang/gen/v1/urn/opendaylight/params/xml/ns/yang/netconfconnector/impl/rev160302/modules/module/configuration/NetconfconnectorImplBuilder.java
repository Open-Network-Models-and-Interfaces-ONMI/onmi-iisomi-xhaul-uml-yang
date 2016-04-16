package org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.netconfconnector.impl.rev160302.modules.module.configuration;
import org.opendaylight.yangtools.yang.binding.Augmentation;
import org.opendaylight.yangtools.yang.binding.AugmentationHolder;
import org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.netconfconnector.impl.rev160302.modules.module.configuration.netconfconnector.impl.Broker;
import org.opendaylight.yangtools.yang.binding.DataObject;
import java.util.HashMap;
import org.opendaylight.yangtools.concepts.Builder;
import org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.netconfconnector.impl.rev160302.modules.module.configuration.netconfconnector.impl.EventmanagerService;
import org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.netconfconnector.impl.rev160302.modules.module.configuration.netconfconnector.impl.NotificationService;
import org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.netconfconnector.impl.rev160302.modules.module.configuration.netconfconnector.impl.DataBroker;
import java.util.Collections;
import java.util.Map;


/**
 * Class that builds {@link org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.netconfconnector.impl.rev160302.modules.module.configuration.NetconfconnectorImpl} instances.
 *
 * @see org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.netconfconnector.impl.rev160302.modules.module.configuration.NetconfconnectorImpl
 *
 */
public class NetconfconnectorImplBuilder implements Builder <org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.netconfconnector.impl.rev160302.modules.module.configuration.NetconfconnectorImpl> {

    private Broker _broker;
    private DataBroker _dataBroker;
    private EventmanagerService _eventmanagerService;
    private NotificationService _notificationService;

    Map<java.lang.Class<? extends Augmentation<org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.netconfconnector.impl.rev160302.modules.module.configuration.NetconfconnectorImpl>>, Augmentation<org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.netconfconnector.impl.rev160302.modules.module.configuration.NetconfconnectorImpl>> augmentation = Collections.emptyMap();

    public NetconfconnectorImplBuilder() {
    }

    public NetconfconnectorImplBuilder(NetconfconnectorImpl base) {
        this._broker = base.getBroker();
        this._dataBroker = base.getDataBroker();
        this._eventmanagerService = base.getEventmanagerService();
        this._notificationService = base.getNotificationService();
        if (base instanceof NetconfconnectorImplImpl) {
            NetconfconnectorImplImpl impl = (NetconfconnectorImplImpl) base;
            if (!impl.augmentation.isEmpty()) {
                this.augmentation = new HashMap<>(impl.augmentation);
            }
        } else if (base instanceof AugmentationHolder) {
            @SuppressWarnings("unchecked")
            AugmentationHolder<org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.netconfconnector.impl.rev160302.modules.module.configuration.NetconfconnectorImpl> casted =(AugmentationHolder<org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.netconfconnector.impl.rev160302.modules.module.configuration.NetconfconnectorImpl>) base;
            if (!casted.augmentations().isEmpty()) {
                this.augmentation = new HashMap<>(casted.augmentations());
            }
        }
    }


    public Broker getBroker() {
        return _broker;
    }
    
    public DataBroker getDataBroker() {
        return _dataBroker;
    }
    
    public EventmanagerService getEventmanagerService() {
        return _eventmanagerService;
    }
    
    public NotificationService getNotificationService() {
        return _notificationService;
    }
    
    @SuppressWarnings("unchecked")
    public <E extends Augmentation<org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.netconfconnector.impl.rev160302.modules.module.configuration.NetconfconnectorImpl>> E getAugmentation(java.lang.Class<E> augmentationType) {
        if (augmentationType == null) {
            throw new IllegalArgumentException("Augmentation Type reference cannot be NULL!");
        }
        return (E) augmentation.get(augmentationType);
    }

    public NetconfconnectorImplBuilder setBroker(Broker value) {
        this._broker = value;
        return this;
    }
    
    public NetconfconnectorImplBuilder setDataBroker(DataBroker value) {
        this._dataBroker = value;
        return this;
    }
    
    public NetconfconnectorImplBuilder setEventmanagerService(EventmanagerService value) {
        this._eventmanagerService = value;
        return this;
    }
    
    public NetconfconnectorImplBuilder setNotificationService(NotificationService value) {
        this._notificationService = value;
        return this;
    }
    
    public NetconfconnectorImplBuilder addAugmentation(java.lang.Class<? extends Augmentation<org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.netconfconnector.impl.rev160302.modules.module.configuration.NetconfconnectorImpl>> augmentationType, Augmentation<org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.netconfconnector.impl.rev160302.modules.module.configuration.NetconfconnectorImpl> augmentation) {
        if (augmentation == null) {
            return removeAugmentation(augmentationType);
        }
    
        if (!(this.augmentation instanceof HashMap)) {
            this.augmentation = new HashMap<>();
        }
    
        this.augmentation.put(augmentationType, augmentation);
        return this;
    }
    
    public NetconfconnectorImplBuilder removeAugmentation(java.lang.Class<? extends Augmentation<org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.netconfconnector.impl.rev160302.modules.module.configuration.NetconfconnectorImpl>> augmentationType) {
        if (this.augmentation instanceof HashMap) {
            this.augmentation.remove(augmentationType);
        }
        return this;
    }

    public NetconfconnectorImpl build() {
        return new NetconfconnectorImplImpl(this);
    }

    private static final class NetconfconnectorImplImpl implements NetconfconnectorImpl {

        public java.lang.Class<org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.netconfconnector.impl.rev160302.modules.module.configuration.NetconfconnectorImpl> getImplementedInterface() {
            return org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.netconfconnector.impl.rev160302.modules.module.configuration.NetconfconnectorImpl.class;
        }

        private final Broker _broker;
        private final DataBroker _dataBroker;
        private final EventmanagerService _eventmanagerService;
        private final NotificationService _notificationService;

        private Map<java.lang.Class<? extends Augmentation<org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.netconfconnector.impl.rev160302.modules.module.configuration.NetconfconnectorImpl>>, Augmentation<org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.netconfconnector.impl.rev160302.modules.module.configuration.NetconfconnectorImpl>> augmentation = Collections.emptyMap();

        private NetconfconnectorImplImpl(NetconfconnectorImplBuilder base) {
            this._broker = base.getBroker();
            this._dataBroker = base.getDataBroker();
            this._eventmanagerService = base.getEventmanagerService();
            this._notificationService = base.getNotificationService();
            switch (base.augmentation.size()) {
            case 0:
                this.augmentation = Collections.emptyMap();
                break;
            case 1:
                final Map.Entry<java.lang.Class<? extends Augmentation<org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.netconfconnector.impl.rev160302.modules.module.configuration.NetconfconnectorImpl>>, Augmentation<org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.netconfconnector.impl.rev160302.modules.module.configuration.NetconfconnectorImpl>> e = base.augmentation.entrySet().iterator().next();
                this.augmentation = Collections.<java.lang.Class<? extends Augmentation<org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.netconfconnector.impl.rev160302.modules.module.configuration.NetconfconnectorImpl>>, Augmentation<org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.netconfconnector.impl.rev160302.modules.module.configuration.NetconfconnectorImpl>>singletonMap(e.getKey(), e.getValue());
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
        public DataBroker getDataBroker() {
            return _dataBroker;
        }
        
        @Override
        public EventmanagerService getEventmanagerService() {
            return _eventmanagerService;
        }
        
        @Override
        public NotificationService getNotificationService() {
            return _notificationService;
        }
        
        @SuppressWarnings("unchecked")
        @Override
        public <E extends Augmentation<org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.netconfconnector.impl.rev160302.modules.module.configuration.NetconfconnectorImpl>> E getAugmentation(java.lang.Class<E> augmentationType) {
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
            result = prime * result + ((_dataBroker == null) ? 0 : _dataBroker.hashCode());
            result = prime * result + ((_eventmanagerService == null) ? 0 : _eventmanagerService.hashCode());
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
            if (!org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.netconfconnector.impl.rev160302.modules.module.configuration.NetconfconnectorImpl.class.equals(((DataObject)obj).getImplementedInterface())) {
                return false;
            }
            org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.netconfconnector.impl.rev160302.modules.module.configuration.NetconfconnectorImpl other = (org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.netconfconnector.impl.rev160302.modules.module.configuration.NetconfconnectorImpl)obj;
            if (_broker == null) {
                if (other.getBroker() != null) {
                    return false;
                }
            } else if(!_broker.equals(other.getBroker())) {
                return false;
            }
            if (_dataBroker == null) {
                if (other.getDataBroker() != null) {
                    return false;
                }
            } else if(!_dataBroker.equals(other.getDataBroker())) {
                return false;
            }
            if (_eventmanagerService == null) {
                if (other.getEventmanagerService() != null) {
                    return false;
                }
            } else if(!_eventmanagerService.equals(other.getEventmanagerService())) {
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
                NetconfconnectorImplImpl otherImpl = (NetconfconnectorImplImpl) obj;
                if (augmentation == null) {
                    if (otherImpl.augmentation != null) {
                        return false;
                    }
                } else if(!augmentation.equals(otherImpl.augmentation)) {
                    return false;
                }
            } else {
                // Hard case: compare our augments with presence there...
                for (Map.Entry<java.lang.Class<? extends Augmentation<org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.netconfconnector.impl.rev160302.modules.module.configuration.NetconfconnectorImpl>>, Augmentation<org.opendaylight.yang.gen.v1.urn.opendaylight.params.xml.ns.yang.netconfconnector.impl.rev160302.modules.module.configuration.NetconfconnectorImpl>> e : augmentation.entrySet()) {
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
            java.lang.StringBuilder builder = new java.lang.StringBuilder ("NetconfconnectorImpl [");
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
            if (_dataBroker != null) {
                if (first) {
                    first = false;
                } else {
                    builder.append(", ");
                }
                builder.append("_dataBroker=");
                builder.append(_dataBroker);
             }
            if (_eventmanagerService != null) {
                if (first) {
                    first = false;
                } else {
                    builder.append(", ");
                }
                builder.append("_eventmanagerService=");
                builder.append(_eventmanagerService);
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
