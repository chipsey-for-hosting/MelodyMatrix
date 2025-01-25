import { Box, Button, Paper } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import React, { useRef, useState } from "react";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { Midi } from "@tonejs/midi";
import SplineViewer from "../Spline/spline";
import "./uploadPage.css";

const theme = createTheme({
  palette: {
    ochre: {
      main: "#FFFFFF",
      light: "#E9DB5D",
      dark: "#A29415",
      contrastText: "#242105",
    },
  },
});

const UploadPage = ({ onMidiDataParsed }) => {
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const noteWidth = screenWidth / 57;

  const fileInputRef = useRef();

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      parseMidi(file);
    }
  };

  const parseMidi = async (file) => {
    const arrayBuffer = await file.arrayBuffer();
    const midi = new Midi(arrayBuffer);
    // console.log(midi.tracks);
    onMidiDataParsed(midi.tracks);
  };

  return (
    <ThemeProvider theme={theme}>
      <Grid container>
        <Grid size={12}>
          <div className="spline">
            <SplineViewer />
          </div>
          <div className="content">
            {/* <div className="mb-3">
              <img
                src="media/images/piano.png"
                alt="logo"
                style={{ width: "3vw" }}
              />
            </div> */}
            <div
              style={{
                marginBottom: "0.5rem",
                fontSize: noteWidth * 2.5,
                fontWeight: "bold",
                background:
                  "linear-gradient(0deg,rgb(31, 31, 31),rgb(111, 105, 150))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Melody Matrix
            </div>
            <div
              style={{
                marginBottom: "3rem",
                fontSize: noteWidth * 0.7,
                // letterSpacing: "0.2rem",
                background:
                  "linear-gradient(0deg,rgb(31, 31, 31),rgb(111, 105, 150))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Powered by Chipsey
            </div>

            <div>
              <input
                type="file"
                accept=".mid"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handleFileChange}
              />
              <Button
                variant="outlined"
                startIcon={<CloudUploadIcon />}
                color="ochre"
                sx={{
                  fontSize: noteWidth * 0.4,
                  borderRadius: "3rem",
                  padding: "0.5rem 1rem",
                  border: "0.1rem solid rgb(30, 30, 30)",
                  color: "rgb(166, 166, 166)",
                }}
                onClick={handleUploadClick}
              >
                Upload Midi
              </Button>
            </div>
          </div>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
};

export default UploadPage;
