import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, ScrollView } from 'react-native';

const GroupView = ({ navigation }) => {
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

export default GroupView;
