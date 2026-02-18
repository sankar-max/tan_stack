import { create } from "zustand"

export type ModalName = "LIKE_VIEW" | "COMMENT_VIEW" | "SHARE_VIEW"

type State = {
  modal: {
    isModalOpen: boolean
    modalName: ModalName | null
    modalTitle: string
    modalDescription: string
    modalProps: { postId: number }
  }
}

type Actions = {
  openModal: (
    name: ModalName,
    options: {
      title: string
      description: string
      props?: { postId?: number }
    },
  ) => void
  closeModal: () => void
}

export const useModalStore = create<State & Actions>((set) => ({
  modal: {
    isModalOpen: false,
    modalName: null,
    modalTitle: "",
    modalDescription: "",
    modalProps: {
      postId: 0,
    },
  },
  openModal: (name, { title, description, props = { postId: 0 } }) =>
    set({
      modal: {
        isModalOpen: true,
        modalName: name,
        modalTitle: title,
        modalDescription: description,
        modalProps: { postId: props.postId! },
      },
    }),
  closeModal: () =>
    set((state) => ({
      modal: {
        ...state.modal,
        isModalOpen: false,
        modalName: null,
      },
    })),
}))
