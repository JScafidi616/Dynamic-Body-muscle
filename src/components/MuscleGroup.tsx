import type { MuscleGroupProps } from '../types';

export function MuscleGroup({ name, children, transform }: MuscleGroupProps) {
	return (
		<g id={`${name}Group`} transform={transform}>
			{children}
		</g>
	);
}
