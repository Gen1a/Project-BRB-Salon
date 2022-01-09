import { onAuthStateChanged } from 'firebase/auth';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../firebase/auth';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    // Set initial state for user auth
    const [user, setUser] = useState(null);
    const [initializing, setInitializing] = useState(true);

    // Handle User auth state changes
    useEffect(() => {
        console.log("AuthProvider mounted...");
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            try {
                console.log(`Auth state changed on: ${new Date().toLocaleString()}`);
                if (user){
                    console.log(`User is defined: ${user.uid}`);
                }
                else{
                    console.log("User not defined");
                }                
                setUser(user ? user : null);
                setInitializing(false);
            } catch (error) {
                setUser(null);
                setInitializing(false);
                console.error(`An error occured when trying to handle the user authentication state: ${error}`);
                throw new Error(`An error occured when trying to handle the user authentication state: ${error}`);
            }
        });
        return () => {
            console.log("AuthProvider unmounted...");
            unsubscribe();
        }
    }, [auth]);


    return (
        // values in Provider are made available for any children components
        <AuthContext.Provider value={{ initializing: initializing, user: user }}>
            {children}
        </AuthContext.Provider>
    );
}

// Export the context provider
export default AuthProvider;
// Define a custom hook for the User Auth context
export const useAuthContext = () => useContext(AuthContext);