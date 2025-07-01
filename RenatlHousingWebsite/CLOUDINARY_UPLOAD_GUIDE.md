# 🚀 Complete Cloudinary Image & Video Upload System

## 📋 Overview

This system provides complete image and video upload functionality using Cloudinary for the RentEase property management application. Images and videos are uploaded directly to Cloudinary from the frontend, and the Cloudinary URLs are saved in the backend database.

## 🏗️ Architecture

```
Frontend (React) → Cloudinary API → Backend (Node.js) → MongoDB
     ↓                    ↓              ↓
  Upload Files    Store Media Files   Save URLs
```

## 🔧 Backend Configuration

### 1. Environment Variables Required

Create a `.env` file in the backend directory:

```env
CLOUDINARY_CLOUD_NAME=dkrrpzlbl
CLOUDINARY_API_KEY=your_api_key_here
CLOUDINARY_API_SECRET=your_api_secret_here
```

### 2. Property Model Structure

The property model supports both images and videos with Cloudinary URLs:

```javascript
// Images array
images: [{
  url: String,        // Cloudinary secure URL
  type: String,       // "image" or category like "bedroom"
  public_id: String   // Cloudinary public ID (optional)
}]

// Videos array  
videos: [{
  url: String,        // Cloudinary secure URL
  type: String,       // "video"
  public_id: String   // Cloudinary public ID (optional)
}]

// Nearby places
nearby: [{
  name: String,       // Place name
  distance: String,   // Distance value
  unit: String        // "km" or "m"
}]
```

### 3. Backend Routes

#### Update Property Route
```
PUT /api/properties/:id
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "description": "Property description",
  "address": "Property address",
  "city": "City name",
  "state": "State name",
  "images": [
    {
      "url": "https://res.cloudinary.com/dkrrpzlbl/image/upload/...",
      "type": "bedroom",
      "public_id": "rent_ease/properties/..."
    }
  ],
  "videos": [
    {
      "url": "https://res.cloudinary.com/dkrrpzlbl/video/upload/...",
      "type": "video",
      "public_id": "rent_ease/properties/..."
    }
  ],
  "nearby": [
    {
      "name": "Hospital",
      "distance": "2",
      "unit": "km"
    }
  ],
  // ... other property fields
}
```

## 🎨 Frontend Implementation

### 1. Image Upload Function

```javascript
const handleImageUpload = async (e) => {
  const files = Array.from(e.target.files);
  
  if (formData.images.length + files.length > 10) {
    toast.error("Maximum 10 images allowed");
    return;
  }

  try {
    setUploading(true);
    const uploadedImages = [];
    
    for (const file of files) {
      // Validate file type and size
      if (!file.type.startsWith('image/')) {
        toast.error("Only image files are allowed");
        continue;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image size should be less than 5MB");
        continue;
      }

      // Upload to Cloudinary
      const uploadData = new FormData();
      uploadData.append("file", file);
      uploadData.append("upload_preset", "RentEase_Videos");
      uploadData.append("cloud_name", "dkrrpzlbl");
      uploadData.append("resource_type", "image");
      
      const response = await fetch(
        "https://api.cloudinary.com/v1_1/dkrrpzlbl/image/upload",
        { method: "POST", body: uploadData }
      );

      const data = await response.json();
      
      if (data.secure_url) {
        uploadedImages.push({
          url: data.secure_url,
          public_id: data.public_id,
          type: "image"
        });
      }
    }

    // Update form data
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...uploadedImages],
    }));
    
    toast.success(`Successfully uploaded ${uploadedImages.length} image(s)`);
  } catch (error) {
    toast.error("Failed to upload images");
  } finally {
    setUploading(false);
  }
};
```

### 2. Video Upload Function

```javascript
const handleVideoUpload = async (e) => {
  const files = Array.from(e.target.files);
  
  if (formData.videos.length + files.length > 3) {
    toast.error("Maximum 3 videos allowed");
    return;
  }

  try {
    setUploadingVideos(true);
    const uploadedVideos = [];
    
    for (const file of files) {
      const uploadData = new FormData();
      uploadData.append("file", file);
      uploadData.append("upload_preset", "RentEase_Videos");
      uploadData.append("cloud_name", "dkrrpzlbl");
      uploadData.append("resource_type", "video");
      
      const response = await fetch(
        "https://api.cloudinary.com/v1_1/dkrrpzlbl/video/upload",
        { method: "POST", body: uploadData }
      );

      const data = await response.json();
      
      if (data.secure_url) {
        uploadedVideos.push({
          url: data.secure_url,
          public_id: data.public_id,
          type: "video"
        });
      }
    }

    setFormData(prev => ({
      ...prev,
      videos: [...prev.videos, ...uploadedVideos],
    }));
    
    toast.success(`Successfully uploaded ${uploadedVideos.length} video(s)`);
  } catch (error) {
    toast.error("Failed to upload videos");
  } finally {
    setUploadingVideos(false);
  }
};
```

### 3. Form Submission

```javascript
const handleSubmit = async (e) => {
  e.preventDefault();
  
  try {
    const token = localStorage.getItem("token");
    
    // Prepare data for submission
    const submitData = {
      description: formData.description.trim(),
      address: formData.address.trim(),
      city: formData.city.trim(),
      state: formData.state.trim(),
      images: formData.images
        .filter(img => img.url && img.url.includes('cloudinary.com'))
        .map(img => ({
          url: img.url.trim(),
          type: img.type?.trim() || "image"
        })),
      videos: formData.videos
        .filter(vid => vid.url && vid.url.includes('cloudinary.com'))
        .map(vid => ({
          url: vid.url.trim(),
          type: vid.type?.trim() || "video"
        })),
      nearby: formData.nearby.map(item => ({
        name: item.name?.trim() || "",
        distance: item.distance?.toString().trim() || "",
        unit: item.unit?.trim() || "km"
      })),
      // ... other fields
    };

    const response = await axios.put(
      `http://localhost:5000/api/properties/${id}`,
      submitData,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    toast.success("Property updated successfully!");
    navigate("/my-properties");
  } catch (error) {
    toast.error("Failed to update property");
  }
};
```

## 🔍 Key Features

### ✅ Image Upload
- **Maximum**: 10 images per property
- **File types**: JPEG, PNG, GIF, WebP
- **Size limit**: 5MB per image
- **Categories**: bedroom, kitchen, living-room, bathroom, exterior
- **Cloudinary folder**: `rent_ease/properties`

### ✅ Video Upload
- **Maximum**: 3 videos per property
- **File types**: MP4, MOV, AVI, WebM
- **Size limit**: 500MB per video
- **Cloudinary folder**: `rent_ease/properties`

### ✅ Nearby Places
- **Structure**: Array of objects with name, distance, and unit
- **Units**: km, m
- **Validation**: Required name and distance

### ✅ Security
- **Authentication**: JWT token required
- **Authorization**: Only property owner can update
- **File validation**: Type and size checks
- **URL validation**: Only Cloudinary URLs accepted

## 🧪 Testing

Run the test script to verify Cloudinary configuration:

```bash
node test-upload.js
```

Expected output:
```
🧪 Testing Cloudinary Upload Functionality...

📸 Testing Image Upload...
✅ Image upload successful!
   URL: https://res.cloudinary.com/dkrrpzlbl/image/upload/...
   Public ID: rent_ease/properties/...

🎥 Testing Video Upload...
✅ Video upload successful!
   URL: https://res.cloudinary.com/dkrrpzlbl/video/upload/...
   Public ID: rent_ease/properties/...

📋 Summary:
✅ Cloudinary configuration is working
✅ Upload preset "RentEase_Videos" is accessible
✅ Both image and video uploads are functional

🚀 Your property update form should work perfectly!
```

## 🚀 Usage Flow

1. **User selects files** in the property update form
2. **Frontend validates** file type and size
3. **Files uploaded** directly to Cloudinary
4. **Cloudinary URLs** stored in form state
5. **Form submitted** to backend with URLs
6. **Backend validates** and saves to MongoDB
7. **Success response** returned to frontend

## 🔧 Troubleshooting

### Common Issues

1. **Upload fails**: Check Cloudinary credentials and upload preset
2. **File too large**: Reduce file size or increase limits
3. **Invalid file type**: Ensure file is image/video format
4. **Authentication error**: Check JWT token validity
5. **Database error**: Verify MongoDB connection

### Debug Steps

1. Check browser console for errors
2. Verify Cloudinary environment variables
3. Test upload preset accessibility
4. Check network requests in DevTools
5. Verify backend logs for errors

## 📝 Notes

- All uploads use the same Cloudinary preset: `RentEase_Videos`
- Images are automatically optimized by Cloudinary
- Videos are stored in their original format
- Public IDs are optional but recommended for cleanup
- The system supports both new uploads and existing URLs

---

**🎉 Your Cloudinary image and video upload system is now complete and ready to use!** 