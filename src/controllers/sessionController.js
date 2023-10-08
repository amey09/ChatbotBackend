import Session from "../models/sessionModel.js";
import User from "../models/userModel.js";
import asyncHandler from "express-async-handler";

const createSession = asyncHandler(async (req, res) => {
  const { datetime } = req.body;

  const user = await User.findOne({ _id: req.user._id });

  if (!req.user._id.equals(user._id)) {
    res.status(401).json({
      message: "Unauthorized: You cannot book for someone else",
    });
  }

  const session = await Session.create({
    wardenID: req.user._id,
    wardenName: user.name,
    uuid: null,
    datetime: datetime,
    mode: null,
  });

  if (session) {
    res.status(201).json({
      message: "Session created successfully",
      session: {
        _id: session._id,
        uuid: session.uuid,
        wardenID: session.wardenID,
        wardenName: session.wardenName,
        datetime: session.datetime,
        Mode: session.mode,
      },
    });
  } else {
    res.status(401);
    throw new Error("Invalid session data");
  }
});

const bookSession = asyncHandler(async (req, res) => {
  const { sessionID } = req.body;

  const user = await User.findOne({ _id: req.user._id });
  if (!user) {
    res.status(404).json({ error: "User not found" });
  }

  if (!req.user._id.equals(user._id)) {
    res.status(401).json({
      message: "Unauthorized: You cannot book for someone else",
    });
  }

  if (user.isWarden) {
    res.status(403);
    throw new Error("Wardens are not allowed to book sessions");
  }

  try {
    await Session.updateOne({ _id: sessionID }, { $set: { uuid: user._id } });
  } catch (error) {
    res.status(500);
    throw new Error("Internal Server Error");
  }
  const updatedSession = await Session.findOne({ _id: sessionID });
  res.status(200).json({
    message: "Booking successfull",
    session: updatedSession,
  });
});

const getSessions = asyncHandler(async (req, res) => {
  const currentDate = new Date();
  try {
    const user = await User.findOne({ _id: req.user._id });

    if (!user) {
      res.status(404).json({
        message: "User not found",
      });
    }

    if (!req.user._id.equals(user._id)) {
      res.status(401).json({
        message: "Unauthorized: Email does not match the logged-in user",
      });
    }

    const uuid = user._id;

    if (user.isWarden === false) {
      try {
        const availableSessions = await Session.find({
          uuid: null,
          datetime: { $gte: currentDate },
        });
        const bookedSessions = await Session.find({
          uuid,
          datetime: { $gte: currentDate },
        });

        if (bookedSessions.length > 0) {
          res.status(200).json({
            message: "Booked sessions found",
            bookedSessions,
            availableSessions:
              availableSessions.length > 0
                ? availableSessions
                : "No new sessions to book",
          });
        } else {
          if (availableSessions.length > 0) {
            res.status(200).json({
              message: "No booked sessions found",
              availableSessions,
            });
          } else {
            res.status(404).json({
              message: "We are not providing sevice right now",
            });
          }
        }
      } catch (error) {
        console.error("Error:", error);
        res.status(500).json({
          message: "Internal Server Error",
        });
      }
    } else {
      try {
        const unBookedSessions = await Session.find({
          $and: [
            { uuid: null },
            { wardenID: uuid },
            { datetime: { $gte: currentDate } },
          ],
        });
        const upComingSessions = await Session.find({
          $and: [
            { uuid: { $ne: null } },
            { wardenID: uuid },
            { datetime: { $gte: currentDate } },
          ],
        });

        console.log(unBookedSessions);
        console.log(upComingSessions);

        if (upComingSessions.length > 0) {
          res.status(200).json({
            message: "Upcoming sessions found",
            upComingSessions,
            unBookedSessions:
              unBookedSessions.length > 0
                ? unBookedSessions
                : "Please create a session",
          });
        } else {
          res.status(200).json({
            unBookedSessions: unBookedSessions,
          });
        }
      } catch (error) {
        console.error("Error:", error);
        res.status(500).json({
          message: "Internal Server Error",
        });
      }
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
});

const deleteSession = asyncHandler(async (req, res) => {
  const { sessionID } = req.body;

  const session = await Session.findOne({ _id: sessionID });

  if (!req.user._id.equals(session.wardenID)) {
    res.status(401).json({
      message: "Unauthorized: You cannot delete sessions of other people",
    });
  }

  if (session) {
    await session.deleteOne();
    res.status(200).json({ message: "Session deleted successfully" });
  } else {
    res.status(404);
    throw new Error("Session not found");
  }
});

export { createSession, bookSession, getSessions, deleteSession };
