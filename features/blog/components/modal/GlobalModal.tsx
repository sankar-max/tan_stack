"use client";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import CommentView from "@/features/blog/components/modal/CommentView";
import LikeView from "@/features/blog/components/modal/LikeView";
import { useModalStore } from "@/features/blog/store/modal";

const MODAL_COMPONENTS = {
	LIKE_VIEW: LikeView,
	COMMENT_VIEW: CommentView,
	SHARE_VIEW: () => <div>Share View</div>, // Placeholder
};

export function GlobalModal() {
	const { isModalOpen, modalName, modalTitle, modalDescription, modalProps } =
		useModalStore((state) => state.modal);
	const { closeModal } = useModalStore();

	if (!modalName) return null;

	const ModalComponent = MODAL_COMPONENTS[modalName];

	return (
		<Dialog open={isModalOpen} onOpenChange={closeModal}>
			<DialogContent className="sm:max-w-2xl rounded-3xl p-0 overflow-hidden border border-border/50 shadow-2xl bg-background/95 backdrop-blur-xl">
				<DialogHeader className="p-8 pb-6 border-b border-border/40">
					<DialogTitle className="text-2xl font-black tracking-tight">{modalTitle}</DialogTitle>
					<DialogDescription className="text-sm text-muted-foreground font-medium mt-1">
            {modalDescription}
          </DialogDescription>
				</DialogHeader>
				<div className="no-scrollbar">
					<ModalComponent {...modalProps} />
				</div>
			</DialogContent>
		</Dialog>
	);
}
