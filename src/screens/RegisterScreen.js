import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import React, { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View, TextInput, Image, Pressable } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { auth } from '../firebase/auth';
import { createUser } from '../firebase/firestore';

const RegisterScreen = ({ navigation }) => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastname] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [repeatPassword, setRepeatPassword] = useState("");
    const [isSigningUp, setIsSigningUp] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    // Define references for the text input fields to optimise UX
    const ref_lastName = useRef();
    const ref_email = useRef();
    const ref_password = useRef();
    const ref_repeatPassword = useRef();

    useEffect(() => {
        return setIsSigningUp(false);
    }, []);

    const handleSignUp = async () => {
        console.log("Sign Up button clicked...");

        setErrorMessage("");
        setIsSigningUp(true);

        try {
            if (!email || !password || !repeatPassword){
                setErrorMessage("Please fill in the required fields before signing up.");
            }
            else if (password !== repeatPassword) {
                setErrorMessage("The passwords don't match! Please try again.");
            }
            else {
                // Try to create a user with the specified e-mail and password
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                if (userCredential){
                    // Log user out
                    console.log("Signout out user...");
                    await auth.signOut();

                    // Send an e-mail verification to the specified e-mail address
                    console.log("Sending e-mail verification...");
                    await sendEmailVerification(userCredential.user);

                    // Create a new user document in the users collection
                    await createUser(userCredential.user.uid, firstName, lastName, email);

                    navigation.navigate("VerifyEmail");
                }
            }

            setIsSigningUp(false);
        } catch (error) {
            setErrorMessage(`An error occurred when trying to sign up (${error.code})`);
        }
    };

    const handleSignIn = () => {
        console.log("Sign In button clicked...");
        navigation.navigate("Login");
    }

    return (
        <KeyboardAwareScrollView style={styles.container}>
            <Image
                style={styles.brbLogo}
                source={require("../../assets/images/brb-salon-academy-1080x1080-BW.jpg")}
                resizeMode="contain" 
            />
            <Text style={styles.errorMessage}>{errorMessage}</Text>
            <View style={styles.registerForm}>
                <Text style={styles.inputLabel}>First Name</Text>
                <TextInput
                    style={styles.input}
                    clearButtonMode="always"
                    keyboardType="default"
                    onChangeText={setFirstName}
                    textContentType="name"
                    value={firstName}
                    onSubmitEditing={() => ref_lastName.current.focus()}   // focuses the 'Last Name' text input after submitting
                    blurOnSubmit={false}
                    returnKeyType='next'    // changes the label of the return key to 'next'
                />
                <Text style={styles.inputLabel}>Last Name</Text>
                <TextInput
                    style={styles.input}
                    clearButtonMode="always"
                    keyboardType="default"
                    onChangeText={setLastname}
                    textContentType="name"
                    value={lastName}
                    onSubmitEditing={() => ref_email.current.focus()}   // focuses the 'E-mail' text input after submitting
                    blurOnSubmit={false}
                    returnKeyType='next'    // changes the label of the return key to 'next'
                    ref={ref_lastName}
                />
                <Text style={styles.inputLabel}>E-Mail <Text style={{ color: "red", fontWeight: "400"}}>*</Text></Text>
                <TextInput
                    style={styles.input}
                    autoCapitalize="none"
                    clearButtonMode="always"
                    keyboardType="email-address"
                    onChangeText={setEmail}
                    textContentType="emailAddress"
                    value={email}
                    onSubmitEditing={() => ref_password.current.focus()}   // focuses the 'Password' text input after submitting
                    blurOnSubmit={false}
                    returnKeyType='next'    // changes the label of the return key to 'next'
                    ref={ref_email}
                />
                <Text style={styles.inputLabel}>Password <Text style={{ color: "red", fontWeight: "400"}}>*</Text></Text>
                <TextInput
                    style={styles.input}
                    clearButtonMode="always"
                    onChangeText={setPassword}
                    textContentType='password'
                    secureTextEntry={true}
                    value={password}
                    onSubmitEditing={() => ref_repeatPassword.current.focus()}   // focuses the 'Repeat Password' text input after submitting
                    blurOnSubmit={false}
                    returnKeyType='next'    // changes the label of the return key to 'next'
                    ref={ref_password}
                />
                <Text style={styles.inputLabel}>Repeat password <Text style={{ color: "red", fontWeight: "400"}}>*</Text></Text>
                <TextInput
                    style={styles.input}
                    clearButtonMode="always"
                    onChangeText={setRepeatPassword}
                    textContentType='password'
                    secureTextEntry={true}
                    value={repeatPassword}
                    blurOnSubmit={true}
                    ref={ref_repeatPassword}
                />
                <Pressable
                    // Dynamically set the button background color
                    style={() => [
                        styles.signUpButton,
                        {
                            backgroundColor: (email && password && repeatPassword) ? "black" : "lightgray",
                        }
                    ]}
                    onPress={handleSignUp}
                    // Disable the button if e-mail and password fields are empty
                    disabled={!email || !password || !repeatPassword}>
                    <Text style={styles.signUpButtonText}>{isSigningUp ? <ActivityIndicator size={"small"} color={"white"}/> : "Register"}</Text>
                </Pressable>
            </View>
            <Text style={{ textAlign: "center" }}>
                Already have an account? <Text style={styles.signUpText} onPress={handleSignIn}>Log In</Text>
            </Text>
        </KeyboardAwareScrollView>
    )
}

export default RegisterScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
        marginTop: 40
    },
    brbLogo: {
        width: 180,
        height: 180,
        alignSelf: "center",
        borderRadius: 25,
        opacity: 0.75,
        borderWidth: 1
    },
    errorMessage: {
        fontSize: 16,
        textAlign: "center",
        color: "darkred",
        marginHorizontal: 20,
        marginVertical: 10
    },
    registerForm: {
        marginHorizontal: 25,
        marginVertical: 20
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        textAlign: "center",
        marginVertical: 20
    },
    inputLabel: {
        textTransform: "uppercase",
        color: "gray"
    },
    input: {
        height: 40,
        fontSize: 18,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: "#000",
        marginBottom: 10
    },
    signUpButton: {
        justifyContent: "center",
        alignItems: "center",
        marginVertical: 10,
        height: 50,
        borderRadius: 15,
    },
    signUpButtonText:{
        color: "white",
        fontSize: 16,
        fontWeight: "bold",
        letterSpacing: 2.5,
        textTransform: "uppercase",
    },
    signUpText: {
        textDecorationLine: "underline", 
        fontSize: 15, 
        fontWeight: "400",
        padding: 20     // to increase the touch area of the Text onpress
    },
});
