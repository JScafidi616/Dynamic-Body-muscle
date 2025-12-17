// src/types/index.ts
import type { MuscleId } from './muscles';

export * from './muscles';

export interface MuscleState {
	highlighted: Set<MuscleId>;
	selected: Set<MuscleId>;
	hovered: MuscleId | null;
}

export interface MuscleStyle {
	fill?: string;
	opacity?: number;
	stroke?: string;
	strokeWidth?: number;
}

export interface MuscleStyles {
	default?: MuscleStyle;
	highlighted?: MuscleStyle;
	selected?: MuscleStyle;
	hovered?: MuscleStyle;
	disabled?: MuscleStyle;
}

export interface BodyMapProps {
	// Programmatic control
	highlighted?: MuscleId[];
	selected?: MuscleId[];

	// Click control
	interactive?: boolean | MuscleId[];
	onMuscleClick?: (muscleId: MuscleId) => void;
	onMuscleHover?: (muscleId: MuscleId | null) => void;

	// Layer control
	showHitLayers?: boolean;

	// Style control
	styles?: MuscleStyles;
	className?: string;

	// View control
	view?: 'front' | 'back';
	gender?: 'male' | 'female';
}

export interface MuscleProps {
	id: MuscleId;
	paths: {
		visible: string;
		hit?: string;
	};
	isHighlighted: boolean;
	isSelected: boolean;
	isHovered: boolean;
	isInteractive: boolean;
	showHitLayer: boolean;
	styles: MuscleStyles;
	onClick?: (id: MuscleId) => void;
	onHover?: (id: MuscleId | null) => void;
}

export interface MuscleGroupProps {
	name: string;
	children: React.ReactNode;
	transform?: string;
}
