import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
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
	const convertExcelToJson = (req) => {
		const reader = new FileReader();
		reader.readAsArrayBuffer(req.current.files[0]);
		reader.onload = (req) => {
			const data = req.target.result;
			const workbook = XLSX.read(data, { type: "binary" });
			const worksheet = workbook.Sheets[workbook.SheetNames[0]];
			const jsonObject = XLSX.utils.sheet_to_json(worksheet);
			setNormalJson(JSON.stringify(jsonObject, null, 2));

			//convert normal json to dynamodb json
			dynamifyObject(jsonObject, (dynamoJson) => {
				const data = JSON.parse(dynamoJson);
				setdynamodbJson(JSON.stringify(data, null, 2));
			});
		};
	};

	return (
		<div>
			<Head>
				<title>Create Next App</title>
				<meta name="description" content="Generated by create next app" />
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<div className={styles.container}>
				<div>
					<h1>EXCEL TO JSON</h1>
					<form>
						<label className={styles.label} htmlFor="input-excel-file">
							Input Excel File 📁:
						</label>
						<input
							type="file"
							className={styles.file_upload}
							name="file_upload"
							ref={fileInput}
							onChange={handleSubmit}
						/>
					</form>
					<button onClick={() => [setNormalJson(""), setdynamodbJson("")]}>
						Reset Textarea
					</button>
					<div>
						<textarea
							className={styles.convert}
							cols="100"
							rows="40"
							value={normalJson}
							onChange={(req) => setNormalJson(req.target.value)}
						/>
						<textarea
							className={styles.convert}
							cols="100"
							rows="40"
							value={dynamodbJson}
							onChange={(req) => setdynamodbJson(req.target.value)}
						/>
					</div>
				</div>
			</div>

			<footer className={styles.footer}>
				<a
					href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
					target="_blank"
					rel="noopener noreferrer">
					Powered by{" "}
					<span className={styles.logo}>
						<Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
					</span>
				</a>
			</footer>
		</div>
	);
}