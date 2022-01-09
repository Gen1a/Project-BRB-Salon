import React from 'react';
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';

const LoadingScreen = () => {
    return (
        <View style={styles.container}>
            <ActivityIndicator size={"large"} color="#000"/>
            <Text>Loading...</Text>
        </View>
    )
};

export default LoadingScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
        justifyContent: "center",
        alignItems: "center"
    }
});
