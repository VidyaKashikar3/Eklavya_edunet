import React from 'react';
import { Typography, Box } from '@mui/material';

interface ResultsProps {
  examData: any;
  results: any;
}

const Results: React.FC<ResultsProps> = ({ examData, results }) => {
  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="h4" gutterBottom>
        Results
      </Typography>
      <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
        {results}
      </Typography>
    </Box>
  );
};

export default Results;