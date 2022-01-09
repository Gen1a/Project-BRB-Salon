import { signInWithEmailAndPassword } from 'firebase/auth';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Image, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { auth } from '../firebase/auth';

const LoginScreen = ({ navigation }) => {
    // Define state for email and password input fields
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    // Set a state to define the label of the Sign In button
    const [isSigningIn, setIsSigningIn] = useState(false);

    // Define references for the text input fields to optimise UX
    const ref_password = useRef();

    useEffect(() => {
        return () => {
            setIsSigningIn(false);
        }
    }, []);

    const handleSignIn = async () => {
        console.log("Sign In button clicked...");
        // Clear any error messages
        setErrorMessage("");
        setIsSigningIn(true);

        try {
            if (!email && !password){
                setErrorMessage("Unable to sign in.\nPlease fill in an e-mail address and a password and try again.");
            }
            else if (!email){
                setErrorMessage("Unable to sign in.\nPlease fill in an e-mail address and try again.");
            }
            else if (!password){
                setErrorMessage("Unable to sign in.\nPlease fill in a password and try again.");
            }
            else if (email && password){
                const userCredential = await signInWithEmailAndPassword(auth, email, password);
                if (userCredential){
                    setIsSigningIn(false);
                    // Show error message if user hasn't verified the e-mail address yet
                    if (!userCredential.user.emailVerified){
                        setErrorMessage("Unable to sign in. Please verify your e-mail address and try again.");
                    }
                    console.log(userCredential.user.emailVerified);
                }
            }
        } catch (error) {
            setErrorMessage(`An error occurred when trying to sign you in (${error.code})`);
            setIsSigningIn(false);
        }      
    }

    const handleSignUp = () => {
        console.log("Sign Up button clicked...");
        navigation.navigate("Register");
    }

    return (
        <SafeAreaView style={styles.container}>
            <Image
                style={styles.brbLogo}
                source={require("../../assets/images/brb-salon-academy-1080x1080-BW.jpg")}
                resizeMode="contain" 
            />
            <Text style={styles.greeting}>Hello, we're glad to have you back!</Text>
            <Text style={styles.errorMessage}>{errorMessage}</Text>

            <View style={styles.loginForm}>
                <Text style={styles.inputLabel}>E-mail</Text>
                <TextInput
                    style={styles.input}
                    autoCapitalize="none"
                    clearButtonMode="always"
                    keyboardType="email-address"
                    textContentType="username"
                    onChangeText={setEmail}
                    onSubmitEditing={() => ref_password.current.focus()}   // focuses the 'Password' text input after submitting
                    blurOnSubmit={false}
                    returnKeyType='next'    // changes the label of the return key to 'next'
                    value={email}
                />
                <Text style={styles.inputLabel}>Password</Text>
                <TextInput
                    style={styles.input}
                    clearButtonMode="always"
                    textContentType='password'
                    secureTextEntry={true}
                    onChangeText={setPassword}
                    value={password}
                    ref={ref_password}
                />
                <Pressable
                    // Dynamically set the button background color
                    style={() => [
                        styles.signInButton,
                        {
                            backgroundColor: (email && password) ? "black" : "lightgray",
                        }
                    ]}
                    onPress={handleSignIn}
                    // Disable the button if e-mail and password fields are empty
                    disabled={!email || !password || isSigningIn}>
                    <Text style={styles.signInButtonText}>{isSigningIn ? <ActivityIndicator size={"small"} color={"white"}/> : "Log In"}</Text>
                </Pressable>
            </View>
            <Text style={{ textAlign: "center" }}>
                Don't have an account yet? <Text style={styles.signUpText} onPress={handleSignUp}>Register</Text>
            </Text>
        </SafeAreaView>
    )
}

export default LoginScreen;

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
    greeting: {
        marginTop: 20,
        marginBottom: 20,
        fontSize: 20,
        fontWeight: "bold",
        textAlign: "center",
    },
    errorMessage: {
        fontSize: 16,
        textAlign: "center",
        color: "darkred",
        marginHorizontal: 20,
    },
    loginForm: {
        marginHorizontal: 25,
        marginVertical: 20
    },
    inputLabel: {
        textTransform: "uppercase",
        color: "gray"
    },
    input: {
        height: 45,
        fontSize: 18,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: "#000",
        marginBottom: 10
    },
    signInButtonText: {
        color: "white",
        fontSize: 16,
        fontWeight: "bold",
        letterSpacing: 2.5,
        textTransform: "uppercase",
    },
    signInButton: {
        justifyContent: "center",
        alignItems: "center",
        marginVertical: 10,
        height: 50,
        borderRadius: 15,
    },
    signUpText: {
        textDecorationLine: "underline", 
        fontSize: 15, 
        fontWeight: "400",
        padding: 20     // to increase the touch area of the Text onpress
    },
});