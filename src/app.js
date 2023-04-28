const fs = require("fs");
const express = require("express");
const app = express();

// Importing products from userDetails.json file
const userDetails = JSON.parse(
  fs.readFileSync(`${__dirname}/data/userDetails.json`)
);

//Middlewares
app.use(express.json());

// Write PATCH endpoint for editing user details
// PATCH endpoint for updating user details
app.patch("/api/v1/details/:id", (req, res) => {
  const id = req.params.id;
  const { name, mail, number } = req.body;
  const userIndex = userDetails.findIndex(user => user.id == id);

  if (userIndex === -1) {
    return res.status(404).json({
      status: "failed",
      message: "User not found!",
    });
  }

  const updatedUser = {
    id: userDetails[userIndex].id,
    name: name || userDetails[userIndex].name,
    mail: mail || userDetails[userIndex].mail,
    number: number || userDetails[userIndex].number,
  };

  userDetails[userIndex] = updatedUser;

  fs.writeFile(
    `${__dirname}/data/userDetails.json`,
    JSON.stringify(userDetails),
    (err) => {
      if (err) {
        return res.status(500).json({
          status: "failed",
          message: "Server error",
        });
      }

      res.status(200).json({
        status: "success",
        message: `User details updated successfully for id: ${id}`,
        user: updatedUser,
      });
    }
  );
});


// POST endpoint for registering new user
app.post("/api/v1/details", (req, res) => {
  const newId = userDetails[userDetails.length - 1].id + 1;
  const { name, mail, number } = req.body;
  const newUser = { id: newId, name, mail, number };
  userDetails.push(newUser);
  fs.writeFile(
    `${__dirname}/data/userDetails.json`,
    JSON.stringify(userDetails),
    (err) => {
      res.status(201).json({
        status: "Success",
        message: "User registered successfully",
        data: {
          userDetails: newUser,
        },
      });
    }
  );
});

// GET endpoint for sending the details of users
app.get("/api/v1/details", (req, res) => {
  res.status(200).json({
    status: "Success",
    message: "Detail of users fetched successfully",
    data: {
      userDetails,
    },
  });
});

// GET endpoint for sending the details of users by id
app.get("/api/v1/userdetails/:id", (req, res) => {
  let { id } = req.params;
  id *= 1;
  const details = userDetails.find((details) => details.id === id);
  if (!details) {
    return res.status(404).send({
      status: "failed",
      message: "User not found!",
    });
  } else {
    res.status(200).send({
      status: "success",
      message: "Details of users fetched successfully",
      data: {
        details,
      },
    });
  }
});

module.exports = app;
