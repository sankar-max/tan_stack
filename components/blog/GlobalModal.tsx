"use client"
import { useModalStore } from "@/features/blog/store/modal"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import LikeView from "@/features/blog/components/modal/LikeView"
import CommentView from "@/features/blog/components/modal/CommentView"

const MODAL_COMPONENTS = {
  LIKE_VIEW: LikeView,
  COMMENT_VIEW: CommentView,
  SHARE_VIEW: () => <div>Share View</div>, // Placeholder
}

export function GlobalModal() {
  const { isModalOpen, modalName, modalTitle, modalDescription, modalProps } =
    useModalStore((state) => state.modal)
  const { closeModal } = useModalStore()

  if (!modalName) return null

  const ModalComponent = MODAL_COMPONENTS[modalName]

  return (
    <Dialog open={isModalOpen} onOpenChange={closeModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{modalTitle}</DialogTitle>
          <DialogDescription>{modalDescription}</DialogDescription>
        </DialogHeader>
        <div className="no-scrollbar -mx-4 max-h-[50vh] overflow-y-auto px-4">
          <ModalComponent {...modalProps} />
        </div>
      </DialogContent>
    </Dialog>
  )
}
