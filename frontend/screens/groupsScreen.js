// ProfileScreen.js

import React from 'react';
import { View, Image, Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Avatar } from 'react-native-elements';

// Dummy data for user (replace with actual user data)
const user = {
    name: 'John Doe',
    image: 'https://example.com/user-image.jpg', // URL to user's image
};

const HomeScreen = () => (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Home Screen</Text>
    </View>
);

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

const NotificationsTab = () => (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Notifications Tab</Text>
    </View>
);

const Tab = createBottomTabNavigator();

const ProfileScreen = () => {
    return (
        <View style={{ flex: 1 }}>
            <View style={{ padding: 20, alignItems: 'center' }}>
                <Avatar
                    rounded
                    size="large"
                    source={{ uri: user.image }}
                />
                <Text style={{ marginTop: 10, fontSize: 18, fontWeight: 'bold' }}>{user.name}</Text>
            </View>

            <Tab.Navigator>
                <Tab.Screen name="Home" component={HomeScreen} />
                <Tab.Screen name="Settings" component={SettingsScreen} />
                <Tab.Screen name="Profile" component={ProfileTab} />
                <Tab.Screen name="Notifications" component={NotificationsTab} />
            </Tab.Navigator>
        </View>
    );
};

export default ProfileScreen;
