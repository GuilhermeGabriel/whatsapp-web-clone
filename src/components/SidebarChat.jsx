import React, { useEffect, useState } from 'react';
import { Avatar } from '@material-ui/core';
import './SidebarChat.css';
import { Link } from 'react-router-dom';
import { collection, setDoc, doc, getFirestore, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../providers/auth';
 
function SidebarChat({ add_new_chat, id, name, photoUrl, lastMessage }) {
    const {user, setUser} = useAuth();

    const create_chat = () => {
        const roomName = prompt("Por favor, digite o nome da sala!");
        if(roomName){
            if(roomName.length < 5 || roomName.length > 15 ){ 
                alert("Nome deve ser entre 5 e 15 caracteres!"); 
                return;
            }
            
            async function addChat(){
                const db = getFirestore();
                const newConversationId = doc(collection(db,'conversations'));
                await setDoc(newConversationId, {
                    id: newConversationId.id,
                    name: roomName,
                    timestamp: serverTimestamp(),
                    lastMessage: `Nova sala de ${user.name}`,
                    info: `Criado por ${user.name}`
                });
            } 
            addChat();
        }
    };

    return !add_new_chat ? (
        <Link to={`/rooms/${id}`} style={{ textDecoration: 'none', color: 'inherit'}}>
            <div className="sidebar__chat">
                <Avatar src={`https://avatars.dicebear.com/api/initials/${name}.svg`}/>
                <div className="sidebarchat_info">
                    <h3>{name}</h3>
                    <p>{lastMessage}</p>
                </div>
            </div>  
        </Link>
        ) 
        :
        (
            <div
                onClick={create_chat}
                className="sidebar__chat">
                <h3>Adicionar nova sala</h3>
            </div>
    )
}

export default SidebarChat;
