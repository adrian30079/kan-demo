import React, { useState } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Download, Eye, EyeOff } from "lucide-react"; // Using lucide-react icons instead of MUI icons

function WordCloudsCard() {
  const [showNouns, setShowNouns] = useState(true);
  const [showAdjectives, setShowAdjectives] = useState(true);

  const handleDownload = async () => {
    try {
      const response = await fetch('https://scontent-hkg1-1.xx.fbcdn.net/v/t39.30808-6/469044040_9224058297607299_928102199779415142_n.jpg?_nc_cat=109&ccb=1-7&_nc_sid=127cfc&_nc_ohc=Hkbu41iwGN4Q7kNvgH-YJxn&_nc_zt=23&_nc_ht=scontent-hkg1-1.xx&_nc_gid=AUCBun8SKiMVJaKQaFqDmBd&oh=00_AYC40jbYH5x-Zc5tqNv520l5P4S5xkYu-CfB3u4sUdToOg&oe=67546F08');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'wordcloud.jpg';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading image:', error);
    }
  };

  return (
    <div className="relative">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle>Word Cloud</CardTitle>
          <div className="flex items-center gap-4">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowNouns(!showNouns)}
                className={`p-2 rounded-full transition-colors ${
                  showNouns ? "text-[#00857C]" : "text-gray-400"
                }`}
              >
                {showNouns ? <Eye size={20} /> : <EyeOff size={20} />}
                <span className="sr-only">Toggle Nouns</span>
              </button>
              <span className="text-sm">Nouns</span>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setShowAdjectives(!showAdjectives)}
                className={`p-2 rounded-full transition-colors ${
                  showAdjectives ? "text-[#00857C]" : "text-gray-400"
                }`}
              >
                {showAdjectives ? <Eye size={20} /> : <EyeOff size={20} />}
                <span className="sr-only">Toggle Adjectives</span>
              </button>
              <span className="text-sm">Adjectives</span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleDownload}
              className="text-[#00857C] hover:text-[#00857C] hover:bg-[#00857C]/10"
            >
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <img
            src="/img/what-wordcloud.jpg"
            alt="what-wordcloud"
            className="w-full h-auto"
            key={1}
          />
        </CardContent>
      </Card>
    </div>
  );
}

export default WordCloudsCard;