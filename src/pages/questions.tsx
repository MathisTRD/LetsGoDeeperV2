import { useState, useEffect } from 'react';
import Head from 'next/head';
import styles from '../styles/Admin.module.css';

interface Question {
  id: number;
  category: string;
  question: string;
}

interface Category {
  id: number;
  name: string;
}

export default function QuestionBoard() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch all data
      const [questionsRes, categoriesRes] = await Promise.all([
        fetch('/api/admin/questions'),
        fetch('/api/admin/categories')
      ]);

      const questionsData = await questionsRes.json();
      const categoriesData = await categoriesRes.json();

      setQuestions(questionsData.questions || []);
      setCategories(categoriesData.categories || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredQuestions = selectedCategory === 'all' 
    ? questions 
    : questions.filter(q => q.category === selectedCategory);

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Loading questions...</div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Question Board - Let's Go Deeper</title>
      </Head>

      <div className={styles.container}>
        <header className={styles.header}>
          <h1>Question Board</h1>
          <p>Browse all conversation starters and questions by category</p>
        </header>

        <div className={styles.stats}>
          <div className={styles.statCard}>
            <h3>Total Questions</h3>
            <div className={styles.statNumber}>{questions.length}</div>
          </div>
          <div className={styles.statCard}>
            <h3>Categories</h3>
            <div className={styles.statNumber}>{categories.length}</div>
          </div>
          <div className={styles.statCard}>
            <h3>Showing</h3>
            <div className={styles.statNumber}>{filteredQuestions.length}</div>
          </div>
        </div>

        <div className={styles.controls}>
          <label htmlFor="categoryFilter">Browse by Category:</label>
          <select 
            id="categoryFilter"
            value={selectedCategory} 
            onChange={(e) => setSelectedCategory(e.target.value)}
            className={styles.select}
          >
            <option value="all">All Categories ({questions.length})</option>
            {categories.map(cat => {
              const count = questions.filter(q => q.category === cat.name).length;
              return (
                <option key={cat.id} value={cat.name}>
                  {cat.name} ({count})
                </option>
              );
            })}
          </select>
        </div>

        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>#</th>
                <th>Category</th>
                <th>Question</th>
              </tr>
            </thead>
            <tbody>
              {filteredQuestions.map((question) => (
                <tr key={question.id}>
                  <td>{question.id}</td>
                  <td>
                    <span className={`${styles.categoryBadge} ${styles[question.category.toLowerCase().replace(' ', '')]}`}>
                      {question.category}
                    </span>
                  </td>
                  <td>{question.question}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className={styles.footer}>
          <a href="/add-question">+ Add New Question</a>
          <span> | </span>
          <a href="/">← Back to Game</a>
        </div>
      </div>
    </>
  );
}