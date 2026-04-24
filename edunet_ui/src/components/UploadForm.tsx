import React, { useState } from 'react';
import { Button, Select, MenuItem, FormControl, InputLabel, Typography, Box } from '@mui/material';

interface UploadFormProps {
  onUpload: (docId: string, exam: string) => void;
}

const UploadForm: React.FC<UploadFormProps> = ({ onUpload }) => {
  const [file, setFile] = useState<File | null>(null);
  const [type, setType] = useState<string>('multiple-choice');
  const [level, setLevel] = useState<string>('moderate');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append('pdf', file);

    try {
      const response = await fetch('http://localhost:5000/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      // Now generate exam
      const examResponse = await fetch('http://localhost:5000/generate-exam', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ docId: data.docId, type, level }),
      });
      const examData = await examResponse.json();
      onUpload(data.docId, examData.exam);
    } catch (error) {
      console.error('Upload or generate failed', error);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
      <Typography variant="h4" gutterBottom>
        Upload Document
      </Typography>
      <input
        accept="application/pdf"
        style={{ display: 'none' }}
        id="pdf-file"
        type="file"
        onChange={handleFileChange}
      />
      <label htmlFor="pdf-file">
        <Button variant="contained" component="span">
          Choose PDF
        </Button>
      </label>
      {file && <Typography>{file.name}</Typography>}
      <FormControl fullWidth sx={{ mt: 2 }}>
        <InputLabel>Exam Type</InputLabel>
        <Select value={type} onChange={(e) => setType(e.target.value)}>
          <MenuItem value="multiple-choice">Multiple Choice</MenuItem>
          <MenuItem value="true-false">True/False</MenuItem>
          <MenuItem value="short-answer">Short Answer</MenuItem>
        </Select>
      </FormControl>
      <FormControl fullWidth sx={{ mt: 2 }}>
        <InputLabel>Difficulty Level</InputLabel>
        <Select value={level} onChange={(e) => setLevel(e.target.value)}>
          <MenuItem value="simple">Simple</MenuItem>
          <MenuItem value="moderate">Moderate</MenuItem>
          <MenuItem value="hard">Hard</MenuItem>
        </Select>
      </FormControl>
      <Button type="submit" variant="contained" sx={{ mt: 2 }}>
        Upload and Generate Exam
      </Button>
    </Box>
  );
};

export default UploadForm;