import React, { useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import UploadForm from './components/UploadForm';
import Exam from './components/Exam';
import Results from './components/Results';

const theme = createTheme();

function App() {
  const [step, setStep] = useState<'upload' | 'exam' | 'results'>('upload');
  const [docId, setDocId] = useState<string>('');
  const [examData, setExamData] = useState<any>(null);
  const [results, setResults] = useState<any>(null);

  const handleUpload = (id: string, exam: string) => {
    setDocId(id);
    setExamData(exam);
    setStep('exam');
  };

  const handleExamSubmit = async (data: any) => {
    try {
      const response = await fetch('http://localhost:5000/grade-exam', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ docId, exam: examData, answers: data.answers }),
      });
      const gradeData = await response.json();
      setResults(gradeData.grade);
      setStep('results');
    } catch (error) {
      console.error('Grading failed', error);
    }
  };

  const handleResults = (res: any) => {
    setResults(res);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="md">
        {step === 'upload' && <UploadForm onUpload={handleUpload} />}
        {step === 'exam' && <Exam docId={docId} exam={examData} onSubmit={handleExamSubmit} />}
        {step === 'results' && <Results examData={examData} results={results} />}
      </Container>
    </ThemeProvider>
  );
}

export default App;
