import "./App.css";
import { useState } from "react";
import axios from "axios";

function App() {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<any>(null);

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    const response = await axios.post(
      "http://localhost:8000/analyze",
      formData,
    );

    setResult(response.data);
  };

  return (
    <div
      style={{
        padding: "40px",
        fontFamily: "Arial",
      }}
    >
      <h1>TrustLens</h1>

      <input
        type="file"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />

      <br />
      <br />

      <button onClick={handleUpload}>Analyze</button>

      {result && (
        <div style={{ marginTop: "20px" }}>
          <h2>Result</h2>

          <ul>
            {result.findings.map((finding: string, index: number) => (
              <li key={index}>{finding}</li>
            ))}
          </ul>

          <h3>Analysis</h3>

          <p>{result.explanation}</p>
        </div>
      )}
    </div>
  );
}

export default App;
