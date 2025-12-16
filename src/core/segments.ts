// ----------------------
//  Segment Type
// ----------------------
export type Segment =
	| 'Chest'
	| 'AbsUpper'
	| 'AbsLower'
	| 'AbsObliques'
	| 'RightBicep'
	| 'LeftBicep'
	| 'RightForearm'
	| 'LeftForearm'
	| 'RightShoulder'
	| 'LeftShoulder'
	| 'RightQuad'
	| 'LeftQuad'
	| 'RightCalf'
	| 'LeftCalf'
	| 'RightAdductor'
	| 'LeftAdductor';

// ----------------------
//  Groups (for UI toggles or filters)
// ----------------------
export type SegmentGroup = 'TorsoGroup' | 'ArmsGroup' | 'LegsGroup';

// ----------------------
//  All valid segments
// ----------------------
export const segments: Segment[] = [
	'Chest',
	'AbsUpper',
	'AbsLower',
	'AbsObliques',
	'RightBicep',
	'LeftBicep',
	'RightForearm',
	'LeftForearm',
	'RightShoulder',
	'LeftShoulder',
	'RightQuad',
	'LeftQuad',
	'RightCalf',
	'LeftCalf',
	'RightAdductor',
	'LeftAdductor',
];

export const segmentGroups: Record<SegmentGroup, Segment[]> = {
	TorsoGroup: ['Chest', 'AbsUpper', 'AbsLower', 'AbsObliques'],

	ArmsGroup: [
		'RightBicep',
		'LeftBicep',
		'RightForearm',
		'LeftForearm',
		'RightShoulder',
		'LeftShoulder',
	],

	LegsGroup: [
		'RightQuad',
		'LeftQuad',
		'RightCalf',
		'LeftCalf',
		'RightAdductor',
		'LeftAdductor',
	],
};

// ----------------------
//  Pairing (left/right symmetry)
// ----------------------
export const pairedSegments: Record<string, Segment[]> = {
	Biceps: ['RightBicep', 'LeftBicep'],
	Forearms: ['RightForearm', 'LeftForearm'],
	Shoulders: ['RightShoulder', 'LeftShoulder'],

	Quads: ['RightQuad', 'LeftQuad'],
	Calves: ['RightCalf', 'LeftCalf'],
	Adductors: ['RightAdductor', 'LeftAdductor'],
};

// ----------------------
//  Hit Areas (SVG transparent overlays)
// ----------------------
export const hitMap: Record<Segment, string> = {
	Chest: 'Chest_Hit',
	AbsUpper: 'AbsUpper_Hit',
	AbsLower: 'AbsLower_Hit',
	AbsObliques: 'AbsObliques_Hit',

	RightBicep: 'RightBicep_Hit',
	LeftBicep: 'LeftBicep_Hit',

	RightForearm: 'RightForearm_Hit',
	LeftForearm: 'LeftForearm_Hit',

	RightShoulder: 'RightShoulder_Hit',
	LeftShoulder: 'LeftShoulder_Hit',

	RightQuad: 'RightQuad_Hit',
	LeftQuad: 'LeftQuad_Hit',

	RightCalf: 'RightCalf_Hit',
	LeftCalf: 'LeftCalf_Hit',

	RightAdductor: 'RightAdductor_Hit',
	LeftAdductor: 'LeftAdductor_Hit',
};
