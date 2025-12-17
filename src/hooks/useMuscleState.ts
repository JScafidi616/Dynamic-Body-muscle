// src/hooks/useMuscleState.ts
import { useCallback, useState } from 'react';
import type { MuscleId } from '../types';

export interface UseMuscleStateReturn {
	highlighted: MuscleId[];
	selected: MuscleId[];

	toggleHighlight: (muscleId: MuscleId) => void;
	highlightMuscles: (muscleIds: MuscleId[]) => void;
	clearHighlights: () => void;

	toggleSelect: (muscleId: MuscleId) => void;
	selectMuscles: (muscleIds: MuscleId[]) => void;
	clearSelections: () => void;

	reset: () => void;
}

export function useMuscleState(
	initialHighlighted: MuscleId[] = [],
	initialSelected: MuscleId[] = [],
): UseMuscleStateReturn {
	const [highlighted, setHighlighted] = useState<Set<MuscleId>>(
		new Set(initialHighlighted),
	);
	const [selected, setSelected] = useState<Set<MuscleId>>(
		new Set(initialSelected),
	);

	const toggleHighlight = useCallback((muscleId: MuscleId) => {
		setHighlighted((prev) => {
			const next = new Set(prev);
			if (next.has(muscleId)) {
				next.delete(muscleId);
			} else {
				next.add(muscleId);
			}
			return next;
		});
	}, []);

	const highlightMuscles = useCallback((muscleIds: MuscleId[]) => {
		setHighlighted(new Set(muscleIds));
	}, []);

	const clearHighlights = useCallback(() => {
		setHighlighted(new Set());
	}, []);

	const toggleSelect = useCallback((muscleId: MuscleId) => {
		setSelected((prev) => {
			const next = new Set(prev);
			if (next.has(muscleId)) {
				next.delete(muscleId);
			} else {
				next.add(muscleId);
			}
			return next;
		});
	}, []);

	const selectMuscles = useCallback((muscleIds: MuscleId[]) => {
		setSelected(new Set(muscleIds));
	}, []);

	const clearSelections = useCallback(() => {
		setSelected(new Set());
	}, []);

	const reset = useCallback(() => {
		setHighlighted(new Set());
		setSelected(new Set());
	}, []);

	return {
		highlighted: Array.from(highlighted),
		selected: Array.from(selected),
		toggleHighlight,
		highlightMuscles,
		clearHighlights,
		toggleSelect,
		selectMuscles,
		clearSelections,
		reset,
	};
}
