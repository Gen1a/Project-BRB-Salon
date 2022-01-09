import React, { useEffect, useState } from 'react';
import { FlatList, Keyboard, Pressable, StyleSheet, Text, TextInput, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SpeedDial } from 'react-native-elements';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import DropdownSingle from '../components/DropdownSingle';
import constants from '../firebase/constants';
import { useDispatch, useSelector } from 'react-redux';
import { fetchClients, fetchClientsByName, fetchClientsByPhone } from '../store/clients/clientSlice';
import { setCurrentClientId } from '../store/clients/clientSlice';

const clientsDropdown = [
    { label: "Active Clients", value: "active", icon: "account-check-outline" },
    { label: "Inactive Clients", value: "inactive", icon: "account-clock-outline" },
    { label: "Favorite Clients", value: "favorite", icon: "account-heart-outline" },
    { label: "Recently Added Clients", value: "recentlyadded", icon: "account-star-outline" },
];

const ClientsScreen = ({ navigation }) => {
    const window = useWindowDimensions();
    const [query, setQuery] = useState("");
    const [dropdownFilter, setDropdownFilter] = useState(clientsDropdown[0].value);
    const [isSpeeddialOpen, setIsSpeeddialOpen] = useState(false);

    // REDUX
    const clientState = useSelector((state) => state.clients);
    const dispatch = useDispatch();

    useEffect(() => {
        console.log("-------------------------");
        // Get the filter defined by the dropdown
        let filter = new Map();
        switch (dropdownFilter){
            case "active":
                filter.set("statecode", constants.CLIENT_STATECODE_ACTIVE);
                break;
            case "inactive":
                filter.set("statecode", constants.CLIENT_STATECODE_INACTIVE);
                break;
            case "favorite":
                filter.set("isfavorite", true);
                break;
            case "recentlyadded":
                console.warn("Recently added case not added yet! Filtering Active Clients.");
                filter.set("statecode", constants.CLIENT_STATECODE_ACTIVE);
                break;
            default:
                console.warn("No dropdownfilter defined!");
                break;
        }

        // Get the query defined in the search text input
        // If query is empty => get all clients with dropdown filter
        if (query === ""){
            try {
                dispatch(fetchClients(filter));
            } catch (error) {
                throw new Error(`An error occurred when trying to render clients: ${error.message}`);
            }
        }
        // If query is a number => query the telephone numbers with dropdown filter
        else if (!Number.isNaN(query) && Number.isInteger(Number.parseFloat(query))){
            try {
                dispatch(fetchClientsByPhone({ query: query, filter: filter}));
            } catch (error) {
                throw new Error(`An error occurred when trying to render clients filtered by phone: ${error.message}`);
            }
        }
        // If query is a string => query the firstname and lastname with dropdown filter
        else if (query.length >= 1){
            try {
                dispatch(fetchClientsByName({ query: query, filter: filter}));
            } catch (error) {
                throw new Error(`An error occurred when trying to render clients filtered by name : ${error.message}`);
            }
        }
    }, [dispatch, query, dropdownFilter]);

    // NON-REDUX
    // Load all clients on mount of the Clients Screen + Fetch Clients if users enters a search query in the input field
    //useEffect(() => {
    //     (async () => {
    //         console.log("---------------------");
    //         console.log(`query value: ${query}`);
    //         console.log(`dropdownFilter: ${dropdownFilter}`);

    //         return;
    //         let clientsData = [];
    //         let filter = new Map();
    //         switch (dropdownFilter){
    //             case "active":
    //                 filter.set("statecode", constants.CLIENT_STATECODE_ACTIVE);
    //                 break;
    //             case "inactive":
    //                 filter.set("statecode", constants.CLIENT_STATECODE_INACTIVE);
    //                 break;
    //             case "favorite":
    //                 filter.set("isfavorite", true);
    //                 break;
    //             case "recentlyadded":
    //                 console.warn("Recently added case not added yet! Filtering Active Clients.");
    //                 filter.set("statecode", constants.CLIENT_STATECODE_ACTIVE);
    //                 break;
    //             default:
    //                 console.warn("No dropdownfilter defined!");
    //                 break;
    //         }
    //         // If query is empty => get all clients with dropdown filter
    //         if (query === ""){
    //             try {
    //                 clientsData = await getAllClients(filter);
    //             } catch (error) {
    //                 throw new Error(`An error occurred when trying to render all the clients: ${error.message}`);
    //             }
    //         }
    //         // If query is a number => query the telephone numbers with dropdown filter
    //         else if (!Number.isNaN(query) && Number.isInteger(Number.parseFloat(query))){
    //             try {
    //                 clientsData = await getClientsByPhone(query, filter);
    //             } catch (error) {
    //                 throw new Error(`An error occurred when trying to render all the clients: ${error.message}`);
    //             }
    //         }
    //         // If query is a string => query the firstname and lastname with dropdown filter
    //         else if (query.length >= 1){
    //             try {
    //                 clientsData = await getClientsByName(query, filter);
    //             } catch (error) {
    //                 throw new Error(`An error occurred when trying to render the clients filtered by the query: ${error.message}`);
    //             }
    //         }

    //         // Set the data for the SectionList
    //         if (clientsData.length === 0){
    //             setClients([]);
    //         }
    //         else {
    //             setClients(clientsData.map((doc) => ({
    //                 id: doc.id,
    //                 data: doc.data()
    //             })));
    //         }
    //     })();
    //     // Cleanup
    // }, [query, dropdownFilter]);

    const clientItemOnPress = (clientId) => {
        dispatch(setCurrentClientId(clientId));
        navigation.navigate("ClientProfile", { clientId: clientId });
    } 

    // Client Item in the FlatList
    const ClientItem = ({ id, client }) => (
        <Pressable style={styles.clientItem} onPress={() => clientItemOnPress(id)}>
            <Text style={styles.clientName}>{client.firstname} {client.lastname}</Text>
            <View style={{ flexDirection: "row", marginVertical: 5 }}>
                <MaterialCommunityIcons style={{ marginRight: 5, paddingTop: 2 }} name='email-outline' size={16}/>
                <Text style={styles.clientEmail}>{client.email}</Text>
            </View>
            <View style={{ flexDirection: "row", justifyContent: "flex-start", marginVertical: 5 }}>
                <View style={{ flexDirection: "row", minWidth: window.width / 2 }} >
                    <MaterialCommunityIcons style={{ marginRight: 5, paddingTop: 2 }} name='cellphone' size={16}/>
                    <Text style={styles.clientTelephone}>{client.telephone}</Text>
                </View>
                <View style={{ flexDirection: "row" }}>
                    <MaterialCommunityIcons style={{ marginRight: 5, paddingTop: 2 }} name='phone-classic' size={16}/>
                    <Text style={styles.clientTelephone}>{client.telephone2}</Text>
                </View>
            </View>
        </Pressable>
    );

    // Seperator in the FlatList
    const ClientSeperator = () => (
        <View style={styles.clientSeperator}></View>
    );

    return (
        <SafeAreaView style={styles.container} edges={['right', 'left', 'top']}>
            <View style={{...styles.searchSection, width: window.width * 0.95 }}>
                <TextInput
                    style={{...styles.searchInput, maxWidth: window.width * 0.75 }}
                    autoCapitalize='none'
                    //clearButtonMode='always'
                    keyboardType='default'
                    returnKeyType='search'
                    maxLength={50}
                    onChangeText={setQuery}
                    placeholder='Enter a name to start searching'
                    placeholderTextColor={'#c9c9c9'}
                    value={query}
                    onSubmitEditing={() => Keyboard.dismiss()}
                />
                <MaterialCommunityIcons
                    style={{...styles.searchIcon}}
                    name={'account-search-outline'}
                    size={40}
                    color={"#000"}
                />
            </View>
            <View style={styles.clientsSection}>
                <View>
                    <DropdownSingle 
                        dropdownData={clientsDropdown}
                        onChangeHandler={setDropdownFilter}
                    />
                </View>
                { clientState.clients.length === 0 ?
                    <Text style={{ marginTop: 10, color: "#fff" }}>No clients found</Text> :
                    <FlatList
                        //data={clients}
                        data={clientState.clients}
                        renderItem={({ item, index, seperators }) => <ClientItem client={item.data} id={item.id} />}
                        keyExtractor={item => item.id}
                        ItemSeparatorComponent={ClientSeperator}
                    />
                }
            </View>
            <SpeedDial
                color='#0f2640'
                isOpen={isSpeeddialOpen}
                size='large'
                icon={{ name: 'edit', color: '#fff' }}
                openIcon={{ name: 'close', color: '#fff' }}
                onOpen={() => setIsSpeeddialOpen(!isSpeeddialOpen)}
                onClose={() => setIsSpeeddialOpen(!isSpeeddialOpen)}
            >
                <SpeedDial.Action
                    color='#0f2640'
                    icon={{ type: 'material', name: 'person-add', color: '#fff' }}
                    title="Add Client"
                    onPress={() => console.log('Adding a client')}
                />
            </SpeedDial>
        </SafeAreaView>
    )
};

export default ClientsScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#333333",
        paddingTop: 10,
        paddingHorizontal: 10,
    },
    searchSection: {
        flex: 1,
        flexDirection: "row",
        marginTop: 10,
        alignItems: "center",
        justifyContent: "space-between",
        borderWidth: 1,
        borderColor: "#000",
        borderRadius: 15,
        backgroundColor: "#7d7d7d"
    },
    clientsSection: {
        flex: 10,
        //alignItems: "flex-start"
    },
    searchInput: {
        flex: 1,    // flex 1 makes sure the entire textinput is clickable to start editing
        fontSize: 18,
        marginLeft: 15,
        paddingVertical: 20,
        color: "white"
    },
    searchIcon: {
        marginHorizontal: 8,
        borderColor: "#000",
        borderRadius: 10,
        padding: 3
    },
    clientItem: {
        //backgroundColor: "#f0f0f0",
        backgroundColor: "#c9c9c9",
        marginVertical: 5,
        marginHorizontal: 5,
        padding: 10,
        borderWidth: StyleSheet.hairlineWidth,
        borderRadius: 15,
        opacity: 1
    },
    clientSeperator: {
        // borderColor: "#000",
        // borderWidth: StyleSheet.hairlineWidth,
    },
    clientName: {
        fontSize: 20,
        fontWeight: "500"
    },
    clientEmail: {
        opacity: 0.7,
        fontSize: 16
    },
    clientTelephone: {
        opacity: 0.7,
        fontSize: 16
    }
});