import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from "react-native-vector-icons/Ionicons";

const AppointmentsScreen = () => {
    return (
        <SafeAreaView style={styles.container}>
            <Text style={{ color: "#fff", fontSize: 22 }}>Appointments Screen</Text>
            <Ionicons name={'construct-outline'} size={75} color={"#fff"} />
            <Text style={{ color: "#fff"}}>Under Construction</Text>
        </SafeAreaView>
    )
};

export default AppointmentsScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#333333",
        justifyContent: "center",
        alignItems: "center"
    }
});
