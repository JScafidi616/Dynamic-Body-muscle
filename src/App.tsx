import { useState } from 'react';
import femaleFront from './assets/DynamicBodyMuscle-01.svg?raw';
import type { Segment } from './core/segments';
import { HumanBodyMap } from './react/dynamicBodyMuscle';

function App() {
	const [selected, setSelected] = useState<Segment[]>([]);

	return (
		<div style={{ width: '100%', maxWidth: '600px', margin: '0 auto' }}>
			<HumanBodyMap
				style={{ width: '500px', height: 'auto' }}
				svg={femaleFront}
				active={selected}
				bilateral={true}
				onSelect={(seg) => {
					console.log('clicked segment:', seg);

					setSelected((prev) =>
						prev.includes(seg) ? prev.filter((x) => x !== seg) : [...prev, seg],
					);
				}}
			/>

			<h3>Selected: {selected.join(', ')}</h3>
		</div>
	);
}

export default App;
