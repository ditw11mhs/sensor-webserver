const express = require("express");
const { PrismaClient } = require("@prisma/client");
const { validate, ValidationError, Joi } = require("express-validation");

const prisma = new PrismaClient();
const app = express();

app.use(express.json());

const esp32Payload = {
  body: Joi.object({
    DeviceID: Joi.string().required(),
    Sensor1: Joi.number().required(),
    Sensor2: Joi.number().required(),
    Sensor3: Joi.number().required(),
  }),
};

const userPayload={
  body: Joi.object({
    UserID: Joi.string().required(),
    DeviceID: Joi.string().required(),
  })
}


// Test
app.get("/", (req, res) => {
  res.send("Test");
});

// Add to Database
app.post(
  "/datastream/add",
  validate(esp32Payload, {}, {}),
  async (req, res) => {
    const { DeviceID, Sensor1, Sensor2, Sensor3 } = req.body;
    res.json([DeviceID, Sensor1, Sensor2, Sensor3]);
  }
);

// Get from Database
app.get("/datastream/get",validate(userPayload,{},{}),async (req,res)=>{
  const {UserID,DeviceID}=req.body;
  res.json([UserID,DeviceID]);
})



app.use(function (err, req, res, next) {
  if (err instanceof ValidationError) {
    return res.status(err.statusCode).json(err);
  }

  return res.status(500).json(err);
});

port = 3000;
const server = app.listen(port, () =>
  console.log("Server is running on port " + port)
);
