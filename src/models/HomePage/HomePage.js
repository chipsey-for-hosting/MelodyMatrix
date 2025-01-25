import React, { useState, useEffect } from "react";
import Grid from "@mui/material/Grid2";
import { Midi } from "@tonejs/midi";
import UploadPage from "../UploadScreen/UploadPage";
import TutorialPage from "../TutorialPage/TutorialPage";

const Home = () => {
  const [pageState, setPageState] = useState("UPLOAD");
  const [midiData, setMidiData] = useState(null);

  const handleMidiData = (data) => {
    try {
      setMidiData(data);
      console.log(midiData);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    if (midiData) {
      console.log("Updated MIDI Data:", midiData);
      setPageState("PLAY");
    }
  }, [midiData]);

  return (
    <Grid container>
      <Grid size={12}>
        {pageState === "UPLOAD" && (
          <UploadPage onMidiDataParsed={handleMidiData} />
        )}
        {pageState === "PLAY" && <TutorialPage midis={midiData} />}
      </Grid>
    </Grid>
  );
};

export default Home;
