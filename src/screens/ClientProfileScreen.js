import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, useWindowDimensions, Image } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import InputGroup from '../components/InputGroup';
import { getClientByUID, updateClient } from '../firebase/firestore';
import { Icon } from 'react-native-elements';
import DropdownSingle from '../components/DropdownSingle';
import constants from '../firebase/constants';
import { ClientFactory } from '../models/Client';
import { updateClientData } from '../store/clients/clientSlice';

const clientProfileDropdownData = [
    { label: "Client Information", value: "clientinfo", icon: "account-circle-outline" },
    { label: "Haircut Information", value: "haircutinfo", icon: "hair-dryer-outline" },
    { label: "Appointments", value: "appointments", icon: "calendar-month-outline" },
    { label: "Notes", value: "notes", icon: "note-outline" },
];

const ClientProfileScreen = ({ route, navigation }) => {
    const dispatch = useDispatch();
    const { height, width } = useWindowDimensions();
    const { clientId } = route.params;
    //const [client, setClient] = useState(null);
    const [email, setEmail] = useState("");
    const [firstname, setFirstname] = useState("");
    const [lastname, setLastname] = useState("");
    const [jobtitle, setJobtitle] = useState("");
    const [telephone, setTelephone] = useState("");
    const [telephone2, setTelephone2] = useState("");
    const [isFavorite, setIsFavorite] = useState(false);
    const [isActive, setIsActive] = useState(false);
    const [dropdownFilter, setDropdownFilter] = useState("");

    // REDUX
    //const clientId = useSelector(state => state.clients.currentClientId);
    const currentClient = useSelector((state) => state.clients.clients.find(x => x.id === clientId));

    useEffect(() => {
        console.log("--------------------");
        if (currentClient?.data) {
            const {firstname, lastname, email, telephone, telephone2, jobtitle, statecode, isfavorite} = currentClient.data;
            setFirstname(firstname);
            setLastname(lastname);
            setEmail(email);
            setJobtitle(jobtitle);
            setTelephone(telephone);
            setTelephone2(telephone2);
            setIsFavorite(isfavorite ?? false);
            setIsActive(statecode === constants.CLIENT_STATECODE_ACTIVE);
        }
    }, []);

    // useEffect(() => {
    //     (async () => {
    //         const {firstname, lastname, email, telephone, telephone2, jobtitle, statecode, isfavorite} = await getClientByUID(clientId);
    //         //setClient(await getClientByUID(clientId));

    //         setFirstname(firstname);
    //         setLastname(lastname);
    //         setEmail(email);
    //         setJobtitle(jobtitle);
    //         setTelephone(telephone);
    //         setTelephone2(telephone2);
    //         setIsFavorite(isfavorite ?? false);
    //         setIsActive(statecode === constants.CLIENT_STATECODE_ACTIVE);
    //     })();
    // }, []);

    return (
        <SafeAreaView style={styles.container} edges={["left", "right"]}>
            <View style={styles.clientProfileHeaderSection}>
                <Image source={require("../../assets/images/brb-330x330-BW.png")} style={styles.brbImage} />
                <View style={styles.clientNameSection}>
                    <Text style={styles.clientName}>{firstname} {lastname}</Text>
                    <Icon
                        type="material"
                        name={isFavorite ? 'favorite' : 'favorite-outline'}
                        color={isFavorite ? "red" : "#fff"}
                        size={25}
                        onPress={() => {
                            updateClient(clientId, { isfavorite: !isFavorite});
                            setIsFavorite(!isFavorite);
                        }}
                    />
                </View>
            </View>
            <DropdownSingle 
                dropdownData={clientProfileDropdownData}
                onChangeHandler={setDropdownFilter}
            />
            <View style={styles.clientProfileContentSection}>
                <KeyboardAwareScrollView>
                    <InputGroup label="first name" keyboardType={"default"} value={firstname} changeHandler={setFirstname}
                        updateHandler={() => dispatch(updateClientData({id: clientId, data: new ClientFactory({ firstname: firstname})}))} />
                    <InputGroup label="last name" keyboardType={"default"} value={lastname} changeHandler={setLastname}
                        updateHandler={() => dispatch(updateClientData({id: clientId, data: new ClientFactory({ lastname: lastname})}))} />
                    <InputGroup label="email" keyboardType={"email-address"} value={email} changeHandler={setEmail} 
                        updateHandler={() => dispatch(updateClientData({id: clientId, data: new ClientFactory({ email: email})}))} />
                    <InputGroup label="jobtitle" keyboardType={"default"} value={jobtitle} changeHandler={setJobtitle}
                        updateHandler={() => dispatch(updateClientData({id: clientId, data: new ClientFactory({ jobtitle: jobtitle})}))} />
                    <InputGroup label="mobile phone" keyboardType={"phone-pad"} value={telephone} changeHandler={setTelephone} 
                        updateHandler={() => dispatch(updateClientData({id: clientId, data: new ClientFactory({ telephone: telephone})}))} />
                    <InputGroup label="office phone" keyboardType={"phone-pad"} value={telephone2} changeHandler={setTelephone2} 
                        updateHandler={() => dispatch(updateClientData({id: clientId, data: new ClientFactory({ telephone2: telephone2})}))} />
                    <InputGroup label="active client?" keyboardType={"default"} value={isActive} editable={false}/>
                </KeyboardAwareScrollView>
            </View>
        </SafeAreaView>
    )
};

export default ClientProfileScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#333333",
        paddingHorizontal: 10,
    },
    clientProfileHeaderSection: {
        backgroundColor: "#0f2640",
        alignItems: "center",
        borderColor: "#adadad",
        borderRadius: 15,
        borderWidth: 2,
        marginTop: 10,
        opacity: 1,
    },
    clientProfileContentSection: {
        flex: 6,
        //borderColor: "#adadad",
        borderWidth: 1,
        borderRadius: 15,
        paddingVertical: 10,
        //margin: 10,
    },
    brbImage: {
        marginVertical: 5,
        width: 85,
        height: 85,
        opacity: 0.75,
        borderColor: "#000",
        borderWidth: 3,
        borderRadius: 10,
    },
    clientNameSection: {
        flexDirection: "row",
        marginVertical: 10
    },
    clientName: {
        color: "#fff",
        textAlign: "center",
        fontSize: 22,
        fontWeight: "600",
        letterSpacing: 3,
        marginRight: 5
    },
});
