'use client';
import { useEffect, useState} from 'react';
import { useParams, useRouter} from 'next/navigation';
import { motion } from 'framer-motion';
import './../../globals.css';
import he from 'he';


export default function QuestionDash(){

    const params = useParams();
    const router = useRouter()
    const email = params.email || 'User';

    const [countdown,setCountdown] = useState(3)
    const [showPopup, setShowPopup] = useState(true);
    const [timer,setTimer] = useState((30*60)+3);
    const [questionNum,setQuestionsNum] = useState(1);
    const [questions,setQuestions] = useState([])
    const [selectedChoices, setSelectedChoices] = useState({});
    const [visited, setVisited] = useState(Array(15).fill(false));
    const [answered, setAnswered] = useState(Array(15).fill(false));
    const [end,setEnd] = useState(false)
    let barWidth = '';

    useEffect(() => {
        const fetchContent = async () => {
            try{
                const response = await fetch(`https://opentdb.com/api.php?amount=15`);
                const data = await response.json();
                setQuestions(data.results.map((question) => {
                    const alloption = [...question.incorrect_answers, question.correct_answer];
                    const suffleoption = alloption.sort(() => Math.random() - 0.5);
                    return {
                        ...question,
                        allOption: suffleoption,
                    }
                }));
                setVisited((prev) => {
                    const newVisited = [...prev];
                    newVisited[0] = true; 
                    return newVisited;
                });
                            
            }catch(error){
                console.log('Error fetching data',error)
            }
        }
        fetchContent();
    },[]);

    useEffect(() => {
        if (countdown > 0) {
          const timer = setTimeout(() => setCountdown(countdown - 1), 1000); 
          return () => clearTimeout(timer); 
        } else {
          setShowPopup(false); 
        }
      }, [countdown]);

    useEffect(() => {
        const timer = setInterval(() => {
            setTimer((prev) => prev > 0 ? prev-1 : 0)
        },1000);
        if(timer === 0){
            handleEnd();
        }
        return () => clearInterval(timer);
    },[timer]);

    const formate = (time) => {
        if(time === 0){
            handleEnd();
        }
        barWidth = `${(time / (30*60)) * 100}%`
        const minute = Math.floor(time/60);
        const second = time%60;
        return `${minute.toString().padStart(2,"0")}:${second.toString().padStart(2,"0")}`;
    }

    const questionState = (index) => {
        setQuestionsNum(index)
        setVisited((prev) => {
            const newVisited = [...prev];
            newVisited[index - 1] = true; 
            return newVisited;
        });
    }

    const handleSelectedChoices = (questionIndex, choice) => {
        setSelectedChoices((prev) => ({
            ...prev,
            [questionIndex]:choice,
        }))
        setAnswered((prev) => {
            const newAnswered = [...prev];
            newAnswered[questionIndex - 1] = true;
            return newAnswered
        })
    }

    const handleClearChoices = (questionIndex) => {
        setSelectedChoices((prev) => {
            const updateChoice = {...prev};
            delete updateChoice[questionIndex];
            return updateChoice;
        });
        setAnswered((prev) => {
            const newAnswered = [...prev];
            newAnswered[questionIndex - 1] = false; 
            return newAnswered;
        });
        console.log(selectedChoices)
    }

    const handleEnd = () => { 
        setEnd(true)
    }

    const popupVariants = {
        hidden: { opacity: 0, scale: 0.8 },
        visible: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 0.8 },
    };

    return(
        <>
        {showPopup ? (
            <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={popupVariants}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 flex items-center justify-center bg-semiforeground bg-opacity-50">
                <motion.div
                className="bg-background rounded-lg flex flex-col justify-center items-center shadow-lg p-6 w-11/12 max-w-md md:max-w-lg lg:max-w-xl"
                initial={{ scale: "0%", opacity: 0 }}
                animate={{ scale: "100%", opacity: 1 }}
                exit={{ scale: "0%", opacity: 0 }}
                transition={{type:'spring',mass:2, duration: 0.3 }}>
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 text-violet-600 text-center">
                    The Quiz starts in:
                    </h2>
                    <p className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-violet-600 text-center">{countdown}</p>
                </motion.div>
            </motion.div>
        ) 
        : end ? 
        (
            <>
            <div className="p-6 max-w-5xl mx-auto">
            <h1 className="text-2xl font-bold mb-6 text-center">Quiz Summary</h1>
            {questions.map((question, index) => {
                const userAnswer = selectedChoices[index + 1] || "Not Answered";
                const isCorrect = he.decode(userAnswer) === he.decode(question.correct_answer);
                return (
                    <div
                    key={index}
                    className="bg-white p-4 mb-4 border rounded-lg shadow-md"
                    >
                    <div className="mb-4">
                        <p className="text-lg font-semibold">
                            Q{index + 1}: {he.decode(question.question)}
                        </p>
                        <div 
                        className={`mt-2 p-2 rounded-md text-sm text-left ${
                            isCorrect ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                        }`}
                    >
                        <span className="mr-2">
                            {isCorrect ? (
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="w-5 h-5 inline-block"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    strokeWidth="2"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M5 13l4 4L19 7"
                                    />
                                </svg>
                            ) : (
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="w-5 h-5 inline-block"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    strokeWidth="2"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            )}
                        </span>
                        <span>
                            Your Answer:{" "}
                            <span className="font-medium">{userAnswer || "Not Answered"}</span>
                        </span>
                        </div>
                        <p className="mt-2 text-sm">
                            Correct Answer: <span className="font-medium">{question.correct_answer}</span>
                        </p>
                    </div>
                </div>
                );
            })}
            <div className="mt-auto">
                <button
                    onClick={() =>  router.push('/')}
                    className="w-fit px-3 py-3 bg-violet-500 text-white font-semibold rounded-md hover:bg-violet-600"
                    >
                    Back to Login
                </button>
            </div>
        </div>

        </>
    ) : (
        <>
            <div className="flex flex-col md:flex-row h-screen box-border overflow-x-hidden">
            <div className="w-full md:w-1/5 bg-violet-100 p-4 border-b md:border-b-0 md:border-r border-violet-400 flex-shrink-0">
                <h3 className="text-violet-600 text-2xl font-bold mb-4 text-center md:text-left">
                Quiz Dashboard
                </h3>
                <p className="text-xl text-gray-600 mb-2 text-center md:text-left">
                <span className="text-violet-500 font-semibold">Time left:</span> {formate(timer)}
                </p>
                <div className="mt-4 grid grid-cols-5 sm:grid-cols-7 md:grid-cols-3 gap-2">
                {Array.from({ length: 15 }, (_, index) => {
                    const isCurrent = questionNum === index + 1;
                    const isVisited = visited[index];
                    const isAnswered = answered[index];
                    return (
                    <button
                        key={index}
                        onClick={() => questionState(index + 1)}
                        className={`py-2 px-4 text-sm border rounded-md  transition 
                        ${
                            isCurrent
                            ? "bg-violet-600 text-white"
                            : isAnswered
                            ? "bg-green-600 text-white"
                            : isVisited
                            ? "bg-gray-400 text-white"
                            : "bg-white text-gray-800"
                        }
                        hover:bg-blue-100`}
                    >
                        {index + 1}
                    </button>
                    );
                })}
                </div>
            </div>

            <main className="w-full md:w-4/5 p-6 overflow-auto box-border">
                {questions.length > 0 ? (
                <>
                    <div className="w-full rounded-lg overflow-hidden flex justify-center">
                        <p className="text-lg text-violet-600 mb-2 text-center md:text-left">
                            <span className="font-semibold">{decodeURIComponent(email)}</span>
                        </p>
                    </div>
                    <div className="w-full h-4 bg-white rounded-lg overflow-hidden mb-8">
                    <motion.div
                        className="h-full bg-violet-500"
                        initial={{ width: "100%" }}
                        animate={{ width: barWidth }}
                        transition={{ duration: 1, ease: "linear" }}
                    />
                    </div>
                    <div className="flex flex-wrap justify-between items-center gap-4 mb-4">
                    <h2 className="text-violet-600 text-2xl font-bold">
                        Question: {questionNum}
                    </h2>
                    <div className="bg-violet-400 text-white text-center rounded-xl px-4 h-6 flex items-center justify-center">
                        {questions[questionNum - 1].difficulty}
                    </div>
                    <button
                        onClick={handleEnd}
                        className="py-2 px-4 text-sm border rounded-md bg-red-500 text-white hover:bg-red-700"
                    >
                        End Test
                    </button>
                    </div>

                    <p className="text-violet-600 text-lg mb-4">
                    {he.decode(questions[questionNum - 1].question)}
                    </p>

                    <div className="flex flex-col h-4/5 justify-between">
                    <div className="space-y-2">
                        {questions[questionNum - 1].allOption.map((choice, index) => (
                        <div key={index} className="flex items-center space-x-2">
                            <input
                            type="radio"
                            id={`choice-${questionNum}-${index}`}
                            name={`question-${questionNum}`}
                            checked={selectedChoices[questionNum] === choice}
                            onChange={() => handleSelectedChoices(questionNum, choice)}
                            className="radio-button"
                            />
                            <label
                            htmlFor={`choice-${questionNum}-${index}`}
                            className="text-violet-600 cursor-pointer"
                            >
                            {he.decode(choice)}
                            </label>
                        </div>
                        ))}
                        <button
                        onClick={() => handleClearChoices(questionNum)}
                        className="py-2 px-4 text-sm border rounded-md bg-red-500 text-white hover:bg-red-700"
                        >
                        Clear
                        </button>
                    </div>

                    <div className="mt-6 flex justify-between">
                        <button
                        onClick={() => questionState(Math.max(1, questionNum - 1))}
                        disabled={questionNum === 1}
                        className={`py-2 px-4 text-sm border rounded-md transition ${
                            questionNum === 1
                            ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                            : "bg-violet-500 text-white hover:bg-violet-600"
                        }`}
                        >
                        Previous
                        </button>
                        <button
                        onClick={() => questionState(Math.min(15, questionNum + 1))}
                        disabled={questionNum === 15}
                        className={`py-2 px-4 text-sm border rounded-md transition ${
                            questionNum === 15
                            ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                            : "bg-violet-500 text-white hover:bg-violet-600"
                        }`}
                        >
                        Next
                        </button>
                    </div>
                    </div>
                </>
                ) : (
                <p className="text-gray-500">Loading questions...</p>
                )}
            </main>
            </div>

        </>
        )}
        </>
    )
}