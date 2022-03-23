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
			    <div class="border border-neutral-400"
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
				{u[1]}
				&nbsp;
			    </div>
			)
		    }))
		})}
	    </div>

	</div>
    </>
}

export default Grid
