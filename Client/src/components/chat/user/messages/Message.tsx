import { format } from "timeago.js";
import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";
import { deleteForEveryone, deleteForMe } from "../../../../config/services/userApi";
import { toast } from "react-toastify";
import UserRootState from "../../../../redux/rootstate/UserState";
import { useSelector } from "react-redux";
import { Messages } from "../../../../interfaces/commonTypes";



interface MessageProps {
  own: boolean;
  message: Partial<Messages>
  setIsUpdated:React.Dispatch<React.SetStateAction<boolean>>;
}

const Message:React.FC<MessageProps>=({ message, own, setIsUpdated }) => {
  const user = useSelector((state: UserRootState) => state.user.userdata);
  const [openRight, setOpenRight] = React.useState(false);
  const [messageIdToDelete, setMessageIdToDelete] = useState("");
  const handleOpenRight = (msgId: string) => {
    setOpenRight(!openRight);
    setMessageIdToDelete(msgId);
  };

  const [openLeft, setOpenLeft] = React.useState(false);

  const handleOpenLeft = (msgId: string) => {
    setOpenLeft(!openLeft);
    setMessageIdToDelete(msgId);
  };

  const handleDeleteEveryone = async () => {
    deleteForEveryone(
        { msgId: messageIdToDelete },
        { withCredentials: true }
      )
      .then((response) => {
        console.log(response);
        setIsUpdated(true);
        handleOpenRight("");
      })
      .catch((error) => {
        handleOpenRight("");
        toast.error(error.response);
        console.log("here", error);
      });
  };

  const handleDeleteForMe = async (side: string) => {
    deleteForMe(
        { msgId: messageIdToDelete, id: user?.id },
        { withCredentials: true }
      )
      .then((response) => {
        console.log(response);
        setIsUpdated(true);
        if (side == "right") {
          handleOpenRight("");
        } else {
          handleOpenLeft("");
        }
      })
      .catch((error) => {
        if (side == "right") {
          handleOpenRight("");
        } else {
          handleOpenLeft("");
        }
        toast.error(error.response);
        console.log("here", error);
      });
  };

  return (
    <>
      {own ? (
        <div>
          <div className="flex items-end justify-end">
            <div className="relative flex flex-col space-y-2 text-xs max-w-xs mx-2 order-2 items-end">
              <div>
                {message?.isDeleted ? (
                  <span
                    style={{ fontStyle: "italic" }}
                    className="rounded-full px-4 py-2 rounded-1g inline-block rounded-bl-none bg-blue-300 text-white"
                  >
                    You deleted this message
                  </span>
                ) : message?.deletedIds?.includes(user?.id!) ? (
                  ""
                ) : message?.imageUrl ? (
                  <img
                    className="w-35 h-35 rounded-lg"
                    src={message?.imageUrl}
                    alt="Bonnie Green image"
                  ></img>
                ) : (
                  <>
                    <span
                      style={{ fontSize: "14px" }}
                      className="relative px-5 py-2 rounded-lg inline-block rounded-bl-none bg-blue-500 text-white"
                      onClick={() => handleOpenRight(message?.id!)}
                    >
                      {/* Text content */}
                      {message?.text}

                      {message?.isRead ? (
                        <>
                          <i className="fa-solid fa-check-double absolute bottom-0 right-0"
                            style={{ padding: "4px", fontSize: "10px" }} ></i>
                        </>
                      ) : (
                        <>
                          <i
                            className="fa-solid fa-check absolute bottom-0 right-0"
                            style={{ padding: "2px", fontSize: "10px" }} // Padding to adjust icon position
                          ></i>
                        </>
                      )}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
          {message?.deletedIds?.includes(user?.id!) ? (
            ""
          ) : (
            <p className="flex items-end justify-end text-xs text-gray-500 mr-2">
              {format(message.createdAt!)}
            </p>
          )}
        </div>
      ) : (
        <div className="chat-message flex flex-col">
          <div className="flex items-end">
            <div className="relative flex flex-col space-y-2 text-xs max-w-xs mx-2 order-2 items-start">
              <div>
                {message?.isDeleted ? (
                  <span
                    style={{ fontStyle: "italic" }}
                    className="px-4 py-2 rounded-lg inline-block rounded-bl-none bg-gray-100 text-gray-600"
                  >
                    This message was deleted
                  </span>
                ) : message?.deletedIds?.includes(user?.id!) ? (
                  ""
                ) : message?.imageUrl ? (
                  <img
                    className="w-35 h-35 rounded-lg"
                    src={message?.imageUrl}
                    alt="Bonnie Green image"
                  ></img>
                ) : (
                  <>
                    <span
                      className="px-4 py-2 rounded-lg inline-block rounded-bl-none bg-gray-200 text-gray-800"
                      onClick={() => handleOpenLeft(message?.id!)}
                      style={{ fontSize: "14px" }}
                    >
                      {message.text}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
          {message?.deletedIds?.includes(user?.id!) ? (
            ""
          ) : (
            <p className="text-xs text-gray-500 ml-2">
              {format(message?.createdAt!)}
            </p>
          )}
        </div>
      )}

      <Dialog
        className="w-40"
        size="xs"
        open={openRight}
        handler={handleOpenRight}
        placeholder={undefined}
        onPointerEnterCapture={undefined}
        onPointerLeaveCapture={undefined}
      >
        <DialogHeader
          placeholder={undefined}
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
          className="text-md"
        >
          Delete message?
        </DialogHeader>
        <DialogBody
          placeholder={undefined}
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
        >
          <div className="flex justify-end flex-col text-end">
            <Button
              variant="text"
              color="red"
              className="mr-1"
              placeholder={undefined}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
              onClick={handleDeleteEveryone}
            >
              <span>Delete for everyone</span>
            </Button>
            <Button
              variant="text"
              color="red"
              className="mr-1"
              placeholder={undefined}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
              onClick={() => handleDeleteForMe("right")}
            >
              <span>Delete for me</span>
            </Button>
          </div>
        </DialogBody>
        <DialogFooter
          placeholder={undefined}
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
        >
          <Button
            variant="text"
            color="green"
            onClick={() => handleOpenRight("")}
            className="mr-1"
            placeholder={undefined}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          >
            <span>Cancel</span>
          </Button>
        </DialogFooter>
      </Dialog>

      {/* LeftSide */}
      <Dialog
        className="w-40"
        size="xs"
        open={openLeft}
        handler={handleOpenLeft}
        placeholder={undefined}
        onPointerEnterCapture={undefined}
        onPointerLeaveCapture={undefined}
      >
        <DialogHeader
          placeholder={undefined}
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
          className="text-md"
        >
          Delete message?
        </DialogHeader>
        <DialogBody
          placeholder={undefined}
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
        >
          <div className="flex justify-end flex-col text-end">
            <Button
              variant="text"
              color="red"
              className="mr-1"
              placeholder={undefined}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
              onClick={() => handleDeleteForMe("left")}
            >
              <span>Delete for me</span>
            </Button>
          </div>
        </DialogBody>
        <DialogFooter
          placeholder={undefined}
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
        >
          <Button
            variant="text"
            color="green"
            onClick={() => handleOpenLeft("")}
            className="mr-1"
            placeholder={undefined}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          >
            <span>Cancel</span>
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
};

export default Message;