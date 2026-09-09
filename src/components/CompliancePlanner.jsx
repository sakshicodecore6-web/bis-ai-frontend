
import api from '../api/client';import { useState,useEffect } from 'react';
import PlannerInputPanel from './PlannerInputPanel';
import RoadmapCurve from './RoadmapCurve';

const emptyInputs = {
  productName: '',
  category: '',
  stage: '',
  market: '',
};

function CompliancePlanner() {
  const [inputs, setInputs] = useState(emptyInputs);
  const [isGenerated, setIsGenerated] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [steps, setSteps] = useState([]);
  
  
  // Tracks which step IDs are checked off. Kept in state here (not in
  // RoadmapCurve) so it survives Edit toggles, per our "kept" decision.
  const [checkedSteps, setCheckedSteps] = useState(() => new Set());
  useEffect(() => {
  if (!isGenerated) return;

  const loadProgress = async () => {
    try {
      const response = await api.get('/planner/progress');
      const checkedFromServer = new Set(
        response.data.progress
          .filter((item) => item.is_checked)
          .map((item) => item.step_id)
      );
      setCheckedSteps(checkedFromServer);
    } catch (err) {
      console.error('Failed to load progress:', err);
    }
  };

  loadProgress();
}, [isGenerated]);

  const allFieldsFilled = Object.values(inputs).every((value) => value !== '');

  const handleInputChange = (field, value) => {
    setInputs((prev) => ({ ...prev, [field]: value }));
  };

  const handleGenerate = async (event) => {
  event.preventDefault();
  if (!allFieldsFilled) return;

  
  try {
  const response = await api.post('/planner/generate', inputs);

  setSteps(response.data.steps);
  setIsGenerated(true);
  setIsEditing(false);
} catch (err) {
  console.error('Failed to generate roadmap:', err);
}
};

  const handleEdit = () => {
    setIsEditing(true);
  };

  // Re-submitting from edit mode just locks the panel again —
  // checkedSteps is untouched, so progress is preserved.
  const handleUpdate = (event) => {
    event.preventDefault();
    if (!allFieldsFilled) return;
    setIsEditing(false);
  };

  const toggleStep = async (stepId) => {
  // Optimistically update the UI first
  setCheckedSteps((prev) => {
    const next = new Set(prev);
    if (next.has(stepId)) {
      next.delete(stepId);
    } else {
      next.add(stepId);
    }
    return next;
  });

  try {
    const response = await api.post('/planner/progress', { step_id: stepId });
    const checkedFromServer = new Set(
      response.data.progress
        .filter((item) => item.is_checked)
        .map((item) => item.step_id)
    );
    setCheckedSteps(checkedFromServer);
  } catch (err) {
    // If the request fails, we leave the optimistic update as-is for now
    console.error('Failed to sync progress:', err);
  }
};

  // Read-only display mode: locked once generated, unless actively editing
  const isReadOnly = isGenerated && !isEditing;

  return (
    <div className="planner">
      <PlannerInputPanel
        inputs={inputs}
        onChange={handleInputChange}
        onSubmit={isGenerated ? handleUpdate : handleGenerate}
        onEdit={handleEdit}
        isReadOnly={isReadOnly}
        allFieldsFilled={allFieldsFilled}
        showEditButton={isGenerated && !isEditing}
      />

      <RoadmapCurve
        steps={isGenerated ? steps : []}
        checkedSteps={checkedSteps}
        onToggleStep={toggleStep}
      />
    </div>
  );
}

export default CompliancePlanner;