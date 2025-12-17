export { BodyMap } from './components/BodyMap';

// Sub-components (for advanced usage)
export { Muscle } from './components/Muscle';
export { MuscleGroup } from './components/MuscleGroup';

// Hooks
export { useMuscleState } from './hooks/useMuscleState';
export type { UseMuscleStateReturn } from './hooks/useMuscleState';

// Data utilities
export {
	ALL_MUSCLES,
	getMuscleById,
	getMusclesByGroup,
	MUSCLE_GROUPS,
} from './utils/muscleData';

// Types
export type {
	BodyMapProps,
	MuscleData,
	MuscleGroupName,
	MuscleGroupProps,
	MuscleId,
	MuscleProps,
	MuscleState,
	MuscleStyle,
	MuscleStyles,
} from './types';
