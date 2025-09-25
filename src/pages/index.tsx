'use client';

import { useState, useEffect } from 'react';
import Head from 'next/head';
import styles from '../styles/Home.module.css';

interface Question {
  text: string;
}

export default function Home() {
  const [gameSelected, setGameSelected] = useState(false);
  const [currentQuestions, setCurrentQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showQuestion, setShowQuestion] = useState(false);
  const [selectedGame, setSelectedGame] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);
  const [showFinalMessage, setShowFinalMessage] = useState(false);
  const [categoryFadingOut, setCategoryFadingOut] = useState(false);
  const [questionReady, setQuestionReady] = useState(false);
  const [categoriesHidden, setCategoriesHidden] = useState(false);
  const [showCategories, setShowCategories] = useState(false);
  const [showBackButton, setShowBackButton] = useState(false);
  const [questionsAnimatingOut, setQuestionsAnimatingOut] = useState(false);
  const [showTitle, setShowTitle] = useState(true);
  const [categories, setCategories] = useState<string[]>([]);

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/api/categories');
        const data = await response.json();
        if (data.categories && Array.isArray(data.categories)) {
          setCategories(data.categories);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
        // Fallback to hardcoded categories if database fails
        setCategories(['Laughs', 'Stories', 'Secrets']);
      }
    };

    fetchCategories();
  }, []);

  const shuffleArray = (array: Question[]) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const fetchQuestions = async (category: string) => {
    try {
      const response = await fetch(`/api/questions?sheet=${category}`);
      const data = await response.json();
      
      if (data.questions && Array.isArray(data.questions) && data.questions.length > 0) {
        const questions = data.questions.map((q: string) => ({ text: q }));
        setCurrentQuestions(shuffleArray(questions));
        return true; // Success
      } else {
        setCurrentQuestions([]);
        alert("No questions found for this category. Please try another one.");
        return false; // Failed - no questions
      }
    } catch (error) {
      console.error('Error fetching questions:', error);
      alert("Error fetching questions. Please try again.");
      setCurrentQuestions([]);
      return false; // Failed - error
    }
  };

  const handleTitleClick = () => {
    setGameSelected(true);
    
    setTimeout(() => {
      setShowTitle(false);
    }, 2000);
    
    setTimeout(() => {
      setShowCategories(true);
    }, 1200);
  };

  const handleGameModeClick = async (category: string) => {
    setSelectedGame(category);
    setCategoryFadingOut(true);
    
    try {
      const questionsLoaded = await fetchQuestions(category);
      
      if (questionsLoaded) {
        // Only proceed to question view if questions were successfully loaded
        setTimeout(() => {
          setCategoriesHidden(true);
          setShowQuestion(true);
          setShowBackButton(true);
          setQuestionReady(true);
          setCurrentIndex(0);
        }, 1200);
      } else {
        // Stay on category screen if no questions found
        setTimeout(() => {
          setCategoryFadingOut(false);
          setSelectedGame('');
        }, 500);
      }
    } catch (error) {
      console.error('Error in handleGameModeClick:', error);
      // Reset to category screen on error
      setTimeout(() => {
        setCategoryFadingOut(false);
        setSelectedGame('');
      }, 500);
    }
  };

  const handleBackButtonClick = () => {
    setQuestionsAnimatingOut(true);
    setShowBackButton(false);
    
    setTimeout(() => {
      setShowQuestion(false);
      setQuestionReady(false);
      setCurrentQuestions([]);
      setCurrentIndex(0);
      setQuestionsAnimatingOut(false);
      setShowFinalMessage(false);
      setCategoryFadingOut(false);
      
      setTimeout(() => {
        setCategoriesHidden(false);
        setShowCategories(true);
      }, 500);
    }, 1000);
  };

  const displayNextQuestion = () => {
    if (currentQuestions.length === 0) {
      setShowFinalMessage(true);
      setTimeout(() => {
        handleBackButtonClick();
      }, 2800);
      return;
    }

    setIsAnimating(true);
    setTimeout(() => {
      setCurrentIndex(prev => prev + 1);
      setCurrentQuestions(prev => prev.slice(1));
      setIsAnimating(false);
    }, 350);
  };

  return (
    <>
      <Head>
        <title>Let&apos;s Go Deeper</title>
        <meta name="description" content="Discover a platform designed for meaningful dialogue. Start deep conversations, explore thought-provoking topics, and connect with others who value in-depth discussions." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        {showBackButton && (
          <button 
            className={`${styles.backButton} ${showBackButton ? styles.show : ''}`}
            onClick={handleBackButtonClick}
            aria-label="Go back to category selection"
          >
            ←
          </button>
        )}

        {showTitle && (
          <div className={`${styles.title} ${gameSelected ? styles.moveUp : ''}`}>
            <span id="pretitle" className={styles.pretitle}> let&apos;s go </span>
            <span 
              id="maintitle" 
              className={styles.maintitle}
              onClick={handleTitleClick}
            >
              Deeper!
            </span>
          </div>
        )}

        <div className={`${styles.gameselector} ${
          showCategories ? styles.show : ''
        } ${
          categoryFadingOut ? styles.fadeOut : ''
        } ${
          categoriesHidden ? styles.hidden : ''
        }`}>
          {categories.map((category) => (
            <button key={category} onClick={() => handleGameModeClick(category)}>
              {category}
            </button>
          ))}
        </div>

        {showQuestion && (
          <div className={`${styles.questions} ${questionsAnimatingOut ? styles.fadeOutUp : ''}`}>
            <section className={styles.questionSection}>
              {currentQuestions.length > 0 && !showFinalMessage && questionReady && (
                <p className={`${styles.question} ${isAnimating ? styles.fadeOut : styles.fadeIn}`}>
                  {currentQuestions[0].text}
                </p>
              )}
              {showFinalMessage && (
                <p className={`${styles.finalNote} ${styles.fadeIn}`}>
                  <span className={styles.gdRest}>No more questions, time to </span>
                  <span className={styles.gdCore}>go deeper</span>
                  <span className={styles.gdRest}>.</span>
                </p>
              )}
            </section>
            {!showFinalMessage && questionReady && (
              <button className={styles.nextButton} onClick={displayNextQuestion}>
                next
              </button>
            )}
          </div>
        )}
      </main>
    </>
  );
}