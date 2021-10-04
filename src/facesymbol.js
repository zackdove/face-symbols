import React, { Component } from "react";
import {ReactP5Wrapper} from "react-p5-wrapper";

function sketch(p5){
	let points = [];
	let size = [];
	const pointCount = 4;
	const rIndexes = [];
	let rPoints = [];
	let midwayBetweenEyesX = 0;
	for (let i = 0; i< pointCount; i++){
		let r = p5.round(p5.random(0, 468))
		rIndexes.push(r);
		// rIndexes.push(468-r);
	}
	p5.setup = () => {
		p5.createCanvas(720, 500);
	}
	p5.updateWithProps = props => {
		if (props.facePoints[0]){
			// console.log(props.facePoints[0]);
			// points = props.facePoints[0].scaledMesh;
			rPoints = [];
			midwayBetweenEyesX = props.facePoints[0].annotations.midwayBetweenEyes[0][0]*2;
			// console.log(midwayBetweenEyesX);
			for (let i=0;i<rIndexes.length; i++){
				const x = props.facePoints[0].scaledMesh[rIndexes[i]][0];
				const y = props.facePoints[0].scaledMesh[rIndexes[i]][1];
				rPoints.push([x, y]);
				rPoints.push([midwayBetweenEyesX-x, y]);
			}
		}
		// points = ;
		if (props.size && props.size[0] !== size[0] && props.size[1] !== size[1]){
			size=props.size;
			console.log(size);
			p5.resizeCanvas(size[0], size[1]);
		}
	};
	p5.draw = () => {
		p5.clear();
		// p5.ellipse(50, 50, 70, 70);
		p5.stroke('blue'); // Change the color
		p5.strokeWeight(10);
		p5.line(0,0, p5.width, 0);
		p5.line(p5.width,0 ,p5.width, p5.height);
		p5.line(p5.width,p5.height, 0, p5.height);
		p5.line(0,p5.height, 0, 0);
		if (rPoints){
			for (let p of rPoints){
				p5.point(p[0], p[1]);
				// p5.point(p5.width-p[0], p[1]);
			}
		}
	}
}

export default class FaceSymbol extends Component{
	state = {
		facePoints: [],
		size: [720, 500],
	};
	setFacePoints = (facePoints) => {
		// console.log(facePoints);
		this.setState({
			facePoints: facePoints,
		});
	};
	setSize = (x, y) => {
		if (x !== this.state.size[0] && y !== this.state.size[1]){
			this.setState({
				size : [x,y],
			});
		}
	};
	render(){
		return 	(<div>
					<ReactP5Wrapper sketch={sketch} facePoints={this.state.facePoints} size={this.state.size} />

				</div>);
	}
}