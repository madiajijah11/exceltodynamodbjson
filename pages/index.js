import Head from "next/head";
import * as XLSX from "xlsx";
import { dynamifyObject } from "dynamify-json-object";
import { useState, useRef } from "react";

export default function Home() {
	const fileInput = useRef(null);
	const [normalJson, setNormalJson] = useState("");
	const [dynamodbJson, setdynamodbJson] = useState("");

	const handleSubmit = () => {
		//check files type
		if (fileInput.length === 0) {
			alert("Please select a file");
			return;
		}
		const fileName = fileInput.current.files[0].name;
		const fileExtension = fileName.split(".")[1];
		if (fileExtension !== "xlsx" && fileExtension !== "xls") {
			alert("Please select a xlsx file");
		} else {
			convertExcelToJson(fileInput);
		}
	};

	//convert excel to json
	const convertExcelToJson = (event) => {
		const reader = new FileReader();
		reader.readAsArrayBuffer(event.current.files[0]);
		reader.onload = (event) => {
			const data = event.target.result;
			const workbook = XLSX.read(data, { type: "binary" });
			const worksheet = workbook.Sheets[workbook.SheetNames[0]];
			const jsonObject = XLSX.utils.sheet_to_json(worksheet);

			const json = JSON.stringify(jsonObject, null, 4);
			setNormalJson(json);

			//convert normal json to dynamodb json
			dynamifyObject(jsonObject, (dynamoJson) => {
				const data = JSON.parse(dynamoJson);
				setdynamodbJson(JSON.stringify(data, null, 4));
			});
		};
	};

	return (
		<>
			<Head>
				<title>Excel to JSON and DynamoDB JSON</title>
				<meta name="description" content="Excel to JSON to DynamoDB JSON by madiajijah11" />
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<div className="container-fluid">
				<h1 className="text-center">Excel to JSON and DynamoDB JSON</h1>
				<div className="row">
					<div className="col-md-6">
						<div className="input-group mb-3">
							<div className="input-group col-10">
								<span
									className="input-group-text"
									style={{ color: "white", backgroundColor: "black" }}>
									Choose .xlsx/.xls file 📁
								</span>
								<input
									style={{ color: "white", backgroundColor: "black" }}
									type="file"
									className="form-control"
									name="file_upload"
									ref={fileInput}
								/>
								<button className="btn btn-light" onClick={handleSubmit}>
									Convert
								</button>
							</div>
						</div>
					</div>
					<div className="col-md-6 text-right">
						<button
							className="btn btn-light"
							onClick={() => [setNormalJson(""), setdynamodbJson("")]}>
							Clear Both Text Area
						</button>
					</div>
				</div>

				<div className="row">
					<div className="col-md-6">
						<div className="form-group text-center">
							<label>Normal JSON</label>
							<textarea
								style={{ color: "white", backgroundColor: "black" }}
								className="form-control"
								rows="25"
								value={normalJson}
								onChange={(event) => setNormalJson(event.target.value)}
							/>
						</div>
					</div>
					<div className="col-md-6">
						<div className="form-group text-center">
							<label>DynamoDB JSON</label>
							<textarea
								style={{ color: "white", backgroundColor: "black" }}
								className="form-control"
								rows="25"
								value={dynamodbJson}
								onChange={(event) => setdynamodbJson(event.target.value)}
							/>
						</div>
					</div>
				</div>
			</div>

			<footer className="text-center">
				<hr />
				<a
					style={{ textDecoration: "none" }}
					href="https://www.github.com/madiajijah11"
					target="_blank"
					rel="noreferrer noopener">
					Created by madiajijah11{" "}
					<span>
						<img
							style={{ borderRadius: "50%" }}
							src="https://avatars.githubusercontent.com/u/20562116?v=4"
							alt="github madiajijah11"
							width="50"
							height="50"
						/>
					</span>
				</a>
			</footer>
		</>
	);
}
