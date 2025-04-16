import { useState, useEffect } from "react";

import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/Dialog";

import classes from "@/styles/Picture.module.css";

export function Picture() {
  const [image, setImage] = useState<string>(
    "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==",
  );

  useEffect(() => {
    const storedImage = localStorage.getItem("image");
    if (storedImage) {
      setImage(storedImage);
    }
  }, [image]);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setImage(base64String);
        localStorage.setItem("image", base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className={classes.picture}>
          <img src={image} />
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Upload Image</DialogTitle>
        <div className={classes.dialog}>
          {image ? (
            <img src={image} alt="Uploaded" className={classes.uploadedImage} />
          ) : (
            <p>No image uploaded</p>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className={classes.fileInput}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
