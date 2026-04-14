import * as cheerio from 'cheerio';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

interface MuscleData {
	id: string;
	name: string;
	group: string;
	hasHitLayer: boolean;
	paths: {
		visible: string;
		hit?: string;
	};
	viewBox?: string;
}

interface MuscleGroup {
	name: string;
	muscles: MuscleData[];
}

function parseSVG(svgPath: string) {
	const svgContent = readFileSync(svgPath, 'utf-8');
	const $ = cheerio.load(svgContent, { xmlMode: true });

	const viewBox = $('svg').attr('viewBox') || '0 0 391.97 650.97';
	const muscleGroups: Record<string, MuscleGroup> = {};

	// Find all muscle paths (excluding _Hit layers)
	$('path[id]').each((_, element) => {
		const id = $(element).attr('id');
		if (!id || id.endsWith('_Hit')) return;

		// Determine group from parent g element
		const parentGroup = $(element).parent('g').attr('id') || 'Other';
		const groupName = parentGroup.replace('Group', '');

		// Check if there's a corresponding hit layer
		const hitLayerId = `${id}_Hit`;
		const hitElement = $(`#${hitLayerId}`);
		const hasHitLayer = hitElement.length > 0;

		// Extract path data
		const visiblePath = $(element).attr('d') || '';
		const hitPath = hasHitLayer ? hitElement.attr('d') || '' : undefined;

		// Get fill color
		//const fill = $(element).attr('fill') || '#c2c2c2';

		const muscleData: MuscleData = {
			id,
			name: id.replace(/([A-Z])/g, ' $1').trim(),
			group: groupName,
			hasHitLayer,
			paths: {
				visible: visiblePath,
				hit: hitPath,
			},
		};

		if (!muscleGroups[groupName]) {
			muscleGroups[groupName] = {
				name: groupName,
				muscles: [],
			};
		}

		muscleGroups[groupName].muscles.push(muscleData);
	});

	return { muscleGroups, viewBox };
}

// Generate muscle pairs automatically
function generateMusclePairs(
	muscleGroups: Record<string, MuscleGroup>,
): Record<string, string> {
	const pairs: Record<string, string> = {};
	const allMuscles = Object.values(muscleGroups).flatMap(
		(group) => group.muscles,
	);

	allMuscles.forEach((muscle) => {
		const id = muscle.id;

		// Check if it starts with Left or Right
		if (id.startsWith('Left')) {
			const rightVersion = id.replace('Left', 'Right');
			// Check if the right version exists
			if (allMuscles.some((m) => m.id === rightVersion)) {
				pairs[id] = rightVersion;
			}
		} else if (id.startsWith('Right')) {
			const leftVersion = id.replace('Right', 'Left');
			// Check if the left version exists
			if (allMuscles.some((m) => m.id === leftVersion)) {
				pairs[id] = leftVersion;
			}
		}
	});

	return pairs;
}

function generateTypeScript(
	muscleGroups: Record<string, MuscleGroup>,
	viewBox: string,
) {
	const allMuscleIds = Object.values(muscleGroups).flatMap((group) =>
		group.muscles.map((m) => m.id),
	);

	const types = `// Auto-generated from SVG
export type MuscleId = ${allMuscleIds.map((id) => `'${id}'`).join(' | ')};

export type MuscleGroupName = ${Object.keys(muscleGroups)
		.map((name) => `'${name}'`)
		.join(' | ')};


export interface MuscleData {
  id: MuscleId;
  name: string;
  group: MuscleGroupName;
  hasHitLayer: boolean;
  paths: {
    visible: string;
    hit?: string;
  };
}

export interface MuscleGroup {
  name: MuscleGroupName;
  muscles: MuscleData[];
}
`;
	// Remove viewBox from individual muscles
	const cleanedGroups = Object.fromEntries(
		Object.entries(muscleGroups).map(([key, group]) => [
			key,
			{
				...group,
				muscles: group.muscles.map(({ ...muscle }) => muscle),
			},
		]),
	);

	// Generate muscle pairs
	const musclePairs = generateMusclePairs(muscleGroups);

	const data = `// Auto-generated from SVG
import type { MuscleGroup } from '../types/muscles';

export const VIEWBOX = '${viewBox}';

export const MUSCLE_GROUPS: Record<string, MuscleGroup> = ${JSON.stringify(
		cleanedGroups,
		null,
		2,
	)};

export const ALL_MUSCLES = Object.values(MUSCLE_GROUPS).flatMap(group => group.muscles);

export const getMuscleById = (id: string) => 
  ALL_MUSCLES.find(muscle => muscle.id === id);

export const getMusclesByGroup = (groupName: string) =>
  MUSCLE_GROUPS[groupName]?.muscles || [];

// Auto-generated muscle pairs (Left <-> Right)
export const MUSCLE_PAIRS: Record<string, string> = ${JSON.stringify(
		musclePairs,
		null,
		2,
	)};

export const getPairedMuscle = (muscleId: string): string | undefined => {
  return MUSCLE_PAIRS[muscleId];
};
`;

	return { types, data };
}

// Main execution
const svgPath = join(process.cwd(), 'src', 'assets', 'body-map-fem_front.svg');
const typesPath = join(process.cwd(), 'src', 'types', 'muscles.ts');
const dataPath = join(process.cwd(), 'src', 'utils', 'muscleData.ts');

console.log('🔍 Parsing SVG...');
const { muscleGroups, viewBox } = parseSVG(svgPath);

console.log('📝 Generating TypeScript...');
const { types, data } = generateTypeScript(muscleGroups, viewBox);

console.log('💾 Writing files...');
writeFileSync(typesPath, types);
writeFileSync(dataPath, data);

const muscleCount = Object.values(muscleGroups).reduce(
	(sum, group) => sum + group.muscles.length,
	0,
);
const pairCount = Object.keys(generateMusclePairs(muscleGroups)).length / 2; // Divide by 2 since each pair is counted twice

console.log(
	`✅ Done! Generated ${muscleCount} muscles in ${
		Object.keys(muscleGroups).length
	} groups`,
);
console.log(`   - Muscle pairs: ${pairCount} pairs found`);
console.log(`   - Types: ${typesPath}`);
console.log(`   - Data: ${dataPath}`);
