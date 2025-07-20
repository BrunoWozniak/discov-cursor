import { Dialog, DialogContent, DialogHeader, DialogFooter } from "./Dialog";
import { Button } from "./Button";

export function DeleteModal({ open, onConfirm, onCancel, todo }) {
  return (
    <Dialog open={open} onOpenChange={onCancel}>
      <DialogContent>
        <DialogHeader>Delete Todo</DialogHeader>
        <div className="py-4">Are you sure you want to delete "{todo?.title}"?</div>
        <DialogFooter>
          <Button variant="destructive" onClick={onConfirm}>Delete</Button>
          <Button variant="outline" onClick={onCancel}>Cancel</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 