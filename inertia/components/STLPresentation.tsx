import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

interface STLPresentationProps {
  title: string
  stlFile: string
}

interface Dimensions {
  x: number
  y: number
  z: number
}

export default function STLPresentation({ title, stlFile }: STLPresentationProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [dimensions, setDimensions] = useState<Dimensions | null>(null)
  const sceneRef = useRef<{
    scene?: THREE.Scene
    camera?: THREE.PerspectiveCamera
    renderer?: THREE.WebGLRenderer
    controls?: OrbitControls
    currentMesh?: THREE.Mesh
  }>({})

  const loadSTLFromFile = (file: File | string) => {
    const scene = sceneRef.current.scene
    if (!scene) return

    // Remove existing mesh
    if (sceneRef.current.currentMesh) {
      scene.remove(sceneRef.current.currentMesh)
      sceneRef.current.currentMesh.geometry.dispose()
      if (Array.isArray(sceneRef.current.currentMesh.material)) {
        sceneRef.current.currentMesh.material.forEach((m) => m.dispose())
      } else {
        sceneRef.current.currentMesh.material.dispose()
      }
    }

    const loader = new STLLoader()

    const onLoad = (geometry: THREE.BufferGeometry) => {
      const material = new THREE.MeshPhongMaterial({
        color: 0x808080,
        specular: 0x222222,
        shininess: 200,
      })
      const mesh = new THREE.Mesh(geometry, material)

      // Center and scale the model
      geometry.computeBoundingBox()
      const boundingBox = geometry.boundingBox!
      const center = new THREE.Vector3()
      boundingBox.getCenter(center)
      mesh.position.sub(center)

      const size = new THREE.Vector3()
      boundingBox.getSize(size)
      
      // Store original dimensions
      setDimensions({
        x: Math.round(size.x * 100) / 100,
        y: Math.round(size.y * 100) / 100,
        z: Math.round(size.z * 100) / 100,
      })

      const maxDim = Math.max(size.x, size.y, size.z)
      const scale = 50 / maxDim
      mesh.scale.setScalar(scale)

      scene.add(mesh)
      sceneRef.current.currentMesh = mesh

      // Position camera to view the object
      const camera = sceneRef.current.camera
      const controls = sceneRef.current.controls
      if (camera && controls) {
        const distance = maxDim * scale * 4
        camera.position.set(distance, distance * 0.5, distance)
        camera.lookAt(0, 0, 0)
        controls.target.set(0, 0, 0)
        controls.update()
      }
    }

    const onError = (error: unknown) => {
      console.error('Error loading STL file:', error)
    }

    if (typeof file === 'string') {
      loader.load(file, onLoad, undefined, onError)
    } else {
      const reader = new FileReader()
      reader.onload = (e) => {
        const contents = e.target?.result
        if (contents) {
          const geometry = loader.parse(contents as ArrayBuffer)
          onLoad(geometry)
        }
      }
      reader.readAsArrayBuffer(file)
    }
  }

  useEffect(() => {
    if (!containerRef.current) return

    const width = containerRef.current.clientWidth
    const height = containerRef.current.clientHeight

    if (width === 0 || height === 0) {
      console.warn('Container has no dimensions')
      return
    }

    // Setup scene
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0xf9fafb)
    sceneRef.current.scene = scene

    // Setup camera
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000)
    camera.position.set(0, 0, 100)
    sceneRef.current.camera = camera

    // Setup renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(width, height)
    renderer.setPixelRatio(window.devicePixelRatio)
    containerRef.current.appendChild(renderer.domElement)
    sceneRef.current.renderer = renderer

    // Setup controls
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.05
    sceneRef.current.controls = controls

    // Add lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
    scene.add(ambientLight)

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
    directionalLight.position.set(1, 1, 1)
    scene.add(directionalLight)

    // Load initial STL
    if (stlFile) {
      loadSTLFromFile(stlFile)
    }

    // Drag and drop handlers
    const handleDragOver = (e: DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      if (e.dataTransfer) {
        e.dataTransfer.dropEffect = 'copy'
      }
    }

    const handleDrop = (e: DragEvent) => {
      e.preventDefault()
      e.stopPropagation()

      const files = e.dataTransfer?.files
      if (files && files.length > 0) {
        const file = files[0]
        if (file.name.toLowerCase().endsWith('.stl')) {
          loadSTLFromFile(file)
        } else {
          console.error('Please drop an STL file')
        }
      }
    }

    const container = containerRef.current
    container.addEventListener('dragover', handleDragOver)
    container.addEventListener('drop', handleDrop)

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate)
      controls.update()
      renderer.render(scene, camera)
    }
    animate()

    // ResizeObserver to handle container size changes
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const width = entry.contentRect.width
        const height = entry.contentRect.height
        camera.aspect = width / height
        camera.updateProjectionMatrix()
        renderer.setSize(width, height)
      }
    })
    resizeObserver.observe(container)

    // Handle window resize as fallback
    const handleResize = () => {
      if (!containerRef.current) return
      const width = containerRef.current.clientWidth
      const height = containerRef.current.clientHeight
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      renderer.setSize(width, height)
    }
    window.addEventListener('resize', handleResize)

    // Cleanup
    return () => {
      resizeObserver.disconnect()
      window.removeEventListener('resize', handleResize)
      container.removeEventListener('dragover', handleDragOver)
      container.removeEventListener('drop', handleDrop)
      const containerElement = containerRef.current
      if (containerElement && renderer.domElement && containerElement.contains(renderer.domElement)) {
        containerElement.removeChild(renderer.domElement)
      }
      if (sceneRef.current.currentMesh) {
        sceneRef.current.currentMesh.geometry.dispose()
        if (Array.isArray(sceneRef.current.currentMesh.material)) {
          sceneRef.current.currentMesh.material.forEach((m) => m.dispose())
        } else {
          sceneRef.current.currentMesh.material.dispose()
        }
      }
      renderer.dispose()
      controls.dispose()
      scene.clear()
    }
  }, [stlFile])

  return (
    <div style={styles.container}>
      <div style={styles.titleFrame}>
        <h2 style={styles.titleText}>{title}</h2>
      </div>
      <div ref={containerRef} style={styles.sceneContainer}>
        <div style={styles.controlsBox}>
          <div style={styles.controlsTitle}>Contrôles</div>
          <div style={styles.controlRow}>🖱️ Clic gauche + glisser : Rotation</div>
          <div style={styles.controlRow}>🖱️ Molette : Zoom</div>
          <div style={styles.controlRow}>🖱️ Clic droit + glisser : Déplacement</div>
        </div>
        {dimensions && (
          <div style={styles.dimensionsBox}>
            <div style={styles.dimensionsTitle}>Dimensions</div>
            <div style={styles.dimensionRow}>X: {dimensions.x} mm</div>
            <div style={styles.dimensionRow}>Y: {dimensions.y} mm</div>
            <div style={styles.dimensionRow}>Z: {dimensions.z} mm</div>
          </div>
        )}
      </div>
    </div>
  )
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '1.5rem',
    padding: '1rem',
    height: '100vh',
    boxSizing: 'border-box' as const,
  },
  titleFrame: {
    backgroundColor: '#ffffff',
    border: '2px solid #e5e7eb',
    borderRadius: '0.75rem',
    padding: '1.5rem',
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
  },
  titleText: {
    fontSize: '1.5rem',
    fontWeight: 600,
    color: '#1f2937',
    margin: 0,
    textAlign: 'center' as const,
  },
  sceneContainer: {
    flexGrow: 1,
    flexShrink: 1,
    backgroundColor: '#f9fafb',
    borderRadius: '0.75rem',
    border: '2px solid #e5e7eb',
    minHeight: '400px',
    height: 0,
    overflow: 'hidden',
    position: 'relative' as const,
  },
  controlsBox: {
    position: 'absolute' as const,
    bottom: '5rem',
    left: '1rem',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    border: '2px solid #e5e7eb',
    borderRadius: '0.5rem',
    padding: '0.75rem 1rem',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    fontSize: '0.875rem',
    zIndex: 10,
  },
  controlsTitle: {
    fontWeight: 600,
    marginBottom: '0.5rem',
    color: '#1f2937',
    borderBottom: '1px solid #e5e7eb',
    paddingBottom: '0.25rem',
  },
  controlRow: {
    color: '#374151',
    marginTop: '0.25rem',
  },
  dimensionsBox: {
    position: 'absolute' as const,
    bottom: '5rem',
    right: '1rem',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    border: '2px solid #e5e7eb',
    borderRadius: '0.5rem',
    padding: '0.75rem 1rem',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    fontSize: '0.875rem',
    fontFamily: 'monospace',
    zIndex: 10,
  },
  dimensionsTitle: {
    fontWeight: 600,
    marginBottom: '0.5rem',
    color: '#1f2937',
    borderBottom: '1px solid #e5e7eb',
    paddingBottom: '0.25rem',
  },
  dimensionRow: {
    color: '#374151',
    marginTop: '0.25rem',
  },
}
