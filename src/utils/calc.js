/**
 * Calculations helper for Smart Internal Mark Calculator (SJIT)
 */

// Calculate SJIT Marks (Out of 40)
export function calculateSjitInternal(m1, m2, m3, category, bonusEnabled, extras) {
  const m1_val = parseFloat(m1) || 0;
  const m2_val = parseFloat(m2) || 0;
  const m3_val = parseFloat(m3) || 0;

  const bonus_factor = bonusEnabled ? 1.5 : 1.0;
  
  // Calculate first_10 and second_10
  let first_10 = (m1_val * bonus_factor + m2_val * bonus_factor) * 0.05;
  let second_10 = m3_val * bonus_factor * 0.1;

  first_10 = Math.min(10, parseFloat(first_10.toFixed(2)));
  second_10 = Math.min(10, parseFloat(second_10.toFixed(2)));

  const sumExams = m1_val + m2_val + m3_val;
  const isSpecialCase = sumExams < 100;

  let pt1 = 0;
  let pt2 = 0;
  let pt3 = 0;

  if (!isSpecialCase) {
    pt1 = parseFloat(extras?.pt1) || 0;
    pt2 = parseFloat(extras?.pt2) || 0;
    pt3 = parseFloat(extras?.pt3) || 0;
  }

  // Cap extras based on category limits
  // Category limits:
  // General: NPTEL(8), Course(7), Extra(5)
  // Hope Elite: Cert(7), Assessment(6), Perf(7)
  // PEP: Cert(7), Assessment(6), NPTEL(7)
  let maxPt1 = 8, maxPt2 = 7, maxPt3 = 5;
  if (category === 'hope_elite') {
    maxPt1 = 7; maxPt2 = 6; maxPt3 = 7;
  } else if (category === 'pep') {
    maxPt1 = 7; maxPt2 = 6; maxPt3 = 7;
  }

  pt1 = Math.min(maxPt1, pt1);
  pt2 = Math.min(maxPt2, pt2);
  pt3 = Math.min(maxPt3, pt3);

  const internalMark = parseFloat((first_10 + second_10 + pt1 + pt2 + pt3).toFixed(2));

  // External marks to pass (out of 100)
  // To pass: Internal (out of 40) + External (out of 60) >= 50
  // External (out of 60) >= 50 - Internal
  // External (out of 100) = (50 - Internal) * 1.667
  // Capped at minimum passing external mark of 45
  let external_mark = 91;
  if (internalMark >= 23) {
    external_mark = 45;
  } else {
    external_mark = Math.max(45, Math.floor((50 - internalMark) * 1.667));
  }

  // Possible marks array for external marks from 100 down to 45
  const externalScores = [100, 90, 80, 70, 60, 50, 45];
  const possibleMarks = externalScores.map(extVal => {
    // External contributes 60%
    const extContrib = extVal * 0.6;
    const total = Math.min(100, parseFloat((internalMark + extContrib).toFixed(2)));
    return {
      external: extVal,
      total: total
    };
  });

  return {
    m1: m1_val,
    m2: m2_val,
    m3: m3_val,
    first_10,
    second_10,
    pt1,
    pt2,
    pt3,
    isSpecialCase,
    internalMark,
    requiredExternal: external_mark,
    possibleMarks,
    category,
    bonusEnabled
  };
}

// Calculate Component-wise Marks (Out of 100 internal)
export function calculateComponentInternal(studentInfo, marks) {
  const a1 = parseFloat(marks.a1) || 0;
  const a2 = parseFloat(marks.a2) || 0;
  const ct1 = parseFloat(marks.ct1) || 0;
  const ct2 = parseFloat(marks.ct2) || 0;
  const model = parseFloat(marks.model) || 0;
  const attendance = parseFloat(marks.attendance) || 0;
  const lab = parseFloat(marks.lab) || 0;

  // Weights:
  // Assignments = 10%
  // Cycle Tests = 20%
  // Model Exam = 50%
  // Attendance = 10%
  // Lab = 10%
  const assignmentsMark = parseFloat((((a1 + a2) / 2) * 0.1).toFixed(2));
  const cycleTestsMark = parseFloat((((ct1 + ct2) / 2) * 0.2).toFixed(2));
  const modelMark = parseFloat((model * 0.5).toFixed(2));
  const attendanceMark = parseFloat((attendance * 0.1).toFixed(2));
  const labMark = parseFloat((lab * 0.1).toFixed(2));

  const totalInternal = parseFloat((assignmentsMark + cycleTestsMark + modelMark + attendanceMark + labMark).toFixed(2));
  const percentage = totalInternal; // since total is out of 100

  // Eligibility: Internal >= 40 (which means 40% since it's out of 100) and Attendance >= 75%
  const isEligible = totalInternal >= 40 && attendance >= 75;

  let statusMessage = '';
  let performanceMessage = '';

  if (isEligible) {
    statusMessage = 'Eligible for Semester Exams';
    if (totalInternal >= 85) {
      performanceMessage = 'Outstanding Performance! Keep maintaining this excellent record.';
    } else if (totalInternal >= 70) {
      performanceMessage = 'Very Good Job! You have a solid foundation for the semester exams.';
    } else if (totalInternal >= 55) {
      performanceMessage = 'Good! You are safe and eligible. Aim higher in external exams.';
    } else {
      performanceMessage = 'Eligible, but close to the border. Put extra effort into your study preparation.';
    }
  } else {
    statusMessage = 'Not Eligible for Semester Exams';
    const reasons = [];
    if (totalInternal < 40) reasons.push('Internal marks below 40');
    if (attendance < 75) reasons.push('Attendance below 75%');
    performanceMessage = `Action Required: Critical. ${reasons.join(' and ')}. Please contact your department advisor.`;
  }

  return {
    studentInfo,
    marks: { a1, a2, ct1, ct2, model, attendance, lab },
    breakdown: {
      assignments: assignmentsMark,
      cycleTests: cycleTestsMark,
      model: modelMark,
      attendance: attendanceMark,
      lab: labMark
    },
    totalInternal,
    percentage,
    isEligible,
    statusMessage,
    performanceMessage
  };
}

// GPA/CGPA Estimator
export function estimateCgpa(semesters) {
  // semesters is array of { gpa: number, credits: number }
  let totalCredits = 0;
  let totalPoints = 0;

  semesters.forEach(sem => {
    const gpa = parseFloat(sem.gpa) || 0;
    const credits = parseFloat(sem.credits) || 0;
    totalPoints += gpa * credits;
    totalCredits += credits;
  });

  const cgpa = totalCredits > 0 ? parseFloat((totalPoints / totalCredits).toFixed(2)) : 0;
  return {
    cgpa,
    totalCredits
  };
}
