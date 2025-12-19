import { useMemo, useState } from 'react';
import type { BodyMapProps, MuscleId, MuscleStyles } from '../types';
import { MUSCLE_GROUPS, VIEWBOX } from '../utils/muscleData';
import { Muscle } from './Muscle';
import { MuscleGroup } from './MuscleGroup';

const DEFAULT_STYLES: MuscleStyles = {
	default: {
		fill: '#c2c2c2',
		opacity: 1,
	},
	highlighted: {
		fill: '#ff6b6b',
		opacity: 0.8,
	},
	selected: {
		fill: '#4ecdc4',
		opacity: 0.9,
		stroke: '#2d9cdb',
		strokeWidth: 2,
	},
	hovered: {
		fill: '#95e1d3',
		opacity: 0.85,
	},
	disabled: {
		fill: '#999',
		opacity: 0.5,
	},
};

export function BodyMap({
	highlighted = [],
	selected = [],
	interactive = true,
	onMuscleClick,
	onMuscleHover,
	showHitLayers = false,
	styles = {},
	className = '',
}: BodyMapProps) {
	const [hoveredMuscle, setHoveredMuscle] = useState<MuscleId | null>(null);

	// Merge custom styles with defaults
	const mergedStyles: MuscleStyles = useMemo(
		() => ({
			default: { ...DEFAULT_STYLES.default, ...styles.default },
			highlighted: { ...DEFAULT_STYLES.highlighted, ...styles.highlighted },
			selected: { ...DEFAULT_STYLES.selected, ...styles.selected },
			hovered: { ...DEFAULT_STYLES.hovered, ...styles.hovered },
			disabled: { ...DEFAULT_STYLES.disabled, ...styles.disabled },
		}),
		[styles],
	);

	// Convert arrays to Sets for O(1) lookup
	const highlightedSet = useMemo(() => new Set(highlighted), [highlighted]);
	const selectedSet = useMemo(() => new Set(selected), [selected]);

	// Determine if a muscle is interactive
	const interactiveSet = useMemo(() => {
		if (interactive === true) return 'all';
		if (interactive === false) return new Set<MuscleId>();
		return new Set(interactive);
	}, [interactive]);

	const isMuscleInteractive = (muscleId: MuscleId): boolean => {
		return interactiveSet === 'all' || interactiveSet.has(muscleId);
	};

	const handleMuscleClick = (muscleId: MuscleId) => {
		onMuscleClick?.(muscleId);
	};

	const handleMuscleHover = (muscleId: MuscleId | null) => {
		setHoveredMuscle(muscleId);
		onMuscleHover?.(muscleId);
	};

	return (
		<svg
			viewBox={VIEWBOX}
			className={`body-map ${className}`}
			style={{ width: '100%', height: '600px' }}
		>
			{Object.entries(MUSCLE_GROUPS).map(([groupName, group]) => (
				<MuscleGroup key={groupName} name={groupName}>
					{group.muscles.map((muscle) => (
						<Muscle
							key={muscle.id}
							id={muscle.id}
							paths={muscle.paths}
							isHighlighted={highlightedSet.has(muscle.id)}
							isSelected={selectedSet.has(muscle.id)}
							isHovered={hoveredMuscle === muscle.id}
							isInteractive={isMuscleInteractive(muscle.id)}
							showHitLayer={showHitLayers}
							styles={mergedStyles}
							onClick={handleMuscleClick}
							onHover={handleMuscleHover}
						/>
					))}
				</MuscleGroup>
			))}
		</svg>
	);
}
