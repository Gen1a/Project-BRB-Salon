import React, { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const DropdownSingle = ({ dropdownData, onChangeHandler }) => {
    const [dropdownValue, setDropdownValue] = useState(dropdownData[0].value);
    const [dropdownIcon, setDropdownIcon] = useState(dropdownData[0].icon);
    //const [isFocus, setIsFocus] = useState(false);

    const DropdownItem = (item) => {
        return (
            <View style={styles.dropdownItem}>
                { item.icon && <MaterialCommunityIcons name={item.icon} size={25} color={"#d1d1d1"} />}
                <Text style={styles.dropdownLabel}>{item.label}</Text>
            </View>
        )
    }

    return (
        <Dropdown
            // REQUIRED
            data={dropdownData}
            labelField="label"  // name of the label field in data array
            valueField="value"  // name of the value field in data array
            onChange={item => {
                setDropdownValue(item.value);
                setDropdownIcon(item.icon);
                //setIsFocus(false);
                onChangeHandler(item.value);
            }}
            // OPTIONAL
            dropdownPosition='bottom'
            renderItem={DropdownItem}
            renderLeftIcon={() => (<MaterialCommunityIcons name={dropdownIcon} color={"#fff"} size={28} />)}
            style={styles.dropdown} // container view
            containerStyle={styles.dropdownContainer}   // container view
            selectedTextStyle={styles.selectedTextStyle}    // style for currently selected text
            activeColor='#0f2640'  // background color of selected item in dropdown
            value={dropdownValue}
            search={false}
            //onFocus={() => setIsFocus(true)}
            //onBlur={() => setIsFocus(false)}
            maxHeight={styles.dropdownItem.height * (dropdownData.length) * 1.4 }
            iconColor='#fff'    // color for arrow icon on right side
        />
    )
}

export default DropdownSingle;

const styles = StyleSheet.create({
    dropdown: {
        height: 40,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderColor: "#fff",
        marginVertical: 10,
        paddingBottom: 5
    },
    dropdownContainer: {
        borderBottomLeftRadius: 15,
        borderBottomRightRadius: 15,
        backgroundColor: "#7d7d7d",
        color: "#000"
    },
    selectedTextStyle: {
        color: "#fff",
        fontSize: 20,
        letterSpacing: 1,
        paddingLeft: 15,
    },
    dropdownItem: {
        flexDirection: "row",
        alignItems: "center",
        height: 40,
        marginVertical: 5,
        paddingLeft: 10
    },
    dropdownLabel: {
        fontSize: 20,
        marginLeft: 15,
        color: "#d1d1d1"
    },
});
