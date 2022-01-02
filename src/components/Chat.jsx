import React, { useState, useEffect, useRef } from 'react';
import './Chat.css';
import {Icon} from '@material-ui/core';
import {Avatar, IconButton} from '@material-ui/core';

import { useParams } from 'react-router-dom';
import { useAuth } from '../providers/auth';
import { collection, doc, getDoc, getFirestore, onSnapshot, orderBy, query, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';

function Chat() {
    const messagesEndRef = useRef(null)
    const [ input, setInput ] = useState("");
    const { roomId } = useParams();
    const [ roomInfo, setRoomInfo] = useState({});
    const [ messages, setMessages ] = useState([]);
    const { user } = useAuth();
    
    useEffect(() => {
        const scrollToBottom = () => {
            messagesEndRef.current?.scrollIntoView()
        }
        scrollToBottom()
    }, [messages]);

    useEffect(() => {
        const db = getFirestore();
        async function getMessages(){
            const q = query(
                collection(db,'conversations',roomId,'messages'),
                orderBy('timestamp', 'asc')
                );
            onSnapshot(q, querySnapshot => {
                 setMessages(querySnapshot.docs.map(doc => doc.data()));
            });
         }
         async function getInfosConversations(){
            const conversationRef = doc(db,'conversations',roomId);
            const docSnapshot = await getDoc(conversationRef);
            setRoomInfo(docSnapshot.data());
         }
         getMessages();
         getInfosConversations();
    }, [roomId]);

    const sendMessage = (e) => {
        e.preventDefault();
        let inputFormatted = input.trim();
        if(inputFormatted.length > 300) {alert('Máximo de 300 caracteres permitidos!'); return;}
        if(inputFormatted.length > 0 ){
            const db = getFirestore();
            
            async function addMessage(){
                const newMessageId = doc(collection(db,'conversations',roomId,'messages'));
                await setDoc(newMessageId, {
                    id: newMessageId.id,
                    uid: user.uid,
                    name: user.name,
                    timestamp: serverTimestamp(),
                    content: inputFormatted,
                    photoUrl: user.photoUrl
                });
            }
            async function updateConversationInfo(){
                const msgRef = doc(db, 'conversations', roomId);
                await updateDoc(msgRef, {
                    lastMessage: `${user.name}: ${inputFormatted}`,
                    timestamp: serverTimestamp()
                });
            }

            addMessage();
            updateConversationInfo();
        }
        setInput("");
    }

    return (
        <div className="chat">
            <div className="chat__header">
                <Avatar src={`https://avatars.dicebear.com/api/initials/${roomInfo.name}.svg`} />

                <div className="chatheader__info">
                    <h4>{roomInfo.name}</h4>
                    <p>{roomInfo.info}</p>    
                </div>

                <div className="chatheader_right">
                    <IconButton>
                        <Icon>attach_file</Icon>
                    </IconButton>
                        
                    <IconButton>
                        <Icon>more_vert</Icon>
                    </IconButton>

                    <IconButton>
                        <Icon>search_outline</Icon>
                    </IconButton>
                </div>
            </div>

            <div className="chat__body">
                {messages.map(msg => (
                    <div 
                        key={msg.id}
                        className={(msg.uid===user.uid) ? 'chatmessage__receiver' : 'chatmessage'}>
                       <div className="chat__name">{msg.name}</div>
                        <div className="chat__text">{msg.content}</div>
                        <div className="chat__timestamp">
                            {new Date(msg.timestamp?.toDate()).toUTCString()}
                        </div>
                    </div>
                ))}
                <div key={'bottomref'} ref={messagesEndRef} />
            </div>

            <div className="chat_footer">
                <Icon>insert_emoticon</Icon>
                <form>
                    <input 
                        value={input}
                        onChange={ e=> setInput(e.target.value)} 
                        type="text"></input>
                    <button onClick={sendMessage} type="submit"></button>
                </form>
                <Icon>mic</Icon>
            </div>
        </div>
    )
}

export default Chat;
