import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import './assets/style/chat.scss';
import ExitIcon from './assets/image/exit.svg';
import { useEffect, useRef, useState } from 'react';
import MessageItemOwn from './components/MessageItemOwn';
import MessageItem from './components/MessageItem';
import { useParams } from "react-router-dom";
import ApiConnector from "./api/apiConnector";
import WriteMessage from './components/WriteMessage';

const Chat = ({ user, joinRoom, getRoom, exitRoom, sendMessage, newMessages, readMessage, sendRead }) => {
    const page_size = 20

    const messagesEndRef = useRef(null)
    const { id } = useParams();

    const [page, setPage] = useState(1);
    const [messageList, setMessageList] = useState([]);
    const [isLoadind, setIsLoading] = useState(true);

    const scrollToBottom = () => {
        setTimeout(() => {
            messagesEndRef.current?.scrollIntoView()
        }, 100)
    }


    const getMessages = async () => {
        var messages = await ApiConnector.sendGetRequest(`chat/messages/${id}?page=${page}&page_size=${page_size}`)
        if (messages?.data) {
            var temp_array = []
            messages?.data.forEach(m => {
                const found = messageList.some(el => el.id == m.id);
                if (!found) {
                    temp_array.push(m)
                }
            });

            setMessageList([...messageList, ...temp_array])
            setPage(page+1)
        }
        setIsLoading(false)
        if (page == 1) {
            scrollToBottom()
        }

    }
    useEffect(() => {

        joinRoom(id)
        getMessages()
        return () => {
            exitRoom(id)
        }
    }, []);

    useEffect(() => {
        var temp_array = []
        newMessages.forEach(m => {
            if (m.room != id) {
                return false
            }
            const found = messageList.some(el => el.id == m.id);
            if (!found) {
                temp_array.push(m)
            }
        });
        setMessageList([...temp_array, ...messageList])

        scrollToBottom()
    }, [newMessages]);


    const statusUpdate = () => {
        if (readMessage == id) {
            let newArr = messageList.map((item) => {
                if (item.user_id == user.id) {
                    item.status = true
                    return item;
                } else {
                    return item;
                }
            });
            setMessageList(newArr)
        }
    }



    useEffect(() => {
        statusUpdate()
    }, [readMessage]);
    
    useEffect(() => {
        if (messageList[0]?.user_id != user.id){
            sendRead(id, user.id)
        }
    }, [messageList]);




    const onWrite = (message) => {
        sendMessage(id, user.id, message)
        scrollToBottom()
    }
    const scrollEvent = (e) => {
        const target = e.target;
        if (target.scrollTop == 0) {
            setIsLoading(true)
            getMessages()
        }
    }


    return (
        <div className="chat">
            <div className="wrapper">
                <div className="header">
                    <div className="text">

                        <div className="name">{getRoom(id)?.name}</div>
                        <div className="sub">{getRoom(id)?.member} участника</div>


                        <div className="sub">{user.username}</div>
                    </div>
                    <Link to="/">
                        <img className="exit" src={ExitIcon} alt="Exit" />
                    </Link>
                </div>
                <div className="history" onScroll={scrollEvent}>
                    <div className="list">
                        {
                            isLoadind &&
                            <div className="loading">
                                <span className="loader"></span>
                            </div>
                        }

                        {
                            messageList.toReversed().map((m, index, elements) => {
                                let printDate = false
                                if (index > 0) {
                                    let nDate = elements[index - 1].date
                                    if (nDate != m.date) {
                                        printDate = true
                                    }
                                }
                                if (index == 0) printDate = true

                                if (user.id == m.user_id) {
                                    return (
                                        <MessageItemOwn message={m} printDate={printDate} key={index} />
                                    )
                                }
                                else {
                                    return (

                                        <MessageItem message={m} printDate={printDate} key={index} />
                                    )
                                }
                            })
                        }

                        <div ref={messagesEndRef} className='space' />
                    </div>
                </div>
                <WriteMessage onWrite={onWrite} />
            </div>
        </div>
    )
}

Chat.propTypes = {
    user: PropTypes.object.isRequired,
    joinRoom: PropTypes.func.isRequired,
    getRoom: PropTypes.func.isRequired,
    exitRoom: PropTypes.func.isRequired,
    sendMessage: PropTypes.func.isRequired,
    newMessages: PropTypes.array.isRequired,
    readMessage: PropTypes.string.isRequired,
    sendRead: PropTypes.func.isRequired,

};

export default Chat
