import { ACADEMIC_LEVELS } from '../../strings';

interface ToggleLevelProps {
  levelVal: string;
  state: 'edit' | 'new';
  editLevelFR: string;
  setEditLevelFR: (v: string) => void;
  editLevelEN: string;
  setEditLevelEN: (v: string) => void;
  newWidgetLevelFR: string;
  setNewWidgetLevelFR: (v: string) => void;
  newWidgetLevelEN: string;
  setNewWidgetLevelEN: (v: string) => void;
}

export const toggleAcademicLevelHelper = ({
  levelVal,
  state,
  editLevelFR,
  setEditLevelFR,
  editLevelEN,
  setEditLevelEN,
  newWidgetLevelFR,
  setNewWidgetLevelFR,
  newWidgetLevelEN,
  setNewWidgetLevelEN
}: ToggleLevelProps) => {
  const currentFR = state === 'edit' ? editLevelFR : newWidgetLevelFR;
  const currentEN = state === 'edit' ? editLevelEN : newWidgetLevelEN;

  const selectedFRList = currentFR ? currentFR.split(' / ').map(s => s.trim()).filter(Boolean) : [];
  const selectedENList = currentEN ? currentEN.split(' / ').map(s => s.trim()).filter(Boolean) : [];

  const targetLevel = ACADEMIC_LEVELS.find(lvl => lvl.value === levelVal);
  if (!targetLevel) return;

  let newFRList: string[];
  let newENList: string[];

  const alreadySelectedIdx = selectedENList.findIndex(x => x.toLowerCase() === targetLevel.EN.toLowerCase());

  if (alreadySelectedIdx !== -1) {
    newFRList = selectedFRList.filter((_, idx) => idx !== alreadySelectedIdx);
    newENList = selectedENList.filter((_, idx) => idx !== alreadySelectedIdx);
  } else {
    newFRList = [...selectedFRList, targetLevel.FR];
    newENList = [...selectedENList, targetLevel.EN];
  }

  const finalFR = newFRList.join(' / ');
  const finalEN = newENList.join(' / ');

  if (state === 'edit') {
    setEditLevelFR(finalFR);
    setEditLevelEN(finalEN);
  } else {
    setNewWidgetLevelFR(finalFR);
    setNewWidgetLevelEN(finalEN);
  }
};
