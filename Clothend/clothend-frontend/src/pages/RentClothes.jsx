import { useState, useRef } from 'react'
import { createListing } from '../api'

function RentClothes({ user, showMsg, onShowLogin }) {
  var [form, setForm] = useState({ name: "", gender: "", type: "", size: "", price: "", description: "", color: "" })
  var [locationUrl, setLocationUrl] = useState("")
  var [imageFile, setImageFile] = useState(null)
  var [imagePreview, setImagePreview] = useState(null)
  var [submitting, setSubmitting] = useState(false)
  var fileInputRef = useRef(null)

  function handleChange(e) { setForm({ ...form, [e.target.name]: e.target.value }) }

  function handleImageChange(e) {
    var file = e.target.files[0]
    if (file) {
      setImageFile(file)
      var reader = new FileReader()
      reader.onloadend = function () { setImagePreview(reader.result) }
      reader.readAsDataURL(file)
    }
  }

  function removeImage() {
    setImageFile(null); setImagePreview(null)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!user) { onShowLogin(); return showMsg("Please log in to list clothes") }
    if (!form.name || !form.gender || !form.type || !form.size || !form.price) return showMsg("Please fill all required fields")
    if (!locationUrl) return showMsg("Please paste your Google Maps location link")

    setSubmitting(true)
    try {
      var formData = new FormData()
      formData.append("name", form.name); formData.append("gender", form.gender)
      formData.append("type", form.type); formData.append("size", form.size)
      formData.append("price", form.price); formData.append("description", form.description)
      formData.append("color", form.color)
      formData.append("locationUrl", locationUrl)
      if (imageFile) formData.append("image", imageFile)

      await createListing(formData)
      showMsg("Listed successfully!")
      setForm({ name: "", gender: "", type: "", size: "", price: "", description: "", color: "" })
      setLocationUrl("")
      removeImage()
    } catch (err) { showMsg(err.message) }
    setSubmitting(false)
  }

  return (
    <div className="rent-page">
      <h1>List Your Clothes</h1>
      <form onSubmit={handleSubmit}>
        <div className="image-upload-area">
          {imagePreview ? (
            <div className="image-preview-wrapper">
              <img src={imagePreview} alt="Preview" className="image-preview" />
              <button type="button" className="remove-image-btn" onClick={removeImage}>✕</button>
            </div>
          ) : (
            <label className="upload-placeholder" htmlFor="cloth-image">
              <span className="upload-icon">📷</span>
              <span>Click to upload image</span>
              <span className="upload-hint">JPG, PNG or WebP (max 5MB)</span>
            </label>
          )}
          <input ref={fileInputRef} id="cloth-image" type="file" accept="image/*" onChange={handleImageChange} style={{ display: 'none' }} />
        </div>

        <input name="name" placeholder="Cloth Name *" value={form.name} onChange={handleChange} />
        <select name="gender" value={form.gender} onChange={handleChange}>
          <option value="">Select Gender *</option><option>Male</option><option>Female</option>
        </select>
        <select name="type" value={form.type} onChange={handleChange}>
          <option value="">Select Type *</option>
          <option>T-Shirts</option><option>Hoodies</option><option>Jeans</option><option>Shirts</option>
          <option>Blazers</option><option>Jackets</option><option>Ethnic Wear</option><option>Casual Wear</option>
        </select>
        <input name="color" placeholder="Color" value={form.color} onChange={handleChange} />
        <input name="size" placeholder="Size (S/M/L/XL) *" value={form.size} onChange={handleChange} />
        <input name="price" type="number" placeholder="Price per Day (₹) *" value={form.price} onChange={handleChange} />
        <textarea name="description" placeholder="Description" value={form.description} onChange={handleChange} />

        <div className="location-section">
          <h3>Your Location *</h3>
          <input type="url" placeholder="Paste your Google Maps location link here" 
            value={locationUrl} onChange={function(e){ setLocationUrl(e.target.value) }} 
            style={{ width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px', marginTop: '5px' }} />
        </div>

        <button type="submit" className="btn btn-full" disabled={submitting}>
          {submitting ? "Submitting..." : "Submit Listing"}
        </button>
      </form>
    </div>
  )
}

export default RentClothes
