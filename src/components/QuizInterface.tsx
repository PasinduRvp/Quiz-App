import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Clock, CheckCircle, XCircle, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

interface QuizInterfaceProps {
  questions: Question[];
  onComplete: (score: number, answers: number[]) => void;
  onReset: () => void;
}

const QuizInterface: React.FC<QuizInterfaceProps> = ({ questions, onComplete, onReset }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>(new Array(questions.length).fill(-1));
  const [timeLeft, setTimeLeft] = useState(questions.length * 60); // 60 seconds per question
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    if (timeLeft > 0 && !isSubmitted) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !isSubmitted) {
      handleSubmit();
    }
  }, [timeLeft, isSubmitted]);

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = () => {
    const score = selectedAnswers.reduce((acc, answer, index) => {
      return answer === questions[index].correctAnswer ? acc + 1 : acc;
    }, 0);
    
    setIsSubmitted(true);
    setShowResults(true);
    onComplete(score, selectedAnswers);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const answeredQuestions = selectedAnswers.filter(answer => answer !== -1).length;

  if (showResults) {
    const score = selectedAnswers.reduce((acc, answer, index) => {
      return answer === questions[index].correctAnswer ? acc + 1 : acc;
    }, 0);
    const percentage = Math.round((score / questions.length) * 100);

    return (
      <div className="max-w-4xl mx-auto animate-fade-in">
        <Card className="mb-6">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold">Quiz Results</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <div className="flex justify-center">
              <div className="text-6xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                {percentage}%
              </div>
            </div>
            <p className="text-xl text-muted-foreground">
              You scored {score} out of {questions.length} questions correctly
            </p>
            
            <div className="flex justify-center space-x-4">
              <Button variant="hero" onClick={onReset}>
                <RotateCcw className="h-4 w-4" />
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <h3 className="text-xl font-semibold mb-4">Review Answers</h3>
          {questions.map((question, index) => {
            const userAnswer = selectedAnswers[index];
            const isCorrect = userAnswer === question.correctAnswer;
            
            return (
              <Card key={question.id} className="border-l-4 border-l-primary">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-3 mb-4">
                    {isCorrect ? (
                      <CheckCircle className="h-6 w-6 text-success mt-1 flex-shrink-0" />
                    ) : (
                      <XCircle className="h-6 w-6 text-destructive mt-1 flex-shrink-0" />
                    )}
                    <div className="flex-1">
                      <h4 className="font-semibold mb-3">{question.question}</h4>
                      <div className="space-y-2">
                        {question.options.map((option, optionIndex) => {
                          const isUserAnswer = userAnswer === optionIndex;
                          const isCorrectAnswer = optionIndex === question.correctAnswer;
                          
                          return (
                            <div
                              key={optionIndex}
                              className={cn(
                                "p-3 rounded-lg border",
                                isCorrectAnswer && "bg-success/10 border-success text-success-foreground",
                                isUserAnswer && !isCorrectAnswer && "bg-destructive/10 border-destructive text-destructive-foreground",
                                !isUserAnswer && !isCorrectAnswer && "bg-muted/30"
                              )}
                            >
                              {option}
                              {isCorrectAnswer && <span className="ml-2 text-success">✓</span>}
                              {isUserAnswer && !isCorrectAnswer && <span className="ml-2 text-destructive">✗</span>}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    );
  }

  const currentQ = questions[currentQuestion];

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4">
          <h2 className="text-2xl font-bold">Quiz</h2>
          <span className="text-muted-foreground">
            Question {currentQuestion + 1} of {questions.length}
          </span>
        </div>
        
        <div className="flex items-center space-x-2 text-lg font-semibold">
          <Clock className={cn(
            "h-5 w-5",
            timeLeft < 60 ? "text-destructive" : "text-primary"
          )} />
          <span className={cn(
            timeLeft < 60 ? "text-destructive" : "text-foreground"
          )}>
            {formatTime(timeLeft)}
          </span>
        </div>
      </div>

      {/* Progress */}
      <div className="mb-6">
        <Progress value={progress} className="h-2" />
        <div className="flex justify-between text-sm text-muted-foreground mt-2">
          <span>Progress: {Math.round(progress)}%</span>
          <span>Answered: {answeredQuestions}/{questions.length}</span>
        </div>
      </div>

      {/* Question Card */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-xl">{currentQ.question}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {currentQ.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswerSelect(index)}
              className={cn(
                "w-full text-left p-4 rounded-lg border-2 transition-all duration-200 hover:shadow-soft",
                selectedAnswers[currentQuestion] === index
                  ? "border-primary bg-primary/5 shadow-soft"
                  : "border-border hover:border-primary/50"
              )}
            >
              <div className="flex items-center space-x-3">
                <div className={cn(
                  "w-6 h-6 rounded-full border-2 flex items-center justify-center text-sm font-semibold",
                  selectedAnswers[currentQuestion] === index
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border"
                )}>
                  {String.fromCharCode(65 + index)}
                </div>
                <span>{option}</span>
              </div>
            </button>
          ))}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentQuestion === 0}
        >
          Previous
        </Button>
        
        <div className="space-x-2">
          {currentQuestion === questions.length - 1 ? (
            <Button 
              variant="success" 
              onClick={handleSubmit}
              disabled={selectedAnswers[currentQuestion] === -1}
            >
              Submit Quiz
            </Button>
          ) : (
            <Button
              variant="hero"
              onClick={handleNext}
              disabled={selectedAnswers[currentQuestion] === -1}
            >
              Next
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizInterface;