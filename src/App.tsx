// import femaleFront from './assets/DynamicBodyMuscle-01.svg?raw';
// src/App.tsx
import { useState } from 'react';
import './App.css';
import { BodyMap } from './components/BodyMap';
import { useMuscleState } from './hooks/useMuscleState';
import type { MuscleId } from './types';
import { MUSCLE_GROUPS, getPairedMuscle } from './utils/muscleData';

function App() {
	const [mode, setMode] = useState<'click' | 'programmatic'>('click');
	const [showHitLayers, setShowHitLayers] = useState(false);
	const [clickedMuscle, setClickedMuscle] = useState<MuscleId | null>(null);
	const [hoveredMuscle, setHoveredMuscle] = useState<MuscleId | null>(null);
	const [syncPairs, setSyncPairs] = useState(true); // Default ON

	const {
		highlighted,
		selected,
		toggleHighlight,
		highlightMuscles,
		clearHighlights,
		toggleSelect,
		clearSelections,
		reset,
	} = useMuscleState();

	const handleMuscleClick = (muscleId: MuscleId) => {
		setClickedMuscle(muscleId);

		if (syncPairs) {
			const pairedMuscle = getPairedMuscle(muscleId);

			// Toggle both the clicked muscle AND its pair
			toggleSelect(muscleId);
			if (pairedMuscle) {
				toggleSelect(pairedMuscle as MuscleId);
			}
		} else {
			// Just toggle the clicked muscle
			if (mode === 'programmatic') {
				toggleHighlight(muscleId); // ✅ Now it's used!
			} else {
				toggleSelect(muscleId);
			}
		}
	};

	const highlightMuscleGroup = (groupName: string) => {
		const group = MUSCLE_GROUPS[groupName];
		if (group) {
			let muscleIds = group.muscles.map((m) => m.id);

			// If sync is enabled, add paired muscles too
			if (syncPairs) {
				const pairedIds = muscleIds
					.map((id) => getPairedMuscle(id))
					.filter(Boolean) as MuscleId[];
				muscleIds = [...muscleIds, ...pairedIds];
			}

			console.log('Highlighting group:', groupName, 'Muscles:', muscleIds);
			highlightMuscles(muscleIds);
		}
	};

	return (
		<div className='app'>
			<header className='header'>
				<h1>🏋️ Dynamic Body Muscle Map</h1>
				<p>Interactive muscle visualization library</p>
				{/* ✅ Debug info */}
				{/* <p style={{ fontSize: '0.8rem', opacity: 0.7 }}>
					Mode: {mode} | Highlighted: {highlighted.length} | Selected:{' '}
					{selected.length}
				</p> */}
			</header>

			<div className='container'>
				<aside className='sidebar'>
					<div className='controls'>
						<h3>Mode</h3>
						<div className='button-group'>
							<button
								className={mode === 'click' ? 'active' : ''}
								onClick={() => {
									setMode('click');
									reset(); // reset programmatic selections when switching
								}}
							>
								Click Mode
							</button>
							<button
								className={mode === 'programmatic' ? 'active' : ''}
								onClick={() => {
									setMode('programmatic');
									clearSelections(); // Clear click-mode selections when switching
								}}
							>
								Programmatic
							</button>
						</div>

						<h3>Options</h3>
						<label className='checkbox'>
							<input
								type='checkbox'
								checked={syncPairs}
								onChange={(e) => setSyncPairs(e.target.checked)}
							/>
							Sync Muscle Pairs
						</label>
						<label className='checkbox'>
							<input
								type='checkbox'
								checked={showHitLayers}
								onChange={(e) => setShowHitLayers(e.target.checked)}
							/>
							Show Hit Layers
						</label>

						{mode === 'programmatic' && (
							<>
								<h3>Highlight Groups</h3>
								<div className='button-group vertical'>
									{Object.keys(MUSCLE_GROUPS)
										.filter(
											(name) =>
												name !== 'Body' &&
												name !== 'Feets' &&
												name !== 'Hands' &&
												name !== 'No-Muscle' &&
												name !== 'Knees',
										) // ✅ Don't show Body button
										.map((groupName) => (
											<button
												key={groupName}
												onClick={() => {
													highlightMuscleGroup(groupName);
													console.log('Clicked group:', groupName);
												}}
											>
												{groupName}
											</button>
										))}
								</div>

								<h3>Actions</h3>
								<div className='button-group vertical'>
									<button onClick={clearHighlights}>Clear Highlights</button>
									<button onClick={clearSelections}>Clear Selections</button>
									<button onClick={reset}>Reset All</button>
								</div>
							</>
						)}

						{mode === 'click' && (
							<>
								<h3>Info</h3>
								<div className='info'>
									<p>
										<strong>Hovered:</strong> {hoveredMuscle || 'None'}
									</p>
									<p>
										<strong>Clicked:</strong> {clickedMuscle || 'None'}
									</p>
									<p>
										<strong>Selected:</strong> {selected.length} muscle(s)
									</p>
								</div>

								<button onClick={clearSelections}>Clear Selections</button>
							</>
						)}
					</div>

					<div className='stats'>
						<h3>Library Stats</h3>
						<ul>
							<li>Groups: {Object.keys(MUSCLE_GROUPS).length}</li>
							<li>
								Total Muscles:{' '}
								{Object.values(MUSCLE_GROUPS).reduce(
									(sum, group) => sum + group.muscles.length,
									0,
								)}
							</li>
							<li>
								Interactive: {mode === 'click' ? 'All' : highlighted.length}
							</li>
						</ul>
					</div>
				</aside>

				<main className='body-map-container'>
					{/* ✅ Add debug logging */}
					{/* <div
						style={{
							position: 'absolute',
							top: 10,
							left: 10,
							background: 'white',
							padding: '10px',
							fontSize: '12px',
							zIndex: 1000,
						}}
					>
						<div>Highlighted: {JSON.stringify(highlighted)}</div>
						<div>Selected: {JSON.stringify(selected)}</div>
						<div>Interactive: {mode === 'click' ? 'true' : 'false'}</div>
					</div> */}
					<BodyMap
						// highlighted={mode === 'programmatic' ? highlighted : []} // This blocks interactivity
						highlighted={highlighted}
						selected={selected}
						interactive={mode === 'click'}
						onMuscleClick={handleMuscleClick}
						onMuscleHover={setHoveredMuscle}
						showHitLayers={showHitLayers}
					/>
				</main>
			</div>
		</div>
	);
}

export default App;
