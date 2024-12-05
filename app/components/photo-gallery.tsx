import { useState } from 'react'
import { X, ChevronLeft, ChevronRight, Grid, Maximize, Download, Link } from 'lucide-react'
import { Button } from '@/components/ui/button'
import postsData from './data-post.json'

// Extract image URLs from data-post.json
const extractImagesFromPosts = () => {
  const images: string[] = []
  postsData.posts.forEach(post => {
    if (post.imgGroup) {
      Object.values(post.imgGroup).forEach(imgUrl => {
        if (typeof imgUrl === 'string' && !images.includes(imgUrl)) {
          images.push(imgUrl)
        }
      })
    }
  })
  return images
}

// Ensure the image URLs are correct
const imageUrls = extractImagesFromPosts()
console.log(imageUrls) // Debug: Log the extracted image URLs

interface PhotoGalleryProps {
  images: string[];
  onClose: () => void;
}

export function PhotoGallery({ images, onClose }: PhotoGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isGridView, setIsGridView] = useState(false)

  // Get the current post's linkExtracted value
  const currentPost = postsData.posts.find(post => 
    post.imgGroup && Object.values(post.imgGroup).includes(images[currentIndex])
  )
  const linkExtracted = currentPost?.linkExtracted || ''

  const nextPhoto = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length)
  }

  const prevPhoto = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length)
  }

  const getCalloutContent = (index: number) => {
    switch (index) {
      case 0:
        return {
          icon: "/img/media/WhatsApp.png",
          alt: "WhatsApp",
          link: "https://chat.coinunited.whatsapp.com/35633267vg23"
        };
      case 1:
        return {
          icon: "/img/media/WeChat.png",
          alt: "WeChat",
          link: "https://wa.me/coinunitedking66012851sccs12.241.23"
        };
      case 3:
        return {
          icon: null, // Will use Lucide Link icon
          alt: "Link",
          link: "https://tinyurl.com/crtyptocasf5231.231542.gh4"
        };
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-md z-50">
      <div className="bg-white w-full h-full max-w-7xl max-h-[90vh] rounded-lg shadow-lg flex flex-col mx-4 relative">
        {/* Top Bar */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold text-[#00857C]">Photo Gallery</h2>
          <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-2">
            <Button
              variant="ghost"
              size="icon"
              className="bg-white rounded-md hover:bg-[#00857C] hover:text-white"
              onClick={() => window.open(images[currentIndex], '_blank')}
              aria-label="Download photo"
            >
              <Download className="h-6 w-6" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="bg-white rounded-md hover:bg-[#00857C] hover:text-white"
              onClick={() => setIsGridView(!isGridView)}
              aria-label={isGridView ? "Switch to single view" : "Switch to grid view"}
            >
              {isGridView ? <Maximize className="h-6 w-6" /> : <Grid className="h-6 w-6" />}
            </Button>
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

        {/* Main Content - Add fixed height to account for thumbnail bar */}
        <div className="flex-grow overflow-hidden relative" style={{ height: 'calc(100% - 80px - 96px)' }}>
          {!isGridView && linkExtracted && (
            <div className="absolute bottom-4 right-4 bg-white/90 p-3 rounded-lg shadow-lg flex items-center gap-2">
              <Link className="h-4 w-4 text-[#00857C]" />
              <span className="text-sm">Link extracted: {linkExtracted}</span>
            </div>
          )}
          
          {isGridView ? (
            <div className="grid grid-cols-3 gap-4 p-4 overflow-y-auto h-full bg-[#E7E9EB]">
              {images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Photo ${index + 1}`}
                  className="w-full h-48 object-contain cursor-pointer rounded-lg bg-white"
                  onClick={() => {
                    setCurrentIndex(index)
                    setIsGridView(false)
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="relative h-full flex items-center justify-center bg-[#E7E9EB]">
              <img
                src={images[currentIndex]}
                alt={`Photo ${currentIndex + 1}`}
                className="max-h-full max-w-full object-contain"
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-4 top-1/2 transform -translate-y-1/2 h-24 w-24 hover:bg-[#00857C] hover:text-white"
                onClick={prevPhoto}
                aria-label="Previous photo"
              >
                <ChevronLeft className="h-12 w-12" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-4 top-1/2 transform -translate-y-1/2 h-24 w-24 hover:bg-[#00857C] hover:text-white"
                onClick={nextPhoto}
                aria-label="Next photo"
              >
                <ChevronRight className="h-12 w-12" />
              </Button>
              
              {/* Add the callout card */}
              {getCalloutContent(currentIndex) !== null && (
                <div className="absolute bottom-28 right-4 bg-white/90 p-2 rounded-lg shadow-lg">
                  <div className="flex items-center space-x-2">
                    {getCalloutContent(currentIndex)?.icon ? (
                      <img 
                        src={getCalloutContent(currentIndex)?.icon} 
                        alt={getCalloutContent(currentIndex)?.alt} 
                        className="w-4 h-4" 
                      />
                    ) : (
                      <Link className="h-4 w-4" />
                    )}
                    <a 
                      href={getCalloutContent(currentIndex)?.link}
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline text-sm"
                    >
                      {getCalloutContent(currentIndex)?.link}
                    </a>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Thumbnail Navigation - Fixed height and position */}
        {!isGridView && (
          <div className="absolute bottom-0 left-0 right-0 h-24 border-t bg-white rounded-b-lg">
            <div className="h-full overflow-x-auto flex items-center px-4">
              <div className="flex space-x-2 mx-auto">
                {images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`Thumbnail ${index + 1}`}
                    className={`h-16 w-24 object-cover cursor-pointer rounded bg-gray-200 ${
                      index === currentIndex ? 'ring-2 ring-[#00857C] ring-offset-2' : 'hover:ring-2 hover:ring-[#00857C]/50'
                    }`}
                    onClick={() => setCurrentIndex(index)}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

