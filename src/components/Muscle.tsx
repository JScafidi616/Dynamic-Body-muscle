// src/components/Muscle.tsx
import { useState } from 'react';
import type { MuscleProps, MuscleStyle } from '../types';

export function Muscle({
	id,
	paths,
	isHighlighted,
	isSelected,
	isHovered,
	isInteractive,
	showHitLayer,
	styles,
	onClick,
	onHover,
}: MuscleProps) {
	const [isLocalHovered, setIsLocalHovered] = useState(false);

	// Determine which style to apply
	const getStyle = (): MuscleStyle => {
		if (isSelected) return styles.selected || {};
		if (isInteractive && (isHovered || isLocalHovered))
			return styles.hovered || {};
		if (isHighlighted) return styles.highlighted || {};
		return styles.default || {};

		// if (!isInteractive) return styles.disabled || {};
		// if (isSelected) return styles.selected || {};
		// if (isHovered || isLocalHovered) return styles.hovered || {};
		// if (isHighlighted) return styles.highlighted || {};
		// return styles.default || {};
	};

	const style = getStyle();

	const handleClick = (e: React.MouseEvent) => {
		e.stopPropagation();
		if (isInteractive && onClick) {
			onClick(id);
		}
	};

	const handleMouseEnter = () => {
		if (isInteractive) {
			setIsLocalHovered(true);
			onHover?.(id);
		}
	};

	const handleMouseLeave = () => {
		setIsLocalHovered(false);
		onHover?.(null);
	};

	const pathProps = {
		fill: style.fill || '#c2c2c2',
		opacity: style.opacity ?? 1,
		stroke: style.stroke,
		strokeWidth: style.strokeWidth,
		style: {
			cursor: isInteractive ? 'pointer' : 'default',
			transition: 'all 0.2s ease',
			pointerEvents: isInteractive ? 'all' : 'none',
		},
		onClick: handleClick,
		onMouseEnter: handleMouseEnter,
		onMouseLeave: handleMouseLeave,
	};

	return (
		<g id={`muscle-${id}`}>
			{/* Visible muscle layer */}
			<path id={id} d={paths.visible} {...pathProps} />

			{/* Hit layer (invisible but interactive) */}
			{paths.hit && (
				<path
					id={`${id}_Hit`}
					d={paths.hit}
					fill='transparent'
					opacity={showHitLayer ? 0.2 : 0}
					style={{
						cursor: isInteractive ? 'pointer' : 'default',
						pointerEvents: isInteractive ? 'all' : 'none', // ✅ Also disable here
					}}
					onClick={handleClick}
					onMouseEnter={handleMouseEnter}
					onMouseLeave={handleMouseLeave}
				/>
			)}
		</g>
	);
}
