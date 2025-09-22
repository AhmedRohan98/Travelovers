// Sample data structure for visa assessment questions
// This can be used as a fallback or for testing

export interface Question {
  id: number
  question: string
  visa_type_id: string // or visa_type depending on your schema
  options: Option[]
}

export interface Option {
  id: number
  option: string
  points: number
  question_id: number
  leads_to_question_id: number | null
}

// Sample questions for Visit Visa
export const visitQuestions: Question[] = [
  {
    id: 1,
    question: "What is the primary purpose of your visit?",
    visa_type_id: "visit",
    options: [
      {
        id: 1,
        option: "Tourism and sightseeing",
        points: 15,
        question_id: 1,
        leads_to_question_id: 2
      },
      {
        id: 2,
        option: "Business meeting or conference",
        points: 12,
        question_id: 1,
        leads_to_question_id: 3
      },
      {
        id: 3,
        option: "Family visit",
        points: 10,
        question_id: 1,
        leads_to_question_id: 4
      },
      {
        id: 4,
        option: "Medical treatment",
        points: 8,
        question_id: 1,
        leads_to_question_id: 5
      }
    ]
  },
  {
    id: 2,
    question: "How long do you plan to stay?",
    visa_type_id: "visit",
    options: [
      {
        id: 5,
        option: "1-2 weeks",
        points: 20,
        question_id: 2,
        leads_to_question_id: 6
      },
      {
        id: 6,
        option: "3-4 weeks",
        points: 15,
        question_id: 2,
        leads_to_question_id: 6
      },
      {
        id: 7,
        option: "1-3 months",
        points: 10,
        question_id: 2,
        leads_to_question_id: 6
      },
      {
        id: 8,
        option: "More than 3 months",
        points: 5,
        question_id: 2,
        leads_to_question_id: 6
      }
    ]
  },
  {
    id: 3,
    question: "Do you have a confirmed business meeting or conference invitation?",
    visa_type_id: "visit",
    options: [
      {
        id: 9,
        option: "Yes, with official invitation letter",
        points: 25,
        question_id: 3,
        leads_to_question_id: 6
      },
      {
        id: 10,
        option: "Yes, with email confirmation",
        points: 15,
        question_id: 3,
        leads_to_question_id: 6
      },
      {
        id: 11,
        option: "No, but I have business contacts",
        points: 8,
        question_id: 3,
        leads_to_question_id: 6
      },
      {
        id: 12,
        option: "No, just exploring opportunities",
        points: 3,
        question_id: 3,
        leads_to_question_id: 6
      }
    ]
  },
  {
    id: 4,
    question: "What is your relationship with the family member you're visiting?",
    visa_type_id: "visit",
    options: [
      {
        id: 13,
        option: "Immediate family (spouse, parent, child)",
        points: 20,
        question_id: 4,
        leads_to_question_id: 6
      },
      {
        id: 14,
        option: "Extended family (sibling, grandparent, aunt/uncle)",
        points: 15,
        question_id: 4,
        leads_to_question_id: 6
      },
      {
        id: 15,
        option: "Close friend",
        points: 10,
        question_id: 4,
        leads_to_question_id: 6
      },
      {
        id: 16,
        option: "Other relationship",
        points: 5,
        question_id: 4,
        leads_to_question_id: 6
      }
    ]
  },
  {
    id: 5,
    question: "Do you have medical documentation from your doctor?",
    visa_type_id: "visit",
    options: [
      {
        id: 17,
        option: "Yes, with detailed medical report and treatment plan",
        points: 25,
        question_id: 5,
        leads_to_question_id: 6
      },
      {
        id: 18,
        option: "Yes, with basic medical documentation",
        points: 15,
        question_id: 5,
        leads_to_question_id: 6
      },
      {
        id: 19,
        option: "No, but I can get it",
        points: 8,
        question_id: 5,
        leads_to_question_id: 6
      },
      {
        id: 20,
        option: "No medical documentation",
        points: 2,
        question_id: 5,
        leads_to_question_id: 6
      }
    ]
  },
  {
    id: 6,
    question: "What is your current employment status?",
    visa_type_id: "visit",
    options: [
      {
        id: 21,
        option: "Full-time employed",
        points: 20,
        question_id: 6,
        leads_to_question_id: 7
      },
      {
        id: 22,
        option: "Business owner",
        points: 18,
        question_id: 6,
        leads_to_question_id: 7
      },
      {
        id: 23,
        option: "Retired with pension",
        points: 15,
        question_id: 6,
        leads_to_question_id: 7
      },
      {
        id: 24,
        option: "Student",
        points: 10,
        question_id: 6,
        leads_to_question_id: 7
      },
      {
        id: 25,
        option: "Unemployed",
        points: 3,
        question_id: 6,
        leads_to_question_id: 7
      }
    ]
  },
  {
    id: 7,
    question: "How much funds do you have available for this trip?",
    visa_type_id: "visit",
    options: [
      {
        id: 26,
        option: "More than $10,000",
        points: 25,
        question_id: 7,
        leads_to_question_id: 8
      },
      {
        id: 27,
        option: "$5,000 - $10,000",
        points: 20,
        question_id: 7,
        leads_to_question_id: 8
      },
      {
        id: 28,
        option: "$2,000 - $5,000",
        points: 15,
        question_id: 7,
        leads_to_question_id: 8
      },
      {
        id: 29,
        option: "$1,000 - $2,000",
        points: 10,
        question_id: 7,
        leads_to_question_id: 8
      },
      {
        id: 30,
        option: "Less than $1,000",
        points: 5,
        question_id: 7,
        leads_to_question_id: 8
      }
    ]
  },
  {
    id: 8,
    question: "Have you traveled internationally before?",
    visa_type_id: "visit",
    options: [
      {
        id: 31,
        option: "Yes, multiple times to various countries",
        points: 20,
        question_id: 8,
        leads_to_question_id: null
      },
      {
        id: 32,
        option: "Yes, a few times to neighboring countries",
        points: 15,
        question_id: 8,
        leads_to_question_id: null
      },
      {
        id: 33,
        option: "Yes, once before",
        points: 10,
        question_id: 8,
        leads_to_question_id: null
      },
      {
        id: 34,
        option: "No, this is my first international trip",
        points: 5,
        question_id: 8,
        leads_to_question_id: null
      }
    ]
  }
]

// Sample questions for Study Visa
export const studyQuestions: Question[] = [
  {
    id: 101,
    question: "What type of educational program are you applying for?",
    visa_type_id: "study",
    options: [
      {
        id: 101,
        option: "Bachelor's degree program",
        points: 20,
        question_id: 101,
        leads_to_question_id: 102
      },
      {
        id: 102,
        option: "Master's degree program",
        points: 25,
        question_id: 101,
        leads_to_question_id: 102
      },
      {
        id: 103,
        option: "PhD/Doctorate program",
        points: 30,
        question_id: 101,
        leads_to_question_id: 102
      },
      {
        id: 104,
        option: "Language course",
        points: 15,
        question_id: 101,
        leads_to_question_id: 102
      },
      {
        id: 105,
        option: "Vocational training",
        points: 18,
        question_id: 101,
        leads_to_question_id: 102
      }
    ]
  },
  {
    id: 102,
    question: "Do you have an offer letter from a recognized institution?",
    visa_type_id: "study",
    options: [
      {
        id: 106,
        option: "Yes, from a top-ranked university",
        points: 30,
        question_id: 102,
        leads_to_question_id: 103
      },
      {
        id: 107,
        option: "Yes, from a recognized institution",
        points: 25,
        question_id: 102,
        leads_to_question_id: 103
      },
      {
        id: 108,
        option: "Conditional offer",
        points: 15,
        question_id: 102,
        leads_to_question_id: 103
      },
      {
        id: 109,
        option: "No offer letter yet",
        points: 5,
        question_id: 102,
        leads_to_question_id: 103
      }
    ]
  },
  {
    id: 103,
    question: "What is your English proficiency level?",
    visa_type_id: "study",
    options: [
      {
        id: 110,
        option: "IELTS 7.5+ or equivalent",
        points: 25,
        question_id: 103,
        leads_to_question_id: 104
      },
      {
        id: 111,
        option: "IELTS 6.5-7.0 or equivalent",
        points: 20,
        question_id: 103,
        leads_to_question_id: 104
      },
      {
        id: 112,
        option: "IELTS 6.0-6.5 or equivalent",
        points: 15,
        question_id: 103,
        leads_to_question_id: 104
      },
      {
        id: 113,
        option: "IELTS 5.5-6.0 or equivalent",
        points: 10,
        question_id: 103,
        leads_to_question_id: 104
      },
      {
        id: 114,
        option: "No English proficiency test",
        points: 5,
        question_id: 103,
        leads_to_question_id: 104
      }
    ]
  },
  {
    id: 104,
    question: "How will you fund your education?",
    visa_type_id: "study",
    options: [
      {
        id: 115,
        option: "Full scholarship",
        points: 30,
        question_id: 104,
        leads_to_question_id: 105
      },
      {
        id: 116,
        option: "Partial scholarship + personal funds",
        points: 25,
        question_id: 104,
        leads_to_question_id: 105
      },
      {
        id: 117,
        option: "Family sponsorship",
        points: 20,
        question_id: 104,
        leads_to_question_id: 105
      },
      {
        id: 118,
        option: "Personal savings",
        points: 15,
        question_id: 104,
        leads_to_question_id: 105
      },
      {
        id: 119,
        option: "Education loan",
        points: 12,
        question_id: 104,
        leads_to_question_id: 105
      }
    ]
  },
  {
    id: 105,
    question: "What are your plans after completing your studies?",
    visa_type_id: "study",
    options: [
      {
        id: 120,
        option: "Return to home country to work",
        points: 25,
        question_id: 105,
        leads_to_question_id: null
      },
      {
        id: 121,
        option: "Pursue further studies",
        points: 20,
        question_id: 105,
        leads_to_question_id: null
      },
      {
        id: 122,
        option: "Work in the study country temporarily",
        points: 15,
        question_id: 105,
        leads_to_question_id: null
      },
      {
        id: 123,
        option: "Undecided",
        points: 8,
        question_id: 105,
        leads_to_question_id: null
      }
    ]
  }
]

export function getQuestionsByVisaType(visaType: string): Question[] {
  if (visaType === 'study') {
    return studyQuestions
  }
  return visitQuestions
}

export function getMaxPossibleScore(visaType: string): number {
  const questions = getQuestionsByVisaType(visaType)
  return questions.reduce((total, question) => {
    return total + Math.max(...question.options.map(option => option.points))
  }, 0)
}
