import React, { useState, useEffect } from 'react';
import axios from 'axios';
import sass from './trivia.module.scss'

function Trivia() {
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [correct, setCorrect] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [answerStates, setAnswerStates] = useState({});

    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const response = await axios.get('https://the-trivia-api.com/api/questions', {
                    params: {
                        apiKey: 'YOUR_API_KEY',  // Replace with your actual API key
                        limit: 5 // Set the number of questions you want
                    }
                });
                const shuffledQuestions = response.data.map(question => {
                    const shuffledAnswers = [question.correctAnswer, ...question.incorrectAnswers].sort(() => Math.random() - 0.5);
                    return { ...question, answers: shuffledAnswers };
                });
                setQuestions(shuffledQuestions);
                setLoading(false);
            } catch (error) {
                setError('Failed to fetch questions: ' + error.message);
                setLoading(false);
            }
        };

        fetchQuestions();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    const checkAnswer = (questionId, answer, correctAnswer) => {
        if (selectedAnswers[questionId]) {
            return;
        }

        setSelectedAnswers(prevState => ({
            ...prevState,
            [questionId]: true
        }));

        const isCorrect = answer === correctAnswer;
        setAnswerStates(prevState => ({
            ...prevState,
            [`${questionId}-${answer}`]: isCorrect ? 'correct' : 'incorrect'
        }));

        if (isCorrect) {
            setCorrect(prev => prev + 1);
        }
    };

    return (
        <div className={sass.trivia}>
            <h4>Questions</h4>
            <ul>
                {questions.map((question, index) => (
                    <li key={index}>
                        <h1>{question.question}</h1>
                        {/* <h3>{question.correctAnswer}</h3> */}
                        <ul>
                            {question.answers.map(item => {
                                const isSelected = selectedAnswers[question.id];
                                const answerState = answerStates[`${question.id}-${item}`];
                                return (
                                    <li key={item} onClick={() => checkAnswer(question.id, item, question.correctAnswer)}>
                                        <button style={{
                                            backgroundColor: isSelected ? (answerState === 'correct' ? 'green' : (answerState === 'incorrect' ? 'yellow' : null)) : null
                                        }}>{item}</button>
                                    </li>
                                );
                            })}
                        </ul>
                    </li>
                ))}
            </ul>
            <h2>Correct answers: {correct}</h2>
        </div>
    );
}

export default Trivia;
