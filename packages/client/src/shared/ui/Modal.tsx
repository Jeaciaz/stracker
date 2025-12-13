import {
  createContext,
  createSignal,
  For,
  onCleanup,
  onMount,
  Show,
  useContext,
  type Accessor,
  type Component,
  type ParentProps,
} from "solid-js";

export type ModalProps<T = {}> = Omit<T, "onClose"> & {
  onClose: () => void;
};

type ModalInner<T = {}> = {
  Modal: Component<ModalProps<T>>;
  isOpen: Accessor<boolean>;
  props?: T;
  ref?: HTMLDialogElement;
};

type ModalControls = {
  open: () => void;
  close: () => void;
  unregister: () => void;
};

type ModalContext = {
  registerModal: <T>(...args: RegisterModalArgs<T>) => ModalControls;
};

const modalContext = createContext<ModalContext>();

export const ModalContextProvider = (props: ParentProps) => {
  const { Provider } = modalContext;
  const [modals, setModals] = createSignal<ModalInner[]>([]);

  const registerModal = <T,>(...[Modal, props]: RegisterModalArgs<T>) => {
    const [isOpen, setIsOpen] = createSignal(false);
    const modalInner: ModalInner = {
      Modal: Modal as Component<ModalProps>,
      props,
      isOpen,
      ref: undefined,
    };

    setModals((modals) => [...modals, modalInner]);

    return {
      open: () => {
        setIsOpen(true);
        const ac = new AbortController();
        modalInner.ref?.addEventListener(
          "close",
          () => {
            modalInner.ref?.addEventListener(
              "transitionend",
              () => {
                setIsOpen(false);
                ac.abort();
              },
              { signal: ac.signal },
            );
          },
          { signal: ac.signal },
        );
        modalInner.ref?.showModal();
      },
      isOpen,
      close: () => modalInner.ref?.requestClose(),
      unregister: () =>
        setModals((modals) => modals.filter((m) => m !== modalInner)),
    };
  };

  return (
    <>
      <Provider value={{ registerModal }}>{props.children}</Provider>
      <For each={modals()}>
        {(modal) => {
          return (
            <dialog ref={modal.ref} class="modal" closedby="closerequest">
              <div class="modal-box">
                <Show when={modal.isOpen()}>
                  <modal.Modal
                    {...modal.props}
                    onClose={() => modal.ref?.requestClose()}
                  />
                </Show>
              </div>
              <form method="dialog" class="modal-backdrop">
                <button>Close</button>
              </form>
            </dialog>
          );
        }}
      </For>
    </>
  );
};

const useModalContext = () => useContext(modalContext);

type RegisterModalArgs<T> =
  T extends Record<string, unknown>
    ? [modal: Component<ModalProps<T>>, props: T]
    : [modal: Component<ModalProps>];

export const useModal = <T,>(...args: RegisterModalArgs<T>) => {
  const context = useModalContext();
  const [modalControls, setModalControls] = createSignal<ModalControls>();

  onMount(() => {
    setModalControls(context?.registerModal<T>(...args));
  });

  onCleanup(() => {
    modalControls()?.unregister();
  });

  return {
    openModal: () => modalControls()?.open(),
    closeModal: () => modalControls()?.close(),
  };
};
