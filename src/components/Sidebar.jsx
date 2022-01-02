import React, {useState,useEffect} from 'react';
import './Sidebar.css';
import Icon from '@material-ui/core/Icon';
import { IconButton } from '@material-ui/core';
import { Avatar } from '@material-ui/core';
import SidebarChat from './SidebarChat';
import { getAuth, signOut } from "firebase/auth";
import { collection, query, getFirestore, onSnapshot, orderBy } from 'firebase/firestore';
import { useAuth } from '../providers/auth';

function Sidebar() {
    const [rooms, setRooms] = useState([]);
    const {user, setUser} = useAuth();

    useEffect(() => {
        async function getConversations(){
           const db = getFirestore();
           const q = query(collection(db,'conversations'),orderBy('timestamp', 'desc'));
           onSnapshot(q, querySnapshot => {
                let rooms=[];
                querySnapshot.docs.map(doc => {
                    let room = {
                        id: doc.id,
                        name: doc.data().name,
                        lastMessage: doc.data().lastMessage,
                        createBy: doc.data().createBy
                    };
                    rooms.push(room);
                });
                setRooms(rooms);
                console.log(rooms);
           });
        }
        getConversations();
    },[]);

    const sign_out = () => {
        const auth = getAuth();
        signOut(auth).then(() => {
            localStorage.removeItem('user');
            window.location.reload();
        }).catch((error) => {
        });
    };

    return (
        <div className="sidebar">
            <div className="sidebar__header">
                <IconButton>
                    <Avatar src={user.photoUrl}/>
                </IconButton>
                <div className="sidebar__header_right">
                    <IconButton>
                        <Icon>donut_large</Icon>
                    </IconButton>
                    <IconButton>
                        <Icon>chat</Icon>
                    </IconButton>
                    <IconButton onClick={()=>sign_out()}>
                        <Icon>more_vertical</Icon>
                    </IconButton>
                </div>
            </div>

            <div className="sidebar__search">
                <div className="sidebarsearch__container">
                    <Icon>search</Icon>
                    <input type="text" placeholder="Pesquisar ou começar nova conversa" />
                </div>
            </div>

            <div className="sidebar__chats">
                {<SidebarChat key={0} add_new_chat/>}
                {rooms.map((room) => (
                    <SidebarChat
                        key={room.id}
                        name={room.name}
                        id={room.id}
                        photoUrl={room.photoUrl}
                        lastMessage={room.lastMessage}
                    />
                ))}
            </div>
        </div>
    )
}

export default Sidebar;
