import React from 'react';
import { StyleSheet, Text, View, Image, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthContext } from '../contexts/AuthProvider';

const VerifyEmailScreen = ({ navigation }) => {

    const { user } = useAuthContext();

    return (
        <SafeAreaView style={styles.container}>
            <Image
                style={styles.brbLogo}
                source={require("../../assets/images/brb-salon-academy-1080x1080-BW.jpg")}
                resizeMode="contain" 
            />
            <View style={styles.verifyEmail}>
                <Text style={styles.verifyEmailText}>Great, you're almost ready to start using the BRB Salon - Academy App!
                {"\n"}
                {"\n"}
                All you need to do now is confirm the verification e-mail that was sent to {user?.email ?? "your e-mail address"} and sign in to the app.</Text>
            </View>
            <Pressable
                    // Dynamically set the button background color
                    style={styles.signInButton}
                    onPress={() => navigation.navigate("Login")}>
                    <Text style={styles.signInButtonText}>Go back to the Sign In screen</Text>
                </Pressable>
        </SafeAreaView>
    )
};

export default VerifyEmailScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
        marginTop: 15
    },
    brbLogo: {
        width: 180,
        height: 180,
        alignSelf: "center",
        borderRadius: 25,
        opacity: 0.75,
        borderWidth: 1
    },
    verifyEmail: {
        justifyContent: "center",
        alignItems: "center",
        margin: 40,
        borderBottomWidth: 2,
        borderTopWidth: 2,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        borderBottomRightRadius: 20,
        borderBottomLeftRadius: 20,
        padding: 15
    },
    verifyEmailText: {
        fontSize: 18,
        textAlign: "center",
    },
    signInButton: {
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "black",
        marginVertical: 10,
        height: 50,
        borderRadius: 15,
        marginHorizontal: 25
    },
    signInButtonText: {
        color: "white",
        fontSize: 14,
        fontWeight: "bold",
        letterSpacing: 2.5,
        textTransform: "uppercase",
    },
});
