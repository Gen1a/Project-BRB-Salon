import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import LoadingScreen from '../screens/LoadingScreen';
import { useAuthContext } from '../contexts/AuthProvider';
import AuthStack from './AuthStack';
import AppStack from './AppStack';


const RootNavigator = () => {
    const { user, initializing } = useAuthContext();
  
    if (initializing){
        return (<LoadingScreen />)
    }
    else{
        return (
            <NavigationContainer>
                {/* Only show the AppStack if the user is logged in and the user has verified the e-mail address */}
                { user ? <AppStack /> : <AuthStack /> }
            </NavigationContainer>
        )
    }
};

export default RootNavigator;