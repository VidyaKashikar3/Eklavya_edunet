import React, { useState } from 'react';
import { Button, Typography, Box, TextField } from '@mui/material';

interface ExamProps {
  docId: string;
  exam: string;
  onSubmit: (answers: any) => void;
}

const Exam: React.FC<ExamProps> = ({ docId, exam, onSubmit }) => {
  const [answers, setAnswers] = useState<string>('');

  const handleSubmit = () => {
    // For simplicity, just pass answers
    onSubmit({ answers });
  };

  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h4" gutterBottom>
        Exam
      </Typography>
      <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
        {exam}
      </Typography>
      <TextField
        label="Your Answers"
        multiline
        rows={10}
        fullWidth
        value={answers}
        onChange={(e) => setAnswers(e.target.value)}
        sx={{ mt: 2 }}
      />
      <Button variant="contained" onClick={handleSubmit} sx={{ mt: 2 }}>
        Submit Exam
      </Button>
    </Box>
  );
};

export default Exam;