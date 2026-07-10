import mongoose from 'mongoose';

const resumeSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    title: {
      type: String,
      required: true
    },
    isPublic: {
      type: Boolean,
      default: false
    },
    personalInfo: {
      firstName: String,
      lastName: String,
      email: String,
      phone: String,
      location: String,
      website: String,
      linkedin: String,
      github: String,
      summary: String
    },
    experience: [{
      jobTitle: String,
      company: String,
      location: String,
      startDate: Date,
      endDate: Date,
      currentlyWorking: Boolean,
      description: String
    }],
    education: [{
      school: String,
      degree: String,
      fieldOfStudy: String,
      startDate: Date,
      endDate: Date,
      grade: String,
      description: String
    }],
    skills: [{
      name: String,
      level: {
        type: String,
        enum: ['beginner', 'intermediate', 'advanced', 'expert']
      }
    }],
    projects: [{
      name: String,
      description: String,
      link: String,
      technologies: [String]
    }],
    certifications: [{
      name: String,
      issuer: String,
      issueDate: Date,
      expiryDate: Date,
      credentialId: String,
      credentialUrl: String
    }],
    languages: [{
      name: String,
      proficiency: {
        type: String,
        enum: ['elementary', 'limited', 'professional', 'fluent', 'native']
      }
    }],
    atsScore: {
      type: Number,
      default: 0
    },
    atsAnalysis: {
      strengths: [String],
      weaknesses: [String],
      suggestions: [String],
      keywordMatches: [String]
    },
    template: {
      type: String,
      default: 'modern'
    },
    downloadCount: {
      type: Number,
      default: 0
    },
    viewCount: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  }
);

resumeSchema.index({ userId: 1 });
resumeSchema.index({ isPublic: 1 });

const Resume = mongoose.model('Resume', resumeSchema);
export default Resume;
