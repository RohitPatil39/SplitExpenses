const express = require("express");
const router = express.Router();
const userModel = require("../models/Users");
const groupModel = require("../models/Group");


this.addExpenseToGroup = async function (gid, eid, uid, amount) {
    try {
        const existingGroup = await groupModel.findById(gid);
        existingGroup.expenses.push(eid);

        var groupUsers = existingGroup.users;
        var userBalances = existingGroup.userBalances || [];

        var totalMembers = groupUsers.length;
        var splitAmount = amount / totalMembers;

        for (const user of groupUsers) {
            if (user !== uid) {
                var balance = userBalances.find((entry) => entry.uid === user);
                if (balance) {
                    balance.balance -= splitAmount;
                } else {
                    userBalances.push({ uid: user, balance: -splitAmount });
                }
            } else {
                var balance = userBalances.find((entry) => entry.uid === user);
                if (balance) {
                    balance.balance += amount - splitAmount;
                } else {
                    userBalances.push({ uid: user, balance: amount - splitAmount });
                }
            }
        }

        existingGroup.userBalances = userBalances;
        existingGroup.paymentGraph = [];
        var payments = makePaymentGraph(gid, existingGroup);
        console.log(payments)
        for (const paymentNode of payments) {
            console.log(paymentNode)
            existingGroup.paymentGraph.push({ from: paymentNode.from, to: paymentNode.to, balance: paymentNode.balance});
        }

        // Update existingGroup.paymentGraph.type with values from paymentNodes
        // existingGroup.paymentGraph.type = paymentNodes.map(node => mapPaymentGraph(node.from, node.to, node.balance));

        await existingGroup.save();

    } catch (error) {
        console.error('Error:', error.message);
    }
};

function makePaymentGraph(gid, group) {
    var paymentGraph = [];

    // Assuming group.userBalances is an array of objects with uid and balance properties
    var userBalances = group.userBalances;

    // Separate lenders and borrowers
    var lenders = userBalances.filter(user => user.balance > 0);
    var borrowers = userBalances.filter(user => user.balance < 0);

    var lenders = lenders.map(item => ({
        uid: item.uid,
        balance: Math.abs(item.balance),
        _id: item._id
    }));

    var borrowers = borrowers.map(item => ({
        uid: item.uid,
        balance: Math.abs(item.balance),
        _id: item._id
    }));

    function createUserNode(uid, balance) {
        return { uid, balance };
    }

    // Helper function to insert a UserNode into the appropriate list
    function insertUserNode(person, sortedPeople) {
        sortedPeople.push(person);
        sortedPeople.sort((a, b) => b.balance - a.balance);
    }

    // Helper function to pop the top user from the list
    function popTopUser(userList) {
        return userList.pop();
    }
    // console.log(lenders, borrowers)

    while (lenders.length > 0) {
        const sender = popTopUser(borrowers);
        const receiver = popTopUser(lenders);


        const amountTransferred = Math.min(sender.balance, receiver.balance);

        paymentGraph.push(new PaymentNode(sender.uid, receiver.uid, amountTransferred));
// console.log(paymentGraph)
        sender.balance -= amountTransferred;
        receiver.balance -= amountTransferred;

        if (sender.balance !== 0)
            insertUserNode(sender, borrowers);

        if (receiver.balance !== 0)
            insertUserNode(receiver, lenders);
    }

    return paymentGraph;
}

class PaymentNode {
    constructor(from, to, amount) {
        this.from = from;
        this.to = to;
        this.balance = amount;
    }
}

this.addGroupUnderUser = async function (users, gid) {
    for (var uid of users) {
        const existingUser = await userModel.findOne({ uid });
        existingUser.groups.push(gid);
        await existingUser.save();
    }
}

this.getExpenses = async function (gid) {
    const existingGroup = await groupModel.findById(gid);
    return existingGroup.expenses;
}

this.getGroups = async function (uid) {
    const existingUser = await userModel.findOne({ uid });
    return existingUser.groups;
}

this.addPaymentGraph = async function (gid) {

}

module.exports = this;