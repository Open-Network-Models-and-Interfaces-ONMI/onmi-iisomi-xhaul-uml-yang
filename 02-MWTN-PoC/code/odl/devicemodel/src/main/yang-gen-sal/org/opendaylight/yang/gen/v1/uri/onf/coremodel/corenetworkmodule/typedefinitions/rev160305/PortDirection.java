package org.opendaylight.yang.gen.v1.uri.onf.coremodel.corenetworkmodule.typedefinitions.rev160305;


/**
 * The enumeration built-in type represents values from a set of assigned names.
 *
 */
public enum PortDirection {
    BIDIRECTIONAL(0),
    
    INPUT(1),
    
    OUTPUT(2),
    
    UNIDENTIFIEDORUNKNOWN(3)
    ;


    int value;
    private static final java.util.Map<java.lang.Integer, PortDirection> VALUE_MAP;

    static {
        final com.google.common.collect.ImmutableMap.Builder<java.lang.Integer, PortDirection> b = com.google.common.collect.ImmutableMap.builder();
        for (PortDirection enumItem : PortDirection.values())
        {
            b.put(enumItem.value, enumItem);
        }

        VALUE_MAP = b.build();
    }

    private PortDirection(int value) {
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
     * @return corresponding PortDirection item
     */
    public static PortDirection forValue(int valueArg) {
        return VALUE_MAP.get(valueArg);
    }
}
