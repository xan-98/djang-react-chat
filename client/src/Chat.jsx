import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ApiConnector from "./api/apiConnector";
import ExitIcon from "./assets/image/exit.svg";
import "./assets/style/chat.scss";
import Loading from "./components/Loading";
import MessageItem from "./components/MessageItem";
import MessageItemOwn from "./components/MessageItemOwn";
import WriteMessage from "./components/WriteMessage";

const Chat = ({
  user,
  joinRoom,
  getRoom,
  exitRoom,
  newMessages,
  readMessage,
  sendRead,
}) => {
  const page_size = 20;
  const messagesEndRef = useRef(null);
  const messagesLast = useRef(null);
  const { id } = useParams();

  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [messageList, setMessageList] = useState([]);
  const [lastId, setLastId] = useState();
  const [isLoadind, setIsLoading] = useState(true);

  const scrollToBottom = () => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView();
    }, 100);
  };

  const getMessages = async () => {
    if (lastPage < page) {
      return false;
    }
    var messages = await ApiConnector.sendGetRequest(
      `chat/messages/${id}?page=${page}&page_size=${page_size}`
    );
    setLastPage(messages?.last_page);
    if (messages?.data) {
      var temp_array = [];
      messages?.data.forEach((m) => {
        const found = messageList.some((el) => el.id == m.id);
        if (!found) {
          temp_array.push(m);
        }
      });

      setMessageList([...messageList, ...temp_array]);
      setPage(page + 1);
      setTimeout(() => {
        setLastId(temp_array[temp_array.length - 1]?.id);
      }, 500);
    }
    setIsLoading(false);
    if (page == 1) {
      scrollToBottom();
    }
  };
  useEffect(() => {
    joinRoom(id);
    getMessages();
    return () => {
      exitRoom(id);
    };
  }, []);

  useEffect(() => {
    var temp_array = [];
    newMessages.forEach((m) => {
      if (m.room != id) {
        return false;
      }
      const found = messageList.some((el) => el.id == m.id);
      if (!found) {
        temp_array.push(m);
      }
    });
    setMessageList([...temp_array, ...messageList]);

    scrollToBottom();
  }, [newMessages]);

  const statusUpdate = () => {
    if (readMessage == id) {
      let newArr = messageList.map((item) => {
        if (item.user_id == user.id) {
          item.status = true;
          return item;
        } else {
          return item;
        }
      });
      setMessageList(newArr);
    }
  };

  useEffect(() => {
    statusUpdate();
  }, [readMessage]);

  useEffect(() => {
    if (messageList[0]?.user_id != user.id) {
      sendRead(id);
    }
  }, [messageList]);

  const onWrite = async (message) => {
    const data = await ApiConnector.sendPostRequest("chat/messages/", {
      room: id,
      message: message,
    });
    if (data?.status == "success") scrollToBottom();
  };

  const loadHistory = () => {
    getMessages();
    setTimeout(() => {
      messagesLast.current?.scrollIntoView({ block: "end" });
    }, 100);
  };

  return (
    <div className="chat">
      <div className="chat__wrapper">
        <div className="chat__header">
          <div className="chat__text">
            <div className="chat__name">{getRoom(id)?.name}</div>
            <div className="chat__sub">{getRoom(id)?.member} участника</div>

            <div className="chat__sub">{user.username}</div>
          </div>
          <Link to="/">
            <img className="exit" src={ExitIcon} alt="Exit" />
          </Link>
        </div>
        <div className="chat__history">
          <div className="chat__list">
            {lastPage >= page && (
              <div className="chat__load" onClick={loadHistory}>
                Нажмите, загрузить историю
              </div>
            )}

            {isLoadind && (
              <Loading/>
            )}

            {messageList.toReversed().map((m, index, elements) => {
              const itemProps = lastId == m?.id ? { ref: messagesLast } : {};

              let printDate = false;
              if (index > 0) {
                let nDate = elements[index - 1].date;
                if (nDate != m.date) {
                  printDate = true;
                }
              }
              if (index == 0) printDate = true;

              if (user.id == m.user_id) {
                return (
                  <div key={index} {...itemProps}>
                    <MessageItemOwn message={m} printDate={printDate} />
                  </div>
                );
              } else {
                return (
                  <div key={index} {...itemProps}>
                    <MessageItem message={m} printDate={printDate} />
                  </div>
                );
              }
            })}

            <div ref={messagesEndRef} className="chat__space" />
          </div>
        </div>
        <WriteMessage onWrite={onWrite} />
      </div>
    </div>
  );
};

Chat.propTypes = {
  user: PropTypes.object.isRequired,
  joinRoom: PropTypes.func.isRequired,
  getRoom: PropTypes.func.isRequired,
  exitRoom: PropTypes.func.isRequired,
  newMessages: PropTypes.array.isRequired,
  readMessage: PropTypes.string.isRequired,
  sendRead: PropTypes.func.isRequired,
};

export default Chat;
