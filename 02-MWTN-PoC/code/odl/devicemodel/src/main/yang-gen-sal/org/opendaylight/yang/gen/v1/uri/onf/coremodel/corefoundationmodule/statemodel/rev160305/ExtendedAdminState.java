package org.opendaylight.yang.gen.v1.uri.onf.coremodel.corefoundationmodule.statemodel.rev160305;


/**
 * The enumeration built-in type represents values from a set of assigned names.
 *
 */
public enum ExtendedAdminState {
    LOCKED(0),
    
    UNLOCKED(1),
    
    SHUTTINGDOWNACTIVE(2),
    
    SHUTTINGDOWNPASSIVE(3)
    ;


    int value;
    private static final java.util.Map<java.lang.Integer, ExtendedAdminState> VALUE_MAP;

    static {
        final com.google.common.collect.ImmutableMap.Builder<java.lang.Integer, ExtendedAdminState> b = com.google.common.collect.ImmutableMap.builder();
        for (ExtendedAdminState enumItem : ExtendedAdminState.values())
        {
            b.put(enumItem.value, enumItem);
        }

        VALUE_MAP = b.build();
    }

    private ExtendedAdminState(int value) {
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
     * @return corresponding ExtendedAdminState item
     */
    public static ExtendedAdminState forValue(int valueArg) {
        return VALUE_MAP.get(valueArg);
    }
}
