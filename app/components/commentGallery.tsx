// app/components/CommentGallery.tsx
import * as React from "react";
import commentsData from "./data-comment.json";
import { Button } from '@/components/ui/button'
import { Post } from "@/types/post";
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react";
import { Flame, Share2, Heart, Tag } from "lucide-react";

interface CommentGalleryProps {
  post: Post;
  onClose: () => void;
}

export const CommentGallery: React.FC<CommentGalleryProps> = ({ post, onClose }) => {
  // Add ref and click handler
  const galleryRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (galleryRef.current && !galleryRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div ref={galleryRef} className="bg-white w-3/4 h-3/4 flex rounded-lg overflow-hidden">
        {/* Left side: Post data */}
        <div className="w-1/2 p-4 overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-[#00857C]">Post</h2>
            <div className="flex items-center space-x-2">
              <Flame className="h-4 w-4 text-red-500" />
              <span>{post.engagementIndex}</span>
              <Share2 className="h-4 w-4 text-green-500" />
              <span>{post.share}</span>
              <Heart className="h-4 w-4 text-red-500" />
              <span>{post.likes}</span>
            </div>
          </div>
          <h3 className="text-lg font-bold mb-2">{post.group}</h3>
          <div className="mb-2 flex flex-wrap gap-1">
            {post.classifiedContent.map((content, index) => (
              <Badge 
                key={`classified-${index}`} 
                className="bg-[#EDFBF9] text-[#32504C] border-none mr-1 flex items-center space-x-1"
              >
                <Tag className="h-3 w-3" />
                <span>{content}</span>
              </Badge>
            ))}
            {post.ner.map((entity, index) => (
              <Badge 
                key={`ner-${index}`} 
                variant="outline" 
                className="flex items-center space-x-1"
              >
                <span>{entity}</span>
              </Badge>
            ))}
          </div>
          <p className="text-sm text-gray-700 pb-4">{post.fullContent}</p>
          {post.imgGroup && Object.values(post.imgGroup).length > 0 && (
            <div className="mb-4 flex flex-wrap">
              {Object.values(post.imgGroup).map((imgUrl, index) => (
                <div key={index} className="w-1/2 p-2">
                  <img 
                    src={imgUrl} 
                    alt={`Post content ${index + 1}`} 
                    className="w-full rounded-lg object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right side: Comments */}
        <div className="w-1/2 border-l">
          <div className="sticky p-4 top-0 bg-white z-10 pb-0">
            <div className="flex items-center justify-between border-b">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-lg font-semibold text-[#00857C]">Comments</h3>
                <span className="text-sm text-gray-500">({commentsData.comments.length})</span>
              </div>
              <Button
                variant="ghost"
                className="bg-white rounded-md hover:bg-[#00857C] hover:text-white"
                onClick={onClose}
                aria-label="Exit gallery"
              >
                Exit <X className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </div>
          <div className="overflow-auto bg-gray-100 p-4 h-[calc(100%-3rem)]">
            {commentsData.comments.map((comment) => (
              <div key={comment.id} className="mb-2 bg-white p-3 rounded-lg shadow">
                <div className="flex justify-between items-center mb-1">
                  <p className="font-semibold text-xs text-gray-600">{comment.author}</p>
                  <span className="text-xs text-gray-500">{comment.timestamp}</span>
                </div>
                <p className="text-sm">{comment.commentText}</p>
                <div className="text-xs text-gray-500">
                  Likes: {comment.likes} | Comments: {comment.comment}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};