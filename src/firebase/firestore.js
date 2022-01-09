import { firestore } from "./index";
import { collection, doc, getDoc, getDocs, orderBy, query, setDoc, Timestamp, updateDoc, where } from "firebase/firestore";
import CONSTANTS from "./constants";
import { formatFirstName, formatLastName, transformTelephoneToArray } from "./converters";
import { UserFactory } from "../models/User";
import { ClientFactory } from "../models/Client";
import constants from "./constants";

//#region USERS
export const createUser = async (uid, firstname, lastname, email, telephone) => {
    if (!uid) {
        console.log("Cant'create a new user without a UID! Returning...");
        return;
    }

    console.log(`Creating new user...`);
    const user = {
        ...new UserFactory(uid, firstname, lastname, email, telephone),
        createdOn: Timestamp.now(),
        modifiedOn: Timestamp.now(),
        stateCode: CONSTANTS.USER_STATECODE_ACTIVE
    };
    try {
        await setDoc(doc(firestore, "users", uid), user);
    } catch (error) {
        throw new Error(`An error occurred when trying to create a new user document: ${error.message}`);
    }
};

export const getUserByUID = async (uid) => {
    console.log(`Getting user with UID ${uid}...`);

    try {
        const usersRef = doc(firestore, "users", uid);
        const usersSnap = await getDoc(usersRef);
        if (usersSnap.exists()){
            return usersSnap.data();
        }
        else{
            console.log("User doc not found");
        }
    } catch (error) {
        throw new Error(`An error occurred when trying to get the current user document: ${error.message}`);
    }
};

export const updateUser = async (uid, firstname, lastname, telephone) => {
    console.log(`Updating user with UID ${uid}...`);

    const userData = new UserFactory(uid, firstname, lastname, telephone);
    console.log(userData);

    try {
        const usersRef = doc(firestore, "users", uid);
        await updateDoc(usersRef, userData);
    } catch (error) {
        throw new Error(`An error occurred when trying to update the user document: ${error.message}`);
    }
};
//#endregion

//#region CLIENTS
export const createClient = async (firstName, lastName, email, telephone, telephone2, birthdate, jobTitle) => {
    console.log("Creating new client...");
    const clientData = {
        firstname: firstName,
        lastname: lastName,
        email: email,
        telephone: telephone,
        telephone2: telephone2,
        birthdate: birthdate,
        jobtitle: jobTitle
    };

    try {
        await setDoc(doc(firestore, "clients"), clientData);
    } catch (error) {
        throw new Error(`An error occurred when trying to create a new client document: ${error.message}`);
    }
}

/**
 * @param {*} filter A Map of fields - values to filter by.
 * @returns A array of QueryDocumentSnapshots of client documents.
 */
export const getAllClients = async (filter) => {
    console.log(`Fetching clients with ${filter.size} filter(s)...`);

    const q = buildQuery("clients", filter);
    if (!q) {
        console.log("Unable to build a query for the client collection...");
        return [];
    }    

    try {
        const querySnapshot = await getDocs(q);
        if (querySnapshot.empty){
            console.log("No clients found in firestore");
            return [];
        }
        else{
            console.log(querySnapshot.size + " clients found");
            return querySnapshot.docs;
        }
    } catch (error) {
        throw new Error(`An error occurred when trying to get the 'clients' collection: ${error.message}`);
    }
}

export const getClientsByName = async (name, filter) => {
    console.log(`Fetching all clients by name firstname '${formatFirstName(name)}' or lastname '${formatLastName(name)}'`);
    if (!name){
        return await getAllClients(filter);
    }
    else {
        let clientsData = [];
        try {
            const clientsRef = collection(firestore, "clients");
            // Get the QueryConstraint for the filter (eg. Active, Inactive, Favorite...)
            const [field, value] = filter.entries().next().value;
            const filterConstraint = buildQueryConstraint("clients", field, value);

            // Define query for firstname
            const firstnameQuery = query(clientsRef,
                filterConstraint,
                where("firstname", ">=", formatFirstName(name)),
                where("firstname", "<=", formatFirstName(name) + "\uf7ff"));
            const firstnameQuerySnapshot = getDocs(firstnameQuery);
    
            // Define query for lastname
            const lastnameQuery = query(clientsRef,
                filterConstraint,
                where("lastname", ">=", formatLastName(name)),
                where("lastname", "<=", formatLastName(name) + "\uf7ff"));
            const lastnameQuerySnapshot = getDocs(lastnameQuery);
            
            // Execute the query
            const results = await Promise.all([firstnameQuerySnapshot, lastnameQuerySnapshot]); // returns an array of QuerySnapshots
            if (results.length === 0) return [];
            else {
                results.forEach(querySnapshot => {
                    if (!querySnapshot.empty){
                        // Loop over the array of QueryDocumentSnapshots
                        querySnapshot.docs.forEach(qds => {
                            // Only push unique documents (eg. when querying Pieter Pieters) to ensure unique ID
                             if (!clientsData.find(x => x.id === qds.id)) {
                                clientsData.push(qds);
                            }
                        });
                    }
                });

                return clientsData;
            }
        } catch (error) {
            throw new Error(`An error occurred when trying to query clients by firstname and lastname: ${error.message}`);
        }
    }
}

export const getClientsByPhone = async (telephone, filter) => {
    console.log(`Fetching all clients by phone ${telephone}`);

    let clientsData = [];
    try {
        // Define query for telephone
        filter.set("telephone", telephone);
        const telephoneQuery = buildQuery("clients", filter);
        const telephoneQuerySnapshot = getDocs(telephoneQuery);

        // Define query for telephone2
        filter.delete("telephone");
        filter.set("telephone2", telephone);
        const telephone2Query = buildQuery("clients", filter);
        const telephone2QuerySnapshot = getDocs(telephone2Query);
        
        // Execute the query
        const results = await Promise.all([telephoneQuerySnapshot, telephone2QuerySnapshot]); // returns an array of QuerySnapshots
        if (results.length === 0) return [];
        else {
            results.forEach(querySnapshot => {
                if (!querySnapshot.empty){ 
                    // Loop over the array of QueryDocumentSnapshots
                    querySnapshot.docs.forEach(qds => {
                        // Only push unique documents (eg. when querying Pieter Pieters) to ensure unique ID
                            if (!clientsData.find(x => x.id === qds.id)) {
                            clientsData.push(qds);
                        }
                    });
                }
            });

            return clientsData;
        }
    } catch (error) {
        throw new Error(`An error occurred when trying to query clients by telephone: ${error.message}`);
    }
}

export const getClientByUID = async (uid) => {
    console.log(`Getting client with UID ${uid}...`);

    try {
        const clientRef = doc(firestore, "clients", uid);
        const clientSnap = await getDoc(clientRef);
        if (clientSnap.exists()){
            const client = new ClientFactory(clientSnap.data());
            return client;
        }
        else{
            console.log("Client doc not found");
        }
    } catch (error) {
        throw new Error(`An error occurred when trying to get the client document: ${error.message}`);
    }
};

/**
 * Updates the specified client document.
 * @param {*} clientId The ID of the client document.
 * @param {*} data A client object containing the fields and values to be updated
 */
export const updateClient = async (clientId, data) => {
    console.log(`Updating client with ID ${clientId}...`);
    console.log(data);
    if (!clientId || !data) return;

    // Check if update data contains a telephone and update the telephoneArray as well
    if (data.telephone) {
        data.telephoneArray = transformTelephoneToArray(data.telephone);
    }
    if (data.telephone2) {
        data.telephone2Array = transformTelephoneToArray(data.telephone2);
    }
    
    try {
        const clientRef = doc(firestore, "clients", clientId);
        await updateDoc(clientRef, data);
    } catch (error) {
        throw new Error(`An error occurred when trying to update the client document: ${error.message}`);
    }
};

const buildQuery = (col, filter) => {
    if(!col && !filter){
        return null;
    }
    else {
        console.log(`Building Query for collection '${col}' with ${filter.size} filter(s)`);
        switch(col){
            case "clients":
                // Return all clients if no filter defined
                if (!filter) return query(collection(firestore, col));
                let iterator;   // terator used to iterate through Map entries

                switch (filter.size){
                    case 0:
                        return query(collection(firestore, col));
                    case 1:
                        iterator = filter.entries();
                        const [field, value] = iterator.next().value;   // filter is a Map => .entries() returns an iterator
                        const constraint = buildQueryConstraint("clients", field, value);
                        return query(collection(firestore, col), constraint);
                    case 2:
                        iterator = filter.entries();  // filter is a Map => .entries() returns an iterator
                        const [field1, value1] = iterator.next().value; // returns an array with [key, value]
                        const constraint1 = buildQueryConstraint("clients", field1, value1);
                        const [field2, value2] = iterator.next().value;
                        const constraint2 = buildQueryConstraint("clients", field2, value2);
                        return query(collection(firestore, col), constraint1, constraint2);
                    case "active":
                        return query(collection(firestore, col), where("statecode", "==", CONSTANTS.CLIENT_STATECODE_ACTIVE));
                    case "inactive":
                        return query(collection(firestore, col), where("statecode", "==", CONSTANTS.CLIENT_STATECODE_INACTIVE));
                    case "favorite":
                        return query(collection(firestore, col), where("isfavorite", "==", true));
                    case "recentlyadded":
                        console.warn("Query for recently added clients not implemented yet. Returning all Active Clients");
                        return query(collection(firestore, col), where("statecode", "==", CONSTANTS.CLIENT_STATECODE_ACTIVE));
                    default:
                        return null; 
                }
            case "users":
                switch (filter) {
                    // TO DO: QUERY FOR USERS
                    default:
                        return null;
                }
            default:
                return null;
        }
    }
};

const buildQueryConstraint = (col, field, value) => {
    if (!col || !field || value == null) {
        console.warn("Unable to build a Queryconstraint due to missing parameters:");
        console.log({col, field, value});
        return null;
    }
    else {
        console.log(`Building Queryconstraint for ${col} - ${field} - ${value}`);
        switch (col) {
            case "clients":
                switch (field) {
                    case "statecode":
                        return where("statecode", "==", value);
                    case "isfavorite":
                        return where("isfavorite", "==", value);
                    case "telephone":
                        return where("telephoneArray", "array-contains", value);
                    case "telephone2":
                        return where("telephone2Array", "array-contains", value);
                    default:
                        console.warn(`buildQueryConstraint for collection 'clients' and field ${field} has not been implemented yet!`);
                        return null;
                }
            case "users":
                switch (filter) {
                    default:
                        console.warn(`buildQueryConstraint for collection 'users' and field ${field} has not been implemented yet!`);
                        return null;
                }
            default:
                console.warn(`buildQueryConstraint for collection '${col} has not been implemented yet!`);
                return null;
        }
    }
}
//#endregion