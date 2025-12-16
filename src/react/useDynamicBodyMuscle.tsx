import { useState } from 'react';

export function useDynamicBodyMuscle() {
	const [activeGroup, setActiveGroup] = useState<string | null>(null);
	const [activeSegment, setActiveSegment] = useState<string | null>(null);

	return {
		activeGroup,
		activeSegment,
		selectGroup: (group: string) => setActiveGroup(group),
		selectSegment: (segment: string) => setActiveSegment(segment),
		clearSelection: () => {
			setActiveGroup(null);
			setActiveSegment(null);
		},
	};
}
