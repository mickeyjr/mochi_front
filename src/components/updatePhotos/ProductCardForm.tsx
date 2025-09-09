import React, { useRef, useState, useCallback, useEffect } from 'react'
import Webcam from 'react-webcam'

type Product = {
  _id: string
  Nombre: string
  Descripcion: string
  CodigoBarras: string
  IdProduct: string
  imagenes: {
    ImagenMimeType: string
    ImagenBuffer: string,
    UrlImage?: string
  }[]
}

type Sticker = {
  id: number
  src: string
  x: number
  y: number
  width: number
  height: number
  rotation: number
  opacity: number
  imgObj?: HTMLImageElement
}

export default function ProductCard({
  product,
  onUpdateImage
}: {
  product: Product
  onUpdateImage: (p: Product) => void
}) {
  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [showCamera, setShowCamera] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [filter, setFilter] = useState<string>('none')
  const [stickers, setStickers] = useState<Sticker[]>([])
  const [draggingStickerId, setDraggingStickerId] = useState<number | null>(null)
  const [selectedStickerId, setSelectedStickerId] = useState<number | null>(null)
  const [offset, setOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 })

  const webcamRef = useRef<Webcam | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const stickerCounter = useRef<number>(0)

  const imageSrc =
    product.imagenes?.length > 0
      ? `${product.imagenes[0].UrlImage}`
      : 'https://via.placeholder.com/300x200.png?text=Sin+Imagen'

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return
    const file = e.target.files[0]
    setSelectedFile(file)
    const reader = new FileReader()
    reader.onload = () => setCapturedImage(reader.result as string)
    reader.readAsDataURL(file)
  }

  const capturePhoto = useCallback(() => {
    if (!webcamRef.current) return
    const screenshot = webcamRef.current.getScreenshot()
    if (!screenshot) return
    setCapturedImage(screenshot)
    fetch(screenshot)
      .then(res => res.blob())
      .then(blob => {
        const file = new File([blob], 'foto.jpg', { type: 'image/jpeg' })
        setSelectedFile(file)
      })
  }, [])

  const retakePhoto = () => {
    setCapturedImage(null)
    setSelectedFile(null)
    setFilter('none')
    setStickers([])
  }

  const addSticker = (src: string) => {
    stickerCounter.current += 1
    const imgObj = new Image()
    imgObj.src = src
    const newSticker: Sticker = {
      id: stickerCounter.current,
      src,
      x: 50,
      y: 50,
      width: 80,
      height: 80,
      rotation: 0,
      opacity: 1,
      imgObj
    }
    setStickers(prev => [...prev, newSticker])
    setSelectedStickerId(newSticker.id)
  }

  const drawCanvas = useCallback(() => {
    if (!canvasRef.current || !capturedImage) return
    const ctx = canvasRef.current.getContext('2d')
    if (!ctx) return
    const img = new Image()
    img.src = capturedImage
    img.onload = () => {
      const canvas = canvasRef.current!
      // Tamaño fijo para mantener consistencia
      canvas.width = 600
      canvas.height = 400
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.filter = filter

      // Escalar imagen para que encaje
      const scaleX = canvas.width / img.width
      const scaleY = canvas.height / img.height
      const scale = Math.min(scaleX, scaleY)
      const imgDrawWidth = img.width * scale
      const imgDrawHeight = img.height * scale
      const offsetX = (canvas.width - imgDrawWidth) / 2
      const offsetY = (canvas.height - imgDrawHeight) / 2
      ctx.drawImage(img, offsetX, offsetY, imgDrawWidth, imgDrawHeight)

      // Dibujar stickers
      stickers.forEach(s => {
        if (!s.imgObj) return
        ctx.save()
        ctx.globalAlpha = s.opacity
        ctx.translate(offsetX + s.x, offsetY + s.y)
        ctx.rotate((s.rotation * Math.PI) / 180)
        ctx.drawImage(s.imgObj, -s.width / 2, -s.height / 2, s.width, s.height)
        ctx.restore()
      })
    }
  }, [capturedImage, stickers, filter])

  useEffect(() => {
    drawCanvas()
  }, [drawCanvas])

  // Drag & drop
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current || !capturedImage) return
    const rect = canvasRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const canvas = canvasRef.current
    const img = new Image()
    img.src = capturedImage
    img.onload = () => {
      const scaleX = canvas.width / img.width
      const scaleY = canvas.height / img.height
      const scale = Math.min(scaleX, scaleY)
      const imgWidth = img.width * scale
      const imgHeight = img.height * scale
      const offsetX = (canvas.width - imgWidth) / 2
      const offsetY = (canvas.height - imgHeight) / 2

      for (let i = stickers.length - 1; i >= 0; i--) {
        const s = stickers[i]
        const stickerX = offsetX + s.x
        const stickerY = offsetY + s.y
        if (x >= stickerX && x <= stickerX + s.width && y >= stickerY && y <= stickerY + s.height) {
          setDraggingStickerId(s.id)
          setSelectedStickerId(s.id)
          setOffset({ x: x - stickerX, y: y - stickerY })
          break
        }
      }
    }
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (draggingStickerId === null || !canvasRef.current || !capturedImage) return
    const rect = canvasRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const canvas = canvasRef.current
    const img = new Image()
    img.src = capturedImage
    img.onload = () => {
      const scaleX = canvas.width / img.width
      const scaleY = canvas.height / img.height
      const scale = Math.min(scaleX, scaleY)
      const imgWidth = img.width * scale
      const imgHeight = img.height * scale
      const offsetX = (canvas.width - imgWidth) / 2
      const offsetY = (canvas.height - imgHeight) / 2

      const newX = x - offset.x - offsetX
      const newY = y - offset.y - offsetY

      setStickers(prev =>
        prev.map(s => (s.id === draggingStickerId ? { ...s, x: newX, y: newY } : s))
      )
    }
  }

  const handleMouseUp = () => setDraggingStickerId(null)

  const updateSelectedSticker = (updates: Partial<Sticker>) => {
    if (selectedStickerId === null) return
    setStickers(prev =>
      prev.map(s => (s.id === selectedStickerId ? { ...s, ...updates } : s))
    )
  }

  const deleteSelectedSticker = () => {
    if (selectedStickerId === null) return
    setStickers(prev => prev.filter(s => s.id !== selectedStickerId))
    setSelectedStickerId(null)
  }

  const uploadWithStickers = async () => {
    if (!canvasRef.current) return
    canvasRef.current.toBlob(async blob => {
      if (!blob) return
      const file = new File([blob], 'foto_stickers.jpg', { type: 'image/jpeg' })
      setSelectedFile(file)
      await uploadFile(file)
    }, 'image/jpeg')
  }

  const uploadFile = async (file: File) => {
    const formData = new FormData()
    formData.append('Imagen', file)
    try {
      setLoading(true)
      const res = await fetch(
        `${import.meta.env.VITE_API_BACK}/productos/${product.IdProduct}/image`,
        { method: 'PUT', body: formData }
      )
      if (!res.ok) {
        const errorText = await res.text()
        throw new Error(`Error al subir la imagen: ${errorText}`)
      }
      const newProduct = { ...product }
      const reader = new FileReader()
      reader.onload = () => {
        if (reader.result) {
          newProduct.imagenes = [{
            ImagenMimeType: file.type,
            ImagenBuffer: (reader.result as string).split(',')[1]
          }]
          onUpdateImage(newProduct)
          setSelectedFile(null)
          setCapturedImage(null)
          setShowCamera(false)
          setShowModal(false)
          setFilter('none')
          setStickers([])
        }
      }
      reader.readAsDataURL(file)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const filters = [
    { name: 'None', value: 'none' },
    { name: 'Clarendon', value: 'contrast(120%) saturate(120%)' },
    { name: 'Gingham', value: 'brightness(110%) sepia(20%)' },
    { name: 'Moon', value: 'grayscale(100%) contrast(110%)' },
    { name: 'Lark', value: 'saturate(150%) brightness(110%)' },
    { name: 'Reyes', value: 'brightness(120%) sepia(30%)' },
    { name: 'Juno', value: 'contrast(120%) saturate(150%)' },
  ]

  const selectedSticker = stickers.find(s => s.id === selectedStickerId)

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden w-80 m-4">
      {/* --- Imagen del producto --- */}
      <div className="h-48 w-full overflow-hidden rounded-t-xl">
        <img
          src={imageSrc}
          alt={product.Nombre}
          className="h-full w-full object-contain"
        />
      </div>

      <div className="p-4">
        <h2 className="text-xl font-semibold text-purple-700">{product.Nombre}</h2>
        <p className="text-gray-600">{product.Descripcion}</p>
        <p className="text-sm text-gray-500 mt-2">Código de barras: {product.CodigoBarras}</p>

        <div className="mt-3">
          <button
            onClick={() => setShowModal(true)}
            className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700 w-full"
          >
            Cambiar foto
          </button>

          {showModal && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
              <div className="bg-white rounded-lg p-6 w-full max-w-2xl relative">
                <h3 className="text-lg font-semibold mb-4 text-center">Actualizar foto</h3>

                {!showCamera && !capturedImage && (
                  <div className="flex flex-col gap-3">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 w-full"
                    >
                      Subir imagen
                    </button>
                    <button
                      onClick={() => setShowCamera(true)}
                      className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 w-full"
                    >
                      Tomar foto
                    </button>
                  </div>
                )}

                {(showCamera || capturedImage) && (
                  <div className="flex flex-col items-center gap-3 w-full">
                    {capturedImage ? (
                      <canvas
                        ref={canvasRef}
                        className="w-full h-[400px] rounded-md overflow-hidden cursor-move"
                        onMouseDown={handleMouseDown}
                        onMouseMove={handleMouseMove}
                        onMouseUp={handleMouseUp}
                        onMouseLeave={handleMouseUp}
                      />
                    ) : (
                      <Webcam
                        audio={false}
                        ref={webcamRef}
                        screenshotFormat="image/jpeg"
                        className="w-full h-[400px] object-cover rounded-md"
                        videoConstraints={{ width: 1280, height: 720, facingMode: 'user' }}
                        style={{ filter }}
                      />
                    )}

                    <div className="flex gap-2 mt-2 w-full">
                      {capturedImage ? (
                        <>
                          <button
                            onClick={retakePhoto}
                            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 flex-1"
                          >
                            Tomar de nuevo
                          </button>
                          <button
                            onClick={uploadWithStickers}
                            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex-1"
                            disabled={loading}
                          >
                            {loading ? 'Subiendo...' : 'Enviar'}
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={capturePhoto}
                          className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600 flex-1"
                        >
                          Capturar
                        </button>
                      )}
                    </div>

                    <div className="flex gap-2 mt-2 w-full">
                      <select
                        value={filter}
                        onChange={e => setFilter(e.target.value)}
                        className="p-2 border rounded flex-1"
                      >
                        {filters.map(f => (
                          <option key={f.value} value={f.value}>{f.name}</option>
                        ))}
                      </select>

                      <button
                        onClick={() => addSticker('/mochi_transparent.png')}
                        className="bg-orange-500 text-white px-2 py-1 rounded hover:bg-orange-600"
                      >
                        Mochi 🍡
                      </button>
                      <button
                        onClick={() => addSticker('https://img.icons8.com/color/48/000000/star.png')}
                        className="bg-pink-500 text-white px-2 py-1 rounded hover:bg-pink-600"
                      >
                        ⭐
                      </button>
                      <button
                        onClick={() => addSticker('https://img.icons8.com/color/48/000000/heart.png')}
                        className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                      >
                        ❤️
                      </button>
                    </div>

                    {selectedSticker && (
                      <div className="w-full max-h-64 overflow-y-auto p-2 border rounded bg-gray-50 mt-2">
                        <table className="w-full table-auto">
                          <tbody className="divide-y divide-gray-200">
                            <tr>
                              <td className="py-1 font-semibold">Rotación</td>
                              <td className="py-1">
                                <input
                                  type="range"
                                  min={0}
                                  max={360}
                                  value={selectedSticker.rotation}
                                  onChange={(e) => updateSelectedSticker({ rotation: Number(e.target.value) })}
                                />
                                <span className="ml-2">{Math.round(selectedSticker.rotation)}°</span>
                              </td>
                            </tr>
                            <tr>
                              <td className="py-1 font-semibold">Escala</td>
                              <td className="py-1">
                                <input
                                  type="range"
                                  min={0.5}
                                  max={3}
                                  step={0.01}
                                  value={selectedSticker.width / 80}
                                  onChange={(e) =>
                                    updateSelectedSticker({
                                      width: 80 * Number(e.target.value),
                                      height: 80 * Number(e.target.value)
                                    })
                                  }
                                />
                                <span className="ml-2">{(selectedSticker.width / 80).toFixed(2)}</span>
                              </td>
                            </tr>
                            <tr>
                              <td className="py-1 font-semibold">Opacidad</td>
                              <td className="py-1">
                                <input
                                  type="range"
                                  min={0}
                                  max={1}
                                  step={0.01}
                                  value={selectedSticker.opacity}
                                  onChange={(e) => updateSelectedSticker({ opacity: Number(e.target.value) })}
                                />
                                <span className="ml-2">{selectedSticker.opacity.toFixed(2)}</span>
                              </td>
                            </tr>
                            <tr>
                              <td colSpan={2} className="py-1 text-center">
                                <button
                                  onClick={deleteSelectedSticker}
                                  className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
                                >
                                  Eliminar sticker
                                </button>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}

                <button
                  onClick={() => {
                    setShowModal(false)
                    setShowCamera(false)
                    setSelectedFile(null)
                    setCapturedImage(null)
                    setFilter('none')
                    setStickers([])
                  }}
                  className="absolute top-2 right-2 text-gray-500 hover:text"

                >
                  ✕
                </button>

                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
