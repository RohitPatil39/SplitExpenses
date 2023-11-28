import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Avatar } from 'react-native-elements';
import SvgUri from 'react-native-svg-uri';
import { View, Text, Image, SafeAreaView } from 'react-native';
import { Platform, NativeModules } from 'react-native';
import GroupsScreen from './groupsScreen';
const { StatusBarManager } = NativeModules;

const avatarUrl = 'https://avatars.dicebear.com/api/avataaars/example.svg';

const user = {
    name: 'Rohit Patil',
    image: 'data:image/jpeg;base64,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',
};

const SettingsScreen = () => (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Settings Screen</Text>
    </View>
);

const ProfileTab = () => (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Profile Tab</Text>
    </View>
);

const Tab = createBottomTabNavigator();

const HomeScreen = () => {
    return (

        <SafeAreaView style={{
            flex: 1,
            backgroundColor: 'hsla(111, 0%, 17%, 1)',
            paddingTop: Platform.OS === 'android' ? StatusBarManager.HEIGHT : 0,
        }}>
            <View style={{ flexDirection: 'row', justifyContent: "space-between", alignItems: 'center', padding: 15 }}>
                <View style={{ marginRight: 10 }}>
                    <Text style={{ color: 'hsla(111, 0%, 65%, 1)', fontSize: 18, fontWeight: 'bold' }}>Welcome! Rohit</Text>
                </View>
                <Image
                    style={{ width: 100, height: 100 }}
                    source={{ uri: avatarUrl }}
                />
                <Avatar
                    rounded
                    size="medium"
                    source={{ uri: user.image }}
                />

            </View>

            <Tab.Navigator
                screenOptions={({ route }) => ({
                    tabBarIcon: ({ focused, color, size }) => {
                        let iconName;
                        if (route.name === 'SettingsScreen') {
                            iconName = focused ? 'home' : 'home';
                        } else if (route.name === 'GroupsScreen') {
                            iconName = focused ? 'people' : 'people';
                        } else if (route.name === 'ProfileTab') {
                            iconName = focused ? 'person' : 'person';
                        }

                        return <Ionicons name={iconName} size={size} color={color} />;
                    },
                    headerShown: false,
                    tabBarActiveTintColor: 'white',
                    tabBarInactiveTintColor: 'darkgrey',
                    tabBarShowLabel: false,
                    tabBarStyle: [
                        {
                            // "height": "60",
                            "display": "flex",
                            "paddingBottom": 6,
                            "backgroundColor": "hsla(111, 0%, 17%, 1)"
                        },
                        null
                    ]
                })}
            >

                <Tab.Screen name="SettingsScreen" component={SettingsScreen} />
                <Tab.Screen name="GroupsScreen" component={GroupsScreen} />
                <Tab.Screen name="ProfileTab" component={ProfileTab} />
            </Tab.Navigator>
        </SafeAreaView>
    );
};

export default HomeScreen;
