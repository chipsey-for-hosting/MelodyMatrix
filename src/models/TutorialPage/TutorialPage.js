import {
  Box,
  Button,
  createTheme,
  Paper,
  Slider,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid2";
import React, { useEffect, useRef, useState } from "react";
import "./TutorialPage.css";
import { BLACK_INDEXES, NOTES } from "../../config/const";
import Wad from "web-audio-daw";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import StopIcon from "@mui/icons-material/Stop";
import PauseIcon from "@mui/icons-material/Pause";
import ChangeHistoryIcon from "@mui/icons-material/ChangeHistory";
import CropSquareIcon from "@mui/icons-material/CropSquare";
import ExtensionIcon from "@mui/icons-material/Extension";
import CircleIcon from "@mui/icons-material/Circle";
import HomeIcon from "@mui/icons-material/Home";

const TutorialPage = ({ midis }) => {
  const theme = createTheme({
    palette: {
      ochre: {
        main: "#FFFFF",
        light: "#FFFFF",
        dark: "#FFFFF",
        contrastText: "#FFFFF",
      },
    },
  });
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const noteWidth = screenWidth / 57;
  const [leftNotes, setLeftNotes] = useState(null);
  const [rightNotes, setRightNotes] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [fps, setFps] = useState(50);
  const [totalDistance, setTotalDistance] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentRightNoteIndex, setCurrentRightNoteIndex] = useState(-1);
  const [currentLeftNoteIndex, setCurrentLeftNoteIndex] = useState(-1);
  const [timeUnit, setTimeUnit] = useState(200);
  const [currentTime, setCurrentTime] = useState(0);
  const activeNotes = useRef(new Map());
  const [instrument, setInstrument] = useState("sine");
  const [leftChannel, setLeftChannel] = useState(0);
  const [rightChannel, setRightChannel] = useState(1);

  const playNote = (note, duration, time) => {
    try {
      // Stop all notes if the time mismatch occurs
      if (currentTime !== time) {
        activeNotes.current.forEach((noteInstance) => noteInstance.stop());
        activeNotes.current.clear();
      }

      setCurrentTime(time);

      const noteInstance = new Wad({ source: instrument });
      noteInstance.play({
        pitch: note,
        label: note,
        env: { hold: duration > 0 ? duration : 0.5 },
      });

      activeNotes.current.set(note, noteInstance);
    } catch (error) {
      console.error("Error playing note:", error.message);
    }
  };

  useEffect(() => {
    if (!isPlaying) return;

    const interval = 1000 / fps;
    const distancePerTick = (timeUnit * interval) / 1000;

    const intervalId = setInterval(() => {
      setTotalDistance((prevDistance) => prevDistance + distancePerTick);
    }, interval);

    return () => clearInterval(intervalId);
  }, [isPlaying, timeUnit, fps]);

  const togglePlaying = () => {
    setIsPlaying(!isPlaying);
  };

  const stop = () => {
    setIsPlaying(false);
    setTotalDistance(0);
    setCurrentLeftNoteIndex(-1);
    setCurrentRightNoteIndex(-1);
  };

  useEffect(() => {
    if (midis && midis.length > 0) {
      setIsLoading(true);
      console.log("Channels: " + midis.length);

      setRightNotes(midis[leftChannel]?.notes);
      if (midis.length > 1) {
        setLeftNotes(midis[rightChannel]?.notes);
      }
      setIsLoading(false);
    }

    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [midis, leftChannel, rightChannel]);

  const getNoteYPosition = (midiNote) => {
    const isBlackKey = BLACK_INDEXES.includes(midiNote);
    return (
      (midiNote -
        12 -
        BLACK_INDEXES.filter((index) => index < midiNote).length) *
        noteWidth -
      (isBlackKey ? noteWidth / 3 : 0)
    );
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      switch (event.code) {
        case "KeyO": {
          setIsPlaying(false);
          break;
        }
        case "KeyI":
        case "KeyS": {
          stop();
          break;
        }
        case "KeyP":
        case " ": {
          setIsPlaying(true);
          break;
        }
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isPlaying]);

  return (
    <div>
      {isLoading ? (
        <div>Loading</div>
      ) : (
        <div>
          <div className="tutorial-background"></div>
          <section id="pianoRoll">
            <div className="controllers ml-2">
              <Button
                variant="outlined"
                startIcon={isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
                color="ochre"
                sx={{ fontSize: noteWidth * 0.6, width: noteWidth * 5.5 }}
                onClick={togglePlaying}
                className="invisible-option"
              >
                {isPlaying ? "Pause" : "Play"}
              </Button>
              <Button
                variant="outlined"
                startIcon={<StopIcon />}
                color="ochre"
                sx={{ fontSize: noteWidth * 0.6, width: noteWidth * 5.5 }}
                onClick={stop}
                className="invisible-option"
              >
                Stop
              </Button>
              <Button
                variant="outlined"
                startIcon={<HomeIcon />}
                color="ochre"
                sx={{ fontSize: noteWidth * 0.6, width: noteWidth * 5.5 }}
                onClick={() => {
                  window.location.reload();
                }}
                className="invisible-option"
              >
                Home
              </Button>
              <Paper
                className="invisible-option"
                sx={{
                  marginTop: "2rem",
                  padding: "1rem",
                  border: "1px solid white",
                  background: "rgba(0,0,0,0)",
                  color: "white",
                  maxWidth: noteWidth * 6,
                }}
                elevation={0}
              >
                <Typography fontSize={13}>MIDI Size</Typography>
                <Slider
                  aria-label="Small steps"
                  defaultValue={200}
                  step={20}
                  marks
                  color="white"
                  min={100}
                  max={500}
                  valueLabelDisplay="auto"
                  onChange={(event, value) => setTimeUnit(value)}
                />
              </Paper>
              <Paper
                className="invisible-option"
                sx={{
                  padding: "1rem",
                  border: "1px solid white",
                  background: "rgba(0,0,0,0)",
                  color: "white",
                  maxWidth: noteWidth * 6,
                }}
                elevation={0}
              >
                <Typography fontSize={13} marginBottom={1}>
                  Instrument
                </Typography>
                <CircleIcon
                  onClick={() => setInstrument("sine")}
                  style={{
                    cursor: "pointer",
                    opacity: instrument === "sine" ? 1 : 0.3,
                  }}
                />
                <CropSquareIcon
                  onClick={() => setInstrument("square")}
                  style={{
                    cursor: "pointer",
                    opacity: instrument === "square" ? 1 : 0.3,
                    marginLeft: noteWidth / 3,
                  }}
                />
                <ExtensionIcon
                  onClick={() => setInstrument("sawtooth")}
                  style={{
                    cursor: "pointer",
                    opacity: instrument === "sawtooth" ? 1 : 0.3,
                    marginLeft: noteWidth / 3,
                  }}
                />
                <ChangeHistoryIcon
                  onClick={() => setInstrument("triangle")}
                  style={{
                    cursor: "pointer",
                    opacity: instrument === "triangle" ? 1 : 0.3,
                    marginLeft: noteWidth / 3,
                  }}
                />
              </Paper>
              {midis?.length > 2 && (
                <>
                  <Paper
                    className="invisible-option"
                    sx={{
                      padding: "1rem",
                      border: "1px solid white",
                      background: "rgba(0,0,0,0)",
                      marginTop: "2rem",
                      color: "white",
                      maxWidth: noteWidth * 10,
                    }}
                    elevation={0}
                  >
                    <Typography fontSize={13} marginBottom={1}>
                      Select Channel 1
                    </Typography>
                    {midis.map((channel, index) => {
                      return (
                        <Button
                          size="small"
                          disabled={index === rightChannel}
                          onClick={() => setLeftChannel(index)}
                          key={index}
                          variant={
                            leftChannel === index ? "contained" : "outlined"
                          }
                          sx={{
                            marginRight: "0.3rem",
                            fontSize: "0.6rem",
                            paddingLeft: 0,
                            paddingRight: 0,
                          }}
                        >
                          {index + 1}
                        </Button>
                      );
                    })}
                  </Paper>
                  <Paper
                    className="invisible-option"
                    sx={{
                      padding: "1rem",
                      border: "1px solid white",
                      background: "rgba(0,0,0,0)",
                      color: "white",
                      maxWidth: noteWidth * 10,
                    }}
                    elevation={0}
                  >
                    <Typography fontSize={13} marginBottom={1}>
                      Select Channel 2
                    </Typography>
                    {midis.map((channel, index) => {
                      return (
                        <Button
                          size="small"
                          disabled={index === leftChannel}
                          onClick={() => setRightChannel(index)}
                          key={index}
                          variant={
                            rightChannel === index ? "contained" : "outlined"
                          }
                          sx={{
                            marginRight: "0.3rem",
                            fontSize: "0.6rem",
                            paddingLeft: 0,
                            paddingRight: 0,
                          }}
                        >
                          {index + 1}
                        </Button>
                      );
                    })}
                  </Paper>
                </>
              )}
            </div>
            <div style={{ height: "150vh" }}></div>
            {leftNotes?.length > 0 &&
              leftNotes.map((note, index) => {
                const startY = note.time * timeUnit + 1000;
                const height = note.duration * timeUnit;
                const startX = getNoteYPosition(note.midi);
                if (
                  startY - totalDistance < 640 &&
                  startY - totalDistance > 600 &&
                  index > currentLeftNoteIndex
                ) {
                  setCurrentLeftNoteIndex(index);
                  // console.log(JSON.stringify(note?.name));
                  playNote(note?.name, note?.duration);
                }
                return (
                  <div
                    key={index}
                    className="note-block"
                    style={{
                      position: "absolute",
                      left: `${startX}px`,
                      bottom: `${startY - totalDistance}px`,
                      width: BLACK_INDEXES.includes(note?.midi)
                        ? `${noteWidth / 1.5}px`
                        : `${noteWidth - 1}px`,
                      height: `${height}px`,
                      backgroundColor: "#75cbd9",
                      borderRadius: "0.7rem",
                      fontSize: BLACK_INDEXES.includes(note?.midi)
                        ? noteWidth / 3
                        : noteWidth / 2,
                      textAlign: "center",
                    }}
                  >
                    <div
                      style={{
                        top: `${height - 20}px`,
                        position: "relative",
                        fontWeight: "bold",
                        color: "black",
                      }}
                    >
                      {note?.name}
                    </div>
                  </div>
                );
              })}
            {rightNotes?.length > 0 &&
              rightNotes.map((note, index) => {
                const startY = note.time * timeUnit + 1000;
                const height = note.duration * timeUnit;
                const startX = getNoteYPosition(note.midi);

                if (
                  startY - totalDistance < 640 &&
                  startY - totalDistance > 600 &&
                  index > currentRightNoteIndex
                ) {
                  setCurrentRightNoteIndex(index);
                  // console.log(JSON.stringify(note?.name));
                  playNote(note?.name, note?.duration);
                }
                return (
                  <div
                    key={index}
                    className="note-block"
                    style={{
                      position: "absolute",
                      left: `${startX}px`,
                      bottom: `${startY - totalDistance}px`,
                      width: BLACK_INDEXES.includes(note?.midi)
                        ? `${noteWidth / 1.5}px`
                        : `${noteWidth - 1}px`,
                      height: `${height}px`,
                      backgroundColor: "#75d97a",
                      borderRadius: "0.7rem",
                      fontSize: BLACK_INDEXES.includes(note?.midi)
                        ? noteWidth / 3
                        : noteWidth / 2,
                      textAlign: "center",
                    }}
                  >
                    <div
                      style={{
                        top: `${height - 20}px`,
                        position: "relative",
                        fontWeight: "bold",
                        color: "black",
                      }}
                    >
                      {note?.name}
                    </div>
                  </div>
                );
              })}
          </section>

          <section className="text-center">
            <div id="piano" className="text-center">
              {NOTES.map((note, index, array) => {
                const prevNote = index > 0 ? array[index - 1] : null;
                return (
                  <div
                    key={index}
                    className={`key ${note.color}`}
                    style={{
                      fontSize:
                        note?.color === "black"
                          ? noteWidth / 3
                          : noteWidth / 2.4,
                      width:
                        note?.color === "white"
                          ? noteWidth - 1
                          : noteWidth / 1.5 - 0.5,
                      marginLeft:
                        note?.color === "black"
                          ? -noteWidth / 3
                          : prevNote?.color === "black"
                            ? -noteWidth / 3 - 0.5
                            : 0,
                      marginRight: note?.color === "black" ? 0 : 0,
                      position: "relative",
                      border: "0.5px solid black",
                      borderBottomLeftRadius: "0.2rem",
                      borderBottomRightRadius: "0.2rem",
                      borderTop: "2px solid grey",
                    }}
                  >
                    <div
                      style={{
                        position: "relative",
                        top: note?.color === "black" ? "4rem" : "8rem",
                        color: note?.color === "black" ? "grey" : "black",
                        fontWeight: "bold",
                      }}
                    >
                      {note?.note}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      )}
    </div>
  );
};

export default TutorialPage;
