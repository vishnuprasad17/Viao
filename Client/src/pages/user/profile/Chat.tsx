import { Link } from "react-router-dom";
import Conversation from "../../../components/chat/user/sidebar/Conversation";
import UserRootState from "../../../redux/rootstate/UserState";
import { useSelector } from "react-redux";
import { MouseEvent, SetStateAction, useEffect, useMemo, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { v4 as uuidv4 } from "uuid";

import { getVendorForChat } from "../../../config/services/userApi";
import {
  changeReadStatus,
  getChat,
  getMessages,
  sendMessage,
} from "../../../config/services/chatApi";
import Message from "../../../components/chat/user/messages/Message";
import { Button, IconButton } from "@material-tailwind/react";
import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { Chats, Messages } from "../../../interfaces/commonTypes";
import { VendorData } from "../../../interfaces/vendorTypes";
import MessageSkeleton from "../../../components/chat/skeletons/MessageSkeleton";
import config from "../../../config/envConfig";
import { IoSendSharp } from "react-icons/io5";
import { BsEmojiSmile } from "react-icons/bs";
import EmojiPicker, { Theme } from "emoji-picker-react";
import { RiMenu2Fill } from "react-icons/ri";
import { IoMdClose } from "react-icons/io";
import { AiOutlineFileImage } from "react-icons/ai";
import { CiHome } from "react-icons/ci";
import { CgProfile } from "react-icons/cg";
import { USER } from "../../../config/routes/user.routes";
import { useMediaQuery } from "react-responsive";
import { debounce } from "lodash";
import { toast } from "react-toastify";

interface FileDetails {
  filename: string;
  originalFile: File;
}

const Chat = () => {
  const user = useSelector((state: UserRootState) => state.user.userdata);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [isUpdated, setIsUpdated] = useState<boolean>(false);
  const [conversation, setconversation] = useState<Chats[]>([]);
  const [currentchat, setcurrentchat] = useState<Chats | null>(null);
  const [messages, setmessages] = useState<Partial<Messages>[]>([]);
  const [arrivalMessage, setArrivalMessage] =
    useState<Partial<Messages> | null>(null);
  const [newMessage, setnewMessage] = useState("");
  const [activeUsers, setActiveUsers] = useState<any[]>([]);
  const [vendor, setVendor] = useState<VendorData>();
  const chatAreaRef = useRef<HTMLDivElement | null>(null);
  const [filemodal, setFileModal] = useState(false);
  const [file, setFile] = useState<FileDetails | null>();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const socket = useRef<Socket>();

  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const handleConversationSelect = (selectedConversation: Chats) => {
    setcurrentchat(selectedConversation);
    setIsSidebarOpen(false);
    const friendId = selectedConversation.members.find((m) => m !== user?.id);
    // Fetch vendor data based on friendId
    getVendorForChat(friendId)
      .then((res) => {
        setVendor(res.data.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    const currentSocket = io(config.SOCKET_URL);
    socket.current = currentSocket;

    // Debounced message updater
    const updateMessages = debounce((data) => {
      setArrivalMessage({
        senderId: data.senderId,
        text: data.text,
        imageUrl: data.imageUrl,
        createdAt: Date.now(),
      });;
    }, 300); // Debounce to limit updates to every 300ms

    currentSocket.on("getMessage", updateMessages);
    currentSocket.on("activeStatus", (users) => {
      setActiveUsers(users);
    });

    return () => {
      currentSocket.off("getMessage", updateMessages);
      currentSocket.off("activeStatus");
      updateMessages.cancel();
      currentSocket.disconnect();
    };
  }, []);

  useEffect(() => {
    arrivalMessage &&
      currentchat?.members.includes(arrivalMessage.senderId!) &&
      setmessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage, currentchat]);

  useEffect(() => {
    socket.current?.emit("adduser", user?.id);
    socket.current?.on("getUsers", (users) => {
      console.log(users);
    });
  }, [user]);

  const getConversation = async () => {
    try {
      const res = await getChat(user?.id, "user");
      console.log(res.data);
      setconversation(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getConversation();
  }, [user?.id]);

  //getting messages
  useEffect(() => {
    const getmessages = async () => {
      try {
        const res = await getMessages(currentchat?.id, "user");
        setmessages(res.data);
        setIsUpdated(false);
      } catch (error) {
        console.log(error);
      }
    };
    getmessages();
  }, [currentchat, isUpdated]);

  const receiverId = useMemo(() => {
      if (currentchat) {
        const conversation = currentchat?.members.find((member) => member !== user?.id);
        return conversation || null;
      }
      return null;
    }, [currentchat]);

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();

    // Check if the message is not empty
    if (newMessage.trim() === "") {
      return; // Do not send the message if it's empty
    }
    const message = {
      senderId: user?.id,
      text: newMessage,
      image: "",
      imageUrl: "",
      conversationId: currentchat?.id,
    };

    socket.current?.emit("sendMessage", {
      senderId: user?.id,
      receiverId,
      text: newMessage,
      image: "",
      imageUrl: "",
    });

    try {
      await sendMessage("user", message)
        .then((res) => {
          setmessages([...messages, res.data]);
          setnewMessage("");
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (error) {
      console.log(error);
    }
    getConversation();
  };

  // Scroll to bottom on new messages with debounce
  const scrollToBottom = debounce(() => {
    chatAreaRef.current?.scrollIntoView({ behavior: "smooth" });
  }, 100);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleInputChange = (e: {
    target: { value: SetStateAction<string> };
  }) => {
    setnewMessage(e.target.value);
  };

  // Handle emoji click
  const handleEmojiClick = (emojiObject: { emoji: string }) => {
    setShowEmojiPicker(false); // Close emoji picker after selection
    setnewMessage((prevMessage) => prevMessage + emojiObject.emoji); // Add emoji to the message
  };

  // image input

  const handleButtonClick = () => {
    // When the IconButton is clicked, trigger the hidden file input
    if (fileInputRef.current) {
      fileInputRef?.current?.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.size > 5 * 1024 * 1024) {
        toast.error("File size exceeds 5MB limit.");
      } else if (!["image/jpeg", "image/png"].includes(selectedFile.type)) {
        toast.error("Unsupported file type. Please upload a JPEG or PNG.");
      } else {
        setFileModal(true);
        setFile({
          filename: URL.createObjectURL(selectedFile),
          originalFile: selectedFile,
        });
      }
    }
  
    // Reset the file input value to ensure re-selection works
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRemoveFile = () => {
    setFileModal(false);
    setFile(null); // Clears the file state
  };

  const s3 = new S3Client({
    credentials: {
      accessKeyId: config.ACCESS_KEY!,
      secretAccessKey: config.SECRET_ACCESS_KEY!,
    },
    region: config.BUCKET_REGION!,
  });

  const handleSend = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (file) {
      console.log("Sending file:", file.originalFile);

      const imageName = uuidv4();

      const params = {
        Bucket: config.BUCKET_NAME!,
        Key: imageName,
        Body: file.originalFile,
        ContentType: file.originalFile.type,
      };

      const command = new PutObjectCommand(params);
      await s3.send(command);

      const getObjectParams = {
        Bucket: config.BUCKET_NAME!,
        Key: imageName,
      };

      const command2 = new GetObjectCommand(getObjectParams);
      const url = await getSignedUrl(s3, command2, { expiresIn: 86400 * 3 });

      const message = {
        senderId: user?.id,
        text: "",
        conversationId: currentchat?.id,
        imageName: imageName,
        imageUrl: url,
      };

      socket.current?.emit("sendMessage", {
        senderId: user?.id,
        receiverId,
        text: "",
        image: imageName,
        imageUrl: url,
      });

      await sendMessage("user", message)
        .then((res) => {
          setmessages([...messages, res.data]);
          setnewMessage("");
          setFileModal(false);
          setFile(null);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  };

  //Change Read Status
  const changeIsRead = async (chatId: string) => {
    try {
      const datas = {
        chatId,
        senderId: user?.id,
      };
      await changeReadStatus("user", datas, { withCredentials: true }).then((res) => {
        console.log(res);
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      {conversation.length == 0 ? (
        <MessageSkeleton />
      ) : (
        <div className="flex h-screen bg-gray-100">
          {/* Sidebar */}
          <div
            className={`${
              isSidebarOpen ? "translate-x-0" : "-translate-x-full"
            } md:translate-x-0 w-full md:w-1/3 lg:w-1/4 bg-white border-r border-gray-200 absolute md:relative z-10 transition-transform duration-300 ease-in-out h-full`}
          >
            <div className="p-4 border-b border-gray-200 flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <h2 className="text-xl font-semibold">Chats</h2>
                <Link to={`${USER.HOME}`}>
                  <IconButton
                    variant="text"
                    className="p-2 bg-transparent text-black rounded"
                    placeholder={undefined}
                    onPointerEnterCapture={undefined}
                    onPointerLeaveCapture={undefined}
                  >
                    <CiHome className="w-5 h-5" />
                  </IconButton>
                </Link>
                <Link to={`${USER.PROFILE}`}>
                  <IconButton
                    variant="text"
                    className="p-2 bg-transparent text-black rounded"
                    placeholder={undefined}
                    onPointerEnterCapture={undefined}
                    onPointerLeaveCapture={undefined}
                  >
                    <CgProfile className="w-5 h-5" />
                  </IconButton>
                </Link>
              </div>
              <button
                className="md:hidden text-gray-600"
                onClick={toggleSidebar}
              >
                <IoMdClose className="w-6 h-6" />
              </button>
            </div>
            <div className="overflow-y-auto h-[calc(100vh-73px)]">
              {conversation.map((c) => (
                <div
                  onClick={() => {
                    handleConversationSelect(c);
                    changeIsRead(c.id);
                  }}
                >
                  <Conversation
                    conversation={c}
                    currentUser={user}
                    currentchat={currentchat}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col">
            {!currentchat ? (
              <div className="flex flex-col justify-center items-center h-full text-gray-500">
                <p>Select a conversation to start chatting</p>
                {isMobile && (
                  <button
                    className="mt-4 px-4 py-2 bg-transparent text-cyan-900 rounded"
                    onClick={toggleSidebar}
                  >
                    Show Chats
                  </button>
                )}
              </div>
            ) : (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b border-gray-200 bg-white flex items-center justify-between">
                  <div className="flex items-center">
                    <button className="md:hidden mr-4" onClick={toggleSidebar}>
                      <RiMenu2Fill className="w-6 h-6 text-gray-600" />
                    </button>
                    <img
                      src={vendor ? vendor?.logoUrl : ""}
                      alt={vendor ? vendor?.logoUrl : ""}
                      className="w-10 h-10 rounded-full"
                    />
                    <div className="ml-4">
                      <h2 className="font-semibold">
                        {vendor ? vendor?.name : ""}
                      </h2>
                      <div className="text-sm text-gray-500 flex items-center">
                        {activeUsers.some(
                          (u) => u.userId === receiverId && u.active
                        ) ? (
                          <>
                            Active now
                            <span>
                              <svg
                                width="10"
                                height="10"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="green"
                                className="ml-1"
                              >
                                <circle cx="10" cy="13" r="10" />
                              </svg>
                            </span>
                          </>
                        ) : (
                          <>
                            Offline
                            <span>
                              <svg
                                width="10"
                                height="10"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="red"
                                className="ml-1"
                              >
                                <circle cx="10" cy="13" r="10" />
                              </svg>
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
                  {messages.map((m) => (
                    <div ref={chatAreaRef}>
                      <Message
                        message={m}
                        own={m.senderId === user?.id}
                        setIsUpdated={setIsUpdated}
                      />
                    </div>
                  ))}
                </div>

                {/* Message Input */}
                <div className="relative flex items-center space-x-2 p-4 bg-white">
                  <IconButton
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    variant="text"
                    className="p-2 hover:bg-gray-100 rounded-full"
                    placeholder={undefined}
                    onPointerEnterCapture={undefined}
                    onPointerLeaveCapture={undefined}
                  >
                    <BsEmojiSmile className="w-6 h-6 text-gray-600" />
                  </IconButton>
                  {/* Emoji Picker Popup */}
                  {showEmojiPicker && (
                    <div className="absolute bottom-12 left-0 z-10">
                      <EmojiPicker
                        onEmojiClick={handleEmojiClick}
                        theme={Theme.LIGHT}
                      />
                    </div>
                  )}
                  <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: "none" }}
                    onChange={(event) => handleFileChange(event)}
                  />

                  {/* IconButton that triggers the hidden file input */}
                  <IconButton
                    onClick={handleButtonClick}
                    variant="text"
                    className="rounded-full"
                    placeholder={undefined}
                    onPointerEnterCapture={undefined}
                    onPointerLeaveCapture={undefined}
                  >
                    <AiOutlineFileImage className="w-6 h-6 text-gray-600" />
                  </IconButton>
                  <textarea
                    value={newMessage}
                    onChange={handleInputChange}
                    placeholder="Type a message..."
                    className="flex-1 p-2 border rounded-lg resize-none"
                    rows={1}
                  />
                  <IconButton
                    type="button"
                    onClick={handleSubmit}
                    className="p-2 bg-blue-500 text-white rounded-full"
                    placeholder={undefined}
                    onPointerEnterCapture={undefined}
                    onPointerLeaveCapture={undefined}
                  >
                    <IoSendSharp className="w-5 h-5" />
                  </IconButton>
                </div>

                {/* File Preview */}
                {filemodal && (
                  <div className="p-4 bg-gray-50 border-t border-gray-200 flex flex-col items-center">
                    {file && (
                      <img
                        src={file?.filename}
                        alt="Preview"
                        className="w-32 h-32 object-cover rounded-lg mb-2"
                      />
                    )}
                    <div className="flex space-x-4">
                      <Button
                        className="bg-red-500 text-white px-4 py-2 rounded"
                        onClick={handleRemoveFile}
                        placeholder={undefined}
                        onPointerEnterCapture={undefined}
                        onPointerLeaveCapture={undefined}
                      >
                        Cancel
                      </Button>
                      <Button
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                        onClick={(e) => handleSend(e)}
                        placeholder={undefined}
                        onPointerEnterCapture={undefined}
                        onPointerLeaveCapture={undefined}
                      >
                        Send
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Chat;
