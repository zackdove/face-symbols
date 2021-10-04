import logo from './logo.svg';
import './App.css';
import React, { useState, useEffect, useRef } from "react";
import "./App.css";
import * as tf from "@tensorflow/tfjs";
import * as facemesh from "@tensorflow-models/facemesh";
import Webcam from "react-webcam";
import {drawMesh} from './meshUtilities.js';
import FaceSymbol from './facesymbol.js';





function App() {
	const webcamReference = useRef(null);
	// const [facePoints, setFacePoints] = useState([]);
	var facePoints = [];
	const faceSymbolRef = useRef(null);
	const loadFacemesh = async () => {
		const network = await facemesh.load({
			inputResolution: { width: 720, height: 500 },
			scale: 1.0,
		});
		setInterval(() => {
			detectFace(network);
		}, 100);
		const detectFace = async (net) => {
			if (
				typeof webcamReference.current !== "undefined" &&
				webcamReference.current !== null &&
				webcamReference.current.video.readyState === 4
			) {
				const video = webcamReference.current.video;
				const videoWidth = webcamReference.current.video.videoWidth;
				const videoHeight = webcamReference.current.video.videoHeight;
				webcamReference.current.video.width = videoWidth;
				webcamReference.current.video.height = videoHeight;
				const faceEstimate = await network.estimateFaces(video);
				facePoints = [...faceEstimate];
				if (faceSymbolRef.current){
					faceSymbolRef.current.setFacePoints(facePoints);
					faceSymbolRef.current.setSize(videoWidth,videoHeight);
				}
				// console.log(faceSymbolRef);
				// setFacePoints(faceEstimate);
				// console.log(facePoints);
				//Get canvas context
				// drawMesh(faceEstimate, ctx);
			}
		}
	};
	loadFacemesh();
	
	function sketch(p5){
		p5.setup = () => {
			p5.createCanvas(500, 500);
		}
		p5.updateWithProps = props => {
			console.log(props);
		};
		p5.draw = () => {
			p5.clear();
			p5.ellipse(50, 50, 70, 70);
		}
	}
	
	return (
		<div className="App">
		<Webcam
		ref={webcamReference}
		style={{
			position: "absolute",
			marginLeft: "auto",
			marginRight: "auto",
			left: 0,
			right: 0,
			textAlign: "center",
			zindex: 1,
		}}
		/>
		<FaceSymbol 
		ref={faceSymbolRef}
		facepoints={facePoints}
		/>
		</div>
	);
}

export default App;
