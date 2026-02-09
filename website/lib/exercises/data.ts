export type ExerciseCategory =
  | "grudi"
  | "ledja"
  | "noge"
  | "ramena"
  | "ruke"
  | "stomak"
  | "korektivne"
  | "napredne";

export type Exercise = {
  slug: string;
  nameKey: string;
  descKey: string;
  category: ExerciseCategory;
  muscleGroupKeys: string[];
  instructionsKey: string;
};

export const categories: ExerciseCategory[] = [
  "grudi",
  "ledja",
  "noge",
  "ramena",
  "ruke",
  "stomak",
  "korektivne",
  "napredne",
];

export const exercises: Exercise[] = [
  {
    slug: "bench-press",
    nameKey: "benchPressName",
    descKey: "benchPressDesc",
    category: "grudi",
    muscleGroupKeys: ["muscleChest", "muscleTriceps", "muscleShoulders"],
    instructionsKey: "benchPressInstructions",
  },
  {
    slug: "lat-pulldown",
    nameKey: "latPulldownName",
    descKey: "latPulldownDesc",
    category: "ledja",
    muscleGroupKeys: ["muscleLats", "muscleBiceps", "muscleRearDelts"],
    instructionsKey: "latPulldownInstructions",
  },
  {
    slug: "squat",
    nameKey: "squatName",
    descKey: "squatDesc",
    category: "noge",
    muscleGroupKeys: ["muscleQuads", "muscleGlutes", "muscleHamstrings"],
    instructionsKey: "squatInstructions",
  },
  {
    slug: "overhead-press",
    nameKey: "overheadPressName",
    descKey: "overheadPressDesc",
    category: "ramena",
    muscleGroupKeys: ["muscleShoulders", "muscleTriceps", "muscleCore"],
    instructionsKey: "overheadPressInstructions",
  },
  {
    slug: "bicep-curl",
    nameKey: "bicepCurlName",
    descKey: "bicepCurlDesc",
    category: "ruke",
    muscleGroupKeys: ["muscleBiceps", "muscleForearms"],
    instructionsKey: "bicepCurlInstructions",
  },
  {
    slug: "plank",
    nameKey: "plankName",
    descKey: "plankDesc",
    category: "stomak",
    muscleGroupKeys: ["muscleCore", "muscleShoulders", "muscleGlutes"],
    instructionsKey: "plankInstructions",
  },
  {
    slug: "band-pull-apart",
    nameKey: "bandPullApartName",
    descKey: "bandPullApartDesc",
    category: "korektivne",
    muscleGroupKeys: ["muscleRearDelts", "muscleUpperBack", "muscleRotatorCuff"],
    instructionsKey: "bandPullApartInstructions",
  },
  {
    slug: "muscle-up",
    nameKey: "muscleUpName",
    descKey: "muscleUpDesc",
    category: "napredne",
    muscleGroupKeys: ["muscleLats", "muscleChest", "muscleTriceps", "muscleCore"],
    instructionsKey: "muscleUpInstructions",
  },
];

export function getExerciseBySlug(slug: string): Exercise | undefined {
  return exercises.find((e) => e.slug === slug);
}

export function getExercisesByCategory(category: ExerciseCategory): Exercise[] {
  return exercises.filter((e) => e.category === category);
}

export function getRelatedExercises(slug: string, limit = 3): Exercise[] {
  const exercise = getExerciseBySlug(slug);
  if (!exercise) return [];
  return exercises
    .filter((e) => e.slug !== slug && e.category === exercise.category)
    .slice(0, limit)
    .concat(
      exercises
        .filter((e) => e.slug !== slug && e.category !== exercise.category)
        .slice(0, limit)
    )
    .slice(0, limit);
}
