import rawQuestions from "./questions.json";
import rawLessons from "./lessons.json";
import type { Question, Lesson } from "../domain/models";
export const questions = rawQuestions as Question[];
export const lessons = rawLessons as Lesson[];

import rawAssessments from "./assessments.json";
export const assessmentQuestions = rawAssessments as Question[];
export const allQuestions = [...questions, ...assessmentQuestions];
