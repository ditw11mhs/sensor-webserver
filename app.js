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

const userPayload = {
  body: Joi.object({
    DeviceID: Joi.string().required(),
  }),
};

const servoUserPayload = {
  body: Joi.object({
    DeviceID: Joi.string().required(),
    Angle: Joi.number().required(),
  }),
};

// Test
app.get("/", (req, res) => {
  res.send("Test");
});

// Update Data in Database
app.post(
  "/datastream/update",
  validate(esp32Payload, {}, {}),
  async (req, res) => {
    const { DeviceID, Sensor1, Sensor2, Sensor3 } = req.body;
    const result = await prisma.datastream.upsert({
      where: { DeviceID: String(DeviceID) },
      update: {
        Sensor1: Number(Sensor1),
        Sensor2: Number(Sensor2),
        Sensor3: Number(Sensor3),
        createdAt: new Date(),
        Logs: {
          create: {
            Sensor1: Number(Sensor1),
            Sensor2: Number(Sensor2),
            Sensor3: Number(Sensor3),
          },
        },
      },
      create: {
        DeviceID: DeviceID,
        Sensor1: Number(Sensor1),
        Sensor2: Number(Sensor2),
        Sensor3: Number(Sensor3),
        Servo: {
          create: {
            Angle: 0.0,
          },
        },
        Logs: {
          create: {
            Sensor1: Number(Sensor1),
            Sensor2: Number(Sensor2),
            Sensor3: Number(Sensor3),
          },
        },
      },
      include: {
        _count: {
          select: { Logs: true },
        },
      },
    });

    if (result._count.Logs > 100) {
      const oldestLog = await prisma.datalog.findFirst({
        where: { DeviceID: String(DeviceID) },
        orderBy: { createdAt: "asc" },
      });
      const deleteoldestLog = await prisma.datalog.delete({
        where: { createdAt: oldestLog.createdAt },
      });
      res.status(200);
    } else {
      res.status(200);
    }
  }
);

// Get stream from Database
app.get("/datastream/get", validate(userPayload, {}, {}), async (req, res) => {
  const { DeviceID } = req.body;
  const result = await prisma.datastream.findUnique({
    where: { DeviceID: String(DeviceID) },
    select: {
      DeviceID: false,
      Sensor1: true,
      Sensor2: true,
      Sensor3: true,
      createdAt: false,
    },
  });
  res.json([result]);
});

// Get logs from Database
app.get("/datalog/get", validate(userPayload, {}, {}), async (req, res) => {
  const { DeviceID } = req.body;
  const result = await prisma.datalog.findMany({
    where: { DeviceID: String(DeviceID) },
  });
  res.json([result]);
});

// Update Servo Angle
app.post(
  "/servo/update",
  validate(servoUserPayload, {}, {}),
  async (req, res) => {
    const { DeviceID, Angle } = req.body;
    const result = await prisma.servo.update({
      where: { DeviceID: String(DeviceID) },
      data: {
        Angle: Number(Angle),
        createdAt: new Date(),
      },
    });
    res.status(200);
  }
);

// Get Servo Angle
app.get("/servo/get", validate(userPayload, {}, {}), async (req, res) => {
  const { DeviceID } = req.body;
  const result = await prisma.servo.findUnique({
    where: { DeviceID: String(DeviceID) },
    select: {
      DeviceID: false,
      Angle: true,
      createdAt: false,
    },
  });
});

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
