import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { ChangeEvent, ChangeEventHandler, FormEvent, useState } from "react";
import {toast } from 'sonner'

interface NewNoteCardProps{ //propriedade chamada onNoteCreated que é uma funcao que recebe o content
  onNoteCreated: (content: string) => void //sem retorno
}


export function NewNoteCard ({ onNoteCreated }: NewNoteCardProps) {
  const [shouldShowOnboarding, setShouldOnboarding] = useState(true);
  const [content, setContent] = useState('')
  const [isRecording, setIsRecording] = useState(false)


  function handleStartEditor() {
    setShouldOnboarding(false);
  }

  function handleContentChanged(event: ChangeEvent<HTMLTextAreaElement>) {
   setContent(event.target.value)
   
    if (event.target.value == "") {
      setShouldOnboarding(true);
    }
  }

  function handleSaveNote(event: FormEvent) {
    event.preventDefault()

    if(content == ''){
      return
    }

    onNoteCreated(content)
    setContent('')
    setShouldOnboarding(true)
    toast.success('Nota criada com sucesso')
  }

  function handleStartRecording(){
    setIsRecording(true)

    const isSpeechRecognitionAPIAvaliable = 'SpeechRecognition' in window
    || 'webkitSpeechRecognition' in window

    if(!isSpeechRecognitionAPIAvaliable){
      alert('Infelizmente seu navegador não suporta a API de gracação')
      return
    }

    const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition 

    const speechRecognition = new SpeechRecognitionAPI()
    speechRecognition.lang = 'pt-BR'
    speechRecognition.continuous = true // gravando até pedir pra parar
    speechRecognition.maxAlternatives = 1
    speechRecognition.interimResults = true


    speechRecognition.onresult = (event) => {
      
    }
  }

  function handleStopRecording(){
    setIsRecording(false)
  }

  return (
    <Dialog.Root>
      <Dialog.Trigger className="rounded-md flex flex-col bg-slate-700 p-5 gap-3 text-left outline-none hover:ring-2 hover:ring-slate-600 focus-visible:ring-2 focus-visible:ring-lime-400 ">
        <span className="text-sm font-medium text-slate-200">
          Adicionar nota
        </span>
        <p className="text-sm leading-6 text-slate-400 ">
          Grave uma nota em áudio que será convertida para texto
          automaticamente.
        </p>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="inset-0 fixed bg-black/50" />
        <Dialog.Content className="fixed overflow-hidden left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 max-w-[640px] w-full bg-slate-700 rounded-md flex flex-col outline-none h-[60vh]">
          <Dialog.Close className="absolute right-0 top-0 bg-slate-800 p-1.5 text-slate-400 hover:text-slate-100">
            <X className="size-5" />
          </Dialog.Close>

          <form  className="flex-1 flex flex-col">
            <div className="flex flex-1 flex-col gap-3 p-5">
              <span className="text-sm font-medium text-slate-300">
                Adicionar nota
              </span>

              {shouldShowOnboarding ? (
                <p className="text-sm leading-6 text-slate-400">
                  Comece{" "}
                  <button onClick={handleStartRecording} type='button' className="text-lime-400 hover:underline">
                    gravando uma nota
                  </button>{" "}
                  em áudio ou se preferir{" "}
                  <button
                    type='button'
                    onClick={handleStartEditor}
                    className="text-lime-400 hover:underline"
                  >
                    {" "}
                    utilize apenas texto.
                  </button>
                </p>
              ) : (
                <textarea
                  autoFocus
                  className="text-sm leading-6 text-slate-400 bg-transparent resize-none flex-1 outline-none"
                  onChange={handleContentChanged}
                  value={content}
                />
              )}
            </div>


            {isRecording ? (
              <button
              type="button"
              onClick={handleStopRecording}
              className="w-full flex bg-slate-900 py-4 text-center text-sm gap-2 justify-center items-center outline-none font-medium group">
              <div className="size-3 rounded-full bg-red-500 animate-pulse" />
              <span className="text-slate-300 outline-none  text-sm hover:text-slate-100 ">
                Gravando! (clique para interromper)
              </span>
              </button>
            ) :(
              <button
              type="button"
              onClick={handleSaveNote}
              className="w-full bg-lime-400 py-4 text-center text-sm text-slate-300 outline-none font-medium group hover:bg-lime-500">
              <span className="text-lime-950 outline-none font-bold ">
                Salvar nota
              </span>
              </button>) }

              
           
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
