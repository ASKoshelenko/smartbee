const ApiError = require('../utils/ApiError');

// Validation schemas
const schemas = {
  // Auth validation
  login: {
    email: {
      type: 'string',
      required: true,
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    },
    password: {
      type: 'string',
      required: true,
      minLength: 6
    }
  },
  register: {
    email: {
      type: 'string',
      required: true,
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    },
    password: {
      type: 'string',
      required: true,
      minLength: 6
    },
    name: {
      type: 'string',
      required: true,
      minLength: 2
    },
    grade: {
      type: 'number',
      required: true,
      min: 9,
      max: 11
    }
  },

  // Course validation
  createCourse: {
    title: {
      type: 'string',
      required: true,
      minLength: 3,
      maxLength: 100
    },
    description: {
      type: 'string',
      required: true,
      minLength: 10,
      maxLength: 1000
    },
    subject: {
      type: 'string',
      required: true,
      enum: ['ukrainian', 'math', 'history', 'english']
    },
    grade: {
      type: 'number',
      required: true,
      min: 9,
      max: 11
    },
    level: {
      type: 'string',
      required: true,
      enum: ['basic', 'advanced']
    }
  },

  // Quiz validation
  createQuiz: {
    title: {
      type: 'string',
      required: true,
      minLength: 3,
      maxLength: 100
    },
    description: {
      type: 'string',
      required: true,
      minLength: 10,
      maxLength: 500
    },
    subject: {
      type: 'string',
      required: true,
      enum: ['ukrainian', 'math', 'history', 'english']
    },
    grade: {
      type: 'number',
      required: true,
      min: 9,
      max: 11
    },
    timeLimit: {
      type: 'number',
      required: true,
      min: 5,
      max: 180
    },
    questions: {
      type: 'array',
      required: true,
      minLength: 1,
      items: {
        type: 'object',
        required: true,
        properties: {
          text: {
            type: 'string',
            required: true,
            minLength: 3
          },
          type: {
            type: 'string',
            required: true,
            enum: ['single', 'multiple', 'text']
          },
          options: {
            type: 'array',
            required: true,
            minLength: 2,
            items: {
              type: 'string',
              required: true
            }
          },
          correctAnswers: {
            type: 'array',
            required: true,
            minLength: 1,
            items: {
              type: 'string',
              required: true
            }
          },
          points: {
            type: 'number',
            required: true,
            min: 1,
            max: 10
          }
        }
      }
    }
  }
};

// Validation middleware
const validateRequest = (req, res, next) => {
  const schema = schemas[req.path.split('/').pop()];
  
  if (!schema) {
    return next();
  }

  const errors = [];
  const body = req.body;

  // Validate each field according to schema
  Object.entries(schema).forEach(([field, rules]) => {
    const value = body[field];

    // Check required fields
    if (rules.required && (value === undefined || value === null || value === '')) {
      errors.push(`${field} is required`);
      return;
    }

    if (value === undefined || value === null) {
      return;
    }

    // Check type
    if (rules.type && typeof value !== rules.type) {
      errors.push(`${field} must be of type ${rules.type}`);
    }

    // Check string length
    if (rules.type === 'string') {
      if (rules.minLength && value.length < rules.minLength) {
        errors.push(`${field} must be at least ${rules.minLength} characters long`);
      }
      if (rules.maxLength && value.length > rules.maxLength) {
        errors.push(`${field} must not exceed ${rules.maxLength} characters`);
      }
      if (rules.pattern && !rules.pattern.test(value)) {
        errors.push(`${field} has invalid format`);
      }
    }

    // Check number range
    if (rules.type === 'number') {
      if (rules.min !== undefined && value < rules.min) {
        errors.push(`${field} must be at least ${rules.min}`);
      }
      if (rules.max !== undefined && value > rules.max) {
        errors.push(`${field} must not exceed ${rules.max}`);
      }
    }

    // Check enum values
    if (rules.enum && !rules.enum.includes(value)) {
      errors.push(`${field} must be one of: ${rules.enum.join(', ')}`);
    }

    // Check arrays
    if (rules.type === 'array') {
      if (!Array.isArray(value)) {
        errors.push(`${field} must be an array`);
        return;
      }

      if (rules.minLength && value.length < rules.minLength) {
        errors.push(`${field} must contain at least ${rules.minLength} items`);
      }

      if (rules.items) {
        value.forEach((item, index) => {
          if (rules.items.type && typeof item !== rules.items.type) {
            errors.push(`${field}[${index}] must be of type ${rules.items.type}`);
          }
          if (rules.items.required && (item === undefined || item === null || item === '')) {
            errors.push(`${field}[${index}] is required`);
          }
        });
      }
    }

    // Check nested objects
    if (rules.type === 'object' && rules.properties) {
      Object.entries(rules.properties).forEach(([prop, propRules]) => {
        if (propRules.required && (!value[prop] || value[prop] === '')) {
          errors.push(`${field}.${prop} is required`);
        }
      });
    }
  });

  if (errors.length > 0) {
    throw new ApiError(400, 'Validation Error', errors);
  }

  next();
};

module.exports = {
  validateRequest,
  schemas
}; 