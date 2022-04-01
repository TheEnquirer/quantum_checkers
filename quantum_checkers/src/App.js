import './App.css';
import Grid from './Grid'
import Modal from './Modal'
import Modal2 from './Modal2'
import { create, all } from 'mathjs'
import React, { useRef, useEffect, useState } from 'react'
import { sqrt } from 'mathjs';


const math = create(all)

const K = 10
const N = 10
const GRID_SIZE = 5
//const f = 2 // killed by annli, 2022, mar 22 7:33:52. rest in peice, dear friend of us all.
const SIM_LEN = 20
const FRAME_TIME = 100
//const QBIT_COUNT = 5

let q1 = {id: 0, x: 2, y: 2}
let q2 = {id: 1, x: 2, y: 2}
let qbits = [q1, q2]

let register = [0, 1/math.sqrt(2), -1/math.sqrt(2), 0]

let cnot = [[1, 0, 0, 0],
			[0, 1, 0, 0],
			[0, 0, 0, 1],
			[0, 0, 1, 0]]

let cnot_rev = [[1, 0, 0, 0],
			    [0, 0, 0, 1],
			    [0, 0, 1, 0],
			    [0, 1, 0, 0]]

let hadamard = [[1/math.sqrt(2),  1/math.sqrt(2)],
				[1/math.sqrt(2), -1/math.sqrt(2)]]

let pauli_x = [[0, 1],
 			   [1, 0]]

let pauli_y = [[0, -math.i],
               [math.i, 0]]

let pauli_z = [[1,  0],
 			   [0, -1]]

let paulis = {1: pauli_x, 2: pauli_y, 3: pauli_z}

let choice = null
let choice2 = null

const timer = ms => new Promise(res => setTimeout(res, ms))

function App() {

    const [stateGrid, setStateGrid] = useState(null)
	const [stateName, setStateName] = useState(null)
	const [stateStratDialog, setStateStratDialog] = useState(false)
	const [stateScoreDialog, setStateScoreDialog] = useState(false)
	const [statePoint, setStatePoint] = useState(null)
	const [stateMatrix, setStateMatrix] = useState(null)

	const call_back = (e) => {
		choice = e
	}

	const call_back2 = (e) => {
		choice2 = e
	}

    useEffect(() => {poggers()}, [])
	
    const poggers = async () => {
		console.log("running poggers")
		// [
		//     [[p1, p2], ..],
		//     [[...]]
		// ]
		//let oldGrid = new Array(GRID_SIZE).fill(new Array(GRID_SIZE).fill([0,0])) // initialize our grid
		let oldGrid = new Array(GRID_SIZE)
		for (let i = 0; i < GRID_SIZE; i++) {
			oldGrid[i] = [[0,0],[0,0],[0,0],[0,0],[0,0]]
			//new Array(GRID_SIZE).fill([0,0])
		}
		console.log("init grid", Array.from(oldGrid))

		oldGrid[2][2] = [1, 1] // set our starting conditions

		let elapsed = 0
		let sims = 0
		let score
		let state
		await timer(200)
		while (sims < SIM_LEN) {

			//setTimeout(function(){
			//}, 5000);
			await timer(FRAME_TIME)

			// do our non-collapse calc
			// if k has passed, collapse, reset k
			//let newGrid = new Array(GRID_SIZE).fill(new Array(GRID_SIZE).fill([0,0])) // initialize our new grid
			let newGrid = new Array(GRID_SIZE)
			for (let i = 0; i < GRID_SIZE; i++) {
				newGrid[i] = [[0,0],[0,0],[0,0],[0,0],[0,0]]
				//new Array(GRID_SIZE).fill([0,0])
			}

			//newGrid[0][1] = 12
			//console.log(newGrid, "e")

			for (let i = 0; i < GRID_SIZE; i++) {
				for (let j = 0; j < GRID_SIZE; j++) {
					for (let q = 0; q < 2; q++) {
						let updateVal = psi(i, j, oldGrid, qbits[q])
						//console.log(updateVal, q)
						newGrid[i][j][q] = updateVal
						//newGrid[i][j][q] = Math.random() + i
						//console.log(newGrid, updateVal.re)
					}
				}
			}

			//console.log(newGrid, "new grid")
			//continue
			oldGrid = newGrid

			let probs = [[], []]
			for (let i = 0; i < GRID_SIZE; i++) {
				for (let j = 0; j < GRID_SIZE; j++) {
					for (let q = 0; q < 2; q++) {
						probs[q].push(math.multiply(oldGrid[i][j][q], math.conj(oldGrid[i][j][q])))
					}
				}
			}

			for (const [i, v] of probs.entries()) {
				let sum = math.sum(v)
				probs[i] = v.map((e) => math.divide(e, sum))
			}

			let probGrid = [[],[],[],[],[]]

			for (let p = 0; p < probs[0].length; p++) {
				probGrid[p % GRID_SIZE].push([probs[0][p].re, probs[1][p].re])
			}
			//console.log(probGrid, "whee")
			setStateGrid(probGrid)

			//let tempGrid = new Array(GRID_SIZE).fill(Array(GRID_SIZE).fill([0,0])) // initialize our grid


			let tempGrid = new Array(GRID_SIZE)
			for (let i = 0; i < GRID_SIZE; i++) {
				tempGrid[i] = [[0,0],[0,0],[0,0],[0,0],[0,0]]
			//new Array(GRID_SIZE).fill([0,0])
			}


			//console.log(oldGrid, tempGrid, "set it to zeroez")
			//console.log(new Array(GRID_SIZE).fill(Array(GRID_SIZE).fill([0,0])), "whaa", oldGrid)
			//console.log(probs)
			//console.log(oldGrid, "old grid final")
			elapsed++
			if (elapsed == K) {
				// collapse
				elapsed = 0

				// find all the probabilities
				// choooose where the qbits go
				// update the qbits
				for (const [i, v] of probs.entries()) {
					//console.log(probs[i])
					let point = math.pickRandom([...Array(Math.pow(GRID_SIZE, 2)).keys()], probs[i].map((e) => e.re))
					//console.log(point, "point")

					let x = Math.floor(point / GRID_SIZE)
					let y = point % GRID_SIZE
					
					qbits[i].x = x
					qbits[i].y = y
					//let extratempgrid = [...tempGrid]
					//extratempgrid[x][y][i] = "whee"// 1
					//tempGrid[x][y][i] = "whee"// 1
					tempGrid[x][y][i] = 1
					//console.log(extratempgrid, "cyclieing temp grid")
					//console.log("what",x,y, "tf" )
				}

				oldGrid = tempGrid
				setStateGrid(oldGrid)

				if ((qbits[0].x === qbits[1].x) != (qbits[0].y === qbits[1].y)) {
					sims++
					await timer(200)
					let cond = (qbits[0].x > qbits[1].x || qbits[0].y < qbits[1].y)
					let gate = cond ? cnot : cnot_rev
					register = math.multiply(gate, register)
					setStateName(cond ? "red" : "blue")
					setStateStratDialog(true)
					while (choice === null) {
						await timer(100)
					}
					if (choice > 0) {
						gate = cond ? math.kron(paulis[choice], math.identity(2)) : math.kron(math.identity(2), paulis[choice])
						register = math.multiply(gate, register)
						state = math.pickRandom([0, 1, 2, 3], math.abs(math.dotMultiply(register, math.ctranspose(register))))
						console.log(sims)
						console.log(register)
						console.log(cond)
						console.log(state)
						if (cond) {
							score = +(state === 0 || state === 2)
						} else {
							score = +(state === 0 || state === 1)
						}
						register = [0, 0, 0, 0]
						register[state] = 1
						setStatePoint(score)
						setStateScoreDialog(true)
						while (choice2 === null) {
							await timer(100)
						}
					}
				} else {
					let gate = Math.random() < 0.5 ? math.kron(hadamard, math.identity(2)) : math.kron(math.identity(2), hadamard)
					register = math.multiply(gate, register)
				}
				await timer(250)
				choice = null
				choice2 = null
				//await timer(FRAME_TIME*5)
				//time += FRAME_TIME*5
				//setStateGrid(oldGrid)
				//setStateGrid(oldGrid)
				//console.log(qbits[0], qbits[1])
				//setStateGrid(oldGrid)
				//console.log(oldGrid)
				//console.log("why isnt props updating")
			}
			//console.log("setting the thing!", oldGrid)
		}

		//console.log(grid);
		//console.log(math.pow(5,2))
		//console.log(psi(2, 2, grid, {id: 1}))

    }

    // this is our wave function
    const dist = (a, b) => {
		return Math.min(Math.abs(a-b), GRID_SIZE-Math.abs(a-b))
    }

    const psi = (x, y, oldGrid, qbit) => {
		let waveValue = math.complex(0, 0)
		//let omega = math.exp(math.i)
		// e^( n*i* (dist(u, x)^2+dist(u, y)^2)/2)

		for (let u = 0; u < GRID_SIZE; u++) {
			for (let v = 0; v < GRID_SIZE; v++) {
				// multiply old value by some thing
				let mul = math.exp(
					math.multiply(math.i, N, 0.5,
					math.add(
						math.pow(dist(u, x), 2), math.pow(dist(v, y), 2)
					)
					)
				)

				waveValue = math.add(waveValue, math.multiply(oldGrid[u][v][qbit.id], mul))
			}
    	}
		//console.log("returning a waveval", waveValue.re)
		return waveValue
    }


    return (
    <div class="border-0 border-red-500 h-screen bg-zinc-900">
	<Grid gridSize={GRID_SIZE} grid={stateGrid} />
	<Modal open={stateStratDialog} qname={stateName} onClose={() => setStateStratDialog(false)} callback={(e) => call_back(e)}/>
	<Modal2 open={stateScoreDialog} pts={statePoint} onClose={() => setStateScoreDialog(false)} callback={() => call_back2(true)}/>
    </div>
    );
}

export default App;




///////////////
// THE PLAN  //
///////////////


// calc the wave function at every point for each qbit -> probability
//     iterate this for k steps
// collapse the wave function
// // gates
// repeat


























