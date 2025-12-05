import React, { useEffect, useState } from 'react'

interface QuestionBasePresentationParticipantProps {
  question: string
  image?: string
  answers: [string, string, string, string]
  answer: 0 | 1 | 2 | 3
  showAnswer: boolean,
  selectedAnswer: number | null,
  onSelectAnswer: (int: number) => void
}

export default function QuestionBasePresentationParticipant({
  question,
  image,
  answers,
  answer,
  showAnswer,
  selectedAnswer: initialSelectedAnswer,
  onSelectAnswer
}: QuestionBasePresentationParticipantProps) {

  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(initialSelectedAnswer ?? null);

  useEffect(() => {
    if(!showAnswer)
    {
      setSelectedAnswer(null)
    }
  }, [showAnswer, question])

  return (
    <div style={styles.container}>
      <div style={styles.questionFrame}>
        <h2 style={styles.questionText}>{question}</h2>
      </div>

      {image && (
        <div style={styles.imageContainer}>
          <img src={image} alt="Question illustration" style={styles.image} />
        </div>
      )}

      <div style={styles.answersGrid}>
        {answers.map((answerText, index) => (
          <div
            key={index}
            style={{
              ...styles.answerSlot,
              ...(showAnswer && index === answer ? styles.correctAnswer : {}),
              ...(showAnswer && index !== answer ? styles.wrongAnswer : {}),
              ...(selectedAnswer != null && selectedAnswer == index && !showAnswer ? styles.selectedAnswer : {}),
            }}
            onClick={() => {
              if(showAnswer) return;
              setSelectedAnswer(index)
              onSelectAnswer(index)
              console.log("Selecting " + index)
            }}
          >
            <span style={styles.answerText}>{answerText}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '1.5rem',
    padding: '1rem',
    height: '100%',
    boxSizing: 'border-box' as const,
  },
  questionFrame: {
    backgroundColor: '#ffffff',
    borderWidth: '2px',
    borderStyle: 'solid',
    borderColor: '#e5e7eb',
    borderRadius: '0.75rem',
    padding: '1.5rem',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
  },
  questionText: {
    fontSize: '1.5rem',
    fontWeight: 600,
    color: '#1f2937',
    margin: 0,
    textAlign: 'center' as const,
  },
  imageContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    borderRadius: '0.75rem',
    borderWidth: '2px',
    borderStyle: 'solid',
    borderColor: '#e5e7eb',
    minHeight: '0',
    maxHeight: 'calc(100vh - 430px)'
  },
  image: {
    width: '100%',
    height: 'auto',
    objectFit: 'contain' as const,
  },
  answersGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1rem',
  },
  answerSlot: {
    backgroundColor: '#ffffff',
    borderWidth: '2px',
    borderStyle: 'solid',
    borderColor: '#e5e7eb',
    borderRadius: '0.75rem',
    padding: '1.25rem',
    minHeight: '80px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
  },
  correctAnswer: {
    backgroundColor: '#dcfce7',
    borderColor: '#22c55e',
    boxShadow: '0 4px 8px rgba(34, 197, 94, 0.2)',
  },
  wrongAnswer: {
    backgroundColor: 'rgba(255, 0, 0, 0.23)',
    borderColor: 'rgba(255, 0, 0, 0.23)',
    boxShadow: '0 4px 8px rgba(255, 0, 0, 0.4)',
  },
  selectedAnswer: {
    backgroundColor: 'rgba(0, 238, 255, 0.23)',
    borderColor: 'rgba(0, 238, 255, 0.23)',
    boxShadow: '0 4px 8px rgba(0, 238, 255, 0.4)',
  },
  answerText: {
    fontSize: '1rem',
    color: '#374151',
    textAlign: 'center' as const,
    fontWeight: 500,
  },
}
