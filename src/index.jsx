// Future idea: update patients to have rich test data
// 	https://github.com/smart-on-fhir/sample-patients
// 	https://darrendevitt.com/fhir-test-data-from-synthea/
import React from "react";
import ReactDOM from "react-dom/client";

//  Our main UI element
import App from "./App";

ReactDOM.createRoot(document.getElementById("root")).render(
	// strict mode so we're notified of potential
	// issues earlier than later
	<React.StrictMode>
		<App />
	</React.StrictMode>,
);
