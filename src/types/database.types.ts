
export type Profile = {
  id: string;
  first_name: string | null;
  last_name: string | null;
  birth_date: string | null;
  weight: number | null;
  height: number | null;
  diagnosis_date: string | null;
  diagnosis_type: string | null;
  created_at: string;
  updated_at: string;
};

export type StoolEntry = {
  id: string;
  user_id: string;
  bristol_type: number;
  quantity: string; // Modifié pour accepter toute chaîne de caractères
  notes: string | null;
  has_photo: boolean;
  has_blood: boolean;
  has_mucus: boolean;
  occurred_at: string;
  created_at: string;
  updated_at: string;
};

export type SymptomType = {
  id: number;
  name: string;
  category: string; // Modifié pour accepter toute chaîne de caractères
  description: string | null;
  icon: string | null;
  created_at: string;
};

export type SymptomEntry = {
  id: string;
  user_id: string;
  symptom_type_id: number;
  intensity: number;
  notes: string | null;
  occurred_at: string;
  created_at: string;
  updated_at: string;
};

export type MoodEntry = {
  id: string;
  user_id: string;
  mood_level: number;
  stress_level: number | null;
  sleep_quality: number | null;
  notes: string | null;
  occurred_at: string;
  created_at: string;
  updated_at: string;
};

export type Medication = {
  id: string;
  user_id: string;
  name: string;
  dosage: string | null;
  frequency: string | null;
  start_date: string | null;
  end_date: string | null;
  active: boolean;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export type MedicationLog = {
  id: string;
  user_id: string;
  medication_id: string;
  taken_at: string;
  dosage_taken: string | null;
  notes: string | null;
  created_at: string;
};

export type FoodCategory = {
  id: number;
  name: string;
  icon: string | null;
  created_at: string;
};

export type FoodEntry = {
  id: string;
  user_id: string;
  food_name: string;
  category_id: number | null;
  quantity: string | null;
  meal_type: string | null; // Modifié pour accepter toute chaîne de caractères
  has_photo: boolean;
  notes: string | null;
  consumed_at: string;
  created_at: string;
  updated_at: string;
};

export type Badge = {
  id: number;
  name: string;
  description: string;
  icon: string;
  category: string | null; // Modifié pour accepter toute chaîne de caractères
  difficulty: number | null;
  created_at: string;
};

export type UserBadge = {
  id: string;
  user_id: string;
  badge_id: number;
  earned_at: string;
};

export type MedicalNote = {
  id: string;
  user_id: string;
  title: string;
  content: string;
  doctor_name: string | null;
  appointment_date: string | null;
  follow_up_date: string | null;
  attachments: any | null;
  created_at: string;
  updated_at: string;
};
