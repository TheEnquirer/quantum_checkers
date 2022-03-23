import './App.css';
import { create, all } from 'mathjs'

const math = create(all)

function App() {

    const K = 10
    const N = 10
    const GRID_SIZE = 5
    //const f = 2 // killed by annli, 2022, mar 22 7:33:52. rest in peice, dear friend of us all.
    const SIM_LEN = 100
    //const QBIT_COUNT = 5

    let q1 = {id: 0, x: 2, y: 2}
    let q2 = {id: 1, x: 2, y: 2}
    let qbits = [q1, q2]

    const poggers = () => {
	// [
	// 	[[p1, p2], ..],
	// 	[[...]]
	// ]
	let oldGrid = new Array(GRID_SIZE).fill(Array(GRID_SIZE).fill([0,0])) // initialize our grid

	oldGrid[2][2] = [1, 1] // set our starting conditions

	let elapsed = 0
	for (let time = 1; time < SIM_LEN; time++) {
	    // do our non-collapse calc
	    // if k has passed, collapse, reset k
	    let newGrid = new Array(GRID_SIZE).fill(Array(GRID_SIZE).fill([0,0])) // initialize our new grid

	    for (let i = 0; i < GRID_SIZE; i++) {
		for (let j = 0; j < GRID_SIZE; j++) {
		    for (let q = 0; q < 2; q++) {
			newGrid[i][j][q] = psi(i, j, oldGrid, qbits[q])
		    }
		}
	    }
	    oldGrid = newGrid

	    elapsed++
	    if (elapsed == K) {
		// collapse
		elapsed = 0

		// find all the probabilities
		// choooose where the qbits go
		// update the qbits
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

		oldGrid = new Array(GRID_SIZE).fill(Array(GRID_SIZE).fill([0,0])) // initialize our grid
		for (const [i, v] of probs.entries()) {
		    //console.log(probs[i])
		    let point = math.pickRandom([...Array(Math.pow(GRID_SIZE, 2)).keys()], probs[i].map((e) => e.re))

		    let x = Math.floor(point / GRID_SIZE)
		    let y = point % GRID_SIZE

		    qbits[i].x = x
		    qbits[i].y = y
		    oldGrid[x][y][i] = 1
		}
		console.log(qbits[0], qbits[1])
	    }
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
	return waveValue
    }



    return (
	<div className="border-2 border-red-500">
	    uwu
	    {poggers()}
	</div>
    );
}

export default App;




///////////////
// THE PLAN  //
///////////////


// calc the wave function at every point for each qbit -> probability
// 	iterate this for k steps
// collapse the wave function
// // gates
// repeat


























