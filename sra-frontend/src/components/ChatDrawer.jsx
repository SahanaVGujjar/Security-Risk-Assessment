import Drawer from '@mui/material/Drawer';
import Avatar from '@mui/material/Avatar';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

export default function ChatDrawer({ open, threads, user, onSend, onApprove, onReject }) {
  return (
    <Drawer anchor="right" open={open} variant="permanent" PaperProps={{ sx: { width: 380, boxShadow: 3 } }}>
      <Paper sx={{ p: 2, height: '100vh', overflowY: 'auto', bgcolor: '#fafbff', position: 'relative' }}>
        {/* Approve/Reject controls for Approvers only */}
        {user.role === 'approver' && (
          <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
            <Button variant="contained" color="success" onClick={onApprove}>Approve</Button>
            <Button variant="contained" color="error" onClick={onReject}>Reject</Button>
          </Box>
        )}
        <Typography variant="h6" sx={{ mb: 1 }}>Q&amp;A Chat Panel</Typography>
        {/* Threaded messages */}
        {threads.map(msg => (
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
            <Avatar sx={{ mr: 1, bgcolor: msg.role==='approver'? '#1565c0' : '#388e3c'}}>{msg.author[0]}</Avatar>
            <div style={{ background: msg.role==='approver' ? '#e3f2fd' : '#e8f5e9', borderRadius: 12, padding: 12 }}>
              <strong>{msg.author}</strong> <span style={{ fontSize:12, color:'#888' }}>{msg.time}</span>
              <Typography sx={{ mt:1 }}>{msg.body}</Typography>
            </div>
          </div>
        ))}
        {/* Chat input at bottom */}
        <form onSubmit={e=>{e.preventDefault(); onSend(e.target.elements.body.value); e.target.reset();}} style={{ position: 'absolute', bottom:20, width:'90%' }}>
          <input name='body' style={{ width:'85%', padding:8, borderRadius:6, border:'1px solid #ccc', fontSize:16 }} placeholder="Type a reply..." required />
          <Button type="submit" variant="contained" sx={{ ml:1 }}>Send</Button>
        </form>
      </Paper>
    </Drawer>
  );
}
