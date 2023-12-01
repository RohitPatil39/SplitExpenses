const express = require("express");
const router = express.Router();
const userModel = require("../models/Users");
const groupModel = require("../models/Group");
const expenseModel = require("../models/Expense");
const dbOperations = require("../expenseCalculations/databaseOperations");
router.use(express.json());


router.post("/adduser", async (req, res) => {
  const User = new userModel({
    username: req.body.username,
    password: req.body.password,
    uid: req.body.uid,
  });
  try {
    console.log("user");
    console.log(User)
    const user = await User.save();
    // console.log("asa                   ..........................................", user);
    res.json(user);
  } catch (err) {
    res.send("Error" + err);
  }
});

router.post("/login", async (req, res) => {
  try {
    const result = {
      authenticated: true,
      username: "username"
    };
    var userinp = req.body.username;
    var p = req.body.password;
    console.log(userinp, p, "...........................")
    var isUser = await userModel.findOne({ password: p, username: userinp })
    // console.log("is", isUser, await userModel.findOne({ username: userinp }))
    if (isUser) {
      console.log(isUser)
      result.username = isUser.uid
      result.authenticated = true;
      res.send(result)

      console.log("isUser", result)
    } else {
      result.authenticated = false;
      res.send(result)
    }
    //
  } catch (err) {
    res.send("Error" + err);
  }
});

router.get("/getusers", async (req, res) => {
  try {
    const user = await userModel.find();
    console.log(user)
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
    console.log(gid);
    await dbOperations.addGroupUnderUser(req.body.users, gid);
    res.json(group);
    console.log(".............................done.......................")
  } catch (err) {
    res.send("Error" + err);
  }
});

router.get("/getgroups", async (req, res) => {
  try {
    const groups = await dbOperations.getGroups(req.query.uid);
    res.json(groups);
    console.log(groups)
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
    console.log("gid", req.body.gid)
    dbOperations.addExpenseToGroup(req.body.gid, expenseId, Expense.uid, Expense.amount);
    res.json(expense);

  } catch (err) {
    res.send("Error" + err);
  }
});

router.post("/settletransaction", async (req, res) => {
  const transaction = {
    sender: req.body.sender,
    receiver: req.body.receiver,
    amount: req.body.amount,
    gid: req.body.gid
  };
  try {
    dbOperations.settleTransaction(transaction);
    res.json("Success");
  } catch (err) {
    res.send("Error" + err);
  }
});



module.exports = router;
