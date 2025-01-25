import React, { useEffect } from "react";

const SplineViewer = () => {
  useEffect(() => {
    const script = document.createElement("script");
    script.type = "module";
    script.src =
      "https://unpkg.com/@splinetool/viewer@1.9.59/build/spline-viewer.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div>
      <spline-viewer
        url="https://prod.spline.design/YBcytwfE9bbkmNim/scene.splinecode"
        style={{ width: "100%", height: "100vh" }}
      ></spline-viewer>
    </div>
  );
};

export default SplineViewer;
