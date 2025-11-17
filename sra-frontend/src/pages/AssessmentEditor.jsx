// src/pages/AssessmentEditor.jsx
import Box from '@mui/material/Box';
import ChatDrawer from '../components/ChatDrawer'; // <- Make sure to create this as in previous steps
// ...other imports

export default function AssessmentEditor({ user, assessment, threads, onSendQA }) {
  return (
    <Box sx={{ display:'flex', flexDirection:'row' }}>
      {/* Main Content: Questions and answers section */}
      <Box sx={{ flex: 1, pr: 4 }}>
        {/* Render each question/group here, use Accordion etc. Disable all inputs if user.role==='approver' */}
        {/* ... */}
      </Box>
      {/* Side Panel: Q&A Drawer */}
      <ChatDrawer open={true} threads={threads} user={user} onSend={onSendQA} />
    </Box>
  );
}
