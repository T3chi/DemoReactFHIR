// https://github.com/smart-on-fhir/sample-patients
// https://darrendevitt.com/fhir-test-data-from-synthea/
import React, { useState } from "react";
import "./App.css";

function App() {
  const [patientId, setPatientId] = useState("");
  const [patientData, setPatientData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Any publicly available Test FHIR server with
  // patients will work, but HAPI's public server is very commonly used
  // not a ton of patient encounter data though, which is unfortunate
  const fhirServerUrl = "https://hapi.fhir.org/baseR4";

  const fetchPatientData = async () => {
    if (!patientId.trim()) {
      setError("Please enter a patient ID");
      return;
    }

    setLoading(true);
    setError(null);
    setPatientData(null);

    try {
      const response = await fetch(
        `${fhirServerUrl}/Patient/${patientId.trim()}`,
      );

      if (!response.ok) {
        throw new Error(`Patient not found (HTTP ${response.status})`);
      }

      const data = await response.json();
      setPatientData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchPatientData();
  };

  // Try these example patient IDs on HAPI server:
  // - 592442 (has name, birth date, etc.)
  // - 592443
  // - 592444

  return (
    <div className="App">
      <header className="App-header">
        <h1>Query FHIR Test Patient </h1>
      </header>
      <main>
        <form onSubmit={handleSubmit}>
          <div className="search-container">
            <input
              type="text"
              value={patientId}
              onChange={(e) => setPatientId(e.target.value)}
              placeholder="Enter HAPI Test Patient ID"
              disabled={loading}
            />
            <button type="submit" disabled={loading}>
              {loading ? "Searching..." : "Search"}
            </button>
          </div>
          <p className="hint">
            Try these tested Patient IDs on HAPI server: 592441, 592442
          </p>
        </form>

        {error && <div className="error">{error}</div>}

        {patientData && (
          <div className="patient-info">
            <h2>Patient Information</h2>
            <div className="patient-details">
              <p>
                <strong>ID:</strong> {patientData.id}
              </p>
              {patientData.name && (
                <p>
                  <strong>Name:</strong> {patientData.name[0].given?.join(" ")}{" "}
                  {patientData.name[0].family}
                </p>
              )}
              {patientData.birthDate && (
                <p>
                  <strong>Birth Date:</strong> {patientData.birthDate}
                </p>
              )}
              {patientData.gender && (
                <p>
                  <strong>Gender:</strong> {patientData.gender}
                </p>
              )}
              {patientData.address && (
                <div>
                  <strong>Address:</strong>
                  <ul>
                    {patientData.address[0].line?.map((line, i) => (
                      <li key={i}>{line}</li>
                    ))}
                    <li>
                      {patientData.address[0].city},{" "}
                      {patientData.address[0].state}{" "}
                      {patientData.address[0].postalCode}
                    </li>
                  </ul>
                </div>
              )}
            </div>
            <details>
              <summary>View Raw JSON</summary>
              <pre>{JSON.stringify(patientData, null, 2)}</pre>
            </details>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
