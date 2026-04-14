import { useMemo, useState } from 'react';
import type { BodyMapProps, MuscleId, MuscleStyles } from '../types';
import { MUSCLE_GROUPS, VIEWBOX } from '../utils/muscleData';
import { Muscle } from './Muscle';
import { MuscleGroup } from './MuscleGroup';

const DEFAULT_STYLES: MuscleStyles = {
	default: {
		fill: '#DEDEDEFF',
		opacity: 1,
	},
	highlighted: {
		fill: '#00E1FFFF',
		opacity: 0.9,
		stroke: '#0080FFFF',
		strokeWidth: 1.5,
		strokeLinejoin: 'round' /* Smooths the corners */,
		strokeLinecap: 'round' /* Smooths the line ends */,
	},
	selected: {
		fill: '#FF8B8BFF',
		opacity: 0.9,
		stroke: '#DB2D2DFF',
		strokeWidth: 1.5,
		strokeLinejoin: 'round' /* Smooths the corners */,
		strokeLinecap: 'round' /* Smooths the line ends */,
	},
	hovered: {
		fill: '#E1A495FF',
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
	// ✅ Debug what's received
	// console.log('BodyMap received:', {
	// 	highlighted,
	// 	selected,
	// 	interactive,
	// 	highlightedCount: highlighted.length,
	// });

	const [hoveredMuscle, setHoveredMuscle] = useState<MuscleId | null>(null);

	// Non-interactive elements (visible but not clickable)
	const NON_INTERACTIVE_IDS = [
		'Body_Bg',
		'Body_Stroke',
		'Neck',
		'RightHand',
		'LeftHand',
		'RightFeet',
		'LeftFeet',
		'RightKnee',
		'LeftKnee',
	];

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
		// Always make certain elements non-interactive
		if (NON_INTERACTIVE_IDS.includes(muscleId)) return false;

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
					{group.muscles.map((muscle) => {
						const isNonInteractive = NON_INTERACTIVE_IDS.includes(muscle.id);

						return (
							<Muscle
								key={muscle.id}
								id={muscle.id}
								paths={muscle.paths}
								isHighlighted={
									!isNonInteractive && highlightedSet.has(muscle.id)
								}
								isSelected={!isNonInteractive && selectedSet.has(muscle.id)}
								isHovered={!isNonInteractive && hoveredMuscle === muscle.id}
								isInteractive={isMuscleInteractive(muscle.id)}
								showHitLayer={showHitLayers}
								styles={mergedStyles}
								onClick={handleMuscleClick}
								onHover={handleMuscleHover}
							/>
						);
					})}
				</MuscleGroup>
			))}
		</svg>
	);
}
