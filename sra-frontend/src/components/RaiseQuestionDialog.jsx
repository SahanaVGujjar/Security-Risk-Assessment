import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';

export default function RaiseQuestionDialog({ open, onClose, questionText, onSend }) {
  const [value, setValue] = React.useState('');
  React.useEffect(() => { if (open) setValue(''); }, [open]);
  return (
    <Dialog open={open} onClose={onClose} aria-labelledby="dialog-title">
      <DialogTitle id="dialog-title">Raise a question</DialogTitle>
      <DialogContent>
        <div style={{ marginBottom: 12 }}><b>About:</b> {questionText}</div>
        <TextField autoFocus fullWidth multiline minRows={3}
                   label="Ask your question or clarification"
                   value={value}
                   onChange={e => setValue(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={() => { onSend(value); onClose(); }} disabled={!value.trim()}>Send</Button>
      </DialogActions>
    </Dialog>
  );
}
