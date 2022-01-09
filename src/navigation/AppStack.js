import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from "@react-navigation/stack";
import MyProfileScreen from '../screens/MyProfileScreen';
import AppointmentsScreen from '../screens/AppointmentsScreen';
import AnalyticsScreen from '../screens/AnalyticsScreen';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import ClientsScreen from '../screens/ClientsScreen';
import ClientProfileScreen from '../screens/ClientProfileScreen';

const Tab = createBottomTabNavigator();
const ClientStack = createStackNavigator();

const ClientStackScreen = () => {
    return (
        <ClientStack.Navigator
            initialRouteName="Clients"
        >
            <ClientStack.Screen name="Clients" component={ClientsScreen} options={{ headerShown: false }}/>
            <ClientStack.Screen
                name="ClientProfile"
                component={ClientProfileScreen}
                options={{
                    title: "Client Profile",
                    gestureEnabled: true,
                    headerStyle: { backgroundColor: "#333333" },
                    headerBackTitle: "Go back",
                    headerBackTitleStyle: { color: "#fff"},
                    headerTintColor: '#fff',
                    headerTitle: ""
                }}
            />
        </ClientStack.Navigator>
    )
}

const AppStack = () => {
    return (
        <Tab.Navigator
            initialRouteName="MyProfile"
            screenOptions={{
                gestureEnabled: true,
                headerShown: false,
                tabBarLabelPosition: "below-icon",
                tabBarActiveTintColor: "#fff",
                //tabBarInactiveTintColor: "#919191",
                tabBarStyle: { backgroundColor: "#333333", borderTopWidth: 1, borderTopColor: "#000", paddingTop: 5},
                tabBarLabelStyle: {
                    fontSize: 12
                },
                //tabBarInactiveBackgroundColor: "#333333"
            }}
        >
            <Tab.Screen
                name="Appointments"
                component={AppointmentsScreen}
                options={{
                    title: "Appointments",
                    tabBarIcon: ({ focused }) => {
                        return <MaterialCommunityIcons
                            name={focused ? 'calendar-month' : 'calendar-month-outline'}
                            color={focused ? "#fff" : "#d1d1d1"}
                            size={25}
                        />
                    },
                }}
            />
            <Tab.Screen
                name="ClientStack"
                component={ClientStackScreen}
                options={{
                    title: "Clients",
                    tabBarIcon: ({ focused }) => {
                        return <MaterialCommunityIcons
                            name={focused ? 'account-group' : 'account-group-outline'}
                            color={focused ? "#fff" : "#d1d1d1"}
                            size={25}
                        />
                    },
                }}
            />
            <Tab.Screen
                name="Analytics"
                component={AnalyticsScreen}
                options={{
                    title: "Analytics",
                    tabBarIcon: ({ focused }) => {
                        return <MaterialCommunityIcons
                            name={"adobe-acrobat"}
                            color={focused ? "#fff" : "#d1d1d1"}
                            size={25}
                        />
                    },
                }}
            />
            <Tab.Screen
                name="MyProfile"
                component={MyProfileScreen}
                options={{
                    title: "Profile",
                    tabBarIcon: ({ focused }) => {
                        return <MaterialCommunityIcons
                            name={focused ? "account-settings" : "account-settings-outline"}
                            color={focused ? "#fff" : "#d1d1d1"}
                            size={25}
                        />
                    },
                }}
            />
        </Tab.Navigator>
    )
};

export default AppStack;