// ─── Admin Mock Data ───

export type AdminUser = {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: "client" | "admin";
  tier: "mentoring" | "training" | "nutrition" | "none";
  subscriptionActive: boolean;
  subscriptionEndDate: string | null;
  planFeatures: string[];
  memberSince: string;
  lastLogin: string;
};

export type AdminExercise = {
  id: string;
  slug: string;
  name: string;
  category: string;
  muscles: string[];
  difficulty: "beginner" | "intermediate" | "advanced";
  hasVideo: boolean;
  createdAt: string;
};

export type AdminTrainingPlan = {
  id: string;
  name: string;
  clientName: string;
  clientId: string;
  daysPerWeek: number;
  goal: string;
  status: "active" | "draft" | "archived";
  createdAt: string;
  days: AdminTrainingDay[];
};

export type AdminTrainingDay = {
  id: string;
  dayName: string;
  dayOfWeek: number | null; // 1=Monday...7=Sunday
  focus: string;
  exercises: AdminTrainingExercise[];
};

export type AdminTrainingExercise = {
  exerciseId: string;
  exerciseName: string;
  sets: number;
  reps: string;
  restSeconds: number;
  notes: string;
};

export type AdminNutritionPlan = {
  id: string;
  name: string;
  clientName: string;
  clientId: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  status: "active" | "draft" | "archived";
  createdAt: string;
  meals: AdminMeal[];
};

export type AdminMeal = {
  id: string;
  name: string;
  foods: { name: string; amount: string; calories: number }[];
  totalCalories: number;
};

export type ContactMessage = {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  isRead: boolean;
  createdAt: string;
};

export type AdminQuestionnaire = {
  id: string;
  clientName: string;
  clientEmail: string;
  submittedAt: string;
  isReviewed: boolean;
  goal: string;
};

// ─── Dashboard Stats ───

export const dashboardStats = {
  totalClients: 47,
  activeClients: 32,
  activePlans: 28,
  pendingMessages: 5,
  totalExercises: 48,
  totalBlogPosts: 12,
};

export const recentSignups: { name: string; email: string; date: string; tier: string }[] = [
  { name: "Nikola Jovanović", email: "nikola@example.com", date: "2026-02-08", tier: "mentoring" },
  { name: "Ana Marković", email: "ana@example.com", date: "2026-02-07", tier: "training" },
  { name: "Stefan Đorđević", email: "stefan@example.com", date: "2026-02-06", tier: "nutrition" },
  { name: "Milica Petrović", email: "milica@example.com", date: "2026-02-05", tier: "mentoring" },
  { name: "Luka Nikolić", email: "luka@example.com", date: "2026-02-03", tier: "training" },
];

// ─── Users ───

export const mockUsers: AdminUser[] = [
  {
    id: "u1",
    fullName: "Marko Petrović",
    email: "marko@example.com",
    phone: "+381 63 123 4567",
    role: "client",
    tier: "mentoring",
    subscriptionActive: true,
    subscriptionEndDate: null,
    planFeatures: [],
    memberSince: "2025-09-15",
    lastLogin: "2026-02-08",
  },
  {
    id: "u2",
    fullName: "Ana Marković",
    email: "ana@example.com",
    phone: "+381 64 234 5678",
    role: "client",
    tier: "training",
    subscriptionActive: true,
    subscriptionEndDate: null,
    planFeatures: [],
    memberSince: "2025-11-01",
    lastLogin: "2026-02-07",
  },
  {
    id: "u3",
    fullName: "Nikola Jovanović",
    email: "nikola@example.com",
    phone: "+381 65 345 6789",
    role: "client",
    tier: "mentoring",
    subscriptionActive: true,
    subscriptionEndDate: null,
    planFeatures: [],
    memberSince: "2026-01-10",
    lastLogin: "2026-02-08",
  },
  {
    id: "u4",
    fullName: "Jelena Ilić",
    email: "jelena@example.com",
    phone: "+381 66 456 7890",
    role: "client",
    tier: "nutrition",
    subscriptionActive: true,
    subscriptionEndDate: null,
    planFeatures: [],
    memberSince: "2025-10-20",
    lastLogin: "2026-02-06",
  },
  {
    id: "u5",
    fullName: "Stefan Đorđević",
    email: "stefan@example.com",
    phone: "+381 62 567 8901",
    role: "client",
    tier: "nutrition",
    subscriptionActive: false,
    subscriptionEndDate: null,
    planFeatures: [],
    memberSince: "2025-08-05",
    lastLogin: "2026-01-15",
  },
  {
    id: "u6",
    fullName: "Milica Petrović",
    email: "milica@example.com",
    phone: "+381 63 678 9012",
    role: "client",
    tier: "mentoring",
    subscriptionActive: true,
    subscriptionEndDate: null,
    planFeatures: [],
    memberSince: "2026-02-05",
    lastLogin: "2026-02-08",
  },
  {
    id: "u7",
    fullName: "Luka Nikolić",
    email: "luka@example.com",
    phone: "+381 64 789 0123",
    role: "client",
    tier: "training",
    subscriptionActive: true,
    subscriptionEndDate: null,
    planFeatures: [],
    memberSince: "2026-02-03",
    lastLogin: "2026-02-08",
  },
  {
    id: "u8",
    fullName: "Teodora Stanković",
    email: "teodora@example.com",
    phone: "+381 65 890 1234",
    role: "client",
    tier: "none",
    subscriptionActive: false,
    subscriptionEndDate: null,
    planFeatures: [],
    memberSince: "2025-07-12",
    lastLogin: "2025-12-20",
  },
  {
    id: "u9",
    fullName: "Aleksandar Stojanović",
    email: "admin@onlinetrener.rs",
    phone: "+381 63 000 0000",
    role: "admin",
    tier: "none",
    subscriptionActive: false,
    subscriptionEndDate: null,
    planFeatures: [],
    memberSince: "2025-01-01",
    lastLogin: "2026-02-09",
  },
];

// ─── Exercises ───

export const mockExercises: AdminExercise[] = [
  { id: "e1", slug: "bench-press", name: "Bench press", category: "grudi", muscles: ["Grudi", "Triceps", "Ramena"], difficulty: "intermediate", hasVideo: false, createdAt: "2025-09-10" },
  { id: "e2", slug: "lat-pulldown", name: "Lat pulldown", category: "ledja", muscles: ["Leđni mišići", "Biceps"], difficulty: "beginner", hasVideo: false, createdAt: "2025-09-10" },
  { id: "e3", slug: "squat", name: "Čučanj", category: "noge", muscles: ["Kvadriceps", "Gluteus", "Zadnja loža"], difficulty: "intermediate", hasVideo: false, createdAt: "2025-09-10" },
  { id: "e4", slug: "overhead-press", name: "Overhead press", category: "ramena", muscles: ["Ramena", "Triceps"], difficulty: "intermediate", hasVideo: false, createdAt: "2025-09-10" },
  { id: "e5", slug: "bicep-curl", name: "Biceps pregib", category: "ruke", muscles: ["Biceps", "Podlaktica"], difficulty: "beginner", hasVideo: false, createdAt: "2025-09-10" },
  { id: "e6", slug: "plank", name: "Plank", category: "stomak", muscles: ["Core"], difficulty: "beginner", hasVideo: false, createdAt: "2025-09-10" },
  { id: "e7", slug: "band-pull-apart", name: "Band pull-apart", category: "korektivne", muscles: ["Zadnji delt", "Gornji deo leđa"], difficulty: "beginner", hasVideo: false, createdAt: "2025-09-11" },
  { id: "e8", slug: "muscle-up", name: "Muscle-up", category: "napredne", muscles: ["Leđni mišići", "Grudi", "Triceps"], difficulty: "advanced", hasVideo: false, createdAt: "2025-09-11" },
  { id: "e9", slug: "deadlift", name: "Mrtvo vučenje", category: "ledja", muscles: ["Leđni mišići", "Zadnja loža", "Gluteus"], difficulty: "advanced", hasVideo: false, createdAt: "2025-09-12" },
  { id: "e10", slug: "incline-dumbbell-press", name: "Kosi potisak sa bučicama", category: "grudi", muscles: ["Grudi", "Ramena", "Triceps"], difficulty: "intermediate", hasVideo: false, createdAt: "2025-09-12" },
  { id: "e11", slug: "cable-fly", name: "Cable fly", category: "grudi", muscles: ["Grudi"], difficulty: "beginner", hasVideo: false, createdAt: "2025-09-12" },
  { id: "e12", slug: "romanian-deadlift", name: "Rumunsko mrtvo vučenje", category: "noge", muscles: ["Zadnja loža", "Gluteus"], difficulty: "intermediate", hasVideo: false, createdAt: "2025-09-13" },
];

export const exerciseCategories = [
  "grudi", "ledja", "noge", "ramena", "ruke", "stomak", "korektivne", "napredne",
];

// ─── Training Plans ───

export const mockTrainingPlans: AdminTrainingPlan[] = [
  {
    id: "tp1",
    name: "Push/Pull/Legs — Marko",
    clientName: "Marko Petrović",
    clientId: "u1",
    daysPerWeek: 5,
    goal: "Hipertrofija",
    status: "active",
    createdAt: "2025-09-20",
    days: [
      {
        id: "td1",
        dayName: "Ponedeljak",
        dayOfWeek: 1,
        focus: "Grudi i triceps",
        exercises: [
          { exerciseId: "e1", exerciseName: "Bench press", sets: 4, reps: "8-10", restSeconds: 120, notes: "" },
          { exerciseId: "e10", exerciseName: "Kosi potisak", sets: 3, reps: "10-12", restSeconds: 90, notes: "" },
          { exerciseId: "e11", exerciseName: "Cable fly", sets: 3, reps: "12-15", restSeconds: 60, notes: "Fokus na kontrakciju" },
        ],
      },
      {
        id: "td2",
        dayName: "Utorak",
        dayOfWeek: 2,
        focus: "Leđa i biceps",
        exercises: [
          { exerciseId: "e9", exerciseName: "Mrtvo vučenje", sets: 4, reps: "6-8", restSeconds: 180, notes: "" },
          { exerciseId: "e2", exerciseName: "Lat pulldown", sets: 4, reps: "8-10", restSeconds: 90, notes: "" },
          { exerciseId: "e5", exerciseName: "Biceps pregib", sets: 3, reps: "10-12", restSeconds: 60, notes: "" },
        ],
      },
      {
        id: "td3",
        dayName: "Četvrtak",
        dayOfWeek: 4,
        focus: "Noge i core",
        exercises: [
          { exerciseId: "e3", exerciseName: "Čučanj", sets: 4, reps: "8-10", restSeconds: 150, notes: "" },
          { exerciseId: "e12", exerciseName: "Rumunsko mrtvo vučenje", sets: 3, reps: "10-12", restSeconds: 90, notes: "" },
          { exerciseId: "e6", exerciseName: "Plank", sets: 3, reps: "45s", restSeconds: 60, notes: "" },
        ],
      },
    ],
  },
  {
    id: "tp2",
    name: "Full Body — Ana",
    clientName: "Ana Marković",
    clientId: "u2",
    daysPerWeek: 3,
    goal: "Mršavljenje",
    status: "active",
    createdAt: "2025-11-05",
    days: [
      {
        id: "td4",
        dayName: "Ponedeljak",
        dayOfWeek: 1,
        focus: "Full body A",
        exercises: [
          { exerciseId: "e3", exerciseName: "Čučanj", sets: 3, reps: "10-12", restSeconds: 90, notes: "" },
          { exerciseId: "e1", exerciseName: "Bench press", sets: 3, reps: "10-12", restSeconds: 90, notes: "" },
          { exerciseId: "e2", exerciseName: "Lat pulldown", sets: 3, reps: "10-12", restSeconds: 90, notes: "" },
        ],
      },
    ],
  },
  {
    id: "tp3",
    name: "Snaga — Nikola (Draft)",
    clientName: "Nikola Jovanović",
    clientId: "u3",
    daysPerWeek: 4,
    goal: "Snaga",
    status: "draft",
    createdAt: "2026-02-01",
    days: [],
  },
];

// ─── Nutrition Plans ───

export const mockNutritionPlans: AdminNutritionPlan[] = [
  {
    id: "np1",
    name: "Hipertrofija 2800kcal — Marko",
    clientName: "Marko Petrović",
    clientId: "u1",
    calories: 2800,
    protein: 180,
    carbs: 320,
    fat: 85,
    status: "active",
    createdAt: "2025-09-22",
    meals: [
      { id: "m1", name: "Doručak", foods: [{ name: "Ovsene pahuljice", amount: "100g", calories: 370 }, { name: "Banana", amount: "1", calories: 105 }, { name: "Whey protein", amount: "30g", calories: 120 }], totalCalories: 595 },
      { id: "m2", name: "Ručak", foods: [{ name: "Pileća prsa", amount: "250g", calories: 413 }, { name: "Integralni pirinač", amount: "200g", calories: 260 }, { name: "Brokoli", amount: "150g", calories: 51 }], totalCalories: 724 },
      { id: "m3", name: "Užina", foods: [{ name: "Grčki jogurt", amount: "200g", calories: 130 }, { name: "Bademi", amount: "30g", calories: 175 }], totalCalories: 305 },
      { id: "m4", name: "Večera", foods: [{ name: "Losos", amount: "200g", calories: 412 }, { name: "Batat", amount: "250g", calories: 225 }, { name: "Salata", amount: "100g", calories: 20 }], totalCalories: 657 },
    ],
  },
  {
    id: "np2",
    name: "Deficit 1800kcal — Ana",
    clientName: "Ana Marković",
    clientId: "u2",
    calories: 1800,
    protein: 140,
    carbs: 180,
    fat: 55,
    status: "active",
    createdAt: "2025-11-06",
    meals: [
      { id: "m5", name: "Doručak", foods: [{ name: "Jaja", amount: "3", calories: 210 }, { name: "Integralni hleb", amount: "2 kriške", calories: 140 }], totalCalories: 350 },
      { id: "m6", name: "Ručak", foods: [{ name: "Pileća prsa", amount: "200g", calories: 330 }, { name: "Kvinoja", amount: "100g", calories: 120 }], totalCalories: 450 },
      { id: "m7", name: "Večera", foods: [{ name: "Ćuretina", amount: "180g", calories: 270 }, { name: "Povrće na pari", amount: "200g", calories: 80 }], totalCalories: 350 },
    ],
  },
  {
    id: "np3",
    name: "Masa 3200kcal — Nikola (Draft)",
    clientName: "Nikola Jovanović",
    clientId: "u3",
    calories: 3200,
    protein: 200,
    carbs: 380,
    fat: 100,
    status: "draft",
    createdAt: "2026-02-02",
    meals: [],
  },
];

// ─── Contact Messages ───

export const mockMessages: ContactMessage[] = [
  {
    id: "msg1",
    name: "Petar Milenković",
    email: "petar@example.com",
    phone: "+381 63 111 2222",
    message: "Zdravo, zanima me online mentorstvo. Da li je moguće početi odmah ili postoji lista čekanja?",
    isRead: false,
    createdAt: "2026-02-09T10:30:00",
  },
  {
    id: "msg2",
    name: "Jovana Ristić",
    email: "jovana@example.com",
    phone: "+381 64 333 4444",
    message: "Htela bih da se raspitam o planu ishrane. Imam intoleranciju na laktozu — da li to može da se prilagodi?",
    isRead: false,
    createdAt: "2026-02-08T15:45:00",
  },
  {
    id: "msg3",
    name: "Milan Todorović",
    email: "milan@example.com",
    phone: "+381 65 555 6666",
    message: "Pozdrav! Imam 20kg viška i želim da počnem sa treningom i ishranom. Koji paket mi preporučujete?",
    isRead: false,
    createdAt: "2026-02-08T09:15:00",
  },
  {
    id: "msg4",
    name: "Sara Pavlović",
    email: "sara@example.com",
    phone: "+381 66 777 8888",
    message: "Da li radite sa ženama? Zanima me program za toniranje i gubitak masti.",
    isRead: true,
    createdAt: "2026-02-07T14:20:00",
  },
  {
    id: "msg5",
    name: "Đorđe Savić",
    email: "djordje@example.com",
    phone: "+381 62 999 0000",
    message: "Zanima me da li plan treninga uključuje video snimke vežbi? Početnk sam i bilo bi mi korisno.",
    isRead: true,
    createdAt: "2026-02-06T11:00:00",
  },
];

// ─── Questionnaires ───

export const mockQuestionnaires: AdminQuestionnaire[] = [
  { id: "q1", clientName: "Nikola Jovanović", clientEmail: "nikola@example.com", submittedAt: "2026-02-08", isReviewed: false, goal: "Mršavljenje i toniranje" },
  { id: "q2", clientName: "Milica Petrović", clientEmail: "milica@example.com", submittedAt: "2026-02-05", isReviewed: false, goal: "Povećanje mišićne mase" },
  { id: "q3", clientName: "Ana Marković", clientEmail: "ana@example.com", submittedAt: "2025-11-01", isReviewed: true, goal: "Mršavljenje" },
  { id: "q4", clientName: "Marko Petrović", clientEmail: "marko@example.com", submittedAt: "2025-09-15", isReviewed: true, goal: "Hipertrofija" },
];
