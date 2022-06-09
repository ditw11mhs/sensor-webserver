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

    if (result._count.Logs > 10) {
      const oldestLog = await prisma.datalog.findFirst({
        where: { DeviceID: String(DeviceID) },
        orderBy: { createdAt: "asc" },
      });
      const deleteoldestLog = await prisma.datalog.delete({
        where: { createdAt: oldestLog.createdAt },
      });
      res.json(result);
    } else {
      res.json(result);
    }
  }
);

// Get stream from Database
app.get("/datastream/get", validate(userPayload, {}, {}), async (req, res) => {
  const { DeviceID } = req.body;
  const result = await prisma.datastream.findUnique({
    where: { DeviceID: String(DeviceID) },
  });
  res.json([result]);
});

// Get logs from Database
app.get("/datalog/get", validate(userPayload, {}, {}), async (req, res) => {
  const { DeviceID } = req.body;
  const result = await prisma.datastream.findUnique({
    where: { DeviceID: String(DeviceID) },
    include: { Logs: true },
  });
  res.json([result]);
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
