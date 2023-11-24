const express = require("express");
const router = express.Router();
const userModel = require("../models/Users");
const groupModel = require("../models/Group");
const expenseController = require("../controllers/expenseController");
const expenseModel = require("../models/Expense");
const expenseCalculator = require("../expenseCalculations/expenseCalculator");
const dbOperations = require("../expenseCalculations/databaseOperations");
router.use(express.json());


router.post("/adduser", async (req, res) => {
  const User = new userModel({
    username: req.body.username,
    uid: req.body.uid,
  });
  try {
    const user = User.save();
    res.json(user);
  } catch (err) {
    res.send("Error" + err);
  }
});

router.get("/getusers", async (req, res) => {
  try {
    const user = await userModel.find();
    res.json(user);
  } catch (err) {
    res.send("Error" + err);
  }
});

router.post("/creategroup", async (req, res) => {
  const Group = new groupModel({
    groupTitle: req.body.groupTitle,
    groupDescription: req.body.groupDescription,
    userBalances: req.body.userBalances,
    paymentGraph: req.body.paymentGraph,
    expenses: req.body.expenses,
    users: req.body.users,
  });
  try {
    const group = await Group.save();
    const gid = group._id;
    dbOperations.addGroupUnderUser(req.body.users, gid);
    res.json(group);
  } catch (err) {
    res.send("Error" + err);
  }
});

router.get("/getgroups", async (req, res) => {
  try {
    console.log("Hi")
    console.log(req.query);
    const groups = await dbOperations.getGroups(req.query.uid);
    res.json(groups);
  } catch (err) {
    res.send("Error" + err);
  }
});

router.get("/getexpenses", async (req, res) => {
  try {
    const expenses = await dbOperations.getExpenses(req.query.gid);
    res.json(expenses);
  } catch (err) {
    res.send("Error" + err);
  }
});

router.post("/addexpense", async (req, res) => {
  const Expense = new expenseModel({
    title: req.body.title,
    description: req.body.description,
    amount: req.body.amount,
    uid: req.body.uid
  });
  try {
    const expense = await Expense.save();
    const expenseId = expense._id;
    dbOperations.addExpenseToGroup(req.body.gid, expenseId, Expense.uid, Expense.amount);
    res.json(expense);

  } catch (err) {
    res.send("Error" + err);
  }
});



module.exports = router;
