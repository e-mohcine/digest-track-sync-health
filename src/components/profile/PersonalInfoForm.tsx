
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Profile } from '@/types/database.types';
import { updateUserProfile } from '@/services/profileService';

interface PersonalInfoFormProps {
  loading: boolean;
  personalInfo: {
    first_name: string;
    last_name: string;
    email: string;
    birth_date: string;
    height: string;
    weight: string;
    diagnosis_type: string;
    diagnosis_date: string;
  };
  setPersonalInfo: React.Dispatch<React.SetStateAction<{
    first_name: string;
    last_name: string;
    email: string;
    birth_date: string;
    height: string;
    weight: string;
    diagnosis_type: string;
    diagnosis_date: string;
  }>>;
}

export const PersonalInfoForm = ({ loading, personalInfo, setPersonalInfo }: PersonalInfoFormProps) => {
  const [saving, setSaving] = useState(false);
  
  const handlePersonalInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setPersonalInfo(prev => ({ ...prev, [name]: value }));
  };

  const savePersonalInfo = async () => {
    setSaving(true);
    try {
      await updateUserProfile({
        first_name: personalInfo.first_name,
        last_name: personalInfo.last_name,
        birth_date: personalInfo.birth_date ? new Date(personalInfo.birth_date).toISOString() : null,
        height: personalInfo.height ? parseFloat(personalInfo.height) : null,
        weight: personalInfo.weight ? parseFloat(personalInfo.weight) : null,
        diagnosis_type: personalInfo.diagnosis_type || null,
        diagnosis_date: personalInfo.diagnosis_date ? new Date(personalInfo.diagnosis_date).toISOString() : null
      });
    } finally {
      setSaving(false);
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="first_name">Prénom</Label>
          <Input 
            id="first_name" 
            name="first_name" 
            value={personalInfo.first_name} 
            onChange={handlePersonalInfoChange} 
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="last_name">Nom</Label>
          <Input 
            id="last_name" 
            name="last_name" 
            value={personalInfo.last_name} 
            onChange={handlePersonalInfoChange} 
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input 
            id="email" 
            name="email" 
            type="email" 
            value={personalInfo.email} 
            readOnly
            className="bg-gray-50"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="birth_date">Date de naissance</Label>
          <Input 
            id="birth_date" 
            name="birth_date" 
            type="date" 
            value={personalInfo.birth_date} 
            onChange={handlePersonalInfoChange} 
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="height">Taille (cm)</Label>
          <Input 
            id="height" 
            name="height" 
            type="number" 
            value={personalInfo.height} 
            onChange={handlePersonalInfoChange} 
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="weight">Poids (kg)</Label>
          <Input 
            id="weight" 
            name="weight" 
            type="number" 
            value={personalInfo.weight} 
            onChange={handlePersonalInfoChange} 
          />
        </div>
      </div>

      <Separator className="my-4" />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="diagnosis_type">Type de diagnostic</Label>
          <Input 
            id="diagnosis_type" 
            name="diagnosis_type" 
            value={personalInfo.diagnosis_type} 
            onChange={handlePersonalInfoChange}
            placeholder="Ex: Maladie de Crohn, RCH, SII..."
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="diagnosis_date">Date de diagnostic</Label>
          <Input 
            id="diagnosis_date" 
            name="diagnosis_date" 
            type="date" 
            value={personalInfo.diagnosis_date} 
            onChange={handlePersonalInfoChange} 
          />
        </div>
      </div>
      
      <div className="flex justify-end mt-4">
        <Button onClick={savePersonalInfo} disabled={loading || saving}>
          {saving ? 'Sauvegarde en cours...' : 'Sauvegarder les modifications'}
        </Button>
      </div>
    </div>
  );
};
