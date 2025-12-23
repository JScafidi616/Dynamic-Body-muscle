// Auto-generated from SVG
export type MuscleId = 'Body_Bg' | 'Body_Stroke' | 'RightForearm' | 'RightBicep' | 'RightShoulder' | 'LeftForearm' | 'LeftBicep' | 'LeftShoulder' | 'RightCalf' | 'RightQuad' | 'RightAdductor' | 'LeftCalf' | 'LeftQuad' | 'LeftAdductor' | 'Chest' | 'RightAbsObliques' | 'LeftAbsObliques' | 'AbsUpper' | 'AbsLower' | 'Neck' | 'RightKnee' | 'LeftKnee' | 'RightFeet' | 'LeftFeet' | 'LeftHand' | 'RightHand';

export type MuscleGroupName = 'Body' | 'RightArm' | 'LeftArm' | 'RightLeg' | 'LeftLeg' | 'Torso' | 'Abs' | 'No-Muscle' | 'Knees' | 'Feets' | 'Hands';


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
