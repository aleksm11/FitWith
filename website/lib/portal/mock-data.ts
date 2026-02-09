// ─── Training Plan Mock Data ───

export type TrainingExercise = {
  exerciseSlug: string;
  nameKey: string;
  sets: number;
  reps: string;
  restSeconds: number;
  notes?: string;
};

export type TrainingDay = {
  dayKey: string;
  focusKey: string;
  exercises: TrainingExercise[];
};

export const trainingPlan: TrainingDay[] = [
  {
    dayKey: "monday",
    focusKey: "chestTriceps",
    exercises: [
      { exerciseSlug: "bench-press", nameKey: "benchPress", sets: 4, reps: "8-10", restSeconds: 120 },
      { exerciseSlug: "", nameKey: "inclineDumbbell", sets: 3, reps: "10-12", restSeconds: 90 },
      { exerciseSlug: "", nameKey: "cableFly", sets: 3, reps: "12-15", restSeconds: 60 },
      { exerciseSlug: "", nameKey: "tricepPushdown", sets: 3, reps: "10-12", restSeconds: 60 },
      { exerciseSlug: "", nameKey: "overheadTricep", sets: 3, reps: "10-12", restSeconds: 60 },
    ],
  },
  {
    dayKey: "tuesday",
    focusKey: "backBiceps",
    exercises: [
      { exerciseSlug: "", nameKey: "deadlift", sets: 4, reps: "6-8", restSeconds: 180 },
      { exerciseSlug: "lat-pulldown", nameKey: "latPulldown", sets: 4, reps: "8-10", restSeconds: 90 },
      { exerciseSlug: "", nameKey: "seatedRow", sets: 3, reps: "10-12", restSeconds: 90 },
      { exerciseSlug: "bicep-curl", nameKey: "bicepCurl", sets: 3, reps: "10-12", restSeconds: 60 },
      { exerciseSlug: "", nameKey: "hammerCurl", sets: 3, reps: "10-12", restSeconds: 60 },
    ],
  },
  {
    dayKey: "wednesday",
    focusKey: "rest",
    exercises: [],
  },
  {
    dayKey: "thursday",
    focusKey: "legsCore",
    exercises: [
      { exerciseSlug: "squat", nameKey: "squat", sets: 4, reps: "8-10", restSeconds: 150 },
      { exerciseSlug: "", nameKey: "legPress", sets: 3, reps: "10-12", restSeconds: 90 },
      { exerciseSlug: "", nameKey: "romanianDeadlift", sets: 3, reps: "10-12", restSeconds: 90 },
      { exerciseSlug: "", nameKey: "legCurl", sets: 3, reps: "12-15", restSeconds: 60 },
      { exerciseSlug: "plank", nameKey: "plank", sets: 3, reps: "45s", restSeconds: 60 },
    ],
  },
  {
    dayKey: "friday",
    focusKey: "shouldersArms",
    exercises: [
      { exerciseSlug: "overhead-press", nameKey: "overheadPress", sets: 4, reps: "8-10", restSeconds: 120 },
      { exerciseSlug: "", nameKey: "lateralRaise", sets: 3, reps: "12-15", restSeconds: 60 },
      { exerciseSlug: "band-pull-apart", nameKey: "bandPullApart", sets: 3, reps: "15-20", restSeconds: 45 },
      { exerciseSlug: "bicep-curl", nameKey: "bicepCurl", sets: 3, reps: "10-12", restSeconds: 60 },
      { exerciseSlug: "", nameKey: "tricepDips", sets: 3, reps: "10-12", restSeconds: 60 },
    ],
  },
  {
    dayKey: "saturday",
    focusKey: "rest",
    exercises: [],
  },
  {
    dayKey: "sunday",
    focusKey: "rest",
    exercises: [],
  },
];

// ─── Nutrition Plan Mock Data ───

export type Meal = {
  nameKey: string;
  foods: { nameKey: string; amount: string }[];
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
};

export type NutritionDay = {
  meals: Meal[];
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
};

export const nutritionPlan: NutritionDay = {
  meals: [
    {
      nameKey: "breakfast",
      foods: [
        { nameKey: "oats", amount: "80g" },
        { nameKey: "banana", amount: "1" },
        { nameKey: "wheyProtein", amount: "30g" },
        { nameKey: "peanutButter", amount: "15g" },
      ],
      calories: 520,
      protein: 38,
      carbs: 65,
      fat: 14,
    },
    {
      nameKey: "snack1",
      foods: [
        { nameKey: "greekYogurt", amount: "200g" },
        { nameKey: "mixedBerries", amount: "100g" },
        { nameKey: "honey", amount: "10g" },
      ],
      calories: 230,
      protein: 20,
      carbs: 30,
      fat: 4,
    },
    {
      nameKey: "lunch",
      foods: [
        { nameKey: "chickenBreast", amount: "200g" },
        { nameKey: "brownRice", amount: "150g" },
        { nameKey: "broccoli", amount: "150g" },
        { nameKey: "oliveOil", amount: "10ml" },
      ],
      calories: 620,
      protein: 52,
      carbs: 60,
      fat: 16,
    },
    {
      nameKey: "snack2",
      foods: [
        { nameKey: "apple", amount: "1" },
        { nameKey: "almonds", amount: "30g" },
      ],
      calories: 260,
      protein: 7,
      carbs: 25,
      fat: 16,
    },
    {
      nameKey: "dinner",
      foods: [
        { nameKey: "salmon", amount: "180g" },
        { nameKey: "sweetPotato", amount: "200g" },
        { nameKey: "mixedSalad", amount: "100g" },
        { nameKey: "oliveOil", amount: "10ml" },
      ],
      calories: 580,
      protein: 42,
      carbs: 48,
      fat: 22,
    },
  ],
  totalCalories: 2210,
  totalProtein: 159,
  totalCarbs: 228,
  totalFat: 72,
};

// ─── Profile Mock Data ───

export type UserProfile = {
  fullName: string;
  email: string;
  phone: string;
  subscriptionTier: "mentoring" | "training" | "nutrition" | "none";
  subscriptionActive: boolean;
  memberSince: string;
  preferredLocale: "sr" | "en" | "ru";
};

export const mockProfile: UserProfile = {
  fullName: "Marko Petrović",
  email: "marko@example.com",
  phone: "+381 63 123 4567",
  subscriptionTier: "mentoring",
  subscriptionActive: true,
  memberSince: "2025-09-15",
  preferredLocale: "sr",
};

// ─── Dashboard Helpers ───

export function getTodayTraining(): TrainingDay {
  const dayIndex = new Date().getDay();
  // JS getDay: 0=Sun, 1=Mon... map to our array (0=Mon)
  const mapped = dayIndex === 0 ? 6 : dayIndex - 1;
  return trainingPlan[mapped];
}

export function getNextWorkoutDay(): TrainingDay | null {
  const dayIndex = new Date().getDay();
  const mapped = dayIndex === 0 ? 6 : dayIndex - 1;
  for (let i = 1; i <= 7; i++) {
    const next = trainingPlan[(mapped + i) % 7];
    if (next.exercises.length > 0) return next;
  }
  return null;
}
