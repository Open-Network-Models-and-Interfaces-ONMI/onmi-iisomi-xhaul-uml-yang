package org.opendaylight.yang.gen.v1.uri.onf.coremodel.corefoundationmodule.statemodel.rev160305;


/**
 * The enumeration built-in type represents values from a set of assigned names.
 *
 */
public enum AdministrativeControl {
    UNLOCK(0),
    
    LOCKPASSIVE(1),
    
    LOCKACTIVE(2),
    
    LOCKIMMEDIATE(3)
    ;


    int value;
    private static final java.util.Map<java.lang.Integer, AdministrativeControl> VALUE_MAP;

    static {
        final com.google.common.collect.ImmutableMap.Builder<java.lang.Integer, AdministrativeControl> b = com.google.common.collect.ImmutableMap.builder();
        for (AdministrativeControl enumItem : AdministrativeControl.values())
        {
            b.put(enumItem.value, enumItem);
        }

        VALUE_MAP = b.build();
    }

    private AdministrativeControl(int value) {
        this.value = value;
    }

    /**
     * @return integer value
     */
    public int getIntValue() {
        return value;
    }

    /**
     * @param valueArg
     * @return corresponding AdministrativeControl item
     */
    public static AdministrativeControl forValue(int valueArg) {
        return VALUE_MAP.get(valueArg);
    }
}
