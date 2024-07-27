import React from "react";

// function RoleTypesData() {
const Data = [
  {
    value: 10,
    label: "Architect",
  },
  {
    value: 134,
    label: "Ass. Principal Data Architect",
  },
  {
    value: 1,
    label: "Assistant Manager",
  },
  {
    value: 5,
    label: "Associate",
  },
  {
    value: 51,
    label: "Associate Analyst",
  },
  {
    value: 49,
    label: "Associate Architect",
  },
  {
    value: 85,
    label: "Associate Automation Engineer",
  },
  {
    value: 92,
    label: "Associate Business Analyst",
  },
  {
    value: 98,
    label: "Associate Business Architect",
  },
  {
    value: 133,
    label: "Associate Client Success Lead",
  },
  {
    value: 65,
    label: "Associate Consultant",
  },
  {
    value: 61,
    label: "Associate Director",
  },
  {
    value: 137,
    label: "Associate Director - Client Success",
  },
  {
    value: 136,
    label: "Associate Director - Consulting",
  },
  {
    value: 53,
    label: "Associate Engineer",
  },
  {
    value: 60,
    label: "Associate Enterprise Architect",
  },
  {
    value: 67,
    label: "Associate Functional Lead",
  },
  {
    value: 8,
    label: "Associate Lead",
  },
  {
    value: 7,
    label: "Associate Lead Functional",
  },
  {
    value: 79,
    label: "Associate Management",
  },
  {
    value: 2,
    label: "Associate Manager",
  },
  {
    value: 74,
    label: "Associate Manager",
  },
  {
    value: 87,
    label: "Associate Performance Engineer",
  },
  {
    value: 115,
    label: "Associate Principal Data Architect",
  },
  {
    value: 105,
    label: "Associate Project Coordinator",
  },
  {
    value: 97,
    label: "Associate Project Manager",
  },
  {
    value: 112,
    label: "Associate QA Engineer",
  },
  {
    value: 129,
    label: "Associate QA Manager",
  },
  {
    value: 116,
    label: "Associate QA Program Manager",
  },
  {
    value: 128,
    label: "Associate Software Architect",
  },
  {
    value: 11,
    label: "Associate Software Engineer",
  },
  {
    value: 119,
    label: "Associate Software Tech Lead",
  },
  {
    value: 144,
    label: "Associate Software Technical Lead",
  },
  {
    value: 130,
    label: "Associate Staff Software Engineer",
  },
  {
    value: 12,
    label: "Associate Team Lead",
  },
  {
    value: 13,
    label: "Associate Technical Lead",
  },
  {
    value: 66,
    label: "Associate Technical Lead",
  },
  {
    value: 91,
    label: "Associate Test Engineer",
  },
  {
    value: 9,
    label: "Associate Test Lead",
  },
  {
    value: 14,
    label: "Associate Test Manager",
  },
  {
    value: 145,
    label: "Associate Vice President",
  },
  {
    value: 151,
    label: "Associate VP - Offering Management",
  },
  {
    value: 86,
    label: "Automation Engineer",
  },
  {
    value: 94,
    label: "Business Analyst",
  },
  {
    value: 102,
    label: "Business Architect",
  },
  {
    value: 16,
    label: "Chief Financial Officer",
  },
  {
    value: 107,
    label: "Client Success Leader",
  },
  {
    value: 101,
    label: "Competency Lead",
  },
  {
    value: 44,
    label: "Consultant",
  },
  {
    value: 108,
    label: "Consulting Lead",
  },
  {
    value: 131,
    label: "Data Architect",
  },
  {
    value: 146,
    label: "Data Engineer",
  },
  {
    value: 30,
    label: "Delivery Manager",
  },
  {
    value: 17,
    label: "Deputy General Manager",
  },
  {
    value: 62,
    label: "Director",
  },
  {
    value: 138,
    label: "Director - Client Success",
  },
  {
    value: 139,
    label: "Director - Consulting",
  },
  {
    value: 149,
    label: "Director - Innovation",
  },
  {
    value: 148,
    label: "Director, Offering Management",
  },
  {
    value: 93,
    label: "Engineer",
  },
  {
    value: 81,
    label: "Enterprise Architect",
  },
  {
    value: 3,
    label: "Executive",
  },
  {
    value: 20,
    label: "Functional Analyst",
  },
  {
    value: 21,
    label: "Functional Lead",
  },
  {
    value: 23,
    label: "Head of HR",
  },
  {
    value: 22,
    label: "Head of Practice",
  },
  {
    value: 24,
    label: "Head of Practice - Offshore",
  },
  {
    value: 48,
    label: "Head of Practice - Offshore",
  },
  {
    value: 64,
    label: "Intern",
  },
  {
    value: 6,
    label: "Jr. Functional Analyst",
  },
  {
    value: 25,
    label: "Lead",
  },
  {
    value: 83,
    label: "Lead - HR",
  },
  {
    value: 84,
    label: "Lead - IT",
  },
  {
    value: 71,
    label: "Lead - PMO",
  },
  {
    value: 26,
    label: "Lead Business Analyst",
  },
  {
    value: 27,
    label: "Lead Consultant",
  },
  {
    value: 69,
    label: "Lead Performance Engineer",
  },
  {
    value: 68,
    label: "Lead Test Engineer",
  },
  {
    value: 78,
    label: "Management",
  },
  {
    value: 18,
    label: "Manager",
  },
  {
    value: 90,
    label: "Performance Engineer",
  },
  {
    value: 55,
    label: "Performance Test Engineer",
  },
  {
    value: 29,
    label: "Practice Director",
  },
  {
    value: 117,
    label: "Principal Data Architect",
  },
  {
    value: 118,
    label: "Principal Security Architect",
  },
  {
    value: 150,
    label: "Principal Software Architect",
  },
  {
    value: 59,
    label: "Principle Architect",
  },
  {
    value: 140,
    label: "Product Support Manager",
  },
  {
    value: 109,
    label: "Project Coordinator",
  },
  {
    value: 103,
    label: "Project Cordinator",
  },
  {
    value: 75,
    label: "Project Manager",
  },
  {
    value: 113,
    label: "QA Engineer",
  },
  {
    value: 142,
    label: "QA Manager",
  },
  {
    value: 147,
    label: "QA Programmer",
  },
  {
    value: 121,
    label: "QA Tech Lead",
  },
  {
    value: 100,
    label: "Sedr",
  },
  {
    value: 50,
    label: "Senior Architect",
  },
  {
    value: 89,
    label: "Senior Automation Engineer",
  },
  {
    value: 58,
    label: "Senior Business Analyst",
  },
  {
    value: 15,
    label: "Senior Consultant",
  },
  {
    value: 132,
    label: "Senior Data Architect",
  },
  {
    value: 114,
    label: "Senior Data Engineer",
  },
  {
    value: 63,
    label: "Senior Delivery Manager",
  },
  {
    value: 106,
    label: "Senior Delivery Partner",
  },
  {
    value: 135,
    label: "Senior Director",
  },
  {
    value: 82,
    label: "Senior Enterprise Architect",
  },
  {
    value: 19,
    label: "Senior Executive",
  },
  {
    value: 31,
    label: "Senior Functional Analyst",
  },
  {
    value: 73,
    label: "Senior Functional Lead",
  },
  {
    value: 33,
    label: "Senior Lead",
  },
  {
    value: 104,
    label: "Senior Lead - PMO",
  },
  {
    value: 32,
    label: "Senior Lead Functional",
  },
  {
    value: 80,
    label: "Senior Management",
  },
  {
    value: 35,
    label: "Senior Manager",
  },
  {
    value: 88,
    label: "Senior Performance Engineer",
  },
  {
    value: 57,
    label: "Senior Performance Test Engineer",
  },
  {
    value: 77,
    label: "Senior Project Manager",
  },
  {
    value: 110,
    label: "Senior QA Engineer",
  },
  {
    value: 126,
    label: "Senior QA Tech Lead",
  },
  {
    value: 143,
    label: "Senior Software Architect",
  },
  {
    value: 36,
    label: "Senior Software Engineer",
  },
  {
    value: 99,
    label: "Senior Solution Architect",
  },
  {
    value: 125,
    label: "Senior Staff QA Engineer",
  },
  {
    value: 127,
    label: "Senior Staff Security Engineer",
  },
  {
    value: 37,
    label: "Senior Team Lead",
  },
  {
    value: 56,
    label: "Senior Technical Analyst",
  },
  {
    value: 38,
    label: "Senior Technical Lead",
  },
  {
    value: 72,
    label: "Senior Technical Lead",
  },
  {
    value: 34,
    label: "Senior Test Engineer",
  },
  {
    value: 39,
    label: "Senior Test Lead",
  },
  {
    value: 42,
    label: "Senior Vice President",
  },
  {
    value: 111,
    label: "Software Architect",
  },
  {
    value: 40,
    label: "Software Engineer",
  },
  {
    value: 120,
    label: "Software Tech Lead",
  },
  {
    value: 41,
    label: "Solution Director",
  },
  {
    value: 124,
    label: "Staff Data Engineer",
  },
  {
    value: 122,
    label: "Staff QA Engineer",
  },
  {
    value: 123,
    label: "Staff Software Engineer",
  },
  {
    value: 43,
    label: "Team Lead",
  },
  {
    value: 54,
    label: "Technical Analyst",
  },
  {
    value: 76,
    label: "Technical Architect",
  },
  {
    value: 45,
    label: "Technical Lead",
  },
  {
    value: 70,
    label: "Technical Lead",
  },
  {
    value: 28,
    label: "Test Engineer",
  },
  {
    value: 46,
    label: "Test Lead",
  },
  {
    value: 47,
    label: "Trainee",
  },
  {
    value: 141,
    label: "Vice President",
  },
];
// return Data;
// }

export default Data;
