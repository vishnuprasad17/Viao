import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Rating,
  Button,
  Avatar,
  Input,
  IconButton,
  Tooltip,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";
import { useState } from "react";
import { FaEdit, FaCheck, FaTimes, FaAngleDown, FaTrash } from "react-icons/fa";
import { UserData } from "../../../interfaces/userTypes";
import UserRootState from "../../../redux/rootstate/UserState";
import { useSelector } from "react-redux";
import { updateReview, deleteReview } from "../../../config/services/userApi";
import { toast } from "react-toastify";
import { formatDistanceToNow } from "date-fns";

interface ReviewCardProps {
  id: string;
  userId: UserData;
  rating: number;
  content: string;
  reply: Array<string>;
  createdAt: Date;
  onUpdate: () => void;
}

const ReviewCard: React.FC<ReviewCardProps> = ({
  id,
  userId,
  rating,
  content,
  reply,
  createdAt,
  onUpdate,
}) => {
  const user = useSelector((state: UserRootState) => state.user.userdata);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(content);
  const [editedRating, setEditedRating] = useState(rating);
  const [error, setError] = useState("");
  const [showReplies, setShowReplies] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const handleUpdate = async () => {
    if (editedContent.trim() === "") {
      setError("Review cannot be empty!");
      return;
    }

    try {
      await updateReview(id, editedContent, editedRating);
      setIsEditing(false);
      toast.success("Review updated successfully!");
      onUpdate();
    } catch (error) {
      console.log(error);
      toast.error("Failed to update review");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteReview(id);
      toast.success("Review deleted successfully!");
      onUpdate();
      setDeleteOpen(false);
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete review");
    }
  };

  const cancelEdit = () => {
    setEditedContent(content);
    setEditedRating(rating);
    setIsEditing(false);
    setError("");
  };

  return (
    <Card
      className="w-full p-4 shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100 rounded-lg"
      placeholder={undefined}
      onPointerEnterCapture={undefined}
      onPointerLeaveCapture={undefined}
    >
      {/* Header Section */}
      <CardHeader
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-0 border-none"
        placeholder={undefined}
        onPointerEnterCapture={undefined}
        onPointerLeaveCapture={undefined}
      >
        <div className="flex items-center gap-3">
          <Avatar
            size="sm"
            src={userId?.imageUrl || "/imgs/user-default.svg"}
            alt={userId.name}
            className="border-2 border-white shadow-sm"
            placeholder={undefined}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          />
          <div>
            <Typography
              variant="h6"
              className="font-semibold"
              placeholder={undefined}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            >
              {userId.name}
            </Typography>
            <Typography
              variant="small"
              className="text-gray-600 text-xs"
              placeholder={undefined}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            >
              {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
            </Typography>
          </div>
        </div>

        <div className="flex items-center gap-2 mt-2 sm:mt-0">
          {isEditing ? (
            <Rating
              value={editedRating}
              onChange={(value) => setEditedRating(value)}
              className="text-amber-400"
              placeholder={undefined}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            />
          ) : (
            <Rating
              value={rating}
              readonly
              className="text-amber-400"
              placeholder={undefined}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            />
          )}
          {user?.id === userId.id && (
            <div className="flex gap-2">
              {isEditing ? (
                <>
                  <Tooltip content="Save changes">
                    <IconButton
                      variant="text"
                      color="green"
                      onClick={handleUpdate}
                      placeholder={undefined}
                      onPointerEnterCapture={undefined}
                      onPointerLeaveCapture={undefined}
                    >
                      <FaCheck className="w-4 h-4" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip content="Cancel">
                    <IconButton
                      variant="text"
                      color="red"
                      onClick={cancelEdit}
                      placeholder={undefined}
                      onPointerEnterCapture={undefined}
                      onPointerLeaveCapture={undefined}
                    >
                      <FaTimes className="w-4 h-4" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip content="Delete review">
                    <IconButton
                      variant="text"
                      color="red"
                      onClick={() => setDeleteOpen(true)}
                      placeholder={undefined}
                      onPointerEnterCapture={undefined}
                      onPointerLeaveCapture={undefined}
                    >
                      <FaTrash className="w-4 h-4" />
                    </IconButton>
                  </Tooltip>
                </>
              ) : (
                <Tooltip content="Edit review">
                  <IconButton
                    variant="text"
                    color="blue"
                    onClick={() => setIsEditing(true)}
                    placeholder={undefined}
                    onPointerEnterCapture={undefined}
                    onPointerLeaveCapture={undefined}
                  >
                    <FaEdit className="w-4 h-4" />
                  </IconButton>
                </Tooltip>
              )}
            </div>
          )}
        </div>
      </CardHeader>

      {/* Content Section */}
      <CardBody
        className="p-0 mt-4"
        placeholder={undefined}
        onPointerEnterCapture={undefined}
        onPointerLeaveCapture={undefined}
      >
        {isEditing ? (
          <div className="space-y-2">
            <Input
              value={editedContent}
              onChange={(e) => {
                setEditedContent(e.target.value);
                setError(
                  e.target.value.trim() ? "" : "Review cannot be empty!"
                );
              }}
              className="!border-gray-300 focus:!border-gray-900"
              labelProps={{ className: "hidden" }}
              autoFocus
              crossOrigin={undefined}
              placeholder={undefined}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            />
            {error && (
              <Typography
                variant="small"
                color="red"
                placeholder={undefined}
                onPointerEnterCapture={undefined}
                onPointerLeaveCapture={undefined}
              >
                {error}
              </Typography>
            )}
          </div>
        ) : (
          <Typography
            className="text-gray-800"
            placeholder={undefined}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          >
            {content}
          </Typography>
        )}

        {/* Replies Section */}
        {reply.length > 0 && (
          <div className="mt-4">
            <Button
              variant="text"
              className="flex items-center gap-1 text-blue-600 hover:text-blue-800 p-0"
              onClick={() => setShowReplies(!showReplies)}
              placeholder={undefined}
              onPointerEnterCapture={undefined}
              onPointerLeaveCapture={undefined}
            >
              {showReplies ? "Hide replies" : "Show replies"}
              <FaAngleDown
                className={`transition-transform ${showReplies ? "rotate-180" : ""}`}
              />
            </Button>

            {showReplies && (
              <div className="mt-2 ml-4 pl-4 border-l-2 border-gray-200 space-y-3">
                {reply.map((replyval, index) => (
                  <div key={index} className="py-2">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-semibold text-gray-700">
                        Seller
                      </span>
                      <span className="text-gray-400">•</span>
                      <span className="text-gray-500">
                        {formatDistanceToNow(new Date(createdAt), {
                          addSuffix: true,
                        })}
                      </span>
                    </div>
                    <Typography
                      className="text-gray-600 text-sm mt-1"
                      placeholder={undefined}
                      onPointerEnterCapture={undefined}
                      onPointerLeaveCapture={undefined}
                    >
                      {replyval}
                    </Typography>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </CardBody>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteOpen}
        handler={() => setDeleteOpen(!deleteOpen)}
        placeholder={undefined}
        onPointerEnterCapture={undefined}
        onPointerLeaveCapture={undefined}
      >
        <DialogHeader
          placeholder={undefined}
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
        >
          Delete Review
        </DialogHeader>
        <DialogBody
          placeholder={undefined}
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
        >
          Are you sure you want to delete this review? This action cannot be
          undone.
        </DialogBody>
        <DialogFooter
          placeholder={undefined}
          onPointerEnterCapture={undefined}
          onPointerLeaveCapture={undefined}
        >
          <Button
            variant="text"
            color="blue-gray"
            onClick={() => setDeleteOpen(false)}
            className="mr-1"
            placeholder={undefined}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          >
            Cancel
          </Button>
          <Button
            variant="gradient"
            color="red"
            onClick={handleDelete}
            placeholder={undefined}
            onPointerEnterCapture={undefined}
            onPointerLeaveCapture={undefined}
          >
            Confirm Delete
          </Button>
        </DialogFooter>
      </Dialog>
    </Card>
  );
};

export default ReviewCard;