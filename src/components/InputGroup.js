import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput } from 'react-native';

const InputGroup = ({label, keyboardType, value, changeHandler, updateHandler, editable}) => {
    const [isFieldDirty, setIsFieldDirty] = useState(false);

    return (
        <View style={styles.clientProfileContentGroup}>
            <Text style={styles.clientProfileLabel}>{label}</Text>
            <TextInput
                style={styles.clientProfileInput}
                // placeholder={placeholder}
                // placeholderTextColor={"gray"}
                editable={editable ?? true} // true by default if not defined
                autoCapitalize="none"
                keyboardType={keyboardType}
                returnKeyType='done'
                onChangeText={(value) => {
                    setIsFieldDirty(true);
                    changeHandler(value);
                }}
                onEndEditing={() => {
                    if (isFieldDirty) {
                        console.log(`Found dirty field. Updating ${label} with value '${value}'`);
                        updateHandler();
                    }
                }}
                value={typeof value !== "boolean" ? value : (value ? "Yes" : "No") }
            />
        </View>
    )
};

export default InputGroup;

const styles = StyleSheet.create({
    clientProfileContentGroup: {
        flex: 1,
        justifyContent: "flex-start",
        marginHorizontal: 10,
        marginBottom: 10
    },
    clientProfileLabel: {
        textTransform: "uppercase",
        fontWeight: "bold",
        color: "#a6a6a6",
        fontSize: 16
    },
    clientProfileInput: {
        flex: 1,    // flex 1 makes sure the entire textinput is clickable to start editing
        color: "#fff",
        fontSize: 18,
        borderBottomWidth: 1,
        paddingHorizontal: 10,
        paddingVertical: 10,
        letterSpacing: 1.5
    }
});