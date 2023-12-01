const express = require("express");
const router = express.Router();
const userModel = require("../models/Users");
const groupModel = require("../models/Group");
const expenseModel = require("../models/Expense");


this.addExpenseToGroup = async function (gid, eid, uid, amount) {
    try {
        const existingGroup = await groupModel.findById(gid);
        console.log(".............................",existingGroup)
        existingGroup.expenses.push(eid);
        // console.log("don")
        var groupUserIds = existingGroup.users;
        var groupUsers = [];
        for (const uid of groupUserIds) {
            groupUsers.push(await userModel.findOne({ uid }));
        }
        var userBalances = existingGroup.userBalances || [];

        var totalMembers = groupUsers.length;
        // console.log(totalMembers)
        var splitAmount = amount / totalMembers;
        // console.log()

        console.log("...................................users", uid)
        for (const user of groupUsers) {
            if (user.uid !== uid) {
                console.log("1")
                var userbalance = userBalances.find((entry) => entry.uid === user.uid);
                if (userbalance) {
                    console.log("2")
                    userbalance.balance -= splitAmount;
                    user.balance -= splitAmount;
                } else {
                    console.log("3")
                    userBalances.push({ uid: user.uid, balance: -splitAmount });
                    user.balance = -splitAmount;
                }
            } else {
                console.log("4")
                var userbalance = userBalances.find((entry) => entry.uid === user.uid);
                if (userbalance) {
                    // console.log("5")
                    userbalance.balance += (amount - splitAmount);
                    user.balance += amount - splitAmount;
                } else {
                    // console.log("6")
                    userBalances.push({ uid: user.uid, balance: (amount - splitAmount) });
                    // console.log("7")
                    user.balance = (amount - splitAmount);
                    // console.log("8")
                }
            }
            user.save();
        }

        existingGroup.userBalances = userBalances;
        existingGroup.paymentGraph = [];
        console.log("pg................................",gid,existingGroup)
        var payments = makePaymentGraph(gid, existingGroup);
        console.log(payments)
        for (const paymentNode of payments) {
            console.log(paymentNode)
            existingGroup.paymentGraph.push({ from: paymentNode.from, to: paymentNode.to, balance: paymentNode.balance });
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
console.log(lenders)
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
    const expenseIds = existingGroup.expenses;
    var expenses = [];
    for (const eid of expenseIds) {
        expenses.push(await expenseModel.findById(eid));
    }
    return expenses;
}

this.getGroups = async function (uid) {
    const existingUser = await userModel.findOne({ uid });
    const groupIds = existingUser.groups;
    var groups = [];
    for (const gid of groupIds) {
        groups.push(await groupModel.findById(gid));
    }
    return groups;
}

this.settleTransaction = async function (transaction) {
    const existingGroup = await groupModel.findById(transaction.gid);
    const userBalances = existingGroup.userBalances;
    const sender = userBalances.filter(user => user.uid === transaction.sender);
    const receiver = userBalances.filter(user => user.uid === transaction.receiver);
    var uid = transaction.sender;
    const user1 = await userModel.findOne({ uid });
    uid = transaction.receiver;
    const user2 = await userModel.findOne({ uid });
    sender[0].balance += transaction.amount;
    user1.balance = sender[0].balance;
    receiver[0].balance -= transaction.amount;
    user2.balance = receiver[0].balance;
    existingGroup.paymentGraph = makePaymentGraph(transaction.gid, existingGroup);
    console.log(userBalances, existingGroup.paymentGraph);
    await existingGroup.save();
    await user1.save();
    await user2.save();
}

module.exports = this;