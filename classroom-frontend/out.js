"use strict";
(() => {
  // src/constants/mock-data.ts
  var MOCK_SUBJECTS = [
    {
      id: 1,
      code: "HR101",
      name: "Introduction to Human Resources",
      department: "Human Resources",
      description: "Basics of HR management, recruitment, and workforce development.",
      createdAt: /* @__PURE__ */ new Date()
    },
    {
      id: 2,
      code: "FIN201",
      name: "Corporate Finance",
      department: "Finance",
      description: "Financial analysis, budgeting, and capital structure.",
      createdAt: /* @__PURE__ */ new Date()
    },
    {
      id: 3,
      code: "IT301",
      name: "Information Systems",
      department: "Information Technology",
      description: "Design and implementation of enterprise information systems.",
      createdAt: /* @__PURE__ */ new Date()
    },
    {
      id: 4,
      code: "ENG401",
      name: "Engineering Mechanics",
      department: "Engineering",
      description: "Fundamentals of mechanics applied to engineering problems.",
      createdAt: /* @__PURE__ */ new Date()
    },
    {
      id: 5,
      code: "OPS501",
      name: "Operations Management",
      department: "Operations",
      description: "Optimizing production and service delivery processes.",
      createdAt: /* @__PURE__ */ new Date()
    },
    {
      id: 6,
      code: "SAL601",
      name: "Sales Strategies",
      department: "Sales",
      description: "Techniques and planning for successful sales teams.",
      createdAt: /* @__PURE__ */ new Date()
    },
    {
      id: 7,
      code: "MKT701",
      name: "Marketing Principles",
      department: "Marketing",
      description: "Core concepts of marketing, branding, and promotion.",
      createdAt: /* @__PURE__ */ new Date()
    },
    {
      id: 8,
      code: "CS801",
      name: "Customer Service Excellence",
      department: "Customer Support",
      description: "Best practices for supporting and retaining customers.",
      createdAt: /* @__PURE__ */ new Date()
    },
    {
      id: 9,
      code: "RD901",
      name: "Research Methods",
      department: "Research & Development",
      description: "Qualitative and quantitative research techniques.",
      createdAt: /* @__PURE__ */ new Date()
    },
    {
      id: 10,
      code: "PROC101",
      name: "Procurement Management",
      department: "Procurement",
      description: "Strategies for sourcing and purchasing goods and services.",
      createdAt: /* @__PURE__ */ new Date()
    },
    {
      id: 11,
      code: "LEG201",
      name: "Business Law",
      department: "Legal",
      description: "Legal frameworks and compliance for business operations.",
      createdAt: /* @__PURE__ */ new Date()
    },
    {
      id: 12,
      code: "ADM301",
      name: "Office Administration",
      department: "Administration",
      description: "Organizational skills and administrative duties.",
      createdAt: /* @__PURE__ */ new Date()
    }
  ];

  // src/providers/data.ts
  var dataProvider = {
    getList: async (params) => {
      const { resource } = params;
      if (resource !== "subjects") {
        return { data: [], total: 0 };
      }
      return {
        data: MOCK_SUBJECTS,
        total: MOCK_SUBJECTS.length
      };
    },
    getOne: async () => {
      throw new Error("This function is not present in mock.");
    },
    create: async () => {
      throw new Error("This function is not present in the mock");
    },
    update: async () => {
      throw new Error("This function is not present in the mock");
    },
    deleteOne: async () => {
      throw new Error("This func is not present in Mock");
    },
    deleteMany: async () => {
      throw new Error("This func is not present in Mock");
    }
  };
})();
