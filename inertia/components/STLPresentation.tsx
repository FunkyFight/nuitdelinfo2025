import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

interface STLPresentationProps {
  title: string
  stlFile: string
}


export default function STLPresentation({ title, stlFile }: STLPresentationProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<{
    scene?: THREE.Scene
    camera?: THREE.PerspectiveCamera
    renderer?: THREE.WebGLRenderer
    controls?: OrbitControls
  }>({})

  useEffect(() => {
    if (!containerRef.current) return

    // Setup scene
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0xf9fafb)
    sceneRef.current.scene = scene

    // Setup camera
    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    )
    camera.position.set(0, 0, 100)
    sceneRef.current.camera = camera

    // Setup renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight)
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

    // Load STL
    const loader = new STLLoader()
    loader.load(
      stlFile,
      (geometry) => {
        const material = new THREE.MeshPhongMaterial({
          color: 0x2563eb,
          specular: 0x111111,
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
        const maxDim = Math.max(size.x, size.y, size.z)
        const scale = 50 / maxDim
        mesh.scale.setScalar(scale)

        scene.add(mesh)
      },
      undefined,
      (error) => {
        console.error('Error loading STL file:', error)
      }
    )

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate)
      controls.update()
      renderer.render(scene, camera)
    }
    animate()

    // Handle resize
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
      window.removeEventListener('resize', handleResize)
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement)
      }
      renderer.dispose()
      controls.dispose()
    }
  }, [stlFile])

  return (
    <div style={styles.container}>
      <div style={styles.titleFrame}>
        <h2 style={styles.titleText}>{title}</h2>
      </div>
      <div ref={containerRef} style={styles.sceneContainer}></div>
    </div>
  )
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '1.5rem',
    padding: '1rem',
    height: '100%',
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
    minHeight: '0',
    overflow: 'hidden',
  },
}
