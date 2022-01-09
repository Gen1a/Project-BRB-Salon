import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from "react-native-vector-icons/Ionicons";

const AnalyticsScreen = () => {

    return (
        <SafeAreaView style={styles.container}>
            <Text style={{ color: "#fff", fontSize: 22 }}>Analytics Screen</Text>
            <Ionicons name={'construct-outline'} size={75} color={"#fff"} />
            <Text style={{ color: "#fff"}}>Under Construction</Text>
        </SafeAreaView>
    )
};

export default AnalyticsScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#333333",
        justifyContent: "center",
        alignItems: "center"
    }
});