const uniqid = require("uniqid");
const { MongoClient, ObjectId, ChangeStream } = require("mongodb");
const uri =
  "mongodb+srv://ganeshyadharth:AbleLyf@students.jbrazv2.mongodb.net/?retryWrites=true&w=majority";
const faceapi = require("face-api.js");
const { canvas, faceDetectionNet, faceDetectionOptions } = faceapi;
const fs = require("fs");
const path = require("path");
const { Buffer } = require("buffer");

exports.handleGetCandidates = async (req, res) => {
  try {
    const client = await MongoClient.connect(uri);
    const db = client.db("AbleLyf");
    console.log(req.body);
    let getData = await db
      .collection("candidates")
      .find({ adminID: req.body.adminID })
      ?.toArray();
    await client.close();
    res.send({
      message: getData.reverse(),
    });
  } catch (err) {
    console.log(err);
  }
};

exports.handleRegisterAdmin = async (req, res) => {
  try {
    const client = await MongoClient.connect(uri);
    const db = client.db("AbleLyf");
    let reqObj = {
      adminID: uniqid(),
      name: req.body.mail,
      password: req.body.password,
    };
    console.log(reqObj);
    await db.collection("admin").insertOne(reqObj);
    await client.close();
    res.json({
      message: "adminRegistered",
    });
  } catch (err) {
    console.log(err);
  }
};

exports.handleLoginAdmin = async (req, res) => {
  try {
    const client = await MongoClient.connect(uri);
    const db = client.db("AbleLyf");
    console.log(req.body);
    let getData = await db.collection("admin").findOne({
      name: req.body.mail,
      password: req.body.password,
    });
    await client.close();
    if (getData) {
    }
    if (getData) {
      res.json({
        message: "adminLogin Success",
        name: getData.name,
        adminID: getData.adminID,
      });
    } else {
      res.json({
        message: "No login",
      });
    }
  } catch (err) {
    console.log(err);
  }
};

exports.handleAddUser = async (req, res) => {
  try {
    const client = await MongoClient.connect(uri);
    const db = client.db("AbleLyf");
    let reqBody = req.body?.dataObj;
    //////
    if (req.body.actions === "Edit") {
      reqBody["_id"] && delete reqBody["_id"];

      let findAndUpdateData = await db
        .collection("candidates")
        .findOneAndUpdate(
          { candidateID: reqBody.candidateID },
          { $set: { ...reqBody } }
        );
    } else {
      reqBody.candidateID = uniqid();
      let insertData = await db
        .collection("candidates")
        .insertOne(req.body?.dataObj);
    }
    await client.close();
    res.json({
      message: "candidateDetails submitted",
    });
  } catch (err) {
    console.log(err);
  }
};

exports.handleDeleteCandidates = async (req, res) => {
  try {
    const client = await MongoClient.connect(uri);
    const db = client.db("AbleLyf");
    let deleteData = await db
      .collection("candidates")
      .deleteMany({ _id: new ObjectId(req.body["_id"]) });
    await client.close();
    res.send({
      message: "deleted candidate",
    });
  } catch (err) {
    console.log(err);
  }
};

exports.handleAttendanceChange = async (req, res) => {
  try {
    const client = await MongoClient.connect(uri);
    const db = client.db("AbleLyf");
    console.log(req.body);
    console.log("jalev=bi");
    let reqBody = req.body;
    reqBody["_id"] && delete reqBody["_id"];
    let findAndUpdateData = await db
      .collection("candidates")
      .findOneAndUpdate(
        { candidateID: req.body.candidateID },
        { $set: { ...req.body } }
      );
    await client.close();
    res.send({
      message: "changedStatus",
    });
  } catch (err) {
    console.log(err);
  }
};

exports.handleEntries = async (req, res) => {
  try {
    const client = await MongoClient.connect(uri);
    const db = client.db("AbleLyf");
    console.log(req.body);
    let getData = await db
      .collection("attendance")
      .find({ adminID: req.body.adminID })
      .toArray();
    await client.close();
    res.send({
      message: getData,
    });
  } catch (err) {
    console.log(err);
  }
};

exports.handleEntriesDelete = async (req, res) => {
  try {
    const client = await MongoClient.connect(url);
    const db = client.db("students");
    const deleteData = await db
      .collection("attendance")
      .findOneAndDelete({ _id: new ObjectId(req.body["_id"]) });
    await client.close();
    res.send({
      message: "deleteSuccesfully",
    });
  } catch (err) {
    console.log(err);
  }
};

exports.handleAddCam = async (req, res) => {
  try {
    const client = await MongoClient.connect(uri);
    const db = client.db("AbleLyf");
    const deleteData = await db.collection("camera").insertOne(req.body);
    await client.close();
    res.send({
      message: "posted successfully",
    });
  } catch (err) {
    console.log(err);
  }
};
exports.handleAdvertise = async (req, res) => {
  try {
    const client = await MongoClient.connect(uri);
    const db = client.db("AbleLyf");
    const deleteData = await db.collection("advertise").deleteMany({});
    const insertData = await db
      .collection("advertise")
      .insertOne({ fileName: req.body.fileName });
    await client.close();
    res.send({
      message: "posted successfully",
    });
  } catch (err) {
    console.log(err);
  }
};
exports.handleGetAdvertise = async (req, res) => {
  try {
    const client = await MongoClient.connect(uri);
    const db = client.db("AbleLyf");
    const getData = await db.collection("advertise").findOne({});
    console.log(getData);
    await client.close();
    res.send({
      message: getData,
    });
  } catch (err) {
    console.log(err);
  }
};

exports.handleGetCrowd = async (req, res) => {
  try {
    const client = await MongoClient.connect(uri);
    const db = client.db("AbleLyf");
    const getData = await db.collection("crowdentries").find({})?.toArray();
    console.log(getData);
    await client.close();
    res.send({
      dataArr: getData,
      message: "Data found",
    });
  } catch (err) {
    console.log(err);
  }
};

exports.handleGetHeat = async (req, res) => {
  try {
    const client = await MongoClient.connect(uri);
    const db = client.db("AbleLyf");
    const getData = await db.collection("heatentries").find({})?.toArray();
    console.log(getData);
    await client.close();
    res.send({
      dataArr: getData,
      message: "Data found",
    });
  } catch (err) {
    console.log(err);
  }
};

exports.handleAddEntries = async (req, res) => {
  try {
    const client = await MongoClient.connect(uri);
    const db = client.db("AbleLyf");
    console.log(req.body);
    let insertData = await db
      .collection("attendance")
      .insertOne(req.body?.dataObj);

    await client.close();
    res.json({
      message: "attendate entries set",
    });
  } catch (err) {
    console.log(err);
  }
};

exports.handleCandidateBehaviour = async (req, res) => {
  try {
    const client = await MongoClient.connect(uri);
    const db = client.db("AbleLyf");
    let getData = await db.collection("candidateBehaviour").find({})?.toArray();
    let getDataB = await db.collection("candidates").find({})?.toArray();

    let unionArr = [];
    for (let i = 0; i < getData?.reverse()?.length; i++) {
      for (let j = 0; j < getDataB.length; j++) {
        if (getData[i].name === getDataB[j].name) {
          const mergedObject = { ...getData[i], ...getDataB[j] };
          unionArr.push(mergedObject);
          break;
        }
      }
    }
    await client.close();
    res.json({
      msg: getData,
      msgB: getDataB,
      all: unionArr,
    });
  } catch (err) {
    console.log(err);
  }
};

exports.handleOneBehave = async (req, res) => {
  try {
    const client = await MongoClient.connect(uri);
    const db = client.db("AbleLyf");
    console.log(req.params.id);
    let getDataB = await db
      .collection("candidates")
      .findOne({ _id: new ObjectId(req.params.id) });
    let merge = getDataB;
    if (getDataB) {
      let getData = await db
        .collection("candidateBehaviour")
        .findOne({ name: getDataB.name });
      merge = { ...getData, ...getDataB };
    }
    await client.close();
    res.json({
      msg: merge,
    });
  } catch (err) {
    console.log(err);
  }
};
