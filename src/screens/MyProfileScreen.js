import { auth } from '../firebase/auth';
import React, { useEffect, useRef, useState } from 'react';
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { ActivityIndicator, Image, Modal, Platform, Pressable, StyleSheet, Text, TextInput, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getMediaLibraryPermissionsAsync, launchImageLibraryAsync, MediaTypeOptions, requestMediaLibraryPermissionsAsync } from "expo-image-picker";
import { manipulateAsync, SaveFormat } from "expo-image-manipulator";
import { Avatar } from "react-native-elements";
import { createUser, getUserByUID, updateUser } from '../firebase/firestore';
import { Timestamp } from "firebase/firestore";
import { getProfileImageURL, updateProfileImage } from '../firebase/storage';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

const MyProfileScreen = ({ navigation }) => {
    const window = useWindowDimensions();
    const [user, setUser] = useState(null);
    const [profileImageSource, setProfileImageSource] = useState("../../assets/images/brb-salon-academy-1080x1080-BW.jpg");
    const [isImageUploading, setIsImageUploading] = useState(false);
    const [isFieldsEditable, setIsFieldsEditable] = useState(false);
    const [firstname, setFirstname] = useState("");
    const [lastname, setLastname] = useState("");
    const [telephone, setTelephone] = useState("");
    const [modalVisible, setModalVisible] = useState(false);

    // Handler for the 'Sign Out' button
    const handleSignOut = async () => {
        try {
            setModalVisible(!modalVisible);
        } catch (error) {
            console.log(error);
        }        
    }

    // Handler for the 'Change profile image' button
    const handleEditProfileImage = async () => {
        // Check if platform is not 'web'
        if (Platform.OS !== "web"){
            // Check if user already granted access to the media library
            let permission = await getMediaLibraryPermissionsAsync();
            if (permission && !permission.granted){
                console.log("No permissions granted yet to access media library. Requesting them now...");
                permission = await requestMediaLibraryPermissionsAsync();
            }

            // Check if user granted permissions during request
            if (permission && permission.granted){
                // Launch the media library
                const pickerResult = await launchImageLibraryAsync({
                    allowsEditing: true,
                    allowsMultipleSelection: false,
                    aspect: [1, 1],
                    mediaTypes: MediaTypeOptions.Images,
                });

                // Only continue if user didn't cancel picking an image
                if (!pickerResult.cancelled){
                    const { uri } = pickerResult;
                    // Upload the image to Firebase Storage
                    try {
                        // Compress and resize the image
                        const compressedImage = await manipulateAsync(
                            uri, [{ resize: { height: 250 } }], // Resize Action
                            { compress: 1, format: SaveFormat.JPEG }    // Save options
                        );

                        setIsImageUploading(true);
                        const downloadUrl = await updateProfileImage(compressedImage.uri);
                        setProfileImageSource(downloadUrl);
                    } 
                    catch (error) {
                        throw new Error(`An error occurred when trying to upload the profile image: ${error.message}`);
                    }
                    finally {
                        setIsImageUploading(false);
                    }
                }
            }
        }
    };

    // Fetch user data of the currently logged in user
    useEffect(() => {
        (async () => {
            try {
                const [user, imageURL] = await Promise.all([getUserByUID(auth.currentUser.uid), getProfileImageURL()]);
                setUser(user);
                setProfileImageSource(imageURL);
                setFirstname(user.firstName ?? "");
                setLastname(user.lastName ?? "");
                setTelephone(user.telephone ?? "");
            } catch (error) {
                throw new Error(error.message);
            }
        })();
    }, []);
    
    // Listens to changes of the 'isFieldsEditable' field controlled by the Edit/Save button
    useEffect(() => {
        (async () => {
            // Only update the user document if the user state is defined + user clicked save + user changed values
            if (!isFieldsEditable && user && (user.firstName !== firstname || user.lastName !== lastname || user.telephone !== telephone)){
                try {
                    console.log("Changes detected to profile information. Updating profile in firestore...");
                    await updateUser(auth.currentUser.uid, firstname, lastname, telephone);
                    setUser(await getUserByUID(auth.currentUser.uid));
                } 
                catch (error) {
                    throw new Error(error.message);
                }              
            }
        })();
    }, [isFieldsEditable]);

    return (
        <SafeAreaView style={styles.container}>
            <Modal
                style={{ justifyContent: "center" }}
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(!modalVisible)}
            >
                <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#fff", opacity: 0.85 }}>
                    <Image
                        source={require("../../assets/images/brb-330x330-BW.png")}
                        style={{ height: 85, marginBottom: 15 }}
                        resizeMode='contain' />
                    <Text style={styles.logOutText}>Are you sure you want to sign out?</Text>
                    <View style={{ flexDirection: "row", width: "100%", justifyContent: "space-evenly" }}>
                        <Pressable style={{...styles.yesButton, backgroundColor: "#0f2640"}} onPress={async () => await auth.signOut()}>
                            <Text style={styles.signOutButtonLabel}>yes</Text>
                        </Pressable>
                        <Pressable style={{...styles.yesButton, backgroundColor: "gray"}} onPress={() => setModalVisible(!modalVisible)}>
                            <Text style={styles.signOutButtonLabel}>no</Text>
                        </Pressable>
                    </View>
                </View>
            </ Modal>                      
            <View style={styles.profileImageSection}>
                { isImageUploading ? 
                <View>
                    <ActivityIndicator size={'large'} color={"#fff"}/>
                    <Text style={styles.uploadingText}>Uploading...</Text>
                </View>
                 : 
                <Avatar
                    source={{ uri: profileImageSource}}
                    size={"xlarge"}
                    rounded
                    title={"No profile image"}
                    containerStyle={{
                        borderColor: "#fff",
                        borderStyle: "solid",
                        borderWidth: 2,
                    }}
                    titleStyle={{ fontSize: 15, color: "#fff" }}
                    placeholderStyle={{ backgroundColor: "#333333", opacity: 0.4 }}
                    // renderPlaceholderContent={() => (<Image
                    //     style={{...styles.profileImage, opacity: 0.5}}
                    //     source={require('../../assets/images/brb-salon-academy-1080x1080-BW.jpg')}
                    // />)}
                >
                    <Avatar.Accessory size={30} style={{ backgroundColor: "#1953b0" }} onPress={handleEditProfileImage}/>
                </Avatar>
                }
            </View>
            <View style={styles.profileInformationSection}>
                <Pressable 
                    style={{
                        ...styles.editButton,
                        width: window.width * 0.25,
                        backgroundColor: (isFieldsEditable ? "#dea15f" : "#1953b0")
                    }}
                    onPress={() => setIsFieldsEditable(!isFieldsEditable)}>
                    <Text style={styles.editButtonLabel}>{isFieldsEditable ? "Save" : "Edit"}</Text>
                    <MaterialIcons name={isFieldsEditable ? 'save' : 'edit'} size={25} color={"white"}/>
                </Pressable>
                <KeyboardAwareScrollView style={{ borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: "#fff" }}>
                    <View style={{...styles.profileInformationGroup, marginTop: 20 }}>
                        <Text style={{...styles.profileInformationLabel, color: "gray", width: window.width * 0.2 }}>E-mail</Text>
                        <TextInput
                            style={{...styles.profileInformationInput, opacity: 0.5}}
                            editable={false}
                            autoCapitalize="none"
                            keyboardType="email-address"
                            textContentType="username"
                            blurOnSubmit={false}
                            returnKeyType='done'    // changes the label of the return key to 'next'
                            value={user?.email ?? ""}
                        />
                        <MaterialIcons name='lock' size={22} style={{ marginLeft: 5 }} color={'#000'}/>
                    </View>
                    <View style={styles.profileInformationGroup}>
                        <Text style={{...styles.profileInformationLabel, color: "gray", width: window.width * 0.2 }}>Status</Text>
                        <TextInput
                            style={{...styles.profileInformationInput, opacity: 0.5}}
                            editable={false}
                            autoCapitalize="words"
                            value={user?.stateCode === 1 ? "Active" : "Inactive"}
                        />
                        <MaterialIcons name='lock' size={22} style={{ marginLeft: 5 }} color={'#000'}/>
                    </View>
                    <View style={styles.profileInformationGroup}>
                        <Text style={{...styles.profileInformationLabel, color: "gray", width: window.width * 0.2}}>Created On</Text>
                        <TextInput
                            style={{...styles.profileInformationInput, opacity: 0.5}}
                            editable={false}
                            autoCapitalize="words"
                            //onChangeText={setEmail}
                            //onSubmitEditing={() => ref_password.current.focus()}   // focuses the 'Password' text input after submitting
                            //blurOnSubmit={false}
                            returnKeyType='done'    // changes the label of the return key to 'done'
                            value={(new Timestamp(user?.createdOn?.seconds, user?.createdOn?.nanoseconds).toDate().toLocaleString())}
                        />
                        <MaterialIcons name='lock' size={22} style={{ marginLeft: 5 }} color={'#000'}/>
                    </View>
                    <View style={styles.profileInformationGroup}>
                        <Text style={{...styles.profileInformationLabel, width: window.width * 0.2, color: (isFieldsEditable ? "#fff" : "gray")}}>First Name</Text>
                        <TextInput
                            style={{...styles.profileInformationInput, opacity: (isFieldsEditable ? 1 : 0.5)}}
                            editable={isFieldsEditable}
                            autoCapitalize="words"
                            keyboardType="default"
                            textContentType="username"
                            placeholderTextColor={isFieldsEditable ? "#fff" : "gray"}
                            returnKeyType='done'    // changes the label of the return key to 'done'
                            onChangeText={setFirstname}
                            value={firstname}
                        />
                        <View style={{ marginLeft: 27 }}/>
                    </View>
                    <View style={styles.profileInformationGroup}>
                        <Text style={{...styles.profileInformationLabel, width: window.width * 0.2, color: (isFieldsEditable ? "#fff" : "gray")}}>Last Name</Text>
                        <TextInput
                            style={{...styles.profileInformationInput, opacity: (isFieldsEditable ? 1 : 0.5)}}
                            editable={isFieldsEditable}
                            autoCapitalize="words"
                            keyboardType="default"
                            textContentType="username"
                            returnKeyType='done'    // changes the label of the return key to 'done'
                            onChangeText={setLastname}
                            value={lastname}
                        />
                        <View style={{ marginLeft: 27 }}/>
                    </View>
                    <View style={styles.profileInformationGroup}>
                        <Text style={{
                            ...styles.profileInformationLabel,
                            width: window.width * 0.2,
                            color: (isFieldsEditable ? "#fff" : "gray")}}
                        >Phone</Text>
                        <TextInput
                            style={{...styles.profileInformationInput, opacity: (isFieldsEditable ? 1 : 0.5)}}
                            editable={isFieldsEditable}
                            keyboardType="numeric"
                            textContentType="telephoneNumber"
                            returnKeyType='done'    // changes the label of the return key to 'done'
                            onChangeText={setTelephone}
                            value={telephone}
                        />
                        <View style={{ marginLeft: 27 }}/>
                    </View>
                </KeyboardAwareScrollView>
            </View>
            <View style={styles.signOutSection}>
                <Pressable style={{...styles.signOutButton, width: window.width * 0.8 }} onPress={handleSignOut}>
                    <Text style={styles.signOutButtonLabel}>Sign out</Text>
                </Pressable>
            </View>
        </SafeAreaView>
    )
};

export default MyProfileScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#333333",
        alignItems: "center"
    },
    profileImageSection: {
        flex: 1,
        justifyContent: "center"
    },
    profileInformationSection: {
        flex: 3,
        justifyContent: "center",
        alignSelf: "stretch",
        paddingHorizontal: 15,
    },
    signOutSection: {
        flex: 0.5,
        justifyContent: "flex-end"
    },
    uploadingText:{
        fontSize: 18,
        color: "#fff"
    },
    editButton: {
        flexDirection: "row",
        justifyContent: "space-evenly",
        alignSelf: "flex-end",
        alignItems: "center",
        borderWidth: 2,
        borderRadius: 5,
        borderColor: "#000",
        height: 40,
        opacity: 0.8,
        marginBottom: 15
    },
    editButtonLabel:{
        fontSize: 16,
        color: "white"
    },
    profileInformationGroup: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
        marginVertical: 10
    },
    profileInformationLabel: {
        flex: 1,
        textTransform: "uppercase",
        fontWeight: "bold",
    },
    profileInformationInput: {
        flex: 2.5,
        color: "#fff",
        height: 32,
        fontSize: 16,
        fontWeight: "400",
        paddingHorizontal: 10,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: "#fff",
    },
    signOutButton: {
        justifyContent: "center",
        backgroundColor: "#1953b0",
        borderWidth: 2,
        borderRadius: 20,
        height: 40,
        opacity: 0.6
    },
    signOutButtonLabel: {
        color: "white",
        textAlign: "center",
        fontSize: 18,
        fontWeight: "500",
        textTransform: "uppercase"
    },
    logOutText: {
        fontSize: 20,
        fontWeight: "500",
        alignSelf: "center",
        marginBottom: 15
    },
    yesButton: {
        justifyContent: "center",
        backgroundColor: "#0f2640",
        height: 50,
        width: 100,
        borderRadius: 15
    },
    noButton: {
        justifyContent: "center",
        backgroundColor: "gray",
        height: 50,
        width: 50,
    }
});