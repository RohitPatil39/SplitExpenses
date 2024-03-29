import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, ScrollView } from 'react-native';

const GroupsScreen = ({ navigation }) => {
    const [groups, setGroups] = useState([]);

    const createGroup = () => {
        navigation.navigate('CreateGroupScreen', {
            onSaveSuccess: (data) => {
                console.log('Save operation in CreateGroupScreen was successful');
                getGroups();
            },
        });
    };

    const getGroups = () => {
        // Your API endpoint
        const api = 'https://expense-splitter-service.onrender.com/splitter/getgroups';
        const uid = "rohit@gmail.com";

        fetch(api + "?uid=" + uid)
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((data) => {
                // console.log(data)
                data.reverse()
                setGroups(data); // Set the groups in the state
            })
            .catch((error) => {
                console.error('Error during GET request:', error);
            });
    };

    useEffect(() => {
        getGroups();
    }, []);

    return (

        <View style={styles.page}>
            <Text style={styles.title}>You are included in {groups.length} Groups</Text>
            {/* <ScrollView style={styles.scrollContainer}> */}
            <View style={styles.container}>
                <FlatList
                    data={groups}
                    keyExtractor={(item) => item._id}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={styles.groupContainer}
                            onPress={() => {
                                // Handle group item press, e.g., navigate to group details
                            }}
                        >
                            {/* Horizontal Section: Section 1 and Section 2 */}
                            <View style={styles.horizontalSection}>
                                {/* Vertical Section 1 */}
                                <View style={styles.verticalSection}>
                                    <Text style={styles.groupTitle}>{item.groupTitle}</Text>
                                </View>

                                {/* Vertical Section 2 */}
                                <View style={styles.verticalSection}>
                                    <Text style={styles.groupDescription}>{item.groupDescription}</Text>

                                </View>
                            </View>

                            <View style={styles.verticalSection}>

                                {item.userBalances.map((userBalance) => {
                                    // Check if the userBalance corresponds to the current user
                                    if (userBalance.uid === "rohit@gmail.com") {
                                        const balance = userBalance.balance;
                                        let balanceText = '';

                                        if (balance === 0) {
                                            balanceText = 'You are settled up.';
                                        } else if (balance > 0) {
                                            balanceText = `You are owed ${balance} Rs.`;
                                        } else {
                                            balanceText = `You owe ${Math.abs(balance)} Rs.`;
                                        }

                                        return <Text key={userBalance.uid} style={styles.userBalance}>{balanceText}</Text>;
                                    }
                                    return null;
                                })}
                            </View>
                        </TouchableOpacity>
                    )}
                />
            </View>
            {/* </ScrollView> */}
            <TouchableOpacity
                style={styles.refreshButton}
                onPress={createGroup}
            >
                <Text style={styles.buttonText}>Create Group</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    page: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'hsla(111, 0%, 31%, 1)'
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: "row-reverse",
        padding: 20
    },
    horizontalSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 4,
    },
    verticalSection: {
        flex: 1,
        margin: 5
    },
    title: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
        paddingTop: 10,
        marginBottom: 20,
    },
    scrollContainer: {
        flex: 1,
    },
    groupContainer: {
        flex: 1,
        justifyContent: 'center',
        width: "500",
        backgroundColor: 'hsla(111, 0%, 17%, 1)',
        padding: 20,
        borderRadius: 10,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    groupTitle: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    groupDescription: {
        color: 'white',
        marginBottom: 10,
    },
    usersContainer: {
        marginTop: 10,
    },
    usersLabel: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    user: {
        color: 'white',
        fontSize: 14,
    },
    userBalancesContainer: {
        marginTop: 10,
    },
    userBalancesLabel: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    userBalance: {
        color: 'white',
        fontSize: 18,
        paddingBottom: 10
    },
    refreshButton: {
        position: 'absolute',
        bottom: 30,
        right: 25,
        backgroundColor: 'hsla(111, 0%, 65%, 1)',
        padding: 10,
        borderRadius: 7,
        shadowColor: '#000',
        shadowOffset: {
            width: 2,
            height: 2,
        },
        shadowOpacity: 0.05,
        shadowRadius: 4.84,
        elevation: 6,
    },
    buttonText: {
        color: 'black',
        backgroundColor:'hsla(111, 0%, 65%, 1)'
    },
});

export default GroupsScreen;
