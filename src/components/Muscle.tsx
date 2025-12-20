// src/components/Muscle.tsx
import React, { useState } from 'react';
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

	// Elements that should always be "disabled" style (Body background, etc.)
	const ALWAYS_DISABLED_IDS = ['Body_Bg', 'Body_Stroke', 'Neck'];
	const shouldBeDisabledStyle = ALWAYS_DISABLED_IDS.includes(id);

	// Determine which style to apply
	const getStyle = (): MuscleStyle => {
		// ✅ Apply disabled style ONLY to body/stroke/neck, NOT to muscles
		if (shouldBeDisabledStyle) return styles.disabled || {};

		// For actual muscles, show proper states regardless of interactivity
		if (isSelected) return styles.selected || {};
		if (isInteractive && (isHovered || isLocalHovered))
			return styles.hovered || {};
		if (isHighlighted) return styles.highlighted || {};
		return styles.default || {};

		// if (isSelected) return styles.selected || {};
		// if (isInteractive && (isHovered || isLocalHovered))
		// 	return styles.hovered || {};
		// if (isHighlighted) return styles.highlighted || {};
		// return styles.default || {};

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
			pointerEvents: (isInteractive
				? 'auto'
				: 'none') as React.CSSProperties['pointerEvents'], // Disable pointer events if not interactive
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
					style={
						{
							cursor: isInteractive ? 'pointer' : 'default',
							pointerEvents: isInteractive ? 'all' : 'none', // ✅ Also disable here
						} as React.CSSProperties
					}
					onClick={handleClick}
					onMouseEnter={handleMouseEnter}
					onMouseLeave={handleMouseLeave}
				/>
			)}
		</g>
	);
}
