import React, { useState } from 'react';
import FileUpload from '@/components/FileUpload';
import QuizInterface from '@/components/QuizInterface';

// Sample quiz questions for demonstration
const sampleQuestions = [
  {
    id: 1,
    question: "What is the primary purpose of React hooks?",
    options: [
      "To replace class components entirely",
      "To allow functional components to use state and lifecycle methods",
      "To improve performance of React applications",
      "To manage global state across components"
    ],
    correctAnswer: 1,
    explanation: "React hooks allow functional components to use state and lifecycle methods that were previously only available in class components."
  },
  {
    id: 2,
    question: "Which hook is used for side effects in React?",
    options: [
      "useState",
      "useContext",
      "useEffect",
      "useReducer"
    ],
    correctAnswer: 2,
    explanation: "useEffect is the hook used for performing side effects in functional components."
  },
  {
    id: 3,
    question: "What does the dependency array in useEffect control?",
    options: [
      "Which variables are accessible inside the effect",
      "When the effect should re-run",
      "The order of effects execution",
      "Whether the effect returns a cleanup function"
    ],
    correctAnswer: 1,
    explanation: "The dependency array controls when the effect should re-run based on changes to specified values."
  },
  {
    id: 4,
    question: "What is JSX in React?",
    options: [
      "A separate templating language",
      "JavaScript syntax extension for describing UI elements",
      "A CSS-in-JS solution",
      "A state management library"
    ],
    correctAnswer: 1,
    explanation: "JSX is a JavaScript syntax extension that allows you to write HTML-like code in your JavaScript files."
  },
  {
    id: 5,
    question: "Which method is used to update state in a functional component?",
    options: [
      "setState()",
      "updateState()",
      "The setter function from useState()",
      "this.state = {}"
    ],
    correctAnswer: 2,
    explanation: "In functional components, you use the setter function returned by useState() to update state."
  }
];

const Index = () => {
  const [currentStep, setCurrentStep] = useState<'upload' | 'quiz' | 'complete'>('upload');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [quizScore, setQuizScore] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<number[]>([]);

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
  };

  const handleStartQuiz = () => {
    setCurrentStep('quiz');
  };

  const handleQuizComplete = (score: number, answers: number[]) => {
    setQuizScore(score);
    setUserAnswers(answers);
    setCurrentStep('complete');
  };

  const handleReset = () => {
    setCurrentStep('upload');
    setSelectedFile(null);
    setQuizScore(0);
    setUserAnswers([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto px-4 py-8">
        {currentStep === 'upload' && (
          <FileUpload
            onFileSelect={handleFileSelect}
            onNext={handleStartQuiz}
          />
        )}
        
        {currentStep === 'quiz' && (
          <QuizInterface
            questions={sampleQuestions}
            onComplete={handleQuizComplete}
            onReset={handleReset}
          />
        )}
      </div>
    </div>
  );
};

export default Index;
