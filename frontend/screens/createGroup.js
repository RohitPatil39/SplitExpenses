import React, { useState } from 'react';
import { View, Text, StyleSheet, NativeModules, SafeAreaView, TextInput, FlatList, TouchableOpacity, Button } from 'react-native';

const { StatusBarManager } = NativeModules;

const CreateGroupScreen = ({ route, navigation }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [selectedUsers, setSelectedUsers] = useState([]);
    const users = [
        { id: 'rohit@gmail.com', name: 'Rohit' },
        { id: 'paresh@gmail.com', name: 'Paresh' },
        { id: 'Rushi@gmail.com', name: 'Rushikesh' },
        // Add more users as needed
    ];

    const toggleUserSelection = (userId) => {
        setSelectedUsers((prevUsers) =>
            prevUsers.includes(userId)
                ? prevUsers.filter((id) => id !== userId)
                : [...prevUsers, userId]
        );
    };

    const handleSave = () => {
        const groupData = {
            title,
            description,
            selectedUsers,
        };
        console.log("groupinfo",groupData)
        saveGroupDataToBackend(groupData);
    };

    const saveGroupDataToBackend = async (data) => {
        try {
            // Assuming you have an API endpoint to save group data
            var formattedData = {
                "groupTitle": data.title,
                "groupDescription": data.description,
                "users": data.selectedUsers
            }
            const response = await fetch('https://expense-splitter-service.onrender.com/splitter/creategroup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formattedData),
            });
            console.log(response);
            if (response.ok) {
                console.log('Group data saved successfully!');
                route.params.onSaveSuccess(true);
                navigation.navigate('GroupsScreen');
            } else {
                console.error('Failed to save group data:', response.status);
                route.params.onSaveSuccess(false);
                navigation.navigate('GroupsScreen');
            }
        } catch (error) {
            console.error('Error saving group data:', error.message);
        }
    };

    return (
        <SafeAreaView style={styles.page}>
            <View style={styles.inputContainergroup}>
                <Text style={styles.title}>Create New Group</Text>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Group Title"
                        value={title}
                        onChangeText={(text) => setTitle(text)}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Group Description"
                        value={description}
                        onChangeText={(text) => setDescription(text)}
                    />
                </View>
                <Text style={styles.subtitle}>Select Users for the Group:</Text>
                <FlatList
                    data={users}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={[
                                styles.userItem,
                                selectedUsers.includes(item.id) && styles.selectedUserItem,
                            ]}
                            onPress={() => toggleUserSelection(item.id)}
                        >
                            <Text style={styles.userName}>{item.name} ({item.id})</Text>
                        </TouchableOpacity>
                    )}
                />
            </View>
            <TouchableOpacity
                style={styles.refreshButton}
                onPress={handleSave}
            >
                <Text style={styles.buttonText}>Save Group</Text>
            </TouchableOpacity>
            {/* Additional content and functionality can be added as needed */}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    page: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'hsla(111, 0%, 31%, 1)',
        flexDirection: "row-reverse",
        paddingTop: Platform.OS === 'android' ? StatusBarManager.HEIGHT : 0,
    },
    inputContainergroup: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 20,
        marginVertical: 30,
        backgroundColor: "hsla(111, 0%, 17%, 1)",
        borderRadius: 16,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.05,
        shadowRadius: 3.84,
        elevation: 9,
    },
    title: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
        padding: 10,
        margin: 20,
    },
    refreshButton: {
        position: 'absolute',
        bottom: 50,
        backgroundColor: 'hsla(330, 2%, 83%, 1)',
        padding: 10,
        borderRadius: 7,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.05,
        shadowRadius: 3.84,
        elevation: 9,
    },
    subtitle: {
        color: 'white',
        fontSize: 18,
        margin: 10,
        padding: 20
    },
    inputContainer: {
        width: '80%',
        marginBottom: 20,
    },
    input: {
        backgroundColor: 'hsla(330, 1%, 63%, 1)',
        padding: 10,
        margin: 10,
        borderRadius: 5,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.05,
        shadowRadius: 3.84,
        elevation: 9,
    },
    userItem: {
        backgroundColor: 'hsla(330, 1%, 56%, 1)',
        padding: 10,
        marginVertical: 5,
        borderRadius: 5,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.05,
        shadowRadius: 3.84,
        elevation: 9,
    },
    selectedUserItem: {
        backgroundColor: 'hsla(330, 2%, 83%, 1)',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.05,
        shadowRadius: 3.84,
        elevation: 9,// Change the background color for selected users
    },
    userName: {
        color: 'black', // Change the text color for user names
    },
});

export default CreateGroupScreen;
