// import femaleFront from './assets/DynamicBodyMuscle-01.svg?raw';
// src/App.tsx
import { useState } from 'react';
import './App.css';
import { BodyMap } from './components/BodyMap';
import { useMuscleState } from './hooks/useMuscleState';
import type { MuscleId } from './types';
import { MUSCLE_GROUPS } from './utils/muscleData';

function App() {
	const [mode, setMode] = useState<'click' | 'programmatic'>('click');
	const [showHitLayers, setShowHitLayers] = useState(false);
	const [clickedMuscle, setClickedMuscle] = useState<MuscleId | null>(null);
	const [hoveredMuscle, setHoveredMuscle] = useState<MuscleId | null>(null);

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
		toggleSelect(muscleId);
	};

	const highlightMuscleGroup = (groupName: string) => {
		const group = MUSCLE_GROUPS[groupName];
		if (group) {
			highlightMuscles(group.muscles.map((m) => m.id));
		}
	};

	return (
		<div className='app'>
			<header className='header'>
				<h1>🏋️ Dynamic Body Muscle Map</h1>
				<p>Interactive muscle visualization library</p>
			</header>

			<div className='container'>
				<aside className='sidebar'>
					<div className='controls'>
						<h3>Mode</h3>
						<div className='button-group'>
							<button
								className={mode === 'click' ? 'active' : ''}
								onClick={() => setMode('click')}
							>
								Click Mode
							</button>
							<button
								className={mode === 'programmatic' ? 'active' : ''}
								onClick={() => setMode('programmatic')}
							>
								Programmatic
							</button>
						</div>

						<h3>Options</h3>
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
									{Object.keys(MUSCLE_GROUPS).map((groupName) => (
										<button
											key={groupName}
											onClick={() => highlightMuscleGroup(groupName)}
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
					<BodyMap
						highlighted={mode === 'programmatic' ? highlighted : []}
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
