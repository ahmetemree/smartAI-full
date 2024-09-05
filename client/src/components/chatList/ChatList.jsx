import { Link } from 'react-router-dom'
import './chatList.scss'
import { useQuery } from '@tanstack/react-query'
import { useEffect, useState } from 'react';
import { useAuth } from '@clerk/clerk-react';
const ChatList = () => {
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
  
  const { isPending, error, data } = useQuery({
    queryKey: ['userChats'],
    queryFn: () =>
      fetch(`${import.meta.env.VITE_API_URL}/api/userchats`,{
        credentials:"include",
        headers: {
        },
      }).then((res) =>
        res.json(),
      ),
    })
    
    
  return (
    <div className='chatList' >
        <span className='title'>Dashboard</span>
        <Link to="/dashboard">Create a new Chat</Link>
        <Link to="/">Explore SmartAI</Link>
        <Link to="/" >Contact</Link>
        <hr/>
        <span className='title'>Recent Chats</span>
        <div className="list">
            {isPending ? "Loading.." : error ? "something went wrong.." : data?.map(chat=>(
              
              <Link to={`/dashboard/chats/${chat._id}`} key={chat._id}>{chat.title}</Link>
              ))}
        </div>
        <hr/>
        <div className="upgrade">
            <img src="/logo2.png" alt="" />
            <div className="texts">
                <span>Upgrade Pro Version</span>
                <span>Get unlimited acess to all features</span>
            </div>
        </div>
    </div>
  )
}

export default ChatList