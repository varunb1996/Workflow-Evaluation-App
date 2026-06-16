import { useState } from "react"
import axios from "axios"

const API = "http://localhost:8000"

export default function DocumentUploader() {

  const [file, setFile] = useState(null)
  const [message, setMessage] = useState("")
  const [uploadedFile, setUploadedFile] = useState("")

  async function uploadFile() {

    if (!file) {
      alert("Choose a PDF first")
      return
    }

    const formData = new FormData()

    formData.append(
      "file",
      file
    )

    try {

      const res = await axios.post(
        `${API}/documents/upload`,
        formData,
        {
          headers: {
            "Content-Type":
              "multipart/form-data"
          }
        }
      )

      setUploadedFile(res.data.file)

      setMessage(
        "Vector store rebuilt successfully"
      )

    } catch (err) {

      console.error(err)

      setMessage(
        "Upload failed"
      )
    }
  }

  return (
    <div
      style={{
        background: "#12151c",
        border: "1px solid #232833",
        borderRadius: "16px",
        padding: "24px",
        marginBottom: "24px"
      }}
    >

      <h3
        style={{
          color: "#c8f060",
          marginBottom: "12px",
          textAlign: "center"
        }}
      >
        Knowledge Base
      </h3>

      <p
        style={{
          color: "#9ca0ae",
          fontSize: "14px",
          textAlign: "center",
          marginBottom: "20px",
          lineHeight: "1.6"
        }}
      >
        Upload PDFs used by the workflow's retrieval system.
        Changes to the knowledge base can affect workflow
        performance and are evaluated against saved baseline
        queries before deployment.
      </p>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "12px",
          alignItems: "center"
        }}
      >

        <input
          type="file"
          accept=".pdf"
          onChange={(e) =>
            setFile(e.target.files[0])
          }
        />

        <button
          onClick={uploadFile}
          style={{
            padding: "8px 16px",
            cursor: "pointer"
          }}
        >
          Upload
        </button>

      </div>

      {uploadedFile && (

        <div
          style={{
            marginTop: "16px",
            textAlign: "center",
            color: "#c8f060",
            fontWeight: "600"
          }}
        >
          Active Knowledge Base:
          {" "}
          {uploadedFile}
        </div>

      )}

      {message && (

        <div
          style={{
            marginTop: "12px",
            textAlign: "center",
            color: "#9ca0ae"
          }}
        >
          {message}
        </div>

      )}

    </div>
  )
}