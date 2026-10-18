import { useMemo, useRef, useState } from "react";
import type { ChangeEvent, DragEvent } from "react";
import axios from "axios";
import "./App.css";

type AnalysisResult = {
  findings: string[];
  summary: string;
  explanation: string;
};

const API_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:8000"
).replace(/\/$/, "");

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_FILE_SIZE = 15 * 1024 * 1024;

function Icon({ name, size = 20 }: { name: string; size?: number }) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.7,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true as const,
  };

  if (name === "scan")
    return (
      <svg {...common}>
        <path d="M4 8V5a1 1 0 0 1 1-1h3M16 4h3a1 1 0 0 1 1 1v3M20 16v3a1 1 0 0 1-1 1h-3M8 20H5a1 1 0 0 1-1-1v-3" />
        <circle cx="12" cy="12" r="4" />
        <path d="M12 10v4m-2-2h4" />
      </svg>
    );

  if (name === "upload")
    return (
      <svg {...common}>
        <path d="M12 16V4m-4 4 4-4 4 4" />
        <path d="M4 15v4a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-4" />
      </svg>
    );

  if (name === "shield")
    return (
      <svg {...common}>
        <path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    );

  if (name === "image")
    return (
      <svg {...common}>
        <rect x="3" y="3" width="18" height="18" rx="3" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <path d="m21 15-5-5L5 21" />
      </svg>
    );

  if (name === "arrow")
    return (
      <svg {...common}>
        <path d="M5 12h14m-6-6 6 6-6 6" />
      </svg>
    );

  if (name === "check")
    return (
      <svg {...common}>
        <path d="m5 12 4 4L19 6" />
      </svg>
    );

  if (name === "refresh")
    return (
      <svg {...common}>
        <path d="M20 7v5h-5M4 17v-5h5" />
        <path d="M5.6 9A7 7 0 0 1 17.5 6L20 12M4 12l2.5 6A7 7 0 0 0 18.4 15" />
      </svg>
    );

  return (
    <svg {...common}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5m0-8h.01" />
    </svg>
  );
}

function App() {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [dragging, setDragging] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const previewUrl = useMemo(
    () => (file ? URL.createObjectURL(file) : ""),
    [file],
  );

  // Extract the AI-generation probability from backend findings.
  const aiProbability = useMemo(() => {
    const finding = result?.findings?.find((item) =>
      /AI generation probability/i.test(item),
    );

    if (!finding) return null;

    const match = finding.match(/([0-9]+(?:\.[0-9]+)?)/);

    if (!match) return null;

    const value = Number(match[1]);

    return value <= 1 ? Math.round(value * 100) : Math.round(value);
  }, [result]);

  const chooseFile = (nextFile?: File) => {
    setError("");
    setResult(null);

    if (!nextFile) return;

    if (!ACCEPTED_TYPES.includes(nextFile.type)) {
      setFile(null);

      if (inputRef.current) inputRef.current.value = "";

      setError("Please choose a JPG, PNG, or WebP image.");
      return;
    }

    if (nextFile.size > MAX_FILE_SIZE) {
      setFile(null);

      if (inputRef.current) inputRef.current.value = "";

      setError(
        "This image is larger than 15 MB. Choose a smaller file to continue.",
      );
      return;
    }

    setFile(nextFile);
  };

  const onInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    chooseFile(event.target.files?.[0]);
  };

  const onDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragging(false);
    chooseFile(event.dataTransfer.files?.[0]);
  };

  const analyzeImage = async () => {
    if (!file) return;

    setLoading(true);
    setError("");
    setResult(null);

    const body = new FormData();
    body.append("file", file);

    try {
      const response = await axios.post<AnalysisResult>(
        `${API_URL}/analyze`,
        body,
        { timeout: 180000 },
      );

      setResult(response.data);
    } catch (err) {
      if (axios.isAxiosError(err) && err.code === "ECONNABORTED") {
        setError(
          "The analysis is taking longer than expected. Please try again in a moment.",
        );
      } else if (axios.isAxiosError(err) && !err.response) {
        setError(
          "Could not reach the TrustLens analysis service. Check that the backend is running and the API URL is configured correctly.",
        );
      } else {
        setError(
          "We couldn’t analyze this image. Please try another image or try again shortly.",
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setFile(null);
    setResult(null);
    setError("");

    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="app-shell">
      <header className="topbar">
        <a className="brand" href="#top" aria-label="TrustLens home">
          <span className="brand-mark">
            <Icon name="scan" size={23} />
          </span>

          <span>
            trust<span className="brand-accent">lens</span>
            <small>MEDIA INTELLIGENCE</small>
          </span>
        </a>

        <nav className="top-nav" aria-label="Main navigation">
          <a className="nav-active" href="#analyze">
            Image analysis
          </a>
          <a href="#how-it-works">How it works</a>
        </nav>

        <div className="header-status">
          <span className="status-dot" /> Analysis workspace
        </div>
      </header>

      <main id="top" className="main-content">
        <section className="hero">
          <h1>
            Look closer.
            <br />
            <span>Know what’s real.</span>
          </h1>

          <p className="hero-copy">
            Explore the signals behind an image. TrustLens combines visual
            forensics and AI detection to help you assess where an image may
            have come from.
          </p>
        </section>

        <section className="workspace" id="analyze">
          <div className="workspace-heading">
            <div>
              <h2>Inspect an image</h2>
              <p>Upload an image to review its authenticity signals.</p>
            </div>
          </div>

          <div className="workspace-grid">
            <div className="upload-panel">
              <div className="panel-topline">
                <span>IMAGE INPUT</span>
              </div>

              <div
                className={`dropzone ${dragging ? "is-dragging" : ""} ${file ? "has-file" : ""}`}
                onDragOver={(event) => {
                  event.preventDefault();
                  setDragging(true);
                }}
                onDragLeave={() => setDragging(false)}
                onDrop={onDrop}
              >
                {file && previewUrl ? (
                  <div className="preview-wrap">
                    <img
                      src={previewUrl}
                      alt="Selected image preview"
                      className="image-preview"
                    />

                    <div className="preview-overlay">
                      <span className="file-type-pill">
                        <Icon name="image" size={14} /> READY TO ANALYZE
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="upload-empty">
                    <span className="upload-icon">
                      <Icon name="upload" size={25} />
                    </span>

                    <h3>Drop your image here</h3>
                    <p>or browse files from your device</p>

                    <button
                      className="secondary-button"
                      onClick={() => inputRef.current?.click()}
                    >
                      Choose image <Icon name="arrow" size={16} />
                    </button>

                    <div className="file-hint">
                      JPG, PNG, WEBP <span>·</span> UP TO 15 MB
                    </div>
                  </div>
                )}

                <input
                  ref={inputRef}
                  className="visually-hidden"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={onInputChange}
                />
              </div>

              {file && (
                <div className="file-meta">
                  <span className="file-meta-icon">
                    <Icon name="image" size={18} />
                  </span>

                  <div className="file-meta-text">
                    <strong>{file.name}</strong>
                    <span>
                      {(file.size / (1024 * 1024)).toFixed(2)} MB · Image ready
                    </span>
                  </div>

                  <button
                    className="icon-button"
                    onClick={reset}
                    aria-label="Remove selected image"
                  >
                    ×
                  </button>
                </div>
              )}

              {error && (
                <div className="error-message" role="alert">
                  <Icon name="info" size={17} />
                  {error}
                </div>
              )}

              <button
                className="primary-button"
                disabled={!file || loading}
                onClick={analyzeImage}
              >
                {loading ? (
                  <>
                    <span className="spinner" /> Examining image…
                  </>
                ) : (
                  <>
                    Analyze image <Icon name="arrow" size={18} />
                  </>
                )}
              </button>

              <p className="privacy-note">
                <Icon name="shield" size={15} /> Your image is processed by the
                TrustLens analysis service.
              </p>
            </div>

            <div className={`results-panel ${result ? "results-ready" : ""}`}>
              <div className="panel-topline">
                <span>ANALYSIS REPORT</span>

                {result && (
                  <span className="complete-tag">
                    <span className="status-dot" /> COMPLETE
                  </span>
                )}
              </div>

              {!result && !loading && (
                <div className="report-empty">
                  <div className="report-graphic">
                    <div className="graphic-orbit orbit-one" />
                    <div className="graphic-orbit orbit-two" />

                    <div className="graphic-core">
                      <Icon name="scan" size={32} />
                    </div>

                    <span className="orbit-node node-one" />
                    <span className="orbit-node node-two" />
                    <span className="orbit-node node-three" />
                  </div>

                  <h3>Your findings will appear here</h3>

                  <p>
                    Once your image is analyzed, you’ll see its AI-generation
                    estimate and the supporting evidence behind the result.
                  </p>

                  <div className="report-checklist">
                    <span>
                      <i>
                        <Icon name="check" size={13} />
                      </i>{" "}
                      AI detection estimate
                    </span>

                    <span>
                      <i>
                        <Icon name="check" size={13} />
                      </i>{" "}
                      Image properties and signals
                    </span>

                    <span>
                      <i>
                        <Icon name="check" size={13} />
                      </i>{" "}
                      Plain-language explanation
                    </span>
                  </div>
                </div>
              )}

              {loading && (
                <div className="loading-state">
                  <div className="loading-orb">
                    <Icon name="scan" size={34} />
                  </div>

                  <h3>Examining your image</h3>

                  <p>
                    Checking image properties and authenticity signals. This can
                    take a little while.
                  </p>

                  <div className="loading-track">
                    <span />
                  </div>

                  <span className="loading-caption">
                    RUNNING ANALYSIS PIPELINE
                  </span>
                </div>
              )}

              {result && (
                <div className="report-content">
                  <div className="score-row">
                    <div>
                      <span className="metric-label">
                        AI-GENERATION ESTIMATE
                      </span>

                      <div className="big-score">
                        {aiProbability === null ? "—" : aiProbability}
                        <span>{aiProbability === null ? "" : "%"}</span>
                      </div>

                      <p className="score-subtitle">
                        {aiProbability === null
                          ? "No AI probability was returned"
                          : aiProbability >= 70
                            ? "Signals lean toward AI-generated"
                            : aiProbability >= 35
                              ? "Mixed signals detected"
                              : "Signals lean away from AI-generated"}
                      </p>
                    </div>

                    <div
                      className="score-ring"
                      style={
                        {
                          "--score": `${aiProbability ?? 0}%`,
                        } as React.CSSProperties
                      }
                    >
                      <div>
                        <strong>
                          {aiProbability === null ? "—" : `${aiProbability}%`}
                        </strong>
                        <span>AI ESTIMATE</span>
                      </div>
                    </div>
                  </div>

                  <div className="summary-block">
                    <div className="result-section-heading">
                      <h3>Assessment</h3>
                      <span className="small-label">SUMMARY</span>
                    </div>

                    <p>
                      {result.summary ||
                        result.explanation ||
                        "Analysis complete."}
                    </p>

                    {result.explanation &&
                      result.explanation !== result.summary && (
                        <p className="explanation-text">{result.explanation}</p>
                      )}
                  </div>

                  <div className="findings-block">
                    <div className="result-section-heading">
                      <h3>Signals observed</h3>
                      <span className="finding-count">
                        {result.findings?.length ?? 0}
                      </span>
                    </div>

                    {result.findings?.length ? (
                      <ul className="findings-list">
                        {result.findings.map((finding, index) => (
                          <li key={`${finding}-${index}`}>
                            <span className="finding-bullet">
                              <Icon name="check" size={13} />
                            </span>
                            {finding}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="muted-text">
                        No additional findings were returned.
                      </p>
                    )}
                  </div>

                  <div className="caution-note">
                    <Icon name="info" size={17} />
                    <p>
                      <strong>Use this as a guide, not a verdict.</strong> AI
                      detectors can make mistakes. Results are probabilistic and
                      should be considered alongside context and other evidence.
                    </p>
                  </div>

                  <button
                    className="secondary-button rerun-button"
                    onClick={reset}
                  >
                    <Icon name="refresh" size={16} /> Analyze another image
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="how-section" id="how-it-works">
          <div className="how-intro">
            <h2>One estimate. Supporting evidence.</h2>
            <p>
              TrustLens brings together multiple signals to create a more useful
              picture of an image’s potential origin.
            </p>
          </div>

          <div className="process-cards">
            <article>
              <div className="process-icon">
                <Icon name="image" size={21} />
              </div>
              <h3>Inspect the image</h3>
              <p>
                Review technical properties such as resolution, sharpness,
                noise, and available metadata.
              </p>
            </article>

            <article>
              <div className="process-icon">
                <Icon name="scan" size={21} />
              </div>
              <h3>Look for AI signals</h3>
              <p>
                Run the image through an AI-generated content detector and
                combine its output with other signals.
              </p>
            </article>

            <article>
              <div className="process-icon">
                <Icon name="shield" size={21} />
              </div>
              <h3>Understand the result</h3>
              <p>
                Read the assessment and supporting findings to make a more
                informed judgment.
              </p>
            </article>
          </div>
        </section>

        <section className="disclaimer-strip">
          <span className="disclaimer-icon">
            <Icon name="info" size={18} />
          </span>

          <p>
            <strong>A note on AI detection</strong> No detector can reliably
            identify every AI-generated image. Compression, editing, and missing
            metadata can affect results. TrustLens is an investigative aid, not
            a source of definitive proof.
          </p>
        </section>
      </main>

      <footer className="footer">
        <a className="footer-brand" href="#top">
          trust<span>lens</span>
        </a>

        <span>See the signals. Keep your judgment.</span>
        <span>© {new Date().getFullYear()} TrustLens</span>
      </footer>
    </div>
  );
}

export default App;
