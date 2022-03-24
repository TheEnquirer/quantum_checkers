import React, { useRef, useEffect } from 'react'
import "./Grid.css"
//import Canvas from './Canvas'

const Grid = props => {

    //const draw = (ctx, frameCount) => {
    //    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height)
    //    ctx.fillStyle = '#000000'
    //    ctx.beginPath()
    //    ctx.arc(50, 100, 20*Math.sin(frameCount*0.05)**2, 0, 2*Math.PI)
    //    ctx.fill()
    //}
	//console.log(props.grid, "props updating?")
    return <>
	{/*<Canvas draw={draw} />*/}
	<div class="l-grid">

	    <div class="grid"
		style={{
		    gridTemplateColumns: `repeat(${props.gridSize}, auto)`,
		    gridTemplateRows: `repeat(${props.gridSize}, auto)`,
		}}>
		{props.grid && props.grid.map((v, i) => {
		    return (v.map((u, j) => {
			//console.log(i, j)
			return (
			    <div class="border border-neutral-400 text-white flex flex-col"
				style={{
					width: "100px",
					height: "100px",
					//margin: "0.25px",
					cursor: "pointer",
				}}

				//key={`cell-${i}_${j}_${u?"f":"u"}`} id={`cell-${i}_${j}_${u?"f":"u"}`} 
			    //style={{
				//background: u ? this.state.props[i][j]["color"] : "inherit"
			    //}}
			    >
				<div class=" h-full ml-2 mr-2 mt-2 rounded"
				    style={{
					background: `rgba(244, 93, 93, ${u[0]})`
				    }}
				>
				</div>
				<div class=" h-full m-2 rounded"

				    style={{
					background: `rgba(93, 131, 244, ${u[1]})`
				    }}
				></div>
				{/*{u[0]?
				    <div class="bg-blue-900 p-1 rounded-sm ">

					q1
				    </div>

				: ""}

				{u[1]?
				    <div class="bg-red-900 p-1 rounded-sm w-full ml-4 mr-3">

					q2
				    </div>

				: ""}*/}
				{/*&nbsp;*/}
			    </div>
			)
		    }))
		})}
	    </div>

	</div>
    </>
}

export default Grid
