import { useEffect, useRef, useState } from "react";
import "./newPrompt.scss";
import Upload from "../upload/Upload";
import { IKImage } from "imagekitio-react";
import model from "../../lib/gemini";
import Markdown from "react-markdown";
import {
  QueryClient,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { useAuth } from "@clerk/clerk-react";


const NewPrompt = ({ data }) => {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [generating, setGenerating] = useState(false);
  const [isInterrupted, setIsInterrupted] = useState(false);
  const [img, setImg] = useState({
    isLoading: false,
    error: "",
    dbData: {},
    aiData: {},
  });
  const { getToken } = useAuth();
  const [token,setUserToken] = useState("")
  
  useEffect(()=>{
    const takeToken = async ()=>{
      const takenToken = await getToken();
      setUserToken(takenToken)
      console.log(takenToken);
    }
    takeToken()
  },[])

  const chat = model.startChat({
    history: data?.history?.length > 0 
    ? data.history.map(({ role, parts }) => ({
        role,
        parts: parts?.length > 0 && parts[0]?.text ? [{ text: parts[0].text }] : [],
      }))
    : [],
    generationConfig: {
      //  maxOutputTokens:100,
    },
  });
  const endRef = useRef(null);
  const formRef = useRef(null);

  useEffect(() => {
    endRef.current.scrollIntoView({ behaviour: "smooth" });
  }, [data, question, answer, img.dbData]);

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => {
      return fetch(`${import.meta.env.VITE_API_URL}/api/chats/${data._id}`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          
        },
        body: JSON.stringify({
          question: question.length ? question : undefined,
          answer,
          img: img.dbData?.filePath || undefined,
        }),
      }).then((res) => res.json());
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient
        .invalidateQueries({ queryKey: ["chat", data._id] })
        .then(() => {
          setQuestion("");
          setAnswer("");
          setGenerating(false);
          setImg({
            isLoading: false,
            error: "",
            dbData: {},
            aiData: {},
          });
        });
    },
    onError: (err) => {
      console.log(err);
      setGenerating(false);
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGenerating(true);
    const text = e.target.text.value;
    if (!text) return;
    add(text,false);
    const token = await getToken();
  };

  const add = async (text, isInitial) => {
    if(!isInitial) setQuestion(text);
    formRef.current.reset();
   
    try {
      const result = await chat.sendMessageStream(
        Object.entries(img.aiData).length ? [img.aiData, text] : [text]
      );
      let accumulatedText = "";
      for await (const chunk of result.stream) {
        const chunkText = chunk.text();

        for (let i = 0; i < chunkText.length; i++) {
          // Her bir karakteri yazmadan önce belirli bir gecikme
          await new Promise((resolve) => setTimeout(resolve, 10)); // 50 ms gecikme
          
          // Gelen karakteri mevcut metne ekleyip güncelle
          accumulatedText += chunkText[i];
          setAnswer(accumulatedText);
          if (generating && isInterrupted) {
            setQuestion("");
            setAnswer("");
            setGenerating(false);
            setImg({
              isLoading: false,
              error: "",
              dbData: {},
              aiData: {},
            });
            return;
          }
        }
      }
     
      mutation.mutate();
    } catch (err) {
      console.log(err);
      setGenerating(false);
    }
  };

  const isClicked = ()=>{
    if(generating){
      setIsInterrupted(true)
    }
    console.log("interrupt");
    console.log(isInterrupted);
  }

  //IN PRODUCTION WE DON'T NEED IT
const hasRun = useRef(false)
  useEffect(()=>{
    if(!hasRun.current){

      if(data?.history?.length===1){
        add(data.history[0].parts[0].text, true)
      }
    }
    hasRun.current=true;
  },[])

  return (
    <div className="newPrompt">
      {img.isLoading && <span>Loading..</span>}
      {img.dbData?.filePath && (
        <IKImage
          urlEndpoint={import.meta.env.VITE_IMAGE_KIT_ENDPOINT}
          path={img.dbData?.filePath}
          width={300}
          transformation={[{ width: 300 }]}
          className="message user"
        />
      )}
      {question && <div className="message user">{question}</div>}
      {answer && (
        <div className="message ">
          <Markdown>{answer}</Markdown>
        </div>
      )}
      <div className="endChat" ref={endRef}></div>
      <form action="" className="newForm" onSubmit={handleSubmit} ref={formRef}>
        <Upload setImg={setImg} />
        <input id="file" type="file" multiple={false} hidden />
        <input type="text" name="text" placeholder="Ask me anything..." />
        <button disabled={generating}>
          <img src={(generating && "/blocked.png") || "/arrow.png"} onClick={isClicked} alt="" />
        </button>
      </form>
    </div>
  );
};

export default NewPrompt;
