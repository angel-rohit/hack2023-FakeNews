import { Show, For } from "solid-js";
export default function ModalPopup(props) {
  const handlOverlay = (e) => {
    if(props?.closeAction && !props?.isOverlayOff){
      if (e.target === e.currentTarget) props?.closeAction();
    }
  };
  return (
    <Show when={props?.isShow}>
      <div
        id="modal_main"
        class={`fixed inset-0 h-screen w-full flex justify-center items-start md:items-center pt-10 md:pt-0 overflow-x-hidden overflow-y-auto ${props?.styles?.zIndex ? props?.styles?.zIndex:'z-[1000]'}`}
      >
        <div
          id="modal_overlay"
          class={`z-[99] inset-0 bg-black bg-opacity-80 h-screen w-full flex justify-center items-start md:items-center pt-10 md:pt-0 ${props?.styles?.overlayStyles || ''}`}
          onClick={handlOverlay}
        >
          {/* modal  */}
          <div
            id="modal"
            class={`transform relative rounded-lg shadow-lg transition-transform duration-300 w-11/12 ${props?.styles?.modelBg || "bg-white"} ${
              props?.styles?.modelSize ? props?.styles?.modelSize : "md:w-98"
            }`}
          >
            {/* close btn  */}
            <Show when={!props.isCloseIconDisable}>
              <button
                class={`absolute top-5 right-8 bg-skin-grey w-6 h-6 rounded-full focus:outline-none text-skin-base flex items-center justify-center z-10 ${props?.closeIconCss} ${
                  props?.styles?.closePosition }`}
                onClick={() => props.closeAction()}
              >
                <span class="icon-close text-xxs text-skin-base"/>
              </button>
            </Show>
            {/* header */}
            <Show when={props?.title}>
              <div class={`px-6 pb-6 pt-4 border-b border-skin-grey ${props?.titleWrapCss}`}>
                <h2 class={`font-medium ${ props?.titleCss ? props?.titleCss: "text-skin-base text-xl"}`}>
                  {props?.title}
                </h2>
              </div>
            </Show>
            <Show when={props?.headerComponent}>
              {props.headerComponent}
            </Show>
            {/* body  */}
            <div class={`w-full h-auto text-base text-skin-base ${props?.styles?.body || 'py-6 px-8'}`}>{props?.body}</div>
            {/* footer  */}
            <Show when={props.actionButtons}>
              <div class={`p-6 w-full flex justify-center items-center gap-3 ${props?.footerWrap}`}>
                <For each={props?.actionButtons}>
                  {(actionbutton) => (
                    <button
                      disabled={typeof actionbutton?.disabled === "function" ? actionbutton?.disabled()  : actionbutton?.disabled}
                      class={`border-skin-blue border w-1/2 py-[0.938rem] rounded focus:outline-none font-medium uppercase text-sm leading-17 disabled:opacity-20 ${
                        actionbutton?.styles ? (typeof actionbutton?.styles === "function" ? actionbutton?.styles() : actionbutton?.styles) : ""
                      }`}
                      onClick={actionbutton.action}
                    >
                      {actionbutton.text}
                    </button>
                  )}
                </For>
              </div>
            </Show>
          </div>
        </div>
      </div>
    </Show>
  );
}
