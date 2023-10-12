import ModalPopup from "../components/common/ModalPopup";
import { createSignal, For, onMount, Show } from "solid-js";

export default function FakeTrading() {
  const [isComplainModal, setComplainModal] = createSignal(false);
  const [title, setTitle] = createSignal("");
  const [des, setDes] = createSignal("");
  const [link, setLink] = createSignal("");
  const [medium, setMedium] = createSignal("");
  const [fakeNewsList, setFakeNewsList] = createSignal([]);
  const [isReportModal, setReportModal] = createSignal(false);

  onMount(() => {
    const data = localStorage.getItem("fakeNewsList");
    if(JSON.parse(data)){
      setFakeNewsList(JSON.parse(data));
    }
  });

  const handleSubmit = () => {
    const data = [...fakeNewsList()] || [];
    data.push({
      id: new Date(),
      title: title(),
      medium: medium(),
      link: link(),
      des: des(),
      report: 1,
      innocent: 0,
      time: new Date()
    });
    localStorage.setItem("fakeNewsList", JSON.stringify(data));
    setFakeNewsList(data);
    setComplainModal(false);
  };

  const reportHandle = (type) => {
    const data = [...fakeNewsList()].filter((script)=>{
      if(script.id ===isReportModal()){
        if(type=="yes"){
          script.innocent = script.innocent + 1;
        }else{
          script.report = script.report + 1;
        }
      }
      return script;
    });
    setFakeNewsList(data);
    localStorage.setItem("fakeNewsList", JSON.stringify(data));
    setReportModal(false);
  };

  return (
    <div class="p-4">
      <div class="flex justify-between items-center">
        <div class="text-skin-bold font-medium text-base">
          List
        </div>
        <div
          class="cursor-pointer py-2 px-4 rounded bg-skin-royalblue text-skin-white font-medium text-sm"
          onClick={() => setComplainModal(true)}
        >
          Report channels
        </div>
      </div>

      <div>
        <For each={fakeNewsList()}>
          {(script) => {
            return (
              <div class="flex items-center border border-skin-overlapMuted rounded p-4 mt-4">
        <div class="w-[8%] h-20 bg-skin-grey rounded mr-4 border border-skin-overlapMuted">
          </div> 
        <div class="w-[92%]">
          <div class="flex items-center">
            <span class="text-base font-semibold text-skin-blue">{script.title}</span>
          </div>
          <p class="text-sm text-skin-base">{script.des}</p>
          <Show when={script?.link}>
            <div><span>Link: </span> <spna>script.link</spna></div>
          </Show>
         
          <div class="flex items-center text-xs font-medium mt-1">
            {/* <span class="text-skin-blue font-medium">Reply.</span> */}
            <div class="text-skin-blue flex items-center">
              <span class="mx-0.5 font-medium">Agree</span>
              <svg class="fill-royal-blue" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><path d="M323.8 34.8c-38.2-10.9-78.1 11.2-89 49.4l-5.7 20c-3.7 13-10.4 25-19.5 35l-51.3 56.4c-8.9 9.8-8.2 25 1.6 33.9s25 8.2 33.9-1.6l51.3-56.4c14.1-15.5 24.4-34 30.1-54.1l5.7-20c3.6-12.7 16.9-20.1 29.7-16.5s20.1 16.9 16.5 29.7l-5.7 20c-5.7 19.9-14.7 38.7-26.6 55.5c-5.2 7.3-5.8 16.9-1.7 24.9s12.3 13 21.3 13L448 224c8.8 0 16 7.2 16 16c0 6.8-4.3 12.7-10.4 15c-7.4 2.8-13 9-14.9 16.7s.1 15.8 5.3 21.7c2.5 2.8 4 6.5 4 10.6c0 7.8-5.6 14.3-13 15.7c-8.2 1.6-15.1 7.3-18 15.1s-1.6 16.7 3.6 23.3c2.1 2.7 3.4 6.1 3.4 9.9c0 6.7-4.2 12.6-10.2 14.9c-11.5 4.5-17.7 16.9-14.4 28.8c.4 1.3 .6 2.8 .6 4.3c0 8.8-7.2 16-16 16H286.5c-12.6 0-25-3.7-35.5-10.7l-61.7-41.1c-11-7.4-25.9-4.4-33.3 6.7s-4.4 25.9 6.7 33.3l61.7 41.1c18.4 12.3 40 18.8 62.1 18.8H384c34.7 0 62.9-27.6 64-62c14.6-11.7 24-29.7 24-50c0-4.5-.5-8.8-1.3-13c15.4-11.7 25.3-30.2 25.3-51c0-6.5-1-12.8-2.8-18.7C504.8 273.7 512 257.7 512 240c0-35.3-28.6-64-64-64l-92.3 0c4.7-10.4 8.7-21.2 11.8-32.2l5.7-20c10.9-38.2-11.2-78.1-49.4-89zM32 192c-17.7 0-32 14.3-32 32V448c0 17.7 14.3 32 32 32H96c17.7 0 32-14.3 32-32V224c0-17.7-14.3-32-32-32H32z"/></svg>
            </div>
            <div>
              <span>Disagree</span>
              <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"><path d="M323.8 477.2c-38.2 10.9-78.1-11.2-89-49.4l-5.7-20c-3.7-13-10.4-25-19.5-35l-51.3-56.4c-8.9-9.8-8.2-25 1.6-33.9s25-8.2 33.9 1.6l51.3 56.4c14.1 15.5 24.4 34 30.1 54.1l5.7 20c3.6 12.7 16.9 20.1 29.7 16.5s20.1-16.9 16.5-29.7l-5.7-20c-5.7-19.9-14.7-38.7-26.6-55.5c-5.2-7.3-5.8-16.9-1.7-24.9s12.3-13 21.3-13L448 288c8.8 0 16-7.2 16-16c0-6.8-4.3-12.7-10.4-15c-7.4-2.8-13-9-14.9-16.7s.1-15.8 5.3-21.7c2.5-2.8 4-6.5 4-10.6c0-7.8-5.6-14.3-13-15.7c-8.2-1.6-15.1-7.3-18-15.2s-1.6-16.7 3.6-23.3c2.1-2.7 3.4-6.1 3.4-9.9c0-6.7-4.2-12.6-10.2-14.9c-11.5-4.5-17.7-16.9-14.4-28.8c.4-1.3 .6-2.8 .6-4.3c0-8.8-7.2-16-16-16H286.5c-12.6 0-25 3.7-35.5 10.7l-61.7 41.1c-11 7.4-25.9 4.4-33.3-6.7s-4.4-25.9 6.7-33.3l61.7-41.1c18.4-12.3 40-18.8 62.1-18.8H384c34.7 0 62.9 27.6 64 62c14.6 11.7 24 29.7 24 50c0 4.5-.5 8.8-1.3 13c15.4 11.7 25.3 30.2 25.3 51c0 6.5-1 12.8-2.8 18.7C504.8 238.3 512 254.3 512 272c0 35.3-28.6 64-64 64l-92.3 0c4.7 10.4 8.7 21.2 11.8 32.2l5.7 20c10.9 38.2-11.2 78.1-49.4 89zM32 384c-17.7 0-32-14.3-32-32V128c0-17.7 14.3-32 32-32H96c17.7 0 32 14.3 32 32V352c0 17.7-14.3 32-32 32H32z"/></svg>
            </div>
            <span class="text-skin-muted ml-1">
              {script.time}
            </span>
          </div>
        </div>
      </div>
              // <div class="border border-skin-grey p-5 mt-2">
              //   <div>{script.medium}</div>
              //   <div class="flex items-center justify-center">
              //     <div>
              //       <Show when={script.innocent > 0}>
              //         <div>{script.innocent} Inocent</div>
              //       </Show>
              //       <Show when={script.report > 0}>
              //         <div>{script.report} Report</div>
              //       </Show>
              //     </div>
              //     <div onClick={() => setReportModal(script.id)}>Report</div>
              //   </div>
              // </div>
            );
          }}
        </For>
      </div>
      <ModalPopup
        closeAction={() => setComplainModal(false)}
        isShow={isComplainModal()}
        title="Complain Cash"
        styles={{ modelSize: "md:w-[28.750rem]" }}
        titleCss="text-skin-bold text-xl leading-6"
        titleWrapCss="pt-6"
        body={
          <div>
            <div>
              <div class="flex items-center mb-2">
                <label class="w-[20%] text-skin-base text-sm font-medium">Title</label>
                <input
                  type="text"
                  class={`w-[80%] h-9 border border-skin-overlapMuted outline-none px-2 rounded-[0.1875rem] text-skin-bold bg-skin-white`}
                  value={title()}
                  onInput={(e) => setTitle(e.target.value)}
                />
              </div>
              <div class="flex items-center mt-2">
                <label class="w-[20%] text-skin-base text-sm font-medium">Medium</label>
                <input
                  type="text"
                  class={`w-[80%] h-9 border border-skin-overlapMuted outline-none px-2 rounded-[0.1875rem] text-skin-bold bg-skin-white`}
                  value={medium()}
                  onInput={(e) => setMedium(e.target.value)}
                />
              </div>
              <div class="flex items-center mt-2">
                <label class="w-[20%] text-skin-base text-sm font-medium">Link</label>
                <input
                  type="text"
                  class={`w-[80%] h-9 border border-skin-overlapMuted outline-none px-2 rounded-[0.1875rem] text-skin-bold bg-skin-white`}
                  value={link()}
                  onInput={(e) => setLink(e.target.value)}
                />
              </div>
              <div class="flex items-center mt-2">
                <label class="w-[20%] text-skin-base text-sm font-medium">Title</label>
                <textarea
                  type=""
                  class={`w-[80%] h-20 border border-skin-overlapMuted outline-none px-2 rounded-[0.1875rem] text-skin-bold bg-skin-white`}
                  value={des()}
                  maxLength={100}
                  onInput={(e) => setDes(e.target.value)}
                />
              </div>
            </div>

            <div class="flex justify-center mt-10">
              <button
                class="uppercase  mr-1 hover:bg-skin-royalblue hover:text-skin-white text-sm font-semibold border border-solid w-48 h-12 rounded text-skin-select border-skin-select"
                onClick={() => setComplainModal(false)}
              >
                Cancel
              </button>
              <button
                class="uppercase  hover:bg-skin-royalblue hover:text-skin-white text-sm font-semibold border border-solid w-48 h-12 rounded text-skin-select border-skin-select"
                onClick={handleSubmit}
              >
                Submit
              </button>
            </div>
          </div>
        }
        isCloseIconDisable={true}
      />

      {/* <ModalPopup
        closeAction={() => setReportModal(false)}
        isShow={isReportModal()}
        title="Report Cash"
        styles={{ modelSize: "md:w-[28.750rem]" }}
        titleCss="text-skin-bold text-xl leading-6"
        titleWrapCss="pt-6"
        body={<div>
          <div>Please select type</div>
          <div class="flex justify-center">
              <button
                class="mr-1 hover:bg-skin-royalblue hover:text-skin-white text-sm font-semibold border border-solid w-48 h-12 rounded text-skin-select border-skin-select"
                onClick={() => reportHandle("yes")}
              >
                He is Innocent
              </button>
              <button
                class="hover:bg-skin-royalblue hover:text-skin-white text-sm font-semibold border border-solid w-48 h-12 rounded text-skin-select border-skin-select"
                onClick={() => reportHandle("not")}
              >
                He is not Innocent
              </button>
            </div>
        </div>}
        isCloseIconDisable={true}
      /> */}
    </div>
  );
}
