import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getAllClients, getClientsByName, getClientsByPhone, updateClient } from '../../firebase/firestore';

export const fetchClients = createAsyncThunk('clients/fetchClients', async (filter) => {
    try {
        const response = await getAllClients(filter);
        if (response.length !== 0) {
            return response.map((doc) => ({
                id: doc.id,
                data: doc.data()
            }));
        }
        else return [];
    } catch (error) {
        console.error(error.message);
    }
});

export const fetchClientsByPhone = createAsyncThunk('clients/fetchClientsByPhone', async ({ query, filter }) => {
    try {
        const response = await getClientsByPhone(query, filter);
        if (response.length !== 0) {
            return response.map((doc) => ({
                id: doc.id,
                data: doc.data()
            }));
        }
        else return [];
    } catch (error) {
        console.error(error.message);
    }
});

export const fetchClientsByName = createAsyncThunk('clients/fetchClientsByName', async ({ query, filter }) => {
    try {
        const response = await getClientsByName(query, filter);
        if (response.length !== 0) {
            return response.map((doc) => ({
                id: doc.id,
                data: doc.data()
            }));
        }
        else return [];
    } catch (error) {
        console.error(error.message);
    }
});

export const updateClientData = createAsyncThunk('clients/updateClientData', async ({ id, data }, { getState }) => {
    try {
        //const state = getState();
        const response = await updateClient(id, data);
        return {id, data};
    } catch (error) {
        console.error(error.message);
    }
});

const clientSlice = createSlice({
    name: "clients",
    initialState: {
        clients: [],
        status: "idle",
        currentClientId: null
    },
    reducers: {
        setCurrentClientId: (state, action) => {
            console.log(`Setting current clientID to ${action.payload}`);
            state.currentClientId = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchClients.pending, (state, action) => {
                console.log(`fetchClients.pending!`);
                state.status = "loading";
            })
            .addCase(fetchClients.fulfilled, (state, action) => {
                console.log(`fetchClients.fulfilled!`);
                state.status = "succeeded";
                state.clients = action.payload;
            })
            .addCase(fetchClients.rejected, (state, action) => {
                console.log(`fetchClients.rejected!`);
                state.status = "failed";
                state.clients = [];
            })
            .addCase(fetchClientsByPhone.pending, (state, action) => {
                console.log(`fetchClientsByPhone.pending!`);
                state.status = "loading";
            })
            .addCase(fetchClientsByPhone.fulfilled, (state, action) => {
                console.log(`fetchClientsByPhone.fulfilled!`);
                state.status = "succeeded";
                state.clients = action.payload;
            })
            .addCase(fetchClientsByPhone.rejected, (state, action) => {
                console.log(`fetchClientsByPhone.rejected!`);
                state.status = "failed";
                state.clients = [];
            })
            .addCase(fetchClientsByName.pending, (state, action) => {
                console.log(`fetchClientsByName.pending!`);
                state.status = "loading";
            })
            .addCase(fetchClientsByName.fulfilled, (state, action) => {
                console.log(`fetchClientsByName.fulfilled!`);
                state.status = "succeeded";
                state.clients = action.payload;
            })
            .addCase(fetchClientsByName.rejected, (state, action) => {
                console.log(`fetchClientsByName.rejected!`);
                state.status = "failed";
                state.clients = [];
            })
            .addCase(updateClientData.pending, (state, action) => {
                console.log(`updateClientData.pending!`);
                state.status = "loading";
            })
            .addCase(updateClientData.fulfilled, (state, action) => {
                console.log(`updateClientData.fulfilled!`);
                state.status = "succeeded";
                // Update the redux store after the database has been successfully updated
                if (action.payload) {
                    const { data } = state.clients.find(x => x.id === action.payload.id);
                    for (const [key, value] of Object.entries(action.payload.data)) {
                        data[key] = value;
                    }
                }
            })
            .addCase(updateClientData.rejected, (state, action) => {
                console.log(`updateClientData.rejected!`);
                state.status = "failed";
            })
    }
});

export const { actions, reducer } = clientSlice;
export const { setCurrentClientId } = actions;