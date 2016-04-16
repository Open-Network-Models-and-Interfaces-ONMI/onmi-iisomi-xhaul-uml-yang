package org.opendaylight.yang.gen.v1.uri.onf.coremodel.corefoundationmodule.statemodel.rev160305;


/**
 * The enumeration built-in type represents values from a set of assigned names.
 *
 */
public enum AdministrativeState {
    LOCKED(0),
    
    UNLOCKED(1)
    ;


    int value;
    private static final java.util.Map<java.lang.Integer, AdministrativeState> VALUE_MAP;

    static {
        final com.google.common.collect.ImmutableMap.Builder<java.lang.Integer, AdministrativeState> b = com.google.common.collect.ImmutableMap.builder();
        for (AdministrativeState enumItem : AdministrativeState.values())
        {
            b.put(enumItem.value, enumItem);
        }

        VALUE_MAP = b.build();
    }

    private AdministrativeState(int value) {
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
     * @return corresponding AdministrativeState item
     */
    public static AdministrativeState forValue(int valueArg) {
        return VALUE_MAP.get(valueArg);
    }
}
