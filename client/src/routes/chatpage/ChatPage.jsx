import { useEffect, useRef, useState } from "react";
import "./chatPage.scss";
import NewPrompt from "../../components/newPrompt/NewPrompt";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "react-router-dom";
import Markdown from "react-markdown";
import { IKImage } from "imagekitio-react";
import { useAuth } from "@clerk/clerk-react";
import SetHamburgerMenuVis from '../../context/setHamburgerMenuVis';

const ChatPage = () => {
  const { isMenuOpen, setIsMenuOpen } = SetHamburgerMenuVis();
  const { getToken } = useAuth();
  const [token,setUserToken] = useState("")
  
  useEffect(()=>{
    const takeToken = async ()=>{
      const takenToken = await getToken();
      setUserToken(takenToken)
      console.log(takenToken);
      setIsMenuOpen(false)
    }
    takeToken()
  },[])
  const path = useLocation().pathname;
  const chatId = path.split("/").pop();
  const { isPending, error, data } = useQuery({
    queryKey: ["chat",chatId],
    queryFn: () =>
      fetch(`${import.meta.env.VITE_API_URL}/api/chats/${chatId}`, {
        credentials: "include",
        headers: {
        },
      }).then((res) => res.json()),
      
  });
  

  return (
    <div className="chatPage">
      <div className="wrapper">
        <div className="chat">
          <div className="message"></div>
          {isPending ? "Loading.." : error ? "error occured!" : data?.history?.map((message,index)=>(
            <>
            {message.img && (
              <IKImage
              urlEndpoint={import.meta.env.VITE_IMAGE_KIT_ENDPOINT}
              path={message.img}
              height="300"
              width="400"
              transformation={[{height:300,width:400}]}
              loading="lazy"
              lqip={{active:true,quality:20}}
              key={index}
              className="message user"
              />
            )}
            <div className={message.role==="user" ? "message user" : "message"} key={index}>
            <Markdown>{message?.parts[0].text}</Markdown>
          </div>
            </>
          ))
          }

          {data && <NewPrompt data={data} />}  
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
